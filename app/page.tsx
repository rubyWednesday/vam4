"use client"

import { TodoFilter } from "@/components/todo/todo-filter"
import { TodoInput } from "@/components/todo/todo-input"
import { TodoList } from "@/components/todo/todo-list"
import { useTodos } from "@/hooks/use-todos"

export default function Page() {
  const { todos, filter, setFilter, addTodo, toggleTodo, editTodo, deleteTodo, stats } =
    useTodos()

  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col gap-6 p-6">
      <div>
        <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          ✨ Todo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.active > 0 ? `${stats.active}개 남음` : "모든 할 일 완료!"}
        </p>
      </div>

      <TodoInput onAdd={addTodo} />

      <div className="flex flex-col gap-3">
        <TodoFilter filter={filter} stats={stats} onFilterChange={setFilter} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  )
}
