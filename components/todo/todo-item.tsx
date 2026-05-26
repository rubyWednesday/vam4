"use client"

import { useRef, useState } from "react"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Priority, Todo } from "@/lib/types"

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; variant: "destructive" | "secondary" | "outline" }
> = {
  high: { label: "높음", variant: "destructive" },
  medium: { label: "중간", variant: "secondary" },
  low: { label: "낮음", variant: "outline" },
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditText(todo.text)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commitEdit() {
    if (editText.trim()) {
      onEdit(todo.id, editText)
    }
    setEditing(false)
  }

  const { label, variant } = PRIORITY_CONFIG[todo.priority]

  return (
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        id={`todo-${todo.id}`}
      />

      {editing ? (
        <Input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit()
            if (e.key === "Escape") setEditing(false)
          }}
          className="h-7 flex-1 text-sm"
        />
      ) : (
        <label
          htmlFor={`todo-${todo.id}`}
          className={cn(
            "flex-1 cursor-pointer text-sm",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.text}
        </label>
      )}

      <Badge variant={variant} className="shrink-0 text-xs">
        {label}
      </Badge>

      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={startEdit}
          disabled={todo.completed}
          aria-label="편집"
        >
          <IconPencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onDelete(todo.id)}
          aria-label="삭제"
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
