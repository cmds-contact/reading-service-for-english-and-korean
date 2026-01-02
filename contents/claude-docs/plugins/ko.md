# 플러그인 생성

한국어

# 플러그인 생성

슬래시 명령어, 에이전트, 훅, Skill, MCP 서버로 Claude Code를 확장하는 맞춤 플러그인을 생성합니다.

## 플러그인 vs 독립 설정 사용 시기

- 단일 프로젝트에 Claude Code를 사용자 정의하는 경우
- 설정이 개인적이고 공유할 필요가 없는 경우
- 패키징 전에 슬래시 명령어나 훅을 실험하는 경우
- `/hello` 또는 `/review`와 같은 짧은 슬래시 명령어 이름을 원하는 경우
- 팀이나 커뮤니티와 기능을 공유하려는 경우
- 여러 프로젝트에서 동일한 슬래시 명령어/에이전트가 필요한 경우
- 확장에 대한 버전 관리와 쉬운 업데이트를 원하는 경우
- 마켓플레이스를 통해 배포하는 경우
- `/my-plugin:hello`와 같은 네임스페이스가 지정된 슬래시 명령어를 사용해도 괜찮은 경우 (네임스페이스는 플러그인 간 충돌을 방지합니다)

> 빠른 반복을 위해 `.claude/`의 독립 설정으로 시작한 다음, 공유할 준비가 되면 [플러그인으로 변환](#convert-existing-configurations-to-plugins)하세요.

## 빠른 시작

### 사전 요구 사항

- Claude Code [설치 및 인증 완료](/docs/en/quickstart#step-1-install-claude-code)
- Claude Code 버전 1.0.33 이상 (`claude --version`으로 확인)

> `/plugin` 명령이 보이지 않으면 Claude Code를 최신 버전으로 업데이트하세요. 업그레이드 지침은 [문제 해결](/docs/en/troubleshooting)을 참조하세요.

### 첫 번째 플러그인 생성

플러그인 디렉토리 생성

```
mkdir my-first-plugin
```

플러그인 매니페스트 생성

```
mkdir my-first-plugin/.claude-plugin
```

```
{
"name": "my-first-plugin",
"description": "A greeting plugin to learn the basics",
"version": "1.0.0",
"author": {
"name": "Your Name"
}
}
```

슬래시 명령어 추가

```
mkdir my-first-plugin/commands
```

```
---
description: Greet the user with a friendly message
---

# Hello Command

Greet the user warmly and ask how you can help them today.
```

플러그인 테스트

```
claude --plugin-dir ./my-first-plugin
```

```
/my-first-plugin:hello
```

> **왜 네임스페이스인가요?** 플러그인 슬래시 명령어는 항상 네임스페이스가 지정됩니다 (`/greet:hello`처럼). 이는 여러 플러그인이 동일한 이름의 명령어를 가질 때 충돌을 방지합니다. 네임스페이스 접두사를 변경하려면 `plugin.json`의 `name` 필드를 업데이트하세요.

슬래시 명령어 인수 추가

```
---
description: Greet the user with a personalized message
---

# Hello Command

Greet the user named "$ARGUMENTS" warmly and ask how you can help them today. Make the greeting personal and encouraging.
```

```
/my-first-plugin:hello Alex
```

- **플러그인 매니페스트** (`.claude-plugin/plugin.json`): 플러그인의 메타데이터 설명
- **Commands 디렉토리** (`commands/`): 맞춤 슬래시 명령어 포함
- **명령어 인수** (`$ARGUMENTS`): 동적 동작을 위한 사용자 입력 캡처

> `--plugin-dir` 플래그는 개발 및 테스트에 유용합니다. 다른 사람과 플러그인을 공유할 준비가 되면 [플러그인 마켓플레이스 생성 및 배포](/docs/en/plugin-marketplaces)를 참조하세요.

## 플러그인 구조 개요

> **흔한 실수**: `commands/`, `agents/`, `skills/`, 또는 `hooks/`를 `.claude-plugin/` 디렉토리 안에 넣지 마세요. `.claude-plugin/` 안에는 `plugin.json`만 들어갑니다. 다른 모든 디렉토리는 플러그인 루트 레벨에 있어야 합니다.

> **다음 단계**: 더 많은 기능을 추가할 준비가 되셨나요? [더 복잡한 플러그인 개발](#develop-more-complex-plugins)로 이동하여 에이전트, 훅, MCP 서버, LSP 서버를 추가하세요. 모든 플러그인 구성 요소의 완전한 기술 사양은 [플러그인 참조](/docs/en/plugins-reference)를 참조하세요.

## 더 복잡한 플러그인 개발

### 플러그인에 Skill 추가

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── code-review/
        └── SKILL.md
```

```
---
name: code-review
description: Reviews code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
---

When reviewing code, check for:
1. Code organization and structure
2. Error handling
3. Security concerns
4. Test coverage
```

### 플러그인에 LSP 서버 추가

> TypeScript, Python, Rust와 같은 일반적인 언어의 경우 공식 마켓플레이스에서 미리 빌드된 LSP 플러그인을 설치하세요. 아직 다루지 않는 언어에 대한 지원이 필요한 경우에만 맞춤 LSP 플러그인을 생성하세요.

```
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

### 복잡한 플러그인 구성

### 로컬에서 플러그인 테스트

```
claude --plugin-dir ./my-plugin
```

- `/command-name`으로 명령어 시도
- `/agents`에 에이전트가 나타나는지 확인
- 훅이 예상대로 작동하는지 확인

> 플래그를 여러 번 지정하여 여러 플러그인을 한 번에 로드할 수 있습니다: claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two

```
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

### 플러그인 문제 디버깅

- **구조 확인**: 디렉토리가 `.claude-plugin/` 안이 아닌 플러그인 루트에 있는지 확인
- **개별 구성 요소 테스트**: 각 명령어, 에이전트, 훅을 개별적으로 확인
- **유효성 검사 및 디버깅 도구 사용**: CLI 명령어와 문제 해결 기술은 [디버깅 및 개발 도구](/docs/en/plugins-reference#debugging-and-development-tools) 참조

### 플러그인 공유

- **문서 추가**: 설치 및 사용 지침이 포함된 `README.md` 포함
- **플러그인 버전 관리**: `plugin.json`에서 [시맨틱 버전 관리](/docs/en/plugins-reference#version-management) 사용
- **마켓플레이스 생성 또는 사용**: 설치를 위해 [플러그인 마켓플레이스](/docs/en/plugin-marketplaces)를 통해 배포
- **다른 사람과 테스트**: 더 넓은 배포 전에 팀원에게 플러그인 테스트 요청

> 완전한 기술 사양, 디버깅 기술, 배포 전략은 [플러그인 참조](/docs/en/plugins-reference)를 참조하세요.

## 기존 설정을 플러그인으로 변환

### 마이그레이션 단계

플러그인 구조 생성

```
mkdir -p my-plugin/.claude-plugin
```

```
{
  "name": "my-plugin",
  "description": "Migrated from standalone configuration",
  "version": "1.0.0"
}
```

기존 파일 복사

```
# 명령어 복사
cp -r .claude/commands my-plugin/

# 에이전트 복사 (있는 경우)
cp -r .claude/agents my-plugin/

# skill 복사 (있는 경우)
cp -r .claude/skills my-plugin/
```

훅 마이그레이션

```
mkdir my-plugin/hooks
```

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "npm run lint:fix $FILE" }]
      }
    ]
  }
}
```

마이그레이션된 플러그인 테스트

### 마이그레이션 시 변경 사항

> 마이그레이션 후 중복을 피하기 위해 `.claude/`에서 원본 파일을 제거할 수 있습니다. 로드될 때 플러그인 버전이 우선합니다.

## 다음 단계

### 플러그인 사용자를 위해

- [플러그인 탐색 및 설치](/docs/en/discover-plugins): 마켓플레이스 탐색 및 플러그인 설치
- [팀 마켓플레이스 구성](/docs/en/discover-plugins#configure-team-marketplaces): 팀을 위한 저장소 수준 플러그인 설정

### 플러그인 개발자를 위해

- [마켓플레이스 생성 및 배포](/docs/en/plugin-marketplaces): 플러그인 패키징 및 공유
- [플러그인 참조](/docs/en/plugins-reference): 완전한 기술 사양
- 특정 플러그인 구성 요소에 대해 더 깊이 알아보기:

[슬래시 명령어](/docs/en/slash-commands): 명령어 개발 세부 정보
[Subagent](/docs/en/sub-agents): 에이전트 설정 및 기능
[Agent Skill](/docs/en/skills): Claude의 기능 확장
[훅](/docs/en/hooks): 이벤트 처리 및 자동화
[MCP](/docs/en/mcp): 외부 도구 통합
- [슬래시 명령어](/docs/en/slash-commands): 명령어 개발 세부 정보
- [Subagent](/docs/en/sub-agents): 에이전트 설정 및 기능
- [Agent Skill](/docs/en/skills): Claude의 기능 확장
- [훅](/docs/en/hooks): 이벤트 처리 및 자동화
- [MCP](/docs/en/mcp): 외부 도구 통합

이 페이지가 도움이 되었나요?
