# 일반적인 워크플로우

한국어

# 일반적인 워크플로우

Claude Code의 일반적인 워크플로우에 대해 알아보세요.

## 새로운 코드베이스 이해하기

### 코드베이스 빠른 개요 보기

프로젝트 루트 디렉토리로 이동

```
cd /path/to/project
```

Claude Code 시작

```
claude
```

높은 수준의 개요 요청

```
> give me an overview of this codebase
```

특정 컴포넌트에 대해 자세히 알아보기

```
> explain the main architecture patterns used here
```

```
> what are the key data models?
```

```
> how is authentication handled?
```

> 팁:
> 넓은 질문으로 시작하여 특정 영역으로 좁혀가세요
> 프로젝트에서 사용된 코딩 규칙과 패턴에 대해 물어보세요
> 프로젝트별 용어 목록을 요청하세요

- 넓은 질문으로 시작하여 특정 영역으로 좁혀가세요
- 프로젝트에서 사용된 코딩 규칙과 패턴에 대해 물어보세요
- 프로젝트별 용어 목록을 요청하세요

### 관련 코드 찾기

Claude에게 관련 파일 찾기 요청

```
> find the files that handle user authentication
```

컴포넌트들이 어떻게 상호작용하는지 컨텍스트 얻기

```
> how do these authentication files work together?
```

실행 흐름 이해하기

```
> trace the login process from front-end to database
```

> 팁:
> 찾고 있는 것을 구체적으로 설명하세요
> 프로젝트의 도메인 언어를 사용하세요

- 찾고 있는 것을 구체적으로 설명하세요
- 프로젝트의 도메인 언어를 사용하세요

## 버그를 효율적으로 수정하기

Claude에게 오류 공유

```
> I'm seeing an error when I run npm test
```

수정 권장 사항 요청

```
> suggest a few ways to fix the @ts-ignore in user.ts
```

수정 적용

```
> update user.ts to add the null check you suggested
```

> 팁:
> Claude에게 문제를 재현하는 명령과 스택 트레이스를 알려주세요
> 오류를 재현하는 단계를 언급하세요
> 오류가 간헐적인지 일관적인지 Claude에게 알려주세요

- Claude에게 문제를 재현하는 명령과 스택 트레이스를 알려주세요
- 오류를 재현하는 단계를 언급하세요
- 오류가 간헐적인지 일관적인지 Claude에게 알려주세요

## 코드 리팩토링

리팩토링할 레거시 코드 식별

```
> find deprecated API usage in our codebase
```

리팩토링 권장 사항 받기

```
> suggest how to refactor utils.js to use modern JavaScript features
```

안전하게 변경 사항 적용

```
> refactor utils.js to use ES2024 features while maintaining the same behavior
```

리팩토링 검증

```
> run tests for the refactored code
```

> 팁:
> Claude에게 현대적 접근 방식의 이점을 설명해 달라고 요청하세요
> 필요할 때 이전 버전과의 호환성을 유지하도록 요청하세요
> 작고 테스트 가능한 단위로 리팩토링하세요

- Claude에게 현대적 접근 방식의 이점을 설명해 달라고 요청하세요
- 필요할 때 이전 버전과의 호환성을 유지하도록 요청하세요
- 작고 테스트 가능한 단위로 리팩토링하세요

## 특수 서브에이전트 사용

사용 가능한 서브에이전트 보기

```
> /agents
```

서브에이전트 자동 사용

```
> review my recent code changes for security issues
```

```
> run all tests and fix any failures
```

특정 서브에이전트 명시적 요청

```
> use the code-reviewer subagent to check the auth module
```

```
> have the debugger subagent investigate why users can't log in
```

워크플로우에 맞는 맞춤 서브에이전트 생성

- 서브에이전트의 목적을 설명하는 고유 식별자 (예: `code-reviewer`, `api-designer`).
- Claude가 이 에이전트를 언제 사용해야 하는지
- 액세스할 수 있는 도구
- 에이전트의 역할과 동작을 설명하는 시스템 프롬프트

> 팁:
> 팀 공유를 위해 `.claude/agents/`에 프로젝트별 서브에이전트를 생성하세요
> 자동 위임을 활성화하려면 설명적인 `description` 필드를 사용하세요
> 각 서브에이전트가 실제로 필요한 것으로 도구 액세스를 제한하세요
> 자세한 예제는 [서브에이전트 문서](/docs/en/sub-agents)를 확인하세요

