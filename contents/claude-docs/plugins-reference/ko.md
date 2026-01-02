# 플러그인 참조

한국어

# 플러그인 참조

스키마, CLI 명령어, 컴포넌트 사양을 포함한 Claude Code 플러그인 시스템의 완전한 기술 참조입니다.

> 플러그인을 설치하려면 [플러그인 검색 및 설치](/docs/en/discover-plugins)를 참조하세요. 플러그인 생성은 [플러그인](/docs/en/plugins)을 참조하세요. 플러그인 배포는 [플러그인 마켓플레이스](/docs/en/plugin-marketplaces)를 참조하세요.

## 플러그인 컴포넌트 참조

### 명령어

### 에이전트

```
---
description: What this agent specializes in
capabilities: ["task1", "task2", "task3"]
---

# Agent Name

Detailed description of the agent's role, expertise, and when Claude should invoke it.

## Capabilities
- Specific task the agent excels at
- Another specialized capability
- When to use this agent vs others

## Context and examples
Provide examples of when this agent should be used and what kinds of problems it solves.
```

- 에이전트는 `/agents` 인터페이스에 나타남
- Claude는 작업 컨텍스트에 따라 자동으로 에이전트를 호출할 수 있음
- 에이전트는 사용자가 수동으로 호출할 수 있음
- 플러그인 에이전트는 내장 Claude 에이전트와 함께 작동함

### Skills

```
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (optional)
│   └── scripts/ (optional)
└── code-reviewer/
    └── SKILL.md
```

