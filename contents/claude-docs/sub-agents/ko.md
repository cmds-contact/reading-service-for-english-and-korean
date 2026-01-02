# Subagent

한국어

# Subagent

Claude Code에서 작업별 워크플로우와 개선된 컨텍스트 관리를 위해 특화된 AI subagent를 생성하고 사용합니다.

## Subagent란 무엇인가요?

- 특정 목적과 전문 분야를 가집니다
- 메인 대화와 별도의 자체 컨텍스트 윈도우를 사용합니다
- 사용 가능한 특정 도구로 구성할 수 있습니다
- 동작을 안내하는 맞춤 시스템 프롬프트를 포함합니다

## 주요 이점

## 컨텍스트 보존

## 전문화된 전문성

## 재사용성

## 유연한 권한

## 빠른 시작

Subagent 인터페이스 열기

```
/agents
```

'Create New Agent' 선택

Subagent 정의

- **권장**: 먼저 Claude로 생성한 다음, 자신에게 맞게 사용자 정의
- 언제 Claude가 사용해야 하는지를 포함하여 subagent를 자세히 설명
- 액세스 권한을 부여할 도구를 선택하거나, 모든 도구를 상속받으려면 비워 두기
- 인터페이스에 사용 가능한 모든 도구가 표시됩니다
- Claude로 생성하는 경우 `e`를 눌러 자신의 편집기에서 시스템 프롬프트를 편집할 수도 있습니다

저장 및 사용

```
> Use the code-reviewer subagent to check my recent changes
```

## Subagent 설정

### 파일 위치

### 플러그인 에이전트

- 플러그인 에이전트는 사용자 정의 에이전트와 함께 `/agents`에 표시됩니다
- 명시적으로 호출 가능: "Use the code-reviewer agent from the security-plugin"
- 적절할 때 Claude에 의해 자동으로 호출될 수 있습니다
- `/agents` 인터페이스를 통해 관리(보기, 검사)할 수 있습니다

### CLI 기반 설정

```
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

- Subagent 설정의 빠른 테스트
- 저장할 필요가 없는 세션별 subagent
- 맞춤 subagent가 필요한 자동화 스크립트
- 문서나 스크립트에서 subagent 정의 공유

### 파일 형식

```
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked
tools: tool1, tool2, tool3  # 선택사항 - 생략 시 모든 도구 상속
model: sonnet  # 선택사항 - 모델 별칭 또는 'inherit' 지정
permissionMode: default  # 선택사항 - subagent의 권한 모드
skills: skill1, skill2  # 선택사항 - 자동 로드할 skill
---

Subagent의 시스템 프롬프트는 여기에 작성합니다. 여러 단락이 될 수 있으며
subagent의 역할, 기능, 문제 해결 접근 방식을 명확하게 정의해야 합니다.

Subagent가 따라야 할 구체적인 지침, 모범 사례 및 제약 사항을 포함하세요.
```

#### 설정 필드

### 모델 선택

- **모델 별칭**: 사용 가능한 별칭 중 하나 사용: `sonnet`, `opus`, 또는 `haiku`
- `'inherit'`: 메인 대화와 동일한 모델 사용 (일관성을 위해 유용)
- **생략**: 지정하지 않으면 subagent용 기본 모델 사용 (`sonnet`)

> `'inherit'` 사용은 subagent가 메인 대화의 모델 선택에 적응하여 세션 전체에서 일관된 기능과 응답 스타일을 보장하려는 경우 특히 유용합니다.

### 사용 가능한 도구

> **권장:** `/agents` 명령을 사용하여 도구 액세스를 수정하세요. 연결된 MCP 서버 도구를 포함한 모든 사용 가능한 도구를 나열하는 대화형 인터페이스를 제공하여 필요한 도구를 쉽게 선택할 수 있습니다.

- MCP 도구를 포함하여 메인 스레드에서 모든 도구를 상속하려면 `tools` 필드를 생략 (기본값)
- **개별 도구 지정**: 보다 세밀한 제어를 위해 쉼표로 구분된 목록으로 지정 (수동으로 또는 `/agents`를 통해 편집 가능)

## Subagent 관리

### /agents 명령 사용 (권장)

- 모든 사용 가능한 subagent 보기 (내장, 사용자, 프로젝트)
- 가이드 설정으로 새 subagent 생성
- 도구 액세스를 포함한 기존 맞춤 subagent 편집
- 맞춤 subagent 삭제
- 중복이 있을 때 어떤 subagent가 활성화되어 있는지 확인
- **도구 권한 관리**: 사용 가능한 도구의 전체 목록 포함

### 직접 파일 관리

```
# 프로젝트 subagent 생성
mkdir -p .claude/agents
echo '---
name: test-runner
description: Use proactively to run tests and fix failures
---