- 팀 공유를 위해 `.claude/agents/`에 프로젝트별 서브에이전트를 생성하세요
- 자동 위임을 활성화하려면 설명적인 `description` 필드를 사용하세요
- 각 서브에이전트가 실제로 필요한 것으로 도구 액세스를 제한하세요
- 자세한 예제는 [서브에이전트 문서](/docs/en/sub-agents)를 확인하세요

## 안전한 코드 분석을 위한 Plan Mode 사용

### Plan Mode를 사용해야 할 때

- **다단계 구현**: 많은 파일을 편집해야 하는 기능일 때
- **코드 탐색**: 변경하기 전에 코드베이스를 철저히 조사하고 싶을 때
- **대화형 개발**: Claude와 방향에 대해 반복적으로 논의하고 싶을 때

### Plan Mode 사용 방법

```
claude --permission-mode plan
```

```
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

### 예제: 복잡한 리팩토링 계획

```
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
```

```
> What about backward compatibility?
> How should we handle database migration?
```

### Plan Mode를 기본값으로 설정

```
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

## 테스트 작업

테스트되지 않은 코드 식별

```
> find functions in NotificationsService.swift that are not covered by tests
```

테스트 스캐폴딩 생성

```
> add tests for the notification service
```

의미 있는 테스트 케이스 추가

```
> add test cases for edge conditions in the notification service
```

테스트 실행 및 검증

```
> run the new tests and fix any failures
```

## Pull Request 생성

변경 사항 요약

```
> summarize the changes I've made to the authentication module
```

Claude로 Pull Request 생성

```
> create a pr
```

검토 및 개선

```
> enhance the PR description with more context about the security improvements
```

테스트 세부 정보 추가

```
> add information about how these changes were tested
```

> 팁:
> Claude에게 직접 PR을 만들어 달라고 요청하세요
> 제출하기 전에 Claude가 생성한 PR을 검토하세요
> Claude에게 잠재적 위험이나 고려 사항을 강조해 달라고 요청하세요

- Claude에게 직접 PR을 만들어 달라고 요청하세요
- 제출하기 전에 Claude가 생성한 PR을 검토하세요
- Claude에게 잠재적 위험이나 고려 사항을 강조해 달라고 요청하세요

## 문서 처리

문서화되지 않은 코드 식별

```
> find functions without proper JSDoc comments in the auth module
```

문서 생성

```
> add JSDoc comments to the undocumented functions in auth.js
```

검토 및 개선

```
> improve the generated documentation with more context and examples
```

문서 검증

```
> check if the documentation follows our project standards
```

> 팁:
> 원하는 문서 스타일을 지정하세요 (JSDoc, docstrings 등)
> 문서에 예제를 요청하세요
> 공개 API, 인터페이스 및 복잡한 로직에 대한 문서를 요청하세요

- 원하는 문서 스타일을 지정하세요 (JSDoc, docstrings 등)
- 문서에 예제를 요청하세요
- 공개 API, 인터페이스 및 복잡한 로직에 대한 문서를 요청하세요

## 이미지 작업

대화에 이미지 추가

- Claude Code 창으로 이미지를 드래그 앤 드롭
- 이미지를 복사하고 ctrl+v로 CLI에 붙여넣기 (cmd+v는 사용하지 마세요)
- Claude에게 이미지 경로 제공. 예: "Analyze this image: /path/to/your/image.png"

Claude에게 이미지 분석 요청

```
> What does this image show?
```

```
> Describe the UI elements in this screenshot
```

```
> Are there any problematic elements in this diagram?
```

컨텍스트로 이미지 사용

```
> Here's a screenshot of the error. What's causing it?
```

```
> This is our current database schema. How should we modify it for the new feature?
```

시각적 콘텐츠에서 코드 제안 받기

```
> Generate CSS to match this design mockup
```

```
> What HTML structure would recreate this component?
```

> 팁:
> 텍스트 설명이 불명확하거나 번거로울 때 이미지를 사용하세요
> 더 나은 컨텍스트를 위해 오류, UI 디자인 또는 다이어그램의 스크린샷을 포함하세요
> 대화에서 여러 이미지로 작업할 수 있습니다
> 이미지 분석은 다이어그램, 스크린샷, 목업 등에서 작동합니다

