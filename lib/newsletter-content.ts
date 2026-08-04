/**
 * Newsletter content formatting.
 *
 * Newsletters are written as plain text in the admin, but email is delivered as
 * HTML — so line breaks collapse and any `*asterisks*` arrive literally unless we
 * convert them first. These helpers turn the simple markers people already use
 * (WhatsApp/markdown style) into email-safe HTML, and back again for editing.
 *
 *   *bold*  **bold**   _italic_   ~~strike~~
 *   # Heading    ## Smaller heading
 *   - bullet     1. numbered
 *   [label](https://link)
 *   blank line = new paragraph, single line break = <br>, leading spaces kept
 *
 * Everything is inlined as `style` attributes because most email clients drop
 * <style> blocks.
 */

const STYLE = {
    p: "margin:0 0 16px;line-height:1.6;",
    h1: "margin:24px 0 12px;font-size:24px;line-height:1.3;font-weight:700;",
    h2: "margin:24px 0 12px;font-size:20px;line-height:1.3;font-weight:700;",
    h3: "margin:20px 0 10px;font-size:17px;line-height:1.3;font-weight:700;",
    list: "margin:0 0 16px;padding-left:22px;",
    li: "margin:0 0 6px;line-height:1.6;",
    link: "color:#962339;text-decoration:underline;",
}

// Tags we know how to turn back into plain text without losing anything.
const SIMPLE_TAGS = new Set([
    "p", "br", "strong", "b", "em", "i", "u", "s", "del", "strike",
    "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "span", "div", "blockquote",
])

const HTML_TAG_PATTERN =
    /<\/?(?:p|div|br|strong|b|em|i|u|s|h[1-6]|ul|ol|li|a|table|tr|td|span|img|blockquote)\b[^>]*>/i

/** True when the value is already HTML rather than plain text. */
export function looksLikeHtml(value: string): boolean {
    return HTML_TAG_PATTERN.test(value || "")
}

/** True for HTML we generated (or close enough) — safe to convert back to text. */
export function isSimpleEmailHtml(value: string): boolean {
    if (!looksLikeHtml(value)) return false
    const tags = value.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b/g) || []
    return tags.every((tag) => SIMPLE_TAGS.has(tag.replace(/[</]/g, "").toLowerCase()))
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function decodeEntities(value: string): string {
    return value
        .replace(/&nbsp;/gi, " ")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#0?39;/gi, "'")
        .replace(/&apos;/gi, "'")
        .replace(/&amp;/gi, "&")
}

/** Bold/italic/strike markers. Applied to already-escaped text. */
function applyEmphasis(text: string): string {
    return text
        .replace(/\*\*([^\n*]+)\*\*/g, "<strong>$1</strong>")
        // Single asterisks read as bold here (WhatsApp habit), not italic.
        .replace(/(^|[^\w*])\*([^\n*]+)\*(?![\w*])/g, "$1<strong>$2</strong>")
        .replace(/~~([^\n~]+)~~/g, "<s>$1</s>")
        .replace(/(^|[^\w_])_([^\n_]+)_(?![\w_])/g, "$1<em>$2</em>")
}

/**
 * Inline formatting for one line: links first (parked as placeholders so the
 * emphasis pass can't chew through a URL), then bold/italic/strike.
 */
function formatInline(rawLine: string): string {
    const escaped = escapeHtml(rawLine)
    const links: string[] = []
    // Links are parked behind a sentinel so the emphasis pass — or a stray
    // asterisk inside a URL — can't chew through them.
    const park = (href: string, label: string) => {
        links.push(`<a href="${href}" style="${STYLE.link}" target="_blank">${applyEmphasis(label)}</a>`)
        return `\u0000${links.length - 1}\u0000`
    }

    let line = escaped
        // [label](https://example.com)
        .replace(/\[([^\]\n]+)\]\(\s*([^)\s]+)\s*\)/g, (_match, label: string, href: string) => park(href, label))
        // Bare links people paste straight in.
        .replace(/(^|[\s(])((?:https?:\/\/|www\.)[^\s<)]+[^\s<).,;:!?])/g, (_match, lead: string, url: string) => {
            const href = url.startsWith("www.") ? `https://${url}` : url
            return lead + park(href, url)
        })

    line = applyEmphasis(line)

    return line.replace(/\u0000(\d+)\u0000/g, (match, index: string) => links[Number(index)] ?? match)
}

/** Keep leading indentation visible — HTML would otherwise collapse it. */
function preserveIndent(rawLine: string): string {
    const indent = rawLine.match(/^[ \t]+/)?.[0] || ""
    if (!indent) return formatInline(rawLine)
    const spaces = indent.replace(/\t/g, "    ").length
    return "&nbsp;".repeat(spaces) + formatInline(rawLine.slice(indent.length))
}

type Block =
    | { type: "p"; lines: string[] }
    | { type: "ul" | "ol"; lines: string[] }

/**
 * Convert the plain-text editor value into email-ready HTML.
 * Content that is already HTML is passed through untouched.
 */
