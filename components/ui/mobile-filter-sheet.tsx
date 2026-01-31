"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Filter } from "lucide-react"

interface MobileFilterSheetProps {
    children: React.ReactNode
    trigger?: React.ReactNode
    title?: string
    description?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onReset?: () => void
    className?: string
}

export function MobileFilterSheet({
    children,
    trigger,
    title = "Filters",
    description = "Refine your search results",
    open,
    onOpenChange,
    onReset,
    className
}: MobileFilterSheetProps) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="h-10 gap-2 md:hidden">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent className={className}>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 py-2 space-y-4 max-h-[60vh] overflow-y-auto">
                        {children}
                    </div>
                    <DrawerFooter className="flex-row gap-3 pt-6 pb-8 mb-9">
                        {onReset && (
                            <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={onReset}>Reset</Button>
                        )}
                        <DrawerClose asChild>
                            <Button className="flex-1 rounded-xl h-11 tx-bg-primary font-semibold">Show Results</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