- 텍스트 설명이 불명확하거나 번거로울 때 이미지를 사용하세요
- 더 나은 컨텍스트를 위해 오류, UI 디자인 또는 다이어그램의 스크린샷을 포함하세요
- 대화에서 여러 이미지로 작업할 수 있습니다
- 이미지 분석은 다이어그램, 스크린샷, 목업 등에서 작동합니다

## 파일 및 디렉토리 참조

단일 파일 참조

```
> Explain the logic in @src/utils/auth.js
```

디렉토리 참조

```
> What's the structure of @src/components?
```

MCP 리소스 참조

```
> Show me the data from @github:repos/owner/repo/issues
```

> 팁:
> 파일 경로는 상대 또는 절대 경로일 수 있습니다
> @ 파일 참조는 해당 파일의 디렉토리와 상위 디렉토리에 있는 `CLAUDE.md`를 컨텍스트에 추가합니다
> 디렉토리 참조는 내용이 아닌 파일 목록을 보여줍니다
> 단일 메시지에서 여러 파일을 참조할 수 있습니다 (예: "@file1.js and @file2.js")

- 파일 경로는 상대 또는 절대 경로일 수 있습니다
- @ 파일 참조는 해당 파일의 디렉토리와 상위 디렉토리에 있는 `CLAUDE.md`를 컨텍스트에 추가합니다
- 디렉토리 참조는 내용이 아닌 파일 목록을 보여줍니다
- 단일 메시지에서 여러 파일을 참조할 수 있습니다 (예: "@file1.js and @file2.js")

## 확장 사고 (thinking mode) 사용

> Sonnet 4.5와 Opus 4.5는 기본적으로 사고가 활성화되어 있습니다. 다른 모든 모델은 기본적으로 사고가 비활성화되어 있습니다. `/model`을 사용하여 현재 모델을 확인하거나 전환하세요.

### ultrathink로 요청별 사고

```
> ultrathink: design a caching layer for our API
```

### 확장 사고 토큰 예산 작동 방식

- 여러 솔루션 접근 방식을 단계별로 탐색할 수 있는 더 많은 공간
- 엣지 케이스를 분석하고 트레이드오프를 철저히 평가할 수 있는 여유
- 추론을 수정하고 실수를 자체 수정할 수 있는 능력
- 사고가 **활성화**되면 (`/config` 또는 `ultrathink`를 통해), Claude는 내부 추론에 출력 예산에서 최대 **31,999 토큰**을 사용할 수 있습니다
- 사고가 **비활성화**되면, Claude는 사고에 **0 토큰**을 사용합니다
- `MAX_THINKING_TOKENS` 환경 변수를 사용하여 사용자 정의 사고 토큰 예산을 설정할 수 있습니다
- 이것이 가장 높은 우선순위를 가지며 기본 31,999 토큰 예산을 재정의합니다
- 유효한 토큰 범위는 [확장 사고 문서](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)를 참조하세요

> Claude 4 모델이 요약된 사고를 보여주더라도 사용된 모든 사고 토큰에 대해 요금이 부과됩니다

## 이전 대화 재개

- `claude --continue`는 현재 디렉토리에서 가장 최근 대화를 계속합니다
- `claude --resume`은 대화 선택기를 열거나 이름으로 재개합니다

### 세션 이름 지정

현재 세션 이름 지정

```
> /rename auth-refactor
```

나중에 이름으로 재개

```
claude --resume auth-refactor
```

```
> /resume auth-refactor
```

### 세션 선택기 사용

- 세션 이름 또는 초기 프롬프트
- 마지막 활동 이후 경과 시간
- 메시지 수
- Git 브랜치 (해당하는 경우)

