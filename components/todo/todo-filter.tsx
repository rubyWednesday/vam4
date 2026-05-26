"use client"

import { Button } from "@/components/ui/button"
import type { Filter } from "@/lib/types"

interface Stats {
  total: number
  active: number
  completed: number
}

interface TodoFilterProps {
  filter: Filter
  stats: Stats
  onFilterChange: (filter: Filter) => void
}

const FILTERS: Array<{ value: Filter; statKey: keyof Stats; label: string }> = [
  { value: "all", statKey: "total", label: "전체" },
  { value: "active", statKey: "active", label: "진행중" },
  { value: "completed", statKey: "completed", label: "완료" },
]

export function TodoFilter({ filter, stats, onFilterChange }: TodoFilterProps) {
  return (
    <div className="flex gap-1">
      {FILTERS.map(({ value, statKey, label }) => (
        <Button
          key={value}
          variant={filter === value ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(value)}
        >
          {label}
          <span className="ml-1.5 rounded-full bg-current/15 px-1.5 py-0.5 text-xs tabular-nums">
            {stats[statKey]}
          </span>
        </Button>
      ))}
    </div>
  )
}