- 플러그인 Skills는 플러그인이 설치되면 자동으로 검색됨
- Claude는 일치하는 작업 컨텍스트에 따라 자율적으로 Skills를 호출함
- Skills에는 SKILL.md와 함께 지원 파일을 포함할 수 있음
- [Claude Code에서 Skills 사용](/docs/en/skills)
- [에이전트 Skills 개요](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview#skill-structure)

### Hooks

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

- `PreToolUse`: Claude가 도구를 사용하기 전
- `PostToolUse`: Claude가 도구를 성공적으로 사용한 후
- `PostToolUseFailure`: Claude 도구 실행이 실패한 후
- `PermissionRequest`: 권한 대화 상자가 표시될 때
- `UserPromptSubmit`: 사용자가 프롬프트를 제출할 때
- `Notification`: Claude Code가 알림을 보낼 때
- `Stop`: Claude가 중지를 시도할 때
- `SubagentStart`: 하위 에이전트가 시작될 때
- `SubagentStop`: 하위 에이전트가 중지를 시도할 때
- `SessionStart`: 세션 시작 시
- `SessionEnd`: 세션 종료 시
- `PreCompact`: 대화 기록이 압축되기 전
- `command`: 셸 명령어 또는 스크립트 실행
- `prompt`: LLM으로 프롬프트 평가 (컨텍스트용 `$ARGUMENTS` 플레이스홀더 사용)
- `agent`: 복잡한 검증 작업을 위해 도구가 있는 에이전트 검증기 실행

### MCP 서버

```
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    },
    "plugin-api-client": {
      "command": "npx",
      "args": ["@company/mcp-server", "--plugin-mode"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}"
    }
  }
}
```

- 플러그인 MCP 서버는 플러그인이 활성화되면 자동으로 시작됨
- 서버는 Claude의 도구킷에서 표준 MCP 도구로 나타남
- 서버 기능은 Claude의 기존 도구와 원활하게 통합됨
- 플러그인 서버는 사용자 MCP 서버와 독립적으로 구성 가능

### LSP 서버

> LSP 플러그인을 사용하려면 공식 마켓플레이스에서 설치하세요. `/plugin` 검색 탭에서 "lsp"를 검색하세요. 이 섹션은 공식 마켓플레이스에서 다루지 않는 언어용 LSP 플러그인을 만드는 방법을 문서화합니다.

- **즉각적인 진단**: Claude는 각 편집 후 즉시 오류와 경고를 확인
- **코드 탐색**: 정의로 이동, 참조 찾기, 호버 정보
- **언어 인식**: 코드 심볼에 대한 타입 정보 및 문서

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

```
{
  "name": "my-plugin",
  "lspServers": {
    "go": {
      "command": "gopls",
      "args": ["serve"],
      "extensionToLanguage": {
        ".go": "go"
      }
    }
  }
}
```

```
"loggingConfig": {
  "args": ["--log-level", "4"],
  "env": {
    "TSS_LOG": "-level verbose -file ${CLAUDE_PLUGIN_LSP_LOG_FILE}"
  }
}
```

> **언어 서버 바이너리를 별도로 설치해야 합니다.** LSP 플러그인은 Claude Code가 언어 서버에 연결하는 방법을 구성하지만, 서버 자체는 포함하지 않습니다. `/plugin` 오류 탭에 `Executable not found in $PATH`가 표시되면 해당 언어에 필요한 바이너리를 설치하세요.

## 플러그인 설치 범위

## 플러그인 매니페스트 스키마

### 완전한 스키마

```
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "Brief plugin description",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json"
}
```

### 필수 필드

### 메타데이터 필드

### 컴포넌트 경로 필드

### 경로 동작 규칙

- `commands/`가 존재하면 사용자 정의 명령어 경로와 함께 로드됨
- 모든 경로는 플러그인 루트에 상대적이며 `./`로 시작해야 함
- 사용자 정의 경로의 명령어는 동일한 명명 및 네임스페이싱 규칙을 사용함
- 유연성을 위해 여러 경로를 배열로 지정 가능

```
{
  "commands": [
    "./specialized/deploy.md",
    "./utilities/batch-process.md"
  ],
  "agents": [
    "./custom-agents/reviewer.md",
    "./custom-agents/tester.md"
  ]
}
```

### 환경 변수

```
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/process.sh"
          }
        ]
      }
    ]
  }
}
```

## 플러그인 캐싱 및 파일 해석

### 플러그인 캐싱 작동 방식

- **상대 경로가 있는 마켓플레이스 플러그인의 경우**: `source` 필드에 지정된 경로가 재귀적으로 복사됩니다. 예를 들어, 마켓플레이스 항목이 `"source": "./plugins/my-plugin"`을 지정하면 전체 `./plugins` 디렉토리가 복사됩니다.
- `.claude-plugin/plugin.json`이 있는 플러그인의 경우: 암시적 루트 디렉토리(`.claude-plugin/plugin.json`을 포함하는 디렉토리)가 재귀적으로 복사됩니다.

### 경로 순회 제한

### 외부 종속성 작업

```
# 플러그인 디렉토리 내부
ln -s /path/to/shared-utils ./shared-utils
```

```
{
  "name": "my-plugin",
  "source": "./",
  "description": "Plugin that needs root-level access",
  "commands": ["./plugins/my-plugin/commands/"],
  "agents": ["./plugins/my-plugin/agents/"],
  "strict": false
}
```

> 플러그인의 논리적 루트 외부 위치를 가리키는 심볼릭 링크는 복사 중에 따라갑니다. 이는 캐싱 시스템의 보안 이점을 유지하면서 유연성을 제공합니다.

## 플러그인 디렉토리 구조

### 표준 플러그인 레이아웃

```
enterprise-plugin/
├── .claude-plugin/           # 메타데이터 디렉토리
│   └── plugin.json          # 필수: 플러그인 매니페스트
├── commands/                 # 기본 명령어 위치
│   ├── status.md
│   └── logs.md
├── agents/                   # 기본 에이전트 위치
│   ├── security-reviewer.md
│   ├── performance-tester.md
│   └── compliance-checker.md
├── skills/                   # 에이전트 Skills
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── pdf-processor/
│       ├── SKILL.md
│       └── scripts/
├── hooks/                    # Hook 구성
│   ├── hooks.json           # 메인 hook 구성
│   └── security-hooks.json  # 추가 hooks
├── .mcp.json                # MCP 서버 정의
├── .lsp.json                # LSP 서버 구성
├── scripts/                 # Hook 및 유틸리티 스크립트
│   ├── security-scan.sh
│   ├── format-code.py
│   └── deploy.js
├── LICENSE                  # 라이선스 파일
└── CHANGELOG.md             # 버전 기록
```

> `.claude-plugin/` 디렉토리에는 `plugin.json` 파일이 포함됩니다. 다른 모든 디렉토리(commands/, agents/, skills/, hooks/)는 `.claude-plugin/` 내부가 아닌 플러그인 루트에 있어야 합니다.

### 파일 위치 참조

## CLI 명령어 참조

### plugin install

```
claude plugin install <plugin> [options]
```

- `<plugin>`: 플러그인 이름 또는 특정 마켓플레이스의 경우 `plugin-name@marketplace-name`

```
# 사용자 범위에 설치 (기본값)
claude plugin install formatter@my-marketplace

# 프로젝트 범위에 설치 (팀과 공유)
claude plugin install formatter@my-marketplace --scope project

# 로컬 범위에 설치 (gitignore됨)
claude plugin install formatter@my-marketplace --scope local
```

### plugin uninstall

```
claude plugin uninstall <plugin> [options]
```

- `<plugin>`: 플러그인 이름 또는 `plugin-name@marketplace-name`

### plugin enable

```
claude plugin enable <plugin> [options]
```

### plugin disable

```
claude plugin disable <plugin> [options]
```

### plugin update

```
claude plugin update <plugin> [options]
```

## 디버깅 및 개발 도구

### 디버깅 명령어

```
claude --debug
```

- 어떤 플러그인이 로드되고 있는지
- 플러그인 매니페스트의 오류
- 명령어, 에이전트 및 hook 등록
- MCP 서버 초기화

### 일반적인 문제

### 오류 메시지 예제

- `Invalid JSON syntax: Unexpected token } in JSON at position 142`: 누락된 쉼표, 추가 쉼표 또는 따옴표 없는 문자열 확인
- `Plugin has an invalid manifest file at .claude-plugin/plugin.json. Validation errors: name: Required`: 필수 필드 누락
- `Plugin has a corrupt manifest file at .claude-plugin/plugin.json. JSON parse error: ...`: JSON 구문 오류
- `Warning: No commands found in plugin my-plugin custom directory: ./cmds. Expected .md files or SKILL.md in subdirectories.`: 명령어 경로가 존재하지만 유효한 명령어 파일이 없음
- `Plugin directory not found at path: ./plugins/my-plugin. Check that the marketplace entry has the correct path.`: marketplace.json의 `source` 경로가 존재하지 않는 디렉토리를 가리킴
- `Plugin my-plugin has conflicting manifests: both plugin.json and marketplace entry specify components.`: 중복 컴포넌트 정의 제거 또는 마켓플레이스 항목에서 `strict: true` 설정

### Hook 문제 해결

- 스크립트가 실행 가능한지 확인: `chmod +x ./scripts/your-script.sh`
- shebang 줄 확인: 첫 줄이 `#!/bin/bash` 또는 `#!/usr/bin/env bash`여야 함
- 경로가 `${CLAUDE_PLUGIN_ROOT}`를 사용하는지 확인: `"command": "${CLAUDE_PLUGIN_ROOT}/scripts/your-script.sh"`
- 스크립트를 수동으로 테스트: `./scripts/your-script.sh`
- 이벤트 이름이 올바른지 확인 (대소문자 구분): `PostToolUse`, `postToolUse` 아님
- matcher 패턴이 도구와 일치하는지 확인: 파일 작업용 `"matcher": "Write|Edit"`
- hook 유형이 유효한지 확인: `command`, `prompt`, 또는 `agent`

### MCP 서버 문제 해결

- 명령어가 존재하고 실행 가능한지 확인
- 모든 경로가 `${CLAUDE_PLUGIN_ROOT}` 변수를 사용하는지 확인
- MCP 서버 로그 확인: `claude --debug`가 초기화 오류를 표시함
- Claude Code 외부에서 서버를 수동으로 테스트
- 서버가 `.mcp.json` 또는 `plugin.json`에 올바르게 구성되었는지 확인
- 서버가 MCP 프로토콜을 올바르게 구현하는지 확인
- 디버그 출력에서 연결 타임아웃 확인

### 디렉토리 구조 실수

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json      <- 매니페스트만 여기에
├── commands/            <- 루트 레벨에
├── agents/              <- 루트 레벨에
└── hooks/               <- 루트 레벨에
```

- `claude --debug`를 실행하고 "loading plugin" 메시지를 찾으세요
- 각 컴포넌트 디렉토리가 디버그 출력에 나열되어 있는지 확인
- 플러그인 파일 읽기를 허용하는 파일 권한 확인

## 배포 및 버전 관리 참조

### 버전 관리

```
{
  "name": "my-plugin",
  "version": "2.1.0"
}
```

- **MAJOR**: 호환되지 않는 변경 사항 (호환되지 않는 API 변경)
- **MINOR**: 새 기능 (이전 버전과 호환되는 추가)
- **PATCH**: 버그 수정 (이전 버전과 호환되는 수정)
- 첫 번째 안정 릴리스의 경우 `1.0.0`에서 시작
- 변경 사항을 배포하기 전에 `plugin.json`에서 버전 업데이트
- `CHANGELOG.md` 파일에 변경 사항 문서화
- 테스트용으로 `2.0.0-beta.1`과 같은 프리릴리스 버전 사용

## 관련 문서

- [플러그인](/docs/en/plugins) - 튜토리얼 및 실용적인 사용법
- [플러그인 마켓플레이스](/docs/en/plugin-marketplaces) - 마켓플레이스 생성 및 관리
- [슬래시 명령어](/docs/en/slash-commands) - 명령어 개발 세부 정보
- [하위 에이전트](/docs/en/sub-agents) - 에이전트 구성 및 기능
- [에이전트 Skills](/docs/en/skills) - Claude의 기능 확장
- [Hooks](/docs/en/hooks) - 이벤트 처리 및 자동화
- [MCP](/docs/en/mcp) - 외부 도구 통합
- [설정](/docs/en/settings) - 플러그인 구성 옵션

이 페이지가 도움이 되었나요?