> 팁:
> **세션 이름을 일찍 지정**: 고유한 작업을 시작할 때 `/rename`을 사용하세요 - 나중에 "explain this function"보다 "payment-integration"을 찾는 것이 훨씬 쉽습니다
> 가장 최근 대화에 빠르게 액세스하려면 `--continue`를 사용하세요
> 어떤 세션이 필요한지 알 때는 `--resume session-name`을 사용하세요
> 찾아보고 선택해야 할 때는 `--resume` (이름 없이)을 사용하세요
> 스크립트에서는 `claude --continue --print "prompt"`를 사용하여 비대화형 모드로 재개하세요
> 선택기에서 `P`를 눌러 재개하기 전에 세션을 미리 보세요
> 재개된 대화는 원래와 동일한 모델 및 설정으로 시작됩니다
> 작동 방식:
> **대화 저장**: 모든 대화는 전체 메시지 기록과 함께 로컬에 자동으로 저장됩니다
> **메시지 역직렬화**: 재개 시 전체 메시지 기록이 복원되어 컨텍스트가 유지됩니다
> **도구 상태**: 이전 대화의 도구 사용 및 결과가 보존됩니다
> **컨텍스트 복원**: 이전의 모든 컨텍스트가 그대로 유지된 채 대화가 재개됩니다

- **세션 이름을 일찍 지정**: 고유한 작업을 시작할 때 `/rename`을 사용하세요 - 나중에 "explain this function"보다 "payment-integration"을 찾는 것이 훨씬 쉽습니다
- 가장 최근 대화에 빠르게 액세스하려면 `--continue`를 사용하세요
- 어떤 세션이 필요한지 알 때는 `--resume session-name`을 사용하세요
- 찾아보고 선택해야 할 때는 `--resume` (이름 없이)을 사용하세요
- 스크립트에서는 `claude --continue --print "prompt"`를 사용하여 비대화형 모드로 재개하세요
- 선택기에서 `P`를 눌러 재개하기 전에 세션을 미리 보세요
- 재개된 대화는 원래와 동일한 모델 및 설정으로 시작됩니다
- **대화 저장**: 모든 대화는 전체 메시지 기록과 함께 로컬에 자동으로 저장됩니다
- **메시지 역직렬화**: 재개 시 전체 메시지 기록이 복원되어 컨텍스트가 유지됩니다
- **도구 상태**: 이전 대화의 도구 사용 및 결과가 보존됩니다
- **컨텍스트 복원**: 이전의 모든 컨텍스트가 그대로 유지된 채 대화가 재개됩니다

## Git worktree로 병렬 Claude Code 세션 실행

Git worktree 이해하기

새 worktree 생성

```
# 새 브랜치로 새 worktree 생성
git worktree add ../project-feature-a -b feature-a

# 또는 기존 브랜치로 worktree 생성
git worktree add ../project-bugfix bugfix-123
```

각 worktree에서 Claude Code 실행

```
# worktree로 이동
cd ../project-feature-a

# 이 격리된 환경에서 Claude Code 실행
claude
```

다른 worktree에서 Claude 실행

```
cd ../project-bugfix
claude
```

worktree 관리

```
# 모든 worktree 목록
git worktree list

# 완료 후 worktree 제거
git worktree remove ../project-feature-a
```

> 팁:
> 각 worktree는 독립적인 파일 상태를 가지므로 병렬 Claude Code 세션에 완벽합니다
> 한 worktree에서 수행한 변경은 다른 worktree에 영향을 미치지 않아 Claude 인스턴스가 서로 간섭하는 것을 방지합니다
> 모든 worktree는 동일한 Git 히스토리와 원격 연결을 공유합니다
> 장기 실행 작업의 경우 한 worktree에서 Claude가 작업하는 동안 다른 worktree에서 개발을 계속할 수 있습니다
> 각 worktree가 어떤 작업을 위한 것인지 쉽게 식별할 수 있도록 설명적인 디렉토리 이름을 사용하세요
> 프로젝트 설정에 따라 각 새 worktree에서 개발 환경을 초기화해야 합니다. 스택에 따라 다음이 포함될 수 있습니다:
>
> JavaScript 프로젝트: 의존성 설치 실행 (`npm install`, `yarn`)
> Python 프로젝트: 가상 환경 설정 또는 패키지 관리자로 설치
> 기타 언어: 프로젝트의 표준 설정 프로세스 따르기

