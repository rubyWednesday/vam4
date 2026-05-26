import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { useTodos } from "@/hooks/use-todos"

// localStorage 초기화
afterEach(() => {
  localStorage.clear()
})

describe("useTodos — 동적 필터링", () => {
  // ✅ 기준 5: 완료 필터 선택 중 Todo를 미완료로 변경 → 해당 항목이 목록에서 사라짐
  it("'completed' 필터 중 toggleTodo(완료→미완료)하면 해당 항목이 필터된 목록에서 사라진다", async () => {
    const { result } = renderHook(() => useTodos())

    // 할 일 2개 추가
    act(() => { result.current.addTodo("미완료 할 일", "medium") })
    act(() => { result.current.addTodo("완료할 할 일", "medium") })

    // 두 번째 항목 완료 처리
    const todoId = result.current.todos[0].id  // 최신순이므로 index 0이 "완료할 할 일"
    act(() => { result.current.toggleTodo(todoId) })

    // 완료 필터 선택
    act(() => { result.current.setFilter("completed") })

    // 완료된 항목이 1개 보임을 확인
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].completed).toBe(true)

    // 완료된 항목을 다시 미완료로 변경
    act(() => { result.current.toggleTodo(todoId) })

    // 완료 필터이므로 목록에서 사라져야 함
    expect(result.current.todos).toHaveLength(0)
  })
})
