# 슬래시 명령어

한국어

# 슬래시 명령어

대화형 세션 중 슬래시 명령어로 Claude의 동작을 제어합니다.

## 내장 슬래시 명령어

## 사용자 정의 슬래시 명령어

### 구문

```
/<command-name> [arguments]
```

#### 매개변수

### 명령어 유형

#### 프로젝트 명령어

```
# 프로젝트 명령어 만들기
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

#### 개인 명령어

```
# 개인 명령어 만들기
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
```

### 기능

#### 네임스페이싱

- `.claude/commands/frontend/component.md`는 "(project:frontend)" 설명과 함께 `/component`를 생성합니다
- `~/.claude/commands/component.md`는 "(user)" 설명과 함께 `/component`를 생성합니다

#### 인수

##### $ARGUMENTS로 모든 인수 사용

```
# 명령어 정의
echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md

# 사용법
> /fix-issue 123 high-priority
# $ARGUMENTS는 "123 high-priority"가 됩니다
```

##### $1, $2 등으로 개별 인수 사용

```
# 명령어 정의
echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md

# 사용법
> /review-pr 456 high alice
# $1은 "456", $2는 "high", $3은 "alice"가 됩니다
```

- 명령어의 다른 부분에서 인수에 개별적으로 접근
- 누락된 인수에 대한 기본값 제공
- 특정 매개변수 역할로 더 구조화된 명령어 구축

#### Bash 명령어 실행

```
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

#### 파일 참조

```
# 특정 파일 참조
Review the implementation in @src/utils/helpers.js

# 여러 파일 참조
Compare @src/old-version.js with @src/new-version.js
```

#### 생각 모드

### 프론트매터

```
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit
model: claude-3-5-haiku-20241022
---

Create a git commit with message: $ARGUMENTS
```

```
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

## 플러그인 명령어

### 플러그인 명령어 작동 방식

- **네임스페이스**: 명령어는 충돌을 피하기 위해 `/plugin-name:command-name` 형식을 사용할 수 있습니다 (이름 충돌이 없으면 플러그인 접두사는 선택 사항)
- **자동 사용 가능**: 플러그인이 설치되고 활성화되면 해당 명령어가 `/help`에 나타납니다
- **완전한 통합**: 모든 명령어 기능 지원 (인수, 프론트매터, bash 실행, 파일 참조)

### 플러그인 명령어 구조

```
---
description: Brief description of what the command does
---

# Command Name

Detailed instructions for Claude on how to execute this command.
Include specific guidance on parameters, expected outcomes, and any special considerations.
```

- **인수**: 명령어 설명에 `{arg1}`과 같은 플레이스홀더 사용
- **하위 디렉토리**: 네임스페이싱을 위해 하위 디렉토리에 명령어 구성
- **Bash 통합**: 명령어는 셸 스크립트와 프로그램을 실행할 수 있음
- **파일 참조**: 명령어는 프로젝트 파일을 참조하고 수정할 수 있음

### 호출 패턴

```
/command-name
```

```
/plugin-name:command-name
```

```
/command-name arg1 arg2
```

## MCP 슬래시 명령어

### 명령어 형식

```
/mcp__<server-name>__<prompt-name> [arguments]
```

#### 동적 검색

- MCP 서버가 연결되어 활성화됨
- 서버가 MCP 프로토콜을 통해 프롬프트를 노출함
- 연결 중 프롬프트가 성공적으로 검색됨

```
# 인수 없이
> /mcp__github__list_prs

# 인수와 함께
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Bug title" high
```

#### 명명 규칙

- 공백과 특수 문자는 밑줄이 됨
- 일관성을 위해 이름은 소문자로 함

### MCP 연결 관리

- 구성된 모든 MCP 서버 보기
- 연결 상태 확인
- OAuth 지원 서버로 인증
- 인증 토큰 지우기
- 각 서버에서 사용 가능한 도구와 프롬프트 보기

### MCP 권한 및 와일드카드

- `mcp__github` (모든 GitHub 도구 승인)
- `mcp__github__*` (와일드카드 구문, 역시 모든 GitHub 도구 승인)
- `mcp__github__get_issue`
- `mcp__github__list_issues`

## SlashCommand 도구

```
> Run /write-unit-test when you are about to start writing tests.
```

### SlashCommand 도구 지원 명령어

- 사용자 정의입니다. `/compact` 및 `/init`과 같은 내장 명령어는 지원되지 *않습니다*.
- `description` 프론트매터 필드가 채워져 있어야 합니다. 설명은 컨텍스트에서 사용됩니다.

### SlashCommand 도구 비활성화

```
/permissions
# 거부 규칙에 추가: SlashCommand
```

### 특정 명령어만 비활성화

### SlashCommand 권한 규칙

- **정확한 일치**: `SlashCommand:/commit` (인수 없이 `/commit`만 허용)
- **접두사 일치**: `SlashCommand:/review-pr:*` (모든 인수와 함께 `/review-pr` 허용)

### 문자 예산 제한

- **기본 제한**: 15,000자
- **사용자 정의 제한**: `SLASH_COMMAND_TOOL_CHAR_BUDGET` 환경 변수를 통해 설정

## Skills vs 슬래시 명령어

### 슬래시 명령어 사용 시기

- 자주 사용하는 간단한 프롬프트 스니펫
- 빠른 알림이나 템플릿
- 하나의 파일에 맞는 자주 사용하는 지침
- `/review` -> "이 코드에서 버그를 검토하고 개선 사항을 제안하세요"
- `/explain` -> "이 코드를 간단한 용어로 설명하세요"
- `/optimize` -> "이 코드의 성능 문제를 분석하세요"

### Skills 사용 시기

- 여러 단계가 있는 복잡한 워크플로
- 스크립트나 유틸리티가 필요한 기능
- 여러 파일에 걸쳐 구성된 지식
- 표준화하려는 팀 워크플로
- 양식 작성 스크립트와 유효성 검사가 있는 PDF 처리 Skill
- 다양한 데이터 유형에 대한 참조 문서가 있는 데이터 분석 Skill
- 스타일 가이드와 템플릿이 있는 문서화 Skill

### 주요 차이점

### 예제 비교

```
# .claude/commands/review.md
Review this code for:
- Security vulnerabilities
- Performance issues
- Code style violations
```

```
.claude/skills/code-review/
├── SKILL.md (overview and workflows)
├── SECURITY.md (security checklist)
├── PERFORMANCE.md (performance patterns)
├── STYLE.md (style guide reference)
└── scripts/
    └── run-linters.sh
```

### 각각 사용할 때

- 동일한 프롬프트를 반복적으로 호출함
- 프롬프트가 단일 파일에 맞음
- 실행 시점을 명시적으로 제어하고 싶음
- Claude가 기능을 자동으로 발견해야 함
- 여러 파일이나 스크립트가 필요함
- 유효성 검사 단계가 있는 복잡한 워크플로
- 팀에 표준화된 상세 가이드가 필요함

## 관련 문서

- [플러그인](/docs/en/plugins) - 플러그인을 통해 사용자 정의 명령어로 Claude Code 확장
- [ID 및 액세스 관리](/docs/en/iam) - MCP 도구 권한을 포함한 권한에 대한 완전한 가이드
- [대화형 모드](/docs/en/interactive-mode) - 단축키, 입력 모드 및 대화형 기능
- [CLI 참조](/docs/en/cli-reference) - 명령줄 플래그 및 옵션
- [설정](/docs/en/settings) - 설정 옵션
- [메모리 관리](/docs/en/memory) - 세션 간 Claude의 메모리 관리

이 페이지가 도움이 되었나요?
