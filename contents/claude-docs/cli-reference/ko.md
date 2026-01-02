# CLI 참조

한국어

# CLI 참조

명령어와 플래그를 포함한 Claude Code 명령줄 인터페이스의 완전한 참조 문서입니다.

## CLI 명령어

## CLI 플래그

> `--output-format json` 플래그는 스크립팅과 자동화에 특히 유용하며, Claude의 응답을 프로그래밍 방식으로 파싱할 수 있게 해줍니다.

### 에이전트 플래그 형식

```
claude --agents '{
  "code-reviewer": {
    "description": "전문 코드 리뷰어. 코드 변경 후 자동으로 사용됩니다.",
    "prompt": "당신은 시니어 코드 리뷰어입니다. 코드 품질, 보안, 모범 사례에 집중하세요.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "오류 및 테스트 실패 전문 디버거.",
    "prompt": "당신은 전문 디버거입니다. 오류를 분석하고, 근본 원인을 파악하며, 수정 방법을 제공하세요."
  }
}'
```

### 시스템 프롬프트 플래그

- `--system-prompt`: Claude의 시스템 프롬프트를 완전히 제어해야 할 때 사용합니다. 이렇게 하면 모든 기본 Claude Code 지침이 제거되어 백지 상태에서 시작할 수 있습니다.
CopyAsk AIclaude --system-prompt "You are a Python expert who only writes type-annotated code"

```
claude --system-prompt "You are a Python expert who only writes type-annotated code"
```

- `--system-prompt-file`: 파일에서 사용자 정의 프롬프트를 로드하려는 경우에 사용합니다. 팀 일관성이나 버전 관리되는 프롬프트 템플릿에 유용합니다.
CopyAsk AIclaude -p --system-prompt-file ./prompts/code-review.txt "Review this PR"

```
claude -p --system-prompt-file ./prompts/code-review.txt "Review this PR"
```

- `--append-system-prompt`: Claude Code의 기본 기능을 유지하면서 특정 지침을 추가하려는 경우에 사용합니다. 대부분의 사용 사례에서 가장 안전한 옵션입니다.
CopyAsk AIclaude --append-system-prompt "Always use TypeScript and include JSDoc comments"

```
claude --append-system-prompt "Always use TypeScript and include JSDoc comments"
```

> `--system-prompt`와 `--system-prompt-file`은 상호 배타적입니다. 두 플래그를 동시에 사용할 수 없습니다.

> 대부분의 사용 사례에서는 Claude Code의 내장 기능을 유지하면서 사용자 정의 요구 사항을 추가하는 `--append-system-prompt`가 권장됩니다. 시스템 프롬프트를 완전히 제어해야 하는 경우에만 `--system-prompt` 또는 `--system-prompt-file`을 사용하세요.

## 관련 문서

- [Chrome 확장 프로그램](/docs/en/chrome) - 브라우저 자동화 및 웹 테스트
- [대화형 모드](/docs/en/interactive-mode) - 단축키, 입력 모드 및 대화형 기능
- [슬래시 명령어](/docs/en/slash-commands) - 대화형 세션 명령어
- [빠른 시작 가이드](/docs/en/quickstart) - Claude Code 시작하기
- [일반적인 워크플로](/docs/en/common-workflows) - 고급 워크플로 및 패턴
- [설정](/docs/en/settings) - 설정 옵션
- [SDK 문서](https://docs.claude.com/en/docs/agent-sdk) - 프로그래밍 방식 사용 및 통합

이 페이지가 도움이 되었나요?