You are a test automation expert. When you see code changes, proactively run the appropriate tests. If tests fail, analyze the failures and fix them while preserving the original test intent.' > .claude/agents/test-runner.md

# 사용자 subagent 생성
mkdir -p ~/.claude/agents
# ... subagent 파일 생성
```

> 파일을 수동으로 추가하여 생성한 subagent는 다음에 Claude Code 세션을 시작할 때 로드됩니다. 재시작 없이 즉시 subagent를 생성하고 사용하려면 대신 `/agents` 명령을 사용하세요.

## 효과적인 Subagent 사용

### 자동 위임

- 요청의 작업 설명
- Subagent 설정의 `description` 필드
- 현재 컨텍스트 및 사용 가능한 도구

> 보다 사전적인 subagent 사용을 장려하려면 `description` 필드에 "use PROACTIVELY" 또는 "MUST BE USED"와 같은 문구를 포함하세요.

### 명시적 호출

```
> Use the test-runner subagent to fix failing tests
> Have the code-reviewer subagent look at my recent changes
> Ask the debugger subagent to investigate this error
```

## 내장 Subagent

### 범용 Subagent

- **모델**: 더 뛰어난 추론을 위해 Sonnet 사용
- **도구**: 모든 도구에 액세스 가능
- **모드**: 파일 읽기/쓰기, 명령 실행, 변경 가능
- **목적**: 복잡한 리서치 작업, 다단계 작업, 코드 수정
- 작업에 탐색과 수정이 모두 필요한 경우
- 검색 결과를 해석하기 위해 복잡한 추론이 필요한 경우
- 초기 검색이 실패하면 여러 전략이 필요할 수 있는 경우
- 작업에 서로 의존하는 여러 단계가 있는 경우

```
User: Find all the places where we handle authentication and update them to use the new token format

Claude: [범용 subagent 호출]
[에이전트가 코드베이스 전체에서 인증 관련 코드 검색]
[에이전트가 여러 파일 읽기 및 분석]
[에이전트가 필요한 편집 수행]
[수행된 변경 사항에 대한 상세 보고서 반환]
```

### Plan Subagent

- **모델**: 더 뛰어난 분석을 위해 Sonnet 사용
- **도구**: 코드베이스 탐색을 위해 Read, Glob, Grep, Bash 도구에 액세스 가능
- **목적**: 파일 검색, 코드 구조 분석, 컨텍스트 수집
- **자동 호출**: plan 모드에서 코드베이스를 리서치해야 할 때 Claude가 자동으로 이 에이전트를 사용

```
User: [Plan 모드에서] Help me refactor the authentication module

Claude: Let me research your authentication implementation first...
[내부적으로 Plan subagent를 호출하여 인증 관련 파일 탐색]
[Plan subagent가 코드베이스를 검색하고 결과 반환]
Claude: Based on my research, here's my proposed plan...
```

> Plan subagent는 plan 모드에서만 사용됩니다. 일반 실행 모드에서 Claude는 범용 에이전트 또는 사용자가 생성한 다른 맞춤 subagent를 사용합니다.

### Explore Subagent

- **모델**: 빠르고 저지연 검색을 위해 Haiku 사용
- **모드**: 엄격하게 읽기 전용 - 파일 생성, 수정, 삭제 불가
- **사용 가능한 도구**:

Glob - 파일 패턴 매칭
Grep - 정규 표현식으로 콘텐츠 검색
Read - 파일 내용 읽기
Bash - 읽기 전용 명령만 (ls, git status, git log, git diff, find, cat, head, tail)
- Glob - 파일 패턴 매칭
- Grep - 정규 표현식으로 콘텐츠 검색
- Read - 파일 내용 읽기
- Bash - 읽기 전용 명령만 (ls, git status, git log, git diff, find, cat, head, tail)
- **Quick** - 최소한의 탐색으로 빠른 검색. 대상이 명확한 조회에 적합.
- **Medium** - 적당한 탐색. 속도와 철저함의 균형.
- **Very thorough** - 여러 위치와 명명 규칙에 걸친 포괄적인 분석. 대상이 예상치 못한 곳에 있을 수 있을 때 사용.

```
User: Where are errors from the client handled?

Claude: [Explore subagent를 "medium" 철저함으로 호출]
[Explore가 Grep을 사용하여 오류 처리 패턴 검색]
[Explore가 Read를 사용하여 유망한 파일 검토]
[절대 파일 경로와 함께 결과 반환]
Claude: Client errors are handled in src/services/process.ts:712...
```

```
User: What's the codebase structure?

