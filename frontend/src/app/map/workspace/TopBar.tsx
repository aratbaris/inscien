"use client"

import Link from "next/link"
import { Settings } from "lucide-react"

import LensBar from "./LensBar"
import { useWorkspace } from "./WorkspaceProvider"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function TopBar() {
  const { lens, setLens } = useWorkspace()

  return (
    <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-center">
        <LensBar lens={lens} onChange={setLens} />
      </div>
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href="/settings"
              aria-label="Settings"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <Settings />
            </Link>
          }
        />
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    </header>
  )
}
