"use client"

import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

// The two citation lenses: what your papers cite (References) and what cites them (Cited by).
export type Lens = "cite" | "cited"

const LENSES: { lens: Lens; label: string; Icon: typeof ArrowUpRight }[] = [
  { lens: "cite", label: "References", Icon: ArrowUpRight },
  { lens: "cited", label: "Cited by", Icon: ArrowDownLeft },
]

type Props = {
  lens: Lens
  onChange: (lens: Lens) => void
}

export default function LensBar({ lens, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Citation lens">
      {LENSES.map(({ lens: l, label, Icon }) => (
        <Toggle
          key={l}
          size="sm"
          variant="segment"
          className="gap-1.5 !px-4"
          pressed={lens === l}
          aria-current={lens === l ? "true" : undefined}
          onPressedChange={(pressed) => {
            if (pressed) onChange(l)
          }}
        >
          <Icon className="size-3.5" />
          {label}
        </Toggle>
      ))}
    </div>
  )
}
