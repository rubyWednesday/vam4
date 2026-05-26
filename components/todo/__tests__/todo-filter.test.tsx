import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { TodoFilter } from "@/components/todo/todo-filter"

const defaultStats = { total: 5, active: 3, completed: 2 }

describe("TodoFilter — active 스타일", () => {
  // ✅ 기준 6: 현재 선택된 필터 버튼에 active 스타일 적용
  it("현재 필터 버튼에만 aria-pressed='true'가 설정된다", () => {
    render(
      <TodoFilter
        filter="active"
        stats={defaultStats}
        onFilterChange={vi.fn()}
      />
    )

    expect(screen.getByRole("button", { name: /전체/ })).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByRole("button", { name: /진행중/ })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: /완료/ })).toHaveAttribute("aria-pressed", "false")
  })

  it("필터 버튼 클릭 시 onFilterChange가 해당 필터 값으로 호출된다", async () => {
    const onFilterChange = vi.fn()
    render(
      <TodoFilter
        filter="all"
        stats={defaultStats}
        onFilterChange={onFilterChange}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: /진행중/ }))
    expect(onFilterChange).toHaveBeenCalledWith("active")
  })
})
