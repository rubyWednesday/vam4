"use client"

import { useEffect, useState } from "react"
import type { Filter, Priority, Todo } from "@/lib/types"

const STORAGE_KEY = "todos"

function loadFromStorage(): Todo[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

export function useTodos() {
  const [allTodos, setAllTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>("all")

  // localStorage에서 초기 로드
  useEffect(() => {
    setAllTodos(loadFromStorage())
  }, [])

  // todos 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTodos))
  }, [allTodos])

  function addTodo(text: string, priority: Priority) {
    const trimmed = text.trim()
    if (!trimmed) return
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      priority,
      createdAt: Date.now(),
    }
    setAllTodos((prev) => [newTodo, ...prev])
  }

  function toggleTodo(id: string) {
    setAllTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function editTodo(id: string, text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setAllTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    )
  }

  function deleteTodo(id: string) {
    setAllTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const todos = allTodos.filter((t) => {
    if (filter === "active") return !t.completed
    if (filter === "completed") return t.completed
    return true
  })

  const stats = {
    total: allTodos.length,
    active: allTodos.filter((t) => !t.completed).length,
    completed: allTodos.filter((t) => t.completed).length,
  }

  return { todos, filter, setFilter, addTodo, toggleTodo, editTodo, deleteTodo, stats }
}