- 각 worktree는 독립적인 파일 상태를 가지므로 병렬 Claude Code 세션에 완벽합니다
- 한 worktree에서 수행한 변경은 다른 worktree에 영향을 미치지 않아 Claude 인스턴스가 서로 간섭하는 것을 방지합니다
- 모든 worktree는 동일한 Git 히스토리와 원격 연결을 공유합니다
- 장기 실행 작업의 경우 한 worktree에서 Claude가 작업하는 동안 다른 worktree에서 개발을 계속할 수 있습니다
- 각 worktree가 어떤 작업을 위한 것인지 쉽게 식별할 수 있도록 설명적인 디렉토리 이름을 사용하세요
- 프로젝트 설정에 따라 각 새 worktree에서 개발 환경을 초기화해야 합니다. 스택에 따라 다음이 포함될 수 있습니다:

JavaScript 프로젝트: 의존성 설치 실행 (`npm install`, `yarn`)
Python 프로젝트: 가상 환경 설정 또는 패키지 관리자로 설치
기타 언어: 프로젝트의 표준 설정 프로세스 따르기
- JavaScript 프로젝트: 의존성 설치 실행 (`npm install`, `yarn`)
- Python 프로젝트: 가상 환경 설정 또는 패키지 관리자로 설치
- 기타 언어: 프로젝트의 표준 설정 프로세스 따르기

## Claude를 Unix 스타일 유틸리티로 사용

### 검증 프로세스에 Claude 추가

```
// package.json
{
    ...
    "scripts": {
        ...
        "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
    }
}
```

> 팁:
> CI/CD 파이프라인에서 자동화된 코드 리뷰에 Claude를 사용하세요
> 프로젝트와 관련된 특정 문제를 확인하도록 프롬프트를 맞춤화하세요
> 다양한 유형의 검증을 위해 여러 스크립트를 생성하는 것을 고려하세요

- CI/CD 파이프라인에서 자동화된 코드 리뷰에 Claude를 사용하세요
- 프로젝트와 관련된 특정 문제를 확인하도록 프롬프트를 맞춤화하세요
- 다양한 유형의 검증을 위해 여러 스크립트를 생성하는 것을 고려하세요

### 파이프 입력, 파이프 출력

