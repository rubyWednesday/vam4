"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Priority } from "@/lib/types"

interface TodoInputProps {
  onAdd: (text: string, priority: Priority) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")

  function handleSubmit() {
    if (!text.trim()) return
    onAdd(text, priority)
    setText("")
    setPriority("medium")
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="할 일을 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1"
      />
      <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">높음</SelectItem>
          <SelectItem value="medium">중간</SelectItem>
          <SelectItem value="low">낮음</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} disabled={!text.trim()}>
        추가
      </Button>
    </div>
  )
}
