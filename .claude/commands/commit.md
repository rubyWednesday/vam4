---
description: "변경사항을 확인하고 Conventional Commit 형식으로 커밋"
argument-hint: "[커밋 힌트 (선택)]"
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git add *) Bash(git commit *)
---

`git status`와 `git diff`로 변경사항을 파악하고, Conventional Commit 형식으로 커밋해줘.

## 커밋 메시지 규칙
- 형식: `<type>(<scope>): <description>`
- type: feat / fix / docs / style / refactor / test / chore
- 한국어로 description 작성
- 본문이 필요하면 추가

## 추가 지시사항
$ARGUMENTS
