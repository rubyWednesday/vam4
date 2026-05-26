import { describe, expect, it } from "vitest"
import { filterTodos } from "@/lib/filter-todos"
import type { Todo } from "@/lib/types"

// 공통 픽스처: 완료 2개, 미완료 3개
const makeTodos = (): Todo[] => [
  { id: "1", text: "할 일 1", completed: false, priority: "medium", createdAt: 1 },
  { id: "2", text: "할 일 2", completed: false, priority: "medium", createdAt: 2 },
  { id: "3", text: "할 일 3", completed: false, priority: "medium", createdAt: 3 },
  { id: "4", text: "할 일 4", completed: true,  priority: "medium", createdAt: 4 },
  { id: "5", text: "할 일 5", completed: true,  priority: "medium", createdAt: 5 },
]

describe("filterTodos", () => {
  // ✅ 기준 1: 전체 필터 → 5개 표시
  it("'all' 필터: 5개 중 5개 반환", () => {
    expect(filterTodos(makeTodos(), "all")).toHaveLength(5)
  })

  // ✅ 기준 2: 진행중 필터 → 3개, 모두 미완료
  it("'active' 필터: 미완료 3개만 반환하고 모두 completed: false", () => {
    const result = filterTodos(makeTodos(), "active")
    expect(result).toHaveLength(3)
    expect(result.every((t) => t.completed === false)).toBe(true)
  })

  // ✅ 기준 3: 완료 필터 → 2개, 모두 완료
  it("'completed' 필터: 완료 2개만 반환하고 모두 completed: true", () => {
    const result = filterTodos(makeTodos(), "completed")
    expect(result).toHaveLength(2)
    expect(result.every((t) => t.completed === true)).toBe(true)
  })

  // ✅ 기준 4: 빈 목록 + 진행중 → 빈 배열
  it("빈 배열에 'active' 필터: 빈 배열 반환", () => {
    expect(filterTodos([], "active")).toHaveLength(0)
  })
})