```
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

> 팁:
> 파이프를 사용하여 Claude를 기존 셸 스크립트에 통합하세요
> 강력한 워크플로우를 위해 다른 Unix 도구와 결합하세요
> 구조화된 출력을 위해 --output-format 사용을 고려하세요

- 파이프를 사용하여 Claude를 기존 셸 스크립트에 통합하세요
- 강력한 워크플로우를 위해 다른 Unix 도구와 결합하세요
- 구조화된 출력을 위해 --output-format 사용을 고려하세요

### 출력 형식 제어

텍스트 형식 사용 (기본값)

```
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt
```

JSON 형식 사용

```
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json
```

스트리밍 JSON 형식 사용

```
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json
```

> 팁:
> Claude의 응답만 필요한 간단한 통합에는 `--output-format text`를 사용하세요
> 전체 대화 로그가 필요할 때는 `--output-format json`을 사용하세요
> 각 대화 턴의 실시간 출력에는 `--output-format stream-json`을 사용하세요

- Claude의 응답만 필요한 간단한 통합에는 `--output-format text`를 사용하세요
- 전체 대화 로그가 필요할 때는 `--output-format json`을 사용하세요
- 각 대화 턴의 실시간 출력에는 `--output-format stream-json`을 사용하세요

## 사용자 정의 슬래시 명령 만들기

### 프로젝트별 명령 만들기

프로젝트에 commands 디렉토리 생성

```
mkdir -p .claude/commands
```

각 명령에 대해 Markdown 파일 생성

```
echo "Analyze the performance of this code and suggest three specific optimizations:" > .claude/commands/optimize.md
```

Claude Code에서 사용자 정의 명령 사용

```
> /optimize
```

> 팁:
> 명령 이름은 파일 이름에서 파생됩니다 (예: `optimize.md`가 `/optimize`가 됨)
> 하위 디렉토리에 명령을 구성할 수 있습니다 (예: `.claude/commands/frontend/component.md`는 설명에 "(project:frontend)"와 함께 `/component`를 생성)
> 프로젝트 명령은 저장소를 복제하는 모든 사람이 사용할 수 있습니다
> Markdown 파일 내용은 명령이 호출될 때 Claude에 전송되는 프롬프트가 됩니다

- 명령 이름은 파일 이름에서 파생됩니다 (예: `optimize.md`가 `/optimize`가 됨)
- 하위 디렉토리에 명령을 구성할 수 있습니다 (예: `.claude/commands/frontend/component.md`는 설명에 "(project:frontend)"와 함께 `/component`를 생성)
- 프로젝트 명령은 저장소를 복제하는 모든 사람이 사용할 수 있습니다
- Markdown 파일 내용은 명령이 호출될 때 Claude에 전송되는 프롬프트가 됩니다

### $ARGUMENTS로 명령 인수 추가

$ARGUMENTS 플레이스홀더가 있는 명령 파일 생성

```
echo 'Find and fix issue #$ARGUMENTS. Follow these steps: 1.
Understand the issue described in the ticket 2. Locate the relevant code in
our codebase 3. Implement a solution that addresses the root cause 4. Add
appropriate tests 5. Prepare a concise PR description' >
.claude/commands/fix-issue.md
```

이슈 번호와 함께 명령 사용

```
> /fix-issue 123
```

> 팁:
> $ARGUMENTS 플레이스홀더는 명령 뒤에 오는 텍스트로 대체됩니다
> 명령 템플릿 어디에나 $ARGUMENTS를 배치할 수 있습니다
> 기타 유용한 활용: 특정 함수에 대한 테스트 케이스 생성, 컴포넌트에 대한 문서 작성, 특정 파일의 코드 검토 또는 지정된 언어로 콘텐츠 번역

- $ARGUMENTS 플레이스홀더는 명령 뒤에 오는 텍스트로 대체됩니다
- 명령 템플릿 어디에나 $ARGUMENTS를 배치할 수 있습니다
- 기타 유용한 활용: 특정 함수에 대한 테스트 케이스 생성, 컴포넌트에 대한 문서 작성, 특정 파일의 코드 검토 또는 지정된 언어로 콘텐츠 번역

### 개인 슬래시 명령 만들기

홈 폴더에 commands 디렉토리 생성

```
mkdir -p ~/.claude/commands
```

```
echo "Review this code for security vulnerabilities, focusing on:" >
~/.claude/commands/security-review.md
```

개인 사용자 정의 명령 사용

```
> /security-review
```

> 팁:
> 개인 명령은 `/help`로 나열될 때 설명에 "(user)"가 표시됩니다
> 개인 명령은 본인만 사용할 수 있으며 팀과 공유되지 않습니다
> 개인 명령은 모든 프로젝트에서 작동합니다
> 다양한 코드베이스에서 일관된 워크플로우에 이를 사용할 수 있습니다

- 개인 명령은 `/help`로 나열될 때 설명에 "(user)"가 표시됩니다
- 개인 명령은 본인만 사용할 수 있으며 팀과 공유되지 않습니다
- 개인 명령은 모든 프로젝트에서 작동합니다
- 다양한 코드베이스에서 일관된 워크플로우에 이를 사용할 수 있습니다

## Claude에게 기능에 대해 물어보기

### 예시 질문

```
> can Claude Code create pull requests?
```

```
> how does Claude Code handle permissions?
```

```
> what slash commands are available?
```

```
> how do I use MCP with Claude Code?
```

```
> how do I configure Claude Code for Amazon Bedrock?
```

```
> what are the limitations of Claude Code?
```

> Claude는 이러한 질문에 대해 문서 기반 답변을 제공합니다. 실행 가능한 예제와 실습 데모는 위의 특정 워크플로우 섹션을 참조하세요.

> 팁:
> Claude는 사용 중인 버전에 관계없이 항상 최신 Claude Code 문서에 액세스할 수 있습니다
> 자세한 답변을 얻으려면 구체적인 질문을 하세요
> Claude는 MCP 통합, 엔터프라이즈 설정 및 고급 워크플로우와 같은 복잡한 기능을 설명할 수 있습니다

- Claude는 사용 중인 버전에 관계없이 항상 최신 Claude Code 문서에 액세스할 수 있습니다
- 자세한 답변을 얻으려면 구체적인 질문을 하세요
- Claude는 MCP 통합, 엔터프라이즈 설정 및 고급 워크플로우와 같은 복잡한 기능을 설명할 수 있습니다

## 다음 단계

## Claude Code 레퍼런스 구현

이 페이지가 도움이 되었나요?
