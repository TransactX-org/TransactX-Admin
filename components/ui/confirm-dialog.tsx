"use client"

import * as React from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ConfirmOptions {
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    /** Styles the confirm button as destructive. Defaults to true. */
    destructive?: boolean
}

interface PendingConfirm {
    options: ConfirmOptions
    resolve: (confirmed: boolean) => void
}

/**
 * Promise-based confirmation dialog, a styled replacement for `window.confirm`.
 *
 *   const { confirm, confirmDialog } = useConfirm()
 *   if (await confirm({ title: "Delete user?" })) { ... }
 *   return <>{confirmDialog}</>
 */
export function useConfirm() {
    const [pending, setPending] = React.useState<PendingConfirm | null>(null)

    const confirm = React.useCallback(
        (options: ConfirmOptions) =>
            new Promise<boolean>((resolve) => setPending({ options, resolve })),
        []
    )

    const settle = React.useCallback((confirmed: boolean) => {
        setPending((current) => {
            current?.resolve(confirmed)
            return null
        })
    }, [])

    const options = pending?.options
    const destructive = options?.destructive ?? true

    const confirmDialog = (
        <AlertDialog open={!!pending} onOpenChange={(open) => { if (!open) settle(false) }}>
            <AlertDialogContent className="rounded-2xl border-border/40">
                <AlertDialogHeader>
                    <AlertDialogTitle>{options?.title}</AlertDialogTitle>
                    {options?.description && (
                        <AlertDialogDescription>{options.description}</AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl" onClick={() => settle(false)}>
                        {options?.cancelLabel ?? "Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={cn("rounded-xl", destructive && buttonVariants({ variant: "destructive" }))}
                        onClick={() => settle(true)}
                    >
                        {options?.confirmLabel ?? "Confirm"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    return { confirm, confirmDialog }
}
