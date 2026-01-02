# MCP를 통해 Claude Code를 도구에 연결하기

한국어

# MCP를 통해 Claude Code를 도구에 연결하기

Model Context Protocol을 사용하여 Claude Code를 도구에 연결하는 방법을 알아봅니다.

## MCP로 할 수 있는 것

- **이슈 트래커에서 기능 구현**: "JIRA 이슈 ENG-4521에 설명된 기능을 추가하고 GitHub에 PR을 생성해줘."
- **모니터링 데이터 분석**: "Sentry와 Statsig을 확인해서 ENG-4521에 설명된 기능의 사용량을 확인해줘."
- **데이터베이스 쿼리**: "PostgreSQL 데이터베이스에서 ENG-4521 기능을 사용한 무작위 10명의 사용자 이메일을 찾아줘."
- **디자인 통합**: "Slack에 게시된 새 Figma 디자인을 기반으로 표준 이메일 템플릿을 업데이트해줘."
- **워크플로우 자동화**: "이 10명의 사용자를 새 기능에 대한 피드백 세션에 초대하는 Gmail 초안을 작성해줘."

## 인기 있는 MCP 서버

> 타사 MCP 서버는 본인의 책임 하에 사용하세요 - Anthropic은 이러한 서버들의
> 정확성이나 보안을 모두 검증하지 않았습니다.
> 설치하려는 MCP 서버를 신뢰할 수 있는지 확인하세요.
> 특히 신뢰할 수 없는 콘텐츠를 가져올 수 있는 MCP 서버를 사용할 때는
> 프롬프트 인젝션 위험에 노출될 수 있으므로 주의하세요.

