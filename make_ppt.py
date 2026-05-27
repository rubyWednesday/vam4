"""Todo Tutorial App - PPT 생성 스크립트"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import os

# ── 색상 팔레트 (모던 다크톤)
C_BG       = RGBColor(0x18, 0x18, 0x1B)   # 슬라이드 배경 (zinc-950)
C_ACCENT   = RGBColor(0x6D, 0x28, 0xD9)   # 보라 (violet-700)
C_ACCENT2  = RGBColor(0xA7, 0x8B, 0xFA)   # 연보라 (violet-400)
C_WHITE    = RGBColor(0xFF, 0xFF, 0xFF)
C_GRAY     = RGBColor(0xA1, 0xA1, 0xAA)   # zinc-400
C_CARD     = RGBColor(0x27, 0x27, 0x2A)   # zinc-900

W, H = Inches(13.33), Inches(7.5)         # 16:9 와이드

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H

ROOT = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(ROOT, "screenshots")

# ── 헬퍼 ──────────────────────────────────────────

def blank_slide():
    layout = prs.slide_layouts[6]   # Blank
    return prs.slides.add_slide(layout)

def bg(slide, color=C_BG):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_textbox(slide, text, l, t, w, h,
                size=18, bold=False, color=C_WHITE,
                align=PP_ALIGN.LEFT, italic=False):
    txBox = slide.shapes.add_textbox(l, t, w, h)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size  = Pt(size)
    run.font.bold  = bold
    run.font.color.rgb = color
    run.font.italic = italic
    return txBox

def add_rect(slide, l, t, w, h, color):
    shape = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        l, t, w, h
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape

def add_image_safe(slide, path, l, t, w, h):
    if os.path.exists(path):
        slide.shapes.add_picture(path, l, t, w, h)
    else:
        # placeholder box
        add_rect(slide, l, t, w, h, C_CARD)
        add_textbox(slide, "[ 이미지 없음 ]", l, t, w, h,
                    size=12, color=C_GRAY, align=PP_ALIGN.CENTER)

# ── 슬라이드 1 : 타이틀 ───────────────────────────
s = blank_slide()
bg(s)

# 좌측 보라 사이드바
add_rect(s, Inches(0), Inches(0), Inches(0.5), H, C_ACCENT)

# 타이틀
add_textbox(s, "Todo Tutorial App",
            Inches(1), Inches(2.2), Inches(8), Inches(1.2),
            size=52, bold=True, color=C_WHITE)

# 서브타이틀
add_textbox(s, "Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui",
            Inches(1), Inches(3.5), Inches(9), Inches(0.6),
            size=20, color=C_ACCENT2)

# 날짜
add_textbox(s, "2026.05.27",
            Inches(1), Inches(4.3), Inches(4), Inches(0.5),
            size=14, color=C_GRAY)

# ── 슬라이드 2 : 앱 소개 & 주요 기능 ──────────────
s = blank_slide()
bg(s)
add_rect(s, Inches(0), Inches(0), W, Inches(1.1), C_ACCENT)
add_textbox(s, "앱 소개 & 주요 기능",
            Inches(0.5), Inches(0.2), Inches(10), Inches(0.75),
            size=30, bold=True, color=C_WHITE)

features = [
    ("✅", "할 일 관리",       "추가 · 완료 토글 · 삭제 기능"),
    ("🏷️", "우선순위 설정",    "높음 / 중간 / 낮음 3단계 분류"),
    ("🔍", "필터링",           "전체 / 진행중 / 완료 탭 전환"),
    ("🌙", "다크 / 라이트 모드", "'d' 키 단축키로 즉시 전환"),
    ("📱", "반응형 UI",        "Tailwind CSS v4 기반 모던 디자인"),
    ("🧪", "테스트",           "Vitest 유닛 테스트 · Playwright E2E"),
]

cols = 3
for i, (icon, title, desc) in enumerate(features):
    col = i % cols
    row = i // cols
    l = Inches(0.6 + col * 4.2)
    t = Inches(1.4 + row * 2.4)
    # 카드
    card = add_rect(s, l, t, Inches(3.8), Inches(2.1), C_CARD)
    add_textbox(s, f"{icon} {title}",
                l + Inches(0.18), t + Inches(0.18),
                Inches(3.5), Inches(0.5),
                size=16, bold=True, color=C_ACCENT2)
    add_textbox(s, desc,
                l + Inches(0.18), t + Inches(0.7),
                Inches(3.5), Inches(1.2),
                size=13, color=C_GRAY)

# ── 슬라이드 3 : 기술 스택 ───────────────────────
s = blank_slide()
bg(s)
add_rect(s, Inches(0), Inches(0), W, Inches(1.1), C_ACCENT)
add_textbox(s, "기술 스택",
            Inches(0.5), Inches(0.2), Inches(10), Inches(0.75),
            size=30, bold=True, color=C_WHITE)

stack = [
    ("Framework",  "Next.js 16",         "App Router, Turbopack, Server Components"),
    ("UI Library", "React 19",           "최신 Concurrent 기능"),
    ("Styling",    "Tailwind CSS v4",    "CSS-first 설정 (globals.css)"),
    ("Components", "shadcn/ui + Radix",  "radix-maia 스타일, taupe 베이스 컬러"),
    ("Icons",      "lucide-react",       "SVG 아이콘 라이브러리"),
    ("Theme",      "next-themes",        "시스템 다크모드 + 키 단축키"),
    ("Runtime",    "Bun 1.3",            "패키지 매니저 & 런타임"),
    ("Test",       "Vitest + Playwright","유닛 + E2E 테스트"),
]

for i, (category, name, note) in enumerate(stack):
    col = i % 2
    row = i // 2
    l = Inches(0.5 + col * 6.3)
    t = Inches(1.4 + row * 1.4)
    add_rect(s, l, t, Inches(5.9), Inches(1.2), C_CARD)
    add_textbox(s, category,
                l + Inches(0.15), t + Inches(0.1),
                Inches(1.5), Inches(0.4),
                size=10, color=C_GRAY, italic=True)
    add_textbox(s, name,
                l + Inches(0.15), t + Inches(0.42),
                Inches(2.5), Inches(0.45),
                size=16, bold=True, color=C_ACCENT2)
    add_textbox(s, note,
                l + Inches(2.8), t + Inches(0.42),
                Inches(2.9), Inches(0.45),
                size=12, color=C_GRAY)

# ── 슬라이드 4 : UI 스크린샷 (초기 & 할일 추가) ──
s = blank_slide()
bg(s)
add_rect(s, Inches(0), Inches(0), W, Inches(1.1), C_ACCENT)
add_textbox(s, "UI 스크린샷 — 기본 화면",
            Inches(0.5), Inches(0.2), Inches(10), Inches(0.75),
            size=30, bold=True, color=C_WHITE)

shot_pairs = [
    (os.path.join(SHOTS, "01-initial.png"),    "초기 화면 (빈 상태)"),
    (os.path.join(SHOTS, "03-add-second.png"), "할 일 2개 추가 후"),
]
for i, (path, label) in enumerate(shot_pairs):
    l = Inches(0.5 + i * 6.4)
    add_image_safe(s, path, l, Inches(1.3), Inches(6.0), Inches(4.8))
    add_textbox(s, label,
                l, Inches(6.25), Inches(6.0), Inches(0.5),
                size=13, color=C_GRAY, align=PP_ALIGN.CENTER)

# ── 슬라이드 5 : UI 스크린샷 (토글 & 필터) ───────
s = blank_slide()
bg(s)
add_rect(s, Inches(0), Inches(0), W, Inches(1.1), C_ACCENT)
add_textbox(s, "UI 스크린샷 — 토글 & 필터",
            Inches(0.5), Inches(0.2), Inches(10), Inches(0.75),
            size=30, bold=True, color=C_WHITE)

shot_pairs2 = [
    (os.path.join(SHOTS, "04-toggle-first.png"),      "첫 번째 항목 완료 처리"),
    (os.path.join(SHOTS, "05-filter-completed.png"),  "완료 필터 활성화"),
]
for i, (path, label) in enumerate(shot_pairs2):
    l = Inches(0.5 + i * 6.4)
    add_image_safe(s, path, l, Inches(1.3), Inches(6.0), Inches(4.8))
    add_textbox(s, label,
                l, Inches(6.25), Inches(6.0), Inches(0.5),
                size=13, color=C_GRAY, align=PP_ALIGN.CENTER)

# ── 슬라이드 6 : 코드 구조 / 아키텍처 ────────────
s = blank_slide()
bg(s)
add_rect(s, Inches(0), Inches(0), W, Inches(1.1), C_ACCENT)
add_textbox(s, "코드 구조 & 아키텍처",
            Inches(0.5), Inches(0.2), Inches(10), Inches(0.75),
            size=30, bold=True, color=C_WHITE)

# 디렉토리 트리
tree = """\
todo-tutorial/
├── app/
│   ├── page.tsx          ← 메인 페이지 (TodoApp 진입점)
│   ├── layout.tsx        ← Root Layout + ThemeProvider
│   └── globals.css       ← Tailwind v4 테마 변수
├── components/
│   ├── todo-app.tsx      ← 핵심 상태 관리 + 렌더링
│   ├── theme-provider.tsx← 다크모드 + 'd' 단축키
│   └── ui/               ← shadcn 생성 컴포넌트
├── lib/
│   └── utils.ts          ← cn() 유틸리티
└── .claude/
    └── skills/
        └── run-todo-tutorial/  ← Playwright 드라이버"""

add_rect(s, Inches(0.5), Inches(1.3), Inches(6.2), Inches(5.8), C_CARD)
add_textbox(s, tree,
            Inches(0.7), Inches(1.45), Inches(5.8), Inches(5.5),
            size=12, color=C_ACCENT2)

# 아키텍처 포인트
points = [
    "App Router 기반 — 서버/클라이언트 컴포넌트 분리",
    "CSS-first Tailwind v4 — tailwind.config.js 없음",
    "shadcn/ui 컴포넌트는 components/ui/ 에 소유",
    "상태는 todo-app.tsx 단일 컴포넌트에서 관리",
    "Playwright driver.mjs 로 헤드리스 E2E 자동화",
]
for i, pt in enumerate(points):
    t_pos = Inches(1.4 + i * 0.95)
    add_rect(s, Inches(7.2), t_pos, Inches(0.08), Inches(0.55), C_ACCENT)
    add_textbox(s, pt,
                Inches(7.5), t_pos + Inches(0.05),
                Inches(5.5), Inches(0.55),
                size=13, color=C_WHITE)

# ── 슬라이드 7 : 마무리 ──────────────────────────
s = blank_slide()
bg(s)
add_rect(s, Inches(0), Inches(0), W, Inches(0.5), C_ACCENT)
add_rect(s, Inches(0), Inches(7.0), W, Inches(0.5), C_ACCENT)

add_textbox(s, "Thank You",
            Inches(0), Inches(2.5), W, Inches(1.2),
            size=56, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
add_textbox(s, "github.com/todo-tutorial  ·  claude.ai/code",
            Inches(0), Inches(3.9), W, Inches(0.6),
            size=16, color=C_ACCENT2, align=PP_ALIGN.CENTER)

# ── 저장 ─────────────────────────────────────────
out = os.path.join(ROOT, "todo-tutorial-presentation.pptx")
prs.save(out)
print(f"[OK] saved: {out}")
print(f"   slides: {len(prs.slides)}")
