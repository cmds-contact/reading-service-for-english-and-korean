# Claude Code 설정

한국어

# Claude Code 설정

전역 및 프로젝트 수준 설정과 환경 변수로 Claude Code를 구성하세요.

## 구성 범위

### 사용 가능한 범위

### 각 범위 사용 시점

- 조직 전체에 적용해야 하는 보안 정책
- 재정의할 수 없는 규정 준수 요구사항
- IT/DevOps가 배포하는 표준화된 구성
- 모든 곳에서 원하는 개인 기본 설정 (테마, 편집기 설정)
- 모든 프로젝트에서 사용하는 도구 및 플러그인
- API 키 및 인증 (안전하게 저장됨)
- 팀 공유 설정 (권한, 훅, MCP 서버)
- 팀 전체가 가져야 할 플러그인
- 협업자 간 도구 표준화
- 특정 프로젝트에 대한 개인 재정의
- 팀과 공유하기 전 구성 테스트
- 다른 사람에게는 작동하지 않는 머신별 설정

### 범위 상호작용 방식

- **Enterprise** (최고) - 다른 어떤 것으로도 재정의할 수 없음
- **명령줄 인수** - 임시 세션 재정의
- **Local** - 프로젝트 및 사용자 설정 재정의
- **Project** - 사용자 설정 재정의
- **User** (최저) - 다른 것이 설정을 지정하지 않을 때 적용

### 범위를 사용하는 것

## 설정 파일

- **사용자 설정**은 `~/.claude/settings.json`에 정의되며 모든 프로젝트에 적용됩니다.
- **프로젝트 설정**은 프로젝트 디렉토리에 저장됩니다:

`.claude/settings.json` - 소스 제어에 체크인되고 팀과 공유되는 설정
`.claude/settings.local.json` - 체크인되지 않는 설정, 개인 기본 설정 및 실험에 유용합니다. Claude Code는 생성 시 git에서 `.claude/settings.local.json`을 무시하도록 구성합니다.
- `.claude/settings.json` - 소스 제어에 체크인되고 팀과 공유되는 설정
- `.claude/settings.local.json` - 체크인되지 않는 설정, 개인 기본 설정 및 실험에 유용합니다. Claude Code는 생성 시 git에서 `.claude/settings.local.json`을 무시하도록 구성합니다.
- **관리 설정** (Enterprise): 엔터프라이즈 관리자는 [Claude.ai 관리 콘솔](https://claude.ai/admin-settings/claude-code)을 통해 조직에 Claude Code 설정을 구성하고 배포할 수 있습니다. 이러한 설정은 사용자가 인증할 때 자동으로 가져오며, 사용자 및 프로젝트 설정보다 우선하고, 로컬에서 재정의할 수 없습니다. 이 기능은 Claude for Enterprise 고객에게 제공됩니다. 관리 콘솔에서 이 옵션이 보이지 않으면 Anthropic 계정 팀에 연락하여 기능을 활성화하세요.
파일 기반 정책 배포를 선호하는 조직의 경우 Claude Code는 시스템 디렉토리에 배포할 수 있는 `managed-settings.json` 및 `managed-mcp.json` 파일도 지원합니다:

macOS: `/Library/Application Support/ClaudeCode/`
Linux 및 WSL: `/etc/claude-code/`
Windows: `C:\Program Files\ClaudeCode\`

이것은 관리자 권한이 필요한 시스템 전체 경로입니다(`~/Library/...`와 같은 사용자 홈 디렉토리가 아님). IT 관리자가 배포하도록 설계되었습니다.
자세한 내용은 [엔터프라이즈 관리 설정](/docs/en/iam#enterprise-managed-settings) 및 [엔터프라이즈 MCP 구성](/docs/en/mcp#enterprise-mcp-configuration)을 참조하세요.
엔터프라이즈 배포는 `strictKnownMarketplaces`를 사용하여 **플러그인 마켓플레이스 추가**를 제한할 수도 있습니다. 자세한 내용은 [엔터프라이즈 마켓플레이스 제한](/docs/en/plugin-marketplaces#enterprise-marketplace-restrictions)을 참조하세요.
- macOS: `/Library/Application Support/ClaudeCode/`
- Linux 및 WSL: `/etc/claude-code/`
- Windows: `C:\Program Files\ClaudeCode\`

> 이것은 관리자 권한이 필요한 시스템 전체 경로입니다(`~/Library/...`와 같은 사용자 홈 디렉토리가 아님). IT 관리자가 배포하도록 설계되었습니다.

> 엔터프라이즈 배포는 `strictKnownMarketplaces`를 사용하여 **플러그인 마켓플레이스 추가**를 제한할 수도 있습니다. 자세한 내용은 [엔터프라이즈 마켓플레이스 제한](/docs/en/plugin-marketplaces#enterprise-marketplace-restrictions)을 참조하세요.

- **기타 구성**은 `~/.claude.json`에 저장됩니다. 이 파일에는 기본 설정(테마, 알림 설정, 편집기 모드), OAuth 세션, 사용자 및 로컬 범위의 [MCP 서버](/docs/en/mcp) 구성, 프로젝트별 상태(허용된 도구, 신뢰 설정) 및 다양한 캐시가 포함됩니다. 프로젝트 범위의 MCP 서버는 `.mcp.json`에 별도로 저장됩니다.

```
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  },
  "companyAnnouncements": [
    "Welcome to Acme Corp! Review our code guidelines at docs.acme.com",
    "Reminder: Code reviews required for all PRs",
    "New security policy in effect"
  ]
}
```

### 사용 가능한 설정

### 권한 설정

### 샌드박스 설정

```
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"],
    "network": {
      "allowUnixSockets": [
        "/var/run/docker.sock"
      ],
      "allowLocalBinding": true
    }
  },
  "permissions": {
    "deny": [
      "Read(.envrc)",
      "Read(~/.aws/**)"
    ]
  }
}
```

- `Read` 거부 규칙을 사용하여 Claude가 특정 파일이나 디렉토리를 읽지 못하도록 차단
- `Edit` 허용 규칙을 사용하여 Claude가 현재 작업 디렉토리 외의 디렉토리에 쓸 수 있도록 허용
- `Edit` 거부 규칙을 사용하여 특정 경로에 대한 쓰기 차단
- `WebFetch` 허용/거부 규칙을 사용하여 Claude가 접근할 수 있는 네트워크 도메인 제어

### 귀속 설정

- 커밋은 기본적으로 [git trailers](https://git-scm.com/docs/git-interpret-trailers)(예: `Co-Authored-By`)를 사용하며, 사용자 정의하거나 비활성화할 수 있습니다
- 풀 리퀘스트 설명은 일반 텍스트입니다

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

```
{
  "attribution": {
    "commit": "Generated with AI\n\nCo-Authored-By: AI <ai@example.com>",
    "pr": ""
  }
}
```

> `attribution` 설정은 더 이상 사용되지 않는 `includeCoAuthoredBy` 설정보다 우선합니다. 모든 귀속을 숨기려면 `commit`과 `pr`을 빈 문자열로 설정하세요.

### 파일 제안 설정

```
{
  "fileSuggestion": {
    "type": "command",
    "command": "~/.claude/file-suggestion.sh"
  }
}
```

```
{"query": "src/comp"}
```

```
src/components/Button.tsx
src/components/Modal.tsx
src/components/Form.tsx
```

```
#!/bin/bash
query=$(cat | jq -r '.query')
your-repo-file-index --query "$query" | head -20
```

### 훅 구성

- 관리 훅과 SDK 훅이 로드됩니다
- 사용자 훅, 프로젝트 훅 및 플러그인 훅이 차단됩니다

```
{
  "allowManagedHooksOnly": true
}
```

### 설정 우선순위

- **관리 설정** (Enterprise)

[Claude.ai 관리 콘솔](https://claude.ai/admin-settings/claude-code)을 통해 구성된 원격 설정
사용자가 인증할 때 자동으로 가져옴
재정의할 수 없음
- [Claude.ai 관리 콘솔](https://claude.ai/admin-settings/claude-code)을 통해 구성된 원격 설정
- 사용자가 인증할 때 자동으로 가져옴
- 재정의할 수 없음
- **파일 기반 관리 설정** (`managed-settings.json`)

IT/DevOps가 시스템 디렉토리에 배포한 정책
사용자 또는 프로젝트 설정으로 재정의할 수 없음
원격 관리 설정이 구성된 경우 무시됨
- IT/DevOps가 시스템 디렉토리에 배포한 정책
- 사용자 또는 프로젝트 설정으로 재정의할 수 없음
- 원격 관리 설정이 구성된 경우 무시됨
- **명령줄 인수**

특정 세션에 대한 임시 재정의
- 특정 세션에 대한 임시 재정의
- **로컬 프로젝트 설정** (`.claude/settings.local.json`)

개인 프로젝트별 설정
- 개인 프로젝트별 설정
- **공유 프로젝트 설정** (`.claude/settings.json`)

소스 제어의 팀 공유 프로젝트 설정
- 소스 제어의 팀 공유 프로젝트 설정
- **사용자 설정** (`~/.claude/settings.json`)

개인 전역 설정
- 개인 전역 설정

### 구성 시스템의 핵심 사항

- 메모리 파일 (`CLAUDE.md`): Claude가 시작 시 로드하는 지침 및 컨텍스트 포함
- **설정 파일 (JSON)**: 권한, 환경 변수 및 도구 동작 구성
- **슬래시 명령**: `/command-name`으로 세션 중에 호출할 수 있는 사용자 정의 명령
- **MCP 서버**: 추가 도구 및 통합으로 Claude Code 확장
- **우선순위**: 상위 수준 구성(Enterprise)이 하위 수준 구성(User/Project)을 재정의
- **상속**: 설정이 병합되며 더 구체적인 설정이 더 넓은 설정에 추가되거나 재정의함

### 시스템 프롬프트

### 민감한 파일 제외

```
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./build)"
    ]
  }
}
```

## 서브에이전트 구성

- **사용자 서브에이전트**: `~/.claude/agents/` - 모든 프로젝트에서 사용 가능
- **프로젝트 서브에이전트**: `.claude/agents/` - 프로젝트에 특정하며 팀과 공유 가능

## 플러그인 구성

### 플러그인 설정

```
{
  "enabledPlugins": {
    "formatter@acme-tools": true,
    "deployer@acme-tools": true,
    "analyzer@security-plugins": false
  },
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": "github",
      "repo": "acme-corp/claude-plugins"
    }
  }
}
```

#### enabledPlugins

- **사용자 설정** (`~/.claude/settings.json`): 개인 플러그인 기본 설정
- **프로젝트 설정** (`.claude/settings.json`): 팀과 공유되는 프로젝트별 플러그인
- **로컬 설정** (`.claude/settings.local.json`): 머신별 재정의 (커밋되지 않음)

```
{
  "enabledPlugins": {
    "code-formatter@team-tools": true,
    "deployment-tools@team-tools": true,
    "experimental-features@personal": false
  }
}
```

#### extraKnownMarketplaces

- 팀원은 폴더를 신뢰할 때 마켓플레이스를 설치하라는 메시지가 표시됩니다
- 팀원은 해당 마켓플레이스에서 플러그인을 설치하라는 메시지가 표시됩니다
- 사용자는 원치 않는 마켓플레이스 또는 플러그인을 건너뛸 수 있습니다 (사용자 설정에 저장됨)
- 설치는 신뢰 경계를 존중하며 명시적 동의가 필요합니다

```
{
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": {
        "source": "github",
        "repo": "acme-corp/claude-plugins"
      }
    },
    "security-plugins": {
      "source": {
        "source": "git",
        "url": "https://git.example.com/security/plugins.git"
      }
    }
  }
}
```

- `github`: GitHub 저장소 (`repo` 사용)
- `git`: 모든 git URL (`url` 사용)
- `directory`: 로컬 파일 시스템 경로 (`path` 사용, 개발 전용)

#### strictKnownMarketplaces

- **macOS**: `/Library/Application Support/ClaudeCode/managed-settings.json`
- **Linux 및 WSL**: `/etc/claude-code/managed-settings.json`
- **Windows**: `C:\ProgramData\ClaudeCode\managed-settings.json`
- 엔터프라이즈 관리 설정(`managed-settings.json`)에서만 사용 가능
- 사용자 또는 프로젝트 설정으로 재정의할 수 없음 (최고 우선순위)
- 네트워크/파일 시스템 작업 전에 적용됨 (차단된 소스는 실행되지 않음)
- 소스 사양에 대해 정확한 일치 사용 (git 소스의 경우 `ref`, `path` 포함)
- `undefined` (기본값): 제한 없음 - 사용자가 모든 마켓플레이스 추가 가능
- 빈 배열 `[]`: 완전 잠금 - 사용자가 새 마켓플레이스를 추가할 수 없음
- 소스 목록: 사용자는 정확히 일치하는 마켓플레이스만 추가 가능
- **GitHub 저장소**:

```
{ "source": "github", "repo": "acme-corp/approved-plugins" }
{ "source": "github", "repo": "acme-corp/security-tools", "ref": "v2.0" }
{ "source": "github", "repo": "acme-corp/plugins", "ref": "main", "path": "marketplace" }
```

- **Git 저장소**:

```
{ "source": "git", "url": "https://gitlab.example.com/tools/plugins.git" }
{ "source": "git", "url": "https://bitbucket.org/acme-corp/plugins.git", "ref": "production" }
{ "source": "git", "url": "ssh://git@git.example.com/plugins.git", "ref": "v3.1", "path": "approved" }
```

- **URL 기반 마켓플레이스**:

```
{ "source": "url", "url": "https://plugins.example.com/marketplace.json" }
{ "source": "url", "url": "https://cdn.example.com/marketplace.json", "headers": { "Authorization": "Bearer ${TOKEN}" } }
```

- **NPM 패키지**:

```
{ "source": "npm", "package": "@acme-corp/claude-plugins" }
{ "source": "npm", "package": "@acme-corp/approved-marketplace" }
```

- **파일 경로**:

```
{ "source": "file", "path": "/usr/local/share/claude/acme-marketplace.json" }
{ "source": "file", "path": "/opt/acme-corp/plugins/marketplace.json" }
```

- **디렉토리 경로**:

```
{ "source": "directory", "path": "/usr/local/share/claude/acme-plugins" }
{ "source": "directory", "path": "/opt/acme-corp/approved-marketplaces" }
```

```
{
  "strictKnownMarketplaces": [
    {
      "source": "github",
      "repo": "acme-corp/approved-plugins"
    },
    {
      "source": "github",
      "repo": "acme-corp/security-tools",
      "ref": "v2.0"
    },
    {
      "source": "url",
      "url": "https://plugins.example.com/marketplace.json"
    },
    {
      "source": "npm",
      "package": "@acme-corp/compliance-plugins"
    }
  ]
}
```

```
{
  "strictKnownMarketplaces": []
}
```

- `repo` 또는 `url`이 정확히 일치해야 함
- `ref` 필드가 정확히 일치해야 함 (또는 둘 다 undefined)
- `path` 필드가 정확히 일치해야 함 (또는 둘 다 undefined)

```
// 이것은 서로 다른 소스입니다:
{ "source": "github", "repo": "acme-corp/plugins" }
{ "source": "github", "repo": "acme-corp/plugins", "ref": "main" }