> **특정 통합이 필요하신가요?** [GitHub에서 수백 개의 MCP 서버를 찾아보거나](https://github.com/modelcontextprotocol/servers), [MCP SDK](https://modelcontextprotocol.io/quickstart/server)를 사용하여 직접 만들 수 있습니다.

## MCP 서버 설치하기

### 옵션 1: 원격 HTTP 서버 추가

```
# Basic syntax
claude mcp add --transport http <name> <url>

# Real example: Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Example with Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### 옵션 2: 원격 SSE 서버 추가

> SSE (Server-Sent Events) 전송 방식은 더 이상 사용되지 않습니다. 가능한 경우 HTTP 서버를 대신 사용하세요.

```
# Basic syntax
claude mcp add --transport sse <name> <url>

# Real example: Connect to Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# Example with authentication header
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### 옵션 3: 로컬 stdio 서버 추가

```
# Basic syntax
claude mcp add --transport stdio <name> <command> [args...]

# Real example: Add Airtable server
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

> **"--" 파라미터 이해하기:**
> `--` (더블 대시)는 Claude의 CLI 플래그와 MCP 서버에 전달되는 명령어 및 인수를 구분합니다. `--` 앞의 모든 것은 Claude의 옵션(`--env`, `--scope` 등)이고, `--` 뒤의 모든 것은 MCP 서버를 실행하는 실제 명령어입니다. 예를 들어:
> `claude mcp add --transport stdio myserver -- npx server` -> `npx server`를 실행합니다
> `claude mcp add --transport stdio myserver --env KEY=value -- python server.py --port 8080` -> `KEY=value`를 환경 변수로 하여 `python server.py --port 8080`을 실행합니다
> 이렇게 하면 Claude의 플래그와 서버의 플래그 간의 충돌을 방지할 수 있습니다.

- `claude mcp add --transport stdio myserver -- npx server` -> `npx server`를 실행합니다
- `claude mcp add --transport stdio myserver --env KEY=value -- python server.py --port 8080` -> `KEY=value`를 환경 변수로 하여 `python server.py --port 8080`을 실행합니다

### 서버 관리하기

```
# List all configured servers
claude mcp list

# Get details for a specific server
claude mcp get github

# Remove a server
claude mcp remove github

# (within Claude Code) Check server status
/mcp
```

> 팁:
> `--scope` 플래그를 사용하여 설정이 저장되는 위치를 지정할 수 있습니다:
>
> `local` (기본값): 현재 프로젝트에서 본인만 사용 가능 (이전 버전에서는 `project`라고 불렸음)
> `project`: `.mcp.json` 파일을 통해 프로젝트의 모든 사람과 공유
> `user`: 모든 프로젝트에서 본인만 사용 가능 (이전 버전에서는 `global`이라고 불렸음)
>
>
> `--env` 플래그로 환경 변수 설정 (예: `--env KEY=value`)
> MCP_TIMEOUT 환경 변수를 사용하여 MCP 서버 시작 타임아웃 구성 (예: `MCP_TIMEOUT=10000 claude`는 10초 타임아웃 설정)
> MCP 도구 출력이 10,000 토큰을 초과하면 Claude Code가 경고를 표시합니다. 이 제한을 늘리려면 `MAX_MCP_OUTPUT_TOKENS` 환경 변수를 설정하세요 (예: `MAX_MCP_OUTPUT_TOKENS=50000`)
> OAuth 2.0 인증이 필요한 원격 서버 인증에는 `/mcp`를 사용하세요

- `--scope` 플래그를 사용하여 설정이 저장되는 위치를 지정할 수 있습니다:

`local` (기본값): 현재 프로젝트에서 본인만 사용 가능 (이전 버전에서는 `project`라고 불렸음)
`project`: `.mcp.json` 파일을 통해 프로젝트의 모든 사람과 공유
`user`: 모든 프로젝트에서 본인만 사용 가능 (이전 버전에서는 `global`이라고 불렸음)
- `local` (기본값): 현재 프로젝트에서 본인만 사용 가능 (이전 버전에서는 `project`라고 불렸음)
- `project`: `.mcp.json` 파일을 통해 프로젝트의 모든 사람과 공유
- `user`: 모든 프로젝트에서 본인만 사용 가능 (이전 버전에서는 `global`이라고 불렸음)
- `--env` 플래그로 환경 변수 설정 (예: `--env KEY=value`)
- MCP_TIMEOUT 환경 변수를 사용하여 MCP 서버 시작 타임아웃 구성 (예: `MCP_TIMEOUT=10000 claude`는 10초 타임아웃 설정)
- MCP 도구 출력이 10,000 토큰을 초과하면 Claude Code가 경고를 표시합니다. 이 제한을 늘리려면 `MAX_MCP_OUTPUT_TOKENS` 환경 변수를 설정하세요 (예: `MAX_MCP_OUTPUT_TOKENS=50000`)
- OAuth 2.0 인증이 필요한 원격 서버 인증에는 `/mcp`를 사용하세요

> **Windows 사용자**: 네이티브 Windows(WSL 아님)에서 `npx`를 사용하는 로컬 MCP 서버는 적절한 실행을 위해 `cmd /c` 래퍼가 필요합니다.
> `cmd /c` 래퍼 없이는 Windows가 `npx`를 직접 실행할 수 없어 "Connection closed" 오류가 발생합니다. (위의 `--` 파라미터 설명을 참조하세요.)

```
# This creates command="cmd" which Windows can execute
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

### 플러그인에서 제공하는 MCP 서버

- 플러그인은 플러그인 루트의 `.mcp.json` 또는 `plugin.json` 내에 MCP 서버를 인라인으로 정의합니다
- 플러그인이 활성화되면 해당 MCP 서버가 자동으로 시작됩니다
- 플러그인 MCP 도구는 수동으로 구성된 MCP 도구와 함께 나타납니다
- 플러그인 서버는 플러그인 설치를 통해 관리됩니다 (`/mcp` 명령어가 아님)

```
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

```
{
  "name": "my-plugin",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

- **자동 수명 주기**: 플러그인이 활성화되면 서버가 시작되지만, MCP 서버 변경사항(활성화 또는 비활성화)을 적용하려면 Claude Code를 다시 시작해야 합니다
- **환경 변수**: 플러그인 상대 경로에는 `${CLAUDE_PLUGIN_ROOT}`를 사용합니다
- **사용자 환경 접근**: 수동으로 구성된 서버와 동일한 환경 변수에 접근 가능
- **여러 전송 유형**: stdio, SSE, HTTP 전송 지원 (서버에 따라 전송 지원이 다를 수 있음)

```
# Within Claude Code, see all MCP servers including plugin ones
/mcp
```

- **번들 배포**: 도구와 서버가 함께 패키징됨
- **자동 설정**: 수동 MCP 구성이 필요 없음
- **팀 일관성**: 플러그인 설치 시 모든 사람이 동일한 도구를 얻음

## MCP 설치 범위

### 로컬 범위

```
# Add a local-scoped server (default)
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicitly specify local scope
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### 프로젝트 범위

```
# Add a project-scoped server
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

```
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

### 사용자 범위

```
# Add a user server
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### 올바른 범위 선택하기

- **로컬 범위**: 개인 서버, 실험적 구성, 또는 특정 프로젝트에만 해당하는 민감한 자격 증명
- **프로젝트 범위**: 팀이 공유하는 서버, 프로젝트별 도구, 또는 협업에 필요한 서비스
- **사용자 범위**: 여러 프로젝트에서 필요한 개인 유틸리티, 개발 도구, 또는 자주 사용하는 서비스

> **MCP 서버는 어디에 저장되나요?**
> **사용자 및 로컬 범위**: `~/.claude.json` (`mcpServers` 필드 또는 프로젝트 경로 아래)
> **프로젝트 범위**: 프로젝트 루트의 `.mcp.json` (소스 컨트롤에 체크인됨)
> **엔터프라이즈 관리**: 시스템 디렉토리의 `managed-mcp.json` ([엔터프라이즈 MCP 구성](#enterprise-mcp-configuration) 참조)

- **사용자 및 로컬 범위**: `~/.claude.json` (`mcpServers` 필드 또는 프로젝트 경로 아래)
- **프로젝트 범위**: 프로젝트 루트의 `.mcp.json` (소스 컨트롤에 체크인됨)
- **엔터프라이즈 관리**: 시스템 디렉토리의 `managed-mcp.json` ([엔터프라이즈 MCP 구성](#enterprise-mcp-configuration) 참조)

### 범위 계층 구조 및 우선순위

### .mcp.json에서 환경 변수 확장

- `${VAR}` - 환경 변수 `VAR`의 값으로 확장
- `${VAR:-default}` - `VAR`가 설정되어 있으면 해당 값으로, 그렇지 않으면 `default` 사용
- `command` - 서버 실행 파일 경로
- `args` - 명령줄 인수
- `env` - 서버에 전달되는 환경 변수
- `url` - HTTP 서버 유형용
- `headers` - HTTP 서버 인증용

```
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

## 실용적인 예제

### 예제: Sentry로 오류 모니터링

```
# 1. Add the Sentry MCP server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. Use /mcp to authenticate with your Sentry account
> /mcp

# 3. Debug production issues
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
> "Which deployment introduced these new errors?"
```

### 예제: 코드 리뷰를 위해 GitHub에 연결

```
# 1. Add the GitHub MCP server
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. In Claude Code, authenticate if needed
> /mcp
# Select "Authenticate" for GitHub

# 3. Now you can ask Claude to work with GitHub
> "Review PR #456 and suggest improvements"
> "Create a new issue for the bug we just found"
> "Show me all open PRs assigned to me"
```

### 예제: PostgreSQL 데이터베이스 쿼리

```
# 1. Add the database server with your connection string
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"

# 2. Query your database naturally
> "What's our total revenue this month?"
> "Show me the schema for the orders table"
> "Find customers who haven't made a purchase in 90 days"
```

## 원격 MCP 서버 인증

인증이 필요한 서버 추가

```
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

Claude Code 내에서 /mcp 명령어 사용

```
> /mcp
```

> 팁:
> 인증 토큰은 안전하게 저장되고 자동으로 갱신됩니다
> `/mcp` 메뉴에서 "Clear authentication"을 사용하여 접근을 취소할 수 있습니다
> 브라우저가 자동으로 열리지 않으면 제공된 URL을 복사하세요
> OAuth 인증은 HTTP 서버에서 작동합니다

- 인증 토큰은 안전하게 저장되고 자동으로 갱신됩니다
- `/mcp` 메뉴에서 "Clear authentication"을 사용하여 접근을 취소할 수 있습니다
- 브라우저가 자동으로 열리지 않으면 제공된 URL을 복사하세요
- OAuth 인증은 HTTP 서버에서 작동합니다

## JSON 구성에서 MCP 서버 추가

JSON으로 MCP 서버 추가

```
# Basic syntax
claude mcp add-json <name> '<json>'

# Example: Adding an HTTP server with JSON configuration
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

# Example: Adding a stdio server with JSON configuration
claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
```

서버가 추가되었는지 확인

```
claude mcp get weather-api
```

> 팁:
> 쉘에서 JSON이 올바르게 이스케이프되었는지 확인하세요
> JSON은 MCP 서버 구성 스키마를 준수해야 합니다
> 프로젝트별 구성 대신 사용자 구성에 서버를 추가하려면 `--scope user`를 사용할 수 있습니다

- 쉘에서 JSON이 올바르게 이스케이프되었는지 확인하세요
- JSON은 MCP 서버 구성 스키마를 준수해야 합니다
- 프로젝트별 구성 대신 사용자 구성에 서버를 추가하려면 `--scope user`를 사용할 수 있습니다

## Claude Desktop에서 MCP 서버 가져오기

Claude Desktop에서 서버 가져오기

```
# Basic syntax
claude mcp add-from-claude-desktop
```

가져올 서버 선택

서버가 가져와졌는지 확인

```
claude mcp list
```

> 팁:
> 이 기능은 macOS와 Windows Subsystem for Linux (WSL)에서만 작동합니다
> 해당 플랫폼의 표준 위치에서 Claude Desktop 구성 파일을 읽습니다
> 사용자 구성에 서버를 추가하려면 `--scope user` 플래그를 사용하세요
> 가져온 서버는 Claude Desktop에서와 동일한 이름을 갖게 됩니다
> 동일한 이름의 서버가 이미 존재하면 숫자 접미사가 붙습니다 (예: `server_1`)

- 이 기능은 macOS와 Windows Subsystem for Linux (WSL)에서만 작동합니다
- 해당 플랫폼의 표준 위치에서 Claude Desktop 구성 파일을 읽습니다
- 사용자 구성에 서버를 추가하려면 `--scope user` 플래그를 사용하세요
- 가져온 서버는 Claude Desktop에서와 동일한 이름을 갖게 됩니다
- 동일한 이름의 서버가 이미 존재하면 숫자 접미사가 붙습니다 (예: `server_1`)

## Claude Code를 MCP 서버로 사용하기

```
# Start Claude as a stdio MCP server
claude mcp serve
```

```
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

> **실행 파일 경로 구성**: `command` 필드는 Claude Code 실행 파일을 참조해야 합니다. `claude` 명령어가 시스템의 PATH에 없으면 실행 파일의 전체 경로를 지정해야 합니다.
> 전체 경로를 찾으려면:
> ```
> which claude
> ```
> 그런 다음 구성에서 전체 경로를 사용하세요:
> 올바른 실행 파일 경로가 없으면 `spawn claude ENOENT`와 같은 오류가 발생합니다.

```
which claude
```

```
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "/full/path/to/claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

> 팁:
> 서버는 View, Edit, LS 등 Claude의 도구에 대한 접근을 제공합니다.
> Claude Desktop에서 Claude에게 디렉토리의 파일을 읽거나 편집하도록 요청해 보세요.
> 이 MCP 서버는 Claude Code의 도구만 MCP 클라이언트에 노출하므로, 개별 도구 호출에 대한 사용자 확인을 구현하는 것은 클라이언트의 책임입니다.

- 서버는 View, Edit, LS 등 Claude의 도구에 대한 접근을 제공합니다.
- Claude Desktop에서 Claude에게 디렉토리의 파일을 읽거나 편집하도록 요청해 보세요.
- 이 MCP 서버는 Claude Code의 도구만 MCP 클라이언트에 노출하므로, 개별 도구 호출에 대한 사용자 확인을 구현하는 것은 클라이언트의 책임입니다.

## MCP 출력 제한 및 경고

- **출력 경고 임계값**: MCP 도구 출력이 10,000 토큰을 초과하면 Claude Code가 경고를 표시합니다
- **구성 가능한 제한**: `MAX_MCP_OUTPUT_TOKENS` 환경 변수를 사용하여 최대 허용 MCP 출력 토큰을 조정할 수 있습니다
- **기본 제한**: 기본 최대값은 25,000 토큰입니다

```
# Set a higher limit for MCP tool outputs
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

- 대규모 데이터셋이나 데이터베이스 쿼리
- 상세한 보고서나 문서 생성
- 광범위한 로그 파일이나 디버깅 정보 처리

> 특정 MCP 서버에서 출력 경고가 자주 발생하는 경우 제한을 늘리거나 서버가 응답을 페이지네이션하거나 필터링하도록 구성하는 것을 고려하세요.

## MCP 리소스 사용

### MCP 리소스 참조

사용 가능한 리소스 나열

특정 리소스 참조

```
> Can you analyze @github:issue://123 and suggest a fix?
```

```
> Please review the API documentation at @docs:file://api/authentication
```

여러 리소스 참조

```
> Compare @postgres:schema://users with @docs:file://database/user-model
```

> 팁:
> 리소스는 참조될 때 자동으로 가져와져 첨부 파일로 포함됩니다
> 리소스 경로는 @ 멘션 자동 완성에서 퍼지 검색이 가능합니다
> 서버가 지원하는 경우 Claude Code가 MCP 리소스를 나열하고 읽는 도구를 자동으로 제공합니다
> 리소스는 MCP 서버가 제공하는 모든 유형의 콘텐츠(텍스트, JSON, 구조화된 데이터 등)를 포함할 수 있습니다

- 리소스는 참조될 때 자동으로 가져와져 첨부 파일로 포함됩니다
- 리소스 경로는 @ 멘션 자동 완성에서 퍼지 검색이 가능합니다
- 서버가 지원하는 경우 Claude Code가 MCP 리소스를 나열하고 읽는 도구를 자동으로 제공합니다
- 리소스는 MCP 서버가 제공하는 모든 유형의 콘텐츠(텍스트, JSON, 구조화된 데이터 등)를 포함할 수 있습니다

## MCP 프롬프트를 슬래시 명령어로 사용

### MCP 프롬프트 실행

사용 가능한 프롬프트 확인

인수 없이 프롬프트 실행

```
> /mcp__github__list_prs
```

인수와 함께 프롬프트 실행

```
> /mcp__github__pr_review 456
```

```
> /mcp__jira__create_issue "Bug in login flow" high
```

> 팁:
> MCP 프롬프트는 연결된 서버에서 동적으로 검색됩니다
> 인수는 프롬프트에 정의된 파라미터를 기반으로 파싱됩니다
> 프롬프트 결과는 대화에 직접 주입됩니다
> 서버와 프롬프트 이름은 정규화됩니다 (공백은 밑줄로 변경)

- MCP 프롬프트는 연결된 서버에서 동적으로 검색됩니다
- 인수는 프롬프트에 정의된 파라미터를 기반으로 파싱됩니다
- 프롬프트 결과는 대화에 직접 주입됩니다
- 서버와 프롬프트 이름은 정규화됩니다 (공백은 밑줄로 변경)

## 엔터프라이즈 MCP 구성

- `managed-mcp.json`으로 독점적 제어: 사용자가 수정하거나 확장할 수 없는 고정된 MCP 서버 세트를 배포합니다
- **허용/거부 목록으로 정책 기반 제어**: 사용자가 자신의 서버를 추가할 수 있지만 허용되는 서버를 제한합니다
- **직원이 접근할 수 있는 MCP 서버 제어**: 조직 전체에 승인된 MCP 서버의 표준화된 세트를 배포합니다
- **승인되지 않은 MCP 서버 방지**: 사용자가 승인되지 않은 MCP 서버를 추가하는 것을 제한합니다
- **MCP 완전 비활성화**: 필요한 경우 MCP 기능을 완전히 제거합니다

### 옵션 1: managed-mcp.json으로 독점적 제어

- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux 및 WSL: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

> 이것들은 관리자 권한이 필요한 시스템 전체 경로입니다 (`~/Library/...`와 같은 사용자 홈 디렉토리가 아님). IT 관리자가 배포하도록 설계되었습니다.

```
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

### 옵션 2: 허용 목록과 거부 목록으로 정책 기반 제어

> **옵션 선택**: 사용자 커스터마이징 없이 고정된 서버 세트를 배포하려면 옵션 1(`managed-mcp.json`)을 사용하세요. 정책 제약 내에서 사용자가 자신의 서버를 추가할 수 있도록 하려면 옵션 2(허용/거부 목록)를 사용하세요.

#### 제한 옵션

- **서버 이름별** (`serverName`): 구성된 서버 이름과 일치
- **명령어별** (`serverCommand`): stdio 서버를 시작하는 데 사용되는 정확한 명령어와 인수와 일치
- **URL 패턴별** (`serverUrl`): 와일드카드를 지원하는 원격 서버 URL과 일치

#### 구성 예제

```
{
  "allowedMcpServers": [
    // Allow by server name
    { "serverName": "github" },
    { "serverName": "sentry" },

    // Allow by exact command (for stdio servers)
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] },
    { "serverCommand": ["python", "/usr/local/bin/approved-server.py"] },

    // Allow by URL pattern (for remote servers)
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverUrl": "https://*.internal.corp/*" }
  ],
  "deniedMcpServers": [
    // Block by server name
    { "serverName": "dangerous-server" },

    // Block by exact command (for stdio servers)
    { "serverCommand": ["npx", "-y", "unapproved-package"] },

    // Block by URL pattern (for remote servers)
    { "serverUrl": "https://*.untrusted.com/*" }
  ]
}
```

#### 명령어 기반 제한 작동 방식

- 명령어 배열은 **정확히** 일치해야 합니다 - 명령어와 올바른 순서의 모든 인수
- 예: `["npx", "-y", "server"]`는 `["npx", "server"]` 또는 `["npx", "-y", "server", "--flag"]`와 일치하지 않습니다
- 허용 목록에 **어떤** `serverCommand` 항목이 있으면 stdio 서버는 해당 명령어 중 하나와 **반드시** 일치해야 합니다
- 명령어 제한이 있으면 stdio 서버는 이름만으로 통과할 수 없습니다
- 이를 통해 관리자가 실행 허용되는 명령어를 강제할 수 있습니다
- 원격 서버(HTTP, SSE, WebSocket)는 허용 목록에 `serverUrl` 항목이 있으면 URL 기반 매칭을 사용합니다
- URL 항목이 없으면 원격 서버는 이름 기반 매칭으로 대체됩니다
- 명령어 제한은 원격 서버에 적용되지 않습니다

#### URL 기반 제한 작동 방식

- `https://mcp.company.com/*` - 특정 도메인의 모든 경로 허용
- `https://*.example.com/*` - example.com의 모든 서브도메인 허용
- `http://localhost:*/*` - localhost의 모든 포트 허용
- 허용 목록에 **어떤** `serverUrl` 항목이 있으면 원격 서버는 해당 URL 패턴 중 하나와 **반드시** 일치해야 합니다
- URL 제한이 있으면 원격 서버는 이름만으로 통과할 수 없습니다
- 이를 통해 관리자가 허용되는 원격 엔드포인트를 강제할 수 있습니다

예제: URL만 있는 허용 목록

```
{
  "allowedMcpServers": [
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverUrl": "https://*.internal.corp/*" }
  ]
}
```

- `https://mcp.company.com/api`의 HTTP 서버: ✅ 허용 (URL 패턴과 일치)
- `https://api.internal.corp/mcp`의 HTTP 서버: ✅ 허용 (와일드카드 서브도메인과 일치)
- `https://external.com/mcp`의 HTTP 서버: ❌ 차단 (어떤 URL 패턴과도 일치하지 않음)
- 모든 명령어의 Stdio 서버: ❌ 차단 (일치할 이름이나 명령어 항목 없음)

예제: 명령어만 있는 허용 목록

```
{
  "allowedMcpServers": [
    { "serverCommand": ["npx", "-y", "approved-package"] }
  ]
}
```

- `["npx", "-y", "approved-package"]`의 Stdio 서버: ✅ 허용 (명령어와 일치)
- `["node", "server.js"]`의 Stdio 서버: ❌ 차단 (명령어와 일치하지 않음)
- "my-api"라는 HTTP 서버: ❌ 차단 (일치할 이름 항목 없음)

예제: 이름과 명령어가 혼합된 허용 목록

```
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverCommand": ["npx", "-y", "approved-package"] }
  ]
}
```

- `["npx", "-y", "approved-package"]`를 사용하는 "local-tool" Stdio 서버: ✅ 허용 (명령어와 일치)
- `["node", "server.js"]`를 사용하는 "local-tool" Stdio 서버: ❌ 차단 (명령어 항목이 있지만 일치하지 않음)
- `["node", "server.js"]`를 사용하는 "github" Stdio 서버: ❌ 차단 (명령어 항목이 있으면 stdio 서버는 명령어와 일치해야 함)
- "github"라는 HTTP 서버: ✅ 허용 (이름과 일치)
- "other-api"라는 HTTP 서버: ❌ 차단 (이름이 일치하지 않음)

예제: 이름만 있는 허용 목록

```
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "internal-tool" }
  ]
}
```

- 모든 명령어를 사용하는 "github" Stdio 서버: ✅ 허용 (명령어 제한 없음)
- 모든 명령어를 사용하는 "internal-tool" Stdio 서버: ✅ 허용 (명령어 제한 없음)
- "other"라는 모든 서버: ❌ 차단 (이름이 일치하지 않음)

#### 허용 목록 동작 (allowedMcpServers)

- `undefined` (기본값): 제한 없음 - 사용자가 모든 MCP 서버를 구성할 수 있음
- 빈 배열 `[]`: 완전 잠금 - 사용자가 MCP 서버를 구성할 수 없음
- 항목 목록: 사용자는 이름, 명령어 또는 URL 패턴으로 일치하는 서버만 구성할 수 있음

#### 거부 목록 동작 (deniedMcpServers)

- `undefined` (기본값): 차단되는 서버 없음
- 빈 배열 `[]`: 차단되는 서버 없음
- 항목 목록: 지정된 서버가 모든 범위에서 명시적으로 차단됨

#### 중요 참고사항

- **옵션 1과 옵션 2를 결합할 수 있습니다**: `managed-mcp.json`이 존재하면 독점적 제어를 가지며 사용자는 서버를 추가할 수 없습니다. 허용/거부 목록은 여전히 엔터프라이즈 서버 자체에 적용됩니다.
- **거부 목록이 절대적 우선권을 가집니다**: 서버가 거부 목록 항목(이름, 명령어 또는 URL)과 일치하면 허용 목록에 있더라도 차단됩니다
- 이름 기반, 명령어 기반, URL 기반 제한이 함께 작동합니다: 서버가 이름 항목, 명령어 항목 또는 URL 패턴 **중 하나와** 일치하면 통과합니다 (거부 목록에 의해 차단되지 않는 한)

> `managed-mcp.json` 사용 시: 사용자는 `claude mcp add`나 구성 파일을 통해 MCP 서버를 추가할 수 없습니다. `allowedMcpServers`와 `deniedMcpServers` 설정은 여전히 실제로 로드되는 엔터프라이즈 서버를 필터링하는 데 적용됩니다.

이 페이지가 도움이 되었나요?
