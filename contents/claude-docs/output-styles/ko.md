# 출력 스타일

한국어

# 출력 스타일

소프트웨어 엔지니어링을 넘어선 용도로 Claude Code를 조정합니다

## 내장 출력 스타일

- **Explanatory**: 소프트웨어 엔지니어링 작업을 완료하는 동안 교육적인 "Insights"를 제공합니다. 구현 선택과 코드베이스 패턴을 이해하는 데 도움이 됩니다.
- **Learning**: 협력적인 학습 모드로, Claude는 코딩하면서 "Insights"를 공유할 뿐만 아니라 사용자가 직접 작은 전략적 코드 조각을 작성하도록 요청합니다. Claude Code는 사용자가 구현할 `TODO(human)` 마커를 코드에 추가합니다.

## 출력 스타일 작동 방식

- 모든 출력 스타일은 효율적인 출력(예: 간결하게 응답)에 대한 지시를 제외합니다.
- `keep-coding-instructions`가 true가 아니면 맞춤 출력 스타일은 코딩 지시(예: 테스트로 코드 확인)를 제외합니다.
- 모든 출력 스타일은 시스템 프롬프트 끝에 자체 맞춤 지시가 추가됩니다.
- 모든 출력 스타일은 대화 중에 Claude가 출력 스타일 지시를 준수하도록 알림을 트리거합니다.

## 출력 스타일 변경

- `/output-style`을 실행하여 메뉴에 액세스하고 출력 스타일을 선택합니다 (`/config` 메뉴에서도 액세스할 수 있습니다)
- `/output-style [style]`을 실행합니다. 예: `/output-style explanatory`로 스타일로 직접 전환

## 맞춤 출력 스타일 생성

```
---
name: My Custom Style
description:
  A brief description of what this style does, to be displayed to the user
---

# Custom Style Instructions

You are an interactive CLI tool that helps users with software engineering
tasks. [Your custom instructions here...]

## Specific Behaviors

[Define how the assistant should behave in this style...]
```

### Frontmatter

## 관련 기능과 비교

### 출력 스타일 vs. CLAUDE.md vs. --append-system-prompt

### 출력 스타일 vs. 에이전트

### 출력 스타일 vs. 맞춤 슬래시 명령어

이 페이지가 도움이 되었나요?
