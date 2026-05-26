import type { Filter, Todo } from "@/lib/types"

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === "active") return todos.filter((t) => !t.completed)
  if (filter === "completed") return todos.filter((t) => t.completed)
  return todos
}