export function richTextToEmailHtml(text: string): string {
    if (!text) return ""
    if (looksLikeHtml(text)) return text

    const lines = text.replace(/\r\n?/g, "\n").split("\n")
    const html: string[] = []
    let block: Block | null = null

    const flush = () => {
        if (!block) return
        if (block.type === "p") {
            html.push(`<p style="${STYLE.p}">${block.lines.join("<br>")}</p>`)
        } else {
            const items = block.lines.map((item) => `<li style="${STYLE.li}">${item}</li>`).join("")
            html.push(`<${block.type} style="${STYLE.list}">${items}</${block.type}>`)
        }
        block = null
    }

    const push = (type: Block["type"], line: string) => {
        if (!block || block.type !== type) {
            flush()
            block = { type, lines: [] } as Block
        }
        block.lines.push(line)
    }

    for (const line of lines) {
        if (!line.trim()) {
            flush()
            continue
        }

        const heading = line.match(/^(#{1,3})\s+(.*)$/)
        if (heading) {
            flush()
            const tag = (["h1", "h2", "h3"] as const)[heading[1].length - 1]
            html.push(`<${tag} style="${STYLE[tag]}">${formatInline(heading[2].trim())}</${tag}>`)
            continue
        }

        // "- item" / "* item" / "• item" — the space is what separates a bullet
        // from *bold text*.
        const bullet = line.match(/^\s*[-*•]\s+(.*)$/)
        if (bullet) {
            push("ul", formatInline(bullet[1]))
            continue
        }

        const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/)
        if (numbered) {
            push("ol", formatInline(numbered[1]))
            continue
        }

        push("p", preserveIndent(line))
    }

    flush()
    return html.join("\n")
}

/** Turn email HTML back into the plain-text markers used by the editor. */
export function emailHtmlToRichText(html: string): string {
    if (!html) return ""

    let text = html.replace(/\r\n?/g, "\n")

    text = text.replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")

    text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_match, inner: string) => {
        let index = 0
        return "\n\n" + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, item: string) => `\n${++index}. ${item.trim()}`) + "\n\n"
    })
    text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match, inner: string) =>
        "\n\n" + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, item: string) => `\n- ${item.trim()}`) + "\n\n"
    )
    text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_match, item: string) => `\n- ${item.trim()}`)

    text = text.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_match, level: string, inner: string) => {
        const hashes = "#".repeat(Math.min(Number(level), 3))
        return `\n\n${hashes} ${inner.trim()}\n\n`
    })

    text = text.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_match, href: string, label: string) => {
        const cleanLabel = label.replace(/<[^>]+>/g, "").trim()
        const cleanHref = decodeEntities(href).trim()
        return cleanLabel === cleanHref ? cleanHref : `[${cleanLabel}](${cleanHref})`
    })

    text = text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|blockquote)\s*>/gi, "\n\n")
        .replace(/<(p|div|blockquote)\b[^>]*>/gi, "")
        .replace(/<\/?(strong|b)\b[^>]*>/gi, "**")
        .replace(/<\/?(em|i)\b[^>]*>/gi, "_")
        .replace(/<\/?(s|del|strike)\b[^>]*>/gi, "~~")
        .replace(/<[^>]+>/g, "")

    text = decodeEntities(text)

    return text
        .replace(/[ \t]+$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

/** Readable one-liner for list cards and search — no tags, no markers. */
export function toPlainText(value: string): string {
    if (!value) return ""
    const base = looksLikeHtml(value) ? emailHtmlToRichText(value) : value
    return base
        .replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, "$1")
        .replace(/^\s*#{1,6}\s+/gm, "")
        .replace(/^\s*[-*•]\s+/gm, "")
        // Paired markers only, so {{first_name}} keeps its underscore.
        .replace(/\*\*([^\n*]+)\*\*/g, "$1")
        .replace(/(^|[^\w*])\*([^\n*]+)\*(?![\w*])/g, "$1$2")
        .replace(/~~([^\n~]+)~~/g, "$1")
        .replace(/(^|[^\w_])_([^\n_]+)_(?![\w_])/g, "$1$2")
        .replace(/\s+/g, " ")
        .trim()
}

const TAG_CHIP_STYLE =
    "display:inline-block;padding:1px 8px;border-radius:9999px;background:rgba(139,92,246,0.12);color:#8b5cf6;font-weight:600;font-size:0.85em;"

/** Show {{first_name}} style tags as chips inside a preview (never when sending). */
export function highlightPersonalizationTags(html: string): string {
    return html.replace(
        /\{\{\s*(\w+)\s*\}\}/g,
        (_match, name: string) => `<span style="${TAG_CHIP_STYLE}">${name.replace(/_/g, " ")}</span>`
    )
}

/** What actually gets saved/sent: HTML for email, untouched text elsewhere. */
export function prepareNewsletterContent(content: string, medium: string): string {
    if (medium !== "email") return content
    return richTextToEmailHtml(content)
}

/** What the editor shows: stored HTML converted back to plain text when we can. */
export function newsletterContentToEditorText(content: string | undefined, medium: string): string {
    if (!content) return ""
    if (medium !== "email") return content
    return isSimpleEmailHtml(content) ? emailHtmlToRichText(content) : content
}