Claude: [Explore subagent를 "quick" 철저함으로 호출]
[Explore가 Glob과 ls를 사용하여 디렉토리 구조 매핑]
[주요 디렉토리와 그 목적에 대한 개요 반환]
```

## Subagent 예시

### 코드 리뷰어

```
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

### 디버거

```
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not the symptoms.
```

### 데이터 과학자

```
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data

Always ensure queries are efficient and cost-effective.
```

## 모범 사례

- **Claude로 생성된 에이전트로 시작**: 초기 subagent를 Claude로 생성한 다음 반복하여 개인적으로 만드는 것을 강력히 권장합니다. 이 접근 방식은 특정 요구 사항에 맞게 사용자 정의할 수 있는 견고한 기반으로 최상의 결과를 제공합니다.
- **집중된 subagent 설계**: 하나의 subagent가 모든 것을 하도록 만들기보다는 단일하고 명확한 책임을 가진 subagent를 생성하세요. 이렇게 하면 성능이 향상되고 subagent가 더 예측 가능해집니다.
- **상세한 프롬프트 작성**: 시스템 프롬프트에 구체적인 지침, 예시, 제약 사항을 포함하세요. 더 많은 안내를 제공할수록 subagent의 성능이 향상됩니다.
- **도구 액세스 제한**: Subagent의 목적에 필요한 도구만 부여하세요. 이렇게 하면 보안이 향상되고 subagent가 관련 작업에 집중하는 데 도움이 됩니다.
- **버전 관리**: 팀이 협력적으로 개선하고 혜택을 받을 수 있도록 프로젝트 subagent를 버전 관리에 체크인하세요.

## 고급 사용법

### Subagent 연결

```
> First use the code-analyzer subagent to find performance issues, then use the optimizer subagent to fix them
```

### 동적 Subagent 선택

### 재개 가능한 Subagent

- 각 subagent 실행에는 고유한 `agentId`가 할당됩니다
- 에이전트의 대화는 별도의 기록 파일에 저장됩니다: `agent-{agentId}.jsonl`
- `resume` 파라미터를 통해 `agentId`를 제공하여 이전 에이전트를 재개할 수 있습니다
- 재개 시 에이전트는 이전 대화의 전체 컨텍스트와 함께 계속됩니다

```
> Use the code-analyzer agent to start reviewing the authentication module

[에이전트가 초기 분석 완료 후 agentId: "abc123" 반환]
```

```
> Resume agent abc123 and now analyze the authorization logic as well

[에이전트가 이전 대화의 전체 컨텍스트와 함께 계속]
```

- **장기 실행 리서치**: 대규모 코드베이스 분석을 여러 세션으로 분할
- **반복적 개선**: 컨텍스트를 잃지 않고 subagent의 작업을 계속 개선
- **다단계 워크플로우**: 컨텍스트를 유지하면서 subagent가 관련 작업을 순차적으로 수행
- 에이전트 기록은 프로젝트 디렉토리에 저장됩니다
- 메시지 중복을 피하기 위해 재개 중에는 기록이 비활성화됩니다
- 동기 및 비동기 에이전트 모두 재개 가능합니다
- `resume` 파라미터는 이전 실행의 에이전트 ID를 받습니다

```
{
  "description": "Continue analysis",
  "prompt": "Now examine the error handling patterns",
  "subagent_type": "code-analyzer",
  "resume": "abc123"  // 이전 실행의 에이전트 ID
}
```

> 나중에 재개하려는 작업의 에이전트 ID를 추적하세요. Claude Code는 subagent가 작업을 완료하면 에이전트 ID를 표시합니다.

## 성능 고려 사항

- **컨텍스트 효율성**: 에이전트는 메인 컨텍스트를 보존하여 전체적으로 더 긴 세션을 가능하게 합니다
- **지연 시간**: Subagent는 호출될 때마다 새로 시작하며 작업을 효과적으로 수행하는 데 필요한 컨텍스트를 수집하면서 지연 시간이 추가될 수 있습니다.

## 관련 문서

- [Plugins](/docs/en/plugins) - 플러그인을 통해 맞춤 에이전트로 Claude Code 확장
- [Slash commands](/docs/en/slash-commands) - 다른 내장 명령어에 대해 알아보기
- [Settings](/docs/en/settings) - Claude Code 동작 구성
- [Hooks](/docs/en/hooks) - 이벤트 핸들러로 워크플로우 자동화

이 페이지가 도움이 되었나요?