// 이것도 서로 다릅니다:
{ "source": "github", "repo": "acme-corp/plugins", "path": "marketplace" }
{ "source": "github", "repo": "acme-corp/plugins" }
```

```
{
  "strictKnownMarketplaces": [
    { "source": "github", "repo": "acme-corp/plugins" }
  ]
}
```

```
{
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": { "source": "github", "repo": "acme-corp/plugins" }
    }
  }
}
```

- 제한은 네트워크 요청이나 파일 시스템 작업 전에 확인됩니다
- 차단된 경우 사용자에게 엔터프라이즈 정책에 의해 소스가 차단되었음을 나타내는 명확한 오류 메시지가 표시됩니다
- 제한은 새 마켓플레이스 추가에만 적용됩니다. 이전에 설치된 마켓플레이스는 계속 접근 가능합니다
- 엔터프라이즈 관리 설정은 최고 우선순위를 가지며 재정의할 수 없습니다

### 플러그인 관리

- 마켓플레이스에서 사용 가능한 플러그인 찾아보기
- 플러그인 설치/제거
- 플러그인 활성화/비활성화
- 플러그인 세부정보 보기 (제공되는 명령, 에이전트, 훅)
- 마켓플레이스 추가/제거

## 환경 변수

> 모든 환경 변수는 `settings.json`에서도 구성할 수 있습니다. 이것은 각 세션에 대해 자동으로 환경 변수를 설정하거나 전체 팀 또는 조직에 환경 변수 세트를 배포하는 방법으로 유용합니다.

## Claude가 사용할 수 있는 도구

### Bash 도구 동작

- **작업 디렉토리 유지**: Claude가 작업 디렉토리를 변경하면(예: `cd /path/to/dir`) 이후 Bash 명령은 해당 디렉토리에서 실행됩니다. `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1`을 사용하여 각 명령 후 프로젝트 디렉토리로 재설정할 수 있습니다.
- **환경 변수는 유지되지 않음**: 하나의 Bash 명령에서 설정한 환경 변수(예: `export MY_VAR=value`)는 이후 Bash 명령에서 사용할 수 **없습니다**. 각 Bash 명령은 새로운 셸 환경에서 실행됩니다.

```
conda activate myenv
# 또는: source /path/to/venv/bin/activate
claude
```

```
export CLAUDE_ENV_FILE=/path/to/env-setup.sh
claude
```

```
conda activate myenv
# 또는: source /path/to/venv/bin/activate
# 또는: export MY_VAR=value
```

```
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup",
      "hooks": [{
        "type": "command",
        "command": "echo 'conda activate myenv' >> \"$CLAUDE_ENV_FILE\""
      }]
    }]
  }
}
```

### 훅으로 도구 확장

## 참고

- [ID 및 접근 관리](/docs/en/iam#configuring-permissions) - Claude Code의 권한 시스템에 대해 알아보기
- [IAM 및 접근 제어](/docs/en/iam#enterprise-managed-settings) - 엔터프라이즈 정책 관리
- [문제 해결](/docs/en/troubleshooting#auto-updater-issues) - 일반적인 구성 문제에 대한 해결책

이 페이지가 도움이 되었나요?
