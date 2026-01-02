# 플러그인 마켓플레이스 생성 및 배포

한국어

# 플러그인 마켓플레이스 생성 및 배포

팀과 커뮤니티 전반에 Claude Code 확장을 배포하기 위한 플러그인 마켓플레이스를 구축하고 호스팅하세요.

## 개요

- **플러그인 생성**: 명령어, 에이전트, 훅, MCP 서버 또는 LSP 서버가 포함된 하나 이상의 플러그인을 빌드합니다. 이 가이드는 이미 배포할 플러그인이 있다고 가정합니다; 플러그인 생성 방법에 대한 자세한 내용은 [플러그인 생성](/docs/en/plugins)을 참조하세요.
- **마켓플레이스 파일 생성**: 플러그인과 그 위치를 나열하는 `marketplace.json`을 정의합니다 ([마켓플레이스 파일 생성](#마켓플레이스-파일-생성) 참조).
- **마켓플레이스 호스팅**: GitHub, GitLab 또는 다른 git 호스트에 푸시합니다 ([마켓플레이스 호스팅 및 배포](#마켓플레이스-호스팅-및-배포) 참조).
- **사용자와 공유**: 사용자는 `/plugin marketplace add`로 마켓플레이스를 추가하고 개별 플러그인을 설치합니다 ([플러그인 검색 및 설치](/docs/en/discover-plugins) 참조).

## 연습: 로컬 마켓플레이스 만들기

디렉토리 구조 생성

```
mkdir -p my-marketplace/.claude-plugin
mkdir -p my-marketplace/plugins/review-plugin/.claude-plugin
mkdir -p my-marketplace/plugins/review-plugin/commands
```

플러그인 명령어 생성

```
Review the code I've selected or the recent changes for:
- Potential bugs or edge cases
- Security concerns
- Performance issues
- Readability improvements

Be concise and actionable.
```

플러그인 매니페스트 생성

```
{
  "name": "review-plugin",
  "description": "Adds a /review command for quick code reviews",
  "version": "1.0.0"
}
```

마켓플레이스 파일 생성

```
{
  "name": "my-plugins",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "review-plugin",
      "source": "./plugins/review-plugin",
      "description": "Adds a /review command for quick code reviews"
    }
  ]
}
```

추가 및 설치

```
/plugin marketplace add ./my-marketplace
/plugin install review-plugin@my-plugins
```

사용해 보기

```
/review
```

> **플러그인 설치 방식**: 사용자가 플러그인을 설치하면 Claude Code는 플러그인 디렉토리를 캐시 위치로 복사합니다. 따라서 플러그인은 `../shared-utils`와 같은 경로를 사용하여 디렉토리 외부의 파일을 참조할 수 없습니다. 해당 파일은 복사되지 않기 때문입니다. 플러그인 간에 파일을 공유해야 하는 경우 심볼릭 링크(복사 중에 따라감)를 사용하거나 공유 디렉토리가 플러그인 소스 경로 내에 있도록 마켓플레이스를 재구성하세요. 자세한 내용은 [플러그인 캐싱 및 파일 해석](/docs/en/plugins-reference#plugin-caching-and-file-resolution)을 참조하세요.

```
{
  "name": "company-tools",
  "owner": {
    "name": "DevTools Team",
    "email": "devtools@example.com"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0",
      "author": {
        "name": "DevTools Team"
      }
    },
    {
      "name": "deployment-tools",
      "source": {
        "source": "github",
        "repo": "company/deploy-plugin"
      },
      "description": "Deployment automation tools"
    }
  ]
}
```

## 마켓플레이스 스키마

### 필수 필드

> **예약된 이름**: 다음 마켓플레이스 이름은 공식 Anthropic 용도로 예약되어 있으며 타사 마켓플레이스에서 사용할 수 없습니다: `claude-code-marketplace`, `claude-code-plugins`, `claude-plugins-official`, `anthropic-marketplace`, `anthropic-plugins`, `agent-skills`, `life-sciences`. 공식 마켓플레이스를 사칭하는 이름(`official-claude-plugins` 또는 `anthropic-tools-v2` 등)도 차단됩니다.

### 소유자 필드

### 선택적 메타데이터

## 플러그인 항목

### 선택적 플러그인 필드

## 플러그인 소스

### 상대 경로

```
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin"
}
```

### GitHub 저장소

```
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo"
  }
}
```

### Git 저장소

```
{
  "name": "git-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git"
  }
}
```

### 고급 플러그인 항목

```
{
  "name": "enterprise-tools",
  "source": {
    "source": "github",
    "repo": "company/enterprise-plugin"
  },
  "description": "Enterprise workflow automation tools",
  "version": "2.1.0",
  "author": {
    "name": "Enterprise Team",
    "email": "enterprise@example.com"
  },
  "homepage": "https://docs.example.com/plugins/enterprise-tools",
  "repository": "https://github.com/company/enterprise-plugin",
  "license": "MIT",
  "keywords": ["enterprise", "workflow", "automation"],
  "category": "productivity",
  "commands": [
    "./commands/core/",
    "./commands/enterprise/",
    "./commands/experimental/preview.md"
  ],
  "agents": ["./agents/security-reviewer.md", "./agents/compliance-checker.md"],
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "enterprise-db": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"]
    }
  },
  "strict": false
}
```

- `commands`와 `agents`: 여러 디렉토리 또는 개별 파일을 지정할 수 있습니다. 경로는 플러그인 루트에 상대적입니다.
- `${CLAUDE_PLUGIN_ROOT}`: 플러그인의 설치 디렉토리 내의 파일을 참조하기 위해 훅 및 MCP 서버 구성에서 이 변수를 사용합니다. 플러그인은 설치 시 캐시 위치로 복사되므로 이것이 필요합니다.
- `strict: false`: 이것이 false로 설정되어 있으므로 플러그인에 자체 `plugin.json`이 필요하지 않습니다. 마켓플레이스 항목이 모든 것을 정의합니다.

## 마켓플레이스 호스팅 및 배포

### GitHub에서 호스팅 (권장)

- **저장소 생성**: 마켓플레이스용 새 저장소 설정
- **마켓플레이스 파일 추가**: 플러그인 정의가 포함된 `.claude-plugin/marketplace.json` 생성
- **팀과 공유**: 사용자가 `/plugin marketplace add owner/repo`로 마켓플레이스 추가

### 다른 git 서비스에서 호스팅

```
/plugin marketplace add https://gitlab.com/company/plugins.git
```

### 배포 전 로컬 테스트

```
/plugin marketplace add ./my-local-marketplace
/plugin install test-plugin@my-local-marketplace
```

### 팀에 마켓플레이스 요구

```
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

```
{
  "enabledPlugins": {
    "code-formatter@company-tools": true,
    "deployment-tools@company-tools": true
  }
}
```

### 엔터프라이즈 마켓플레이스 제한

#### 일반적인 구성

```
{
  "strictKnownMarketplaces": []
}
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
    }
  ]
}
```

#### 제한 작동 방식

- GitHub 소스의 경우: `repo`가 필수이며, 허용 목록에 지정된 경우 `ref` 또는 `path`도 일치해야 합니다
- URL 소스의 경우: 전체 URL이 정확히 일치해야 합니다

## 검증 및 테스트

```
claude plugin validate .
```

```
/plugin validate .
```

```
/plugin marketplace add ./path/to/marketplace
```

```
/plugin install test-plugin@marketplace-name
```

## 문제 해결

### 마켓플레이스가 로드되지 않음

- 마켓플레이스 URL에 접근 가능한지 확인
- 지정된 경로에 `.claude-plugin/marketplace.json`이 있는지 확인
- `claude plugin validate` 또는 `/plugin validate`를 사용하여 JSON 구문이 유효한지 확인
- 비공개 저장소의 경우 접근 권한이 있는지 확인

### 마켓플레이스 검증 오류

- `Marketplace has no plugins defined`: `plugins` 배열에 최소 하나의 플러그인 추가
- `No marketplace description provided`: 사용자가 마켓플레이스를 이해할 수 있도록 `metadata.description` 추가
- `Plugin "x" uses npm source which is not yet fully implemented`: 대신 `github` 또는 로컬 경로 소스 사용

### 플러그인 설치 실패

- 플러그인 소스 URL에 접근 가능한지 확인
- 플러그인 디렉토리에 필요한 파일이 포함되어 있는지 확인
- GitHub 소스의 경우 저장소가 공개되어 있거나 접근 권한이 있는지 확인
- 플러그인 소스를 수동으로 클론/다운로드하여 테스트

### 설치 후 파일을 찾을 수 없음

## 참고

- [사전 빌드된 플러그인 검색 및 설치](/docs/en/discover-plugins) - 기존 마켓플레이스에서 플러그인 설치
- [플러그인](/docs/en/plugins) - 자체 플러그인 생성
- [플러그인 레퍼런스](/docs/en/plugins-reference) - 완전한 기술 사양 및 스키마
- [플러그인 설정](/docs/en/settings#plugin-settings) - 플러그인 구성 옵션
- [strictKnownMarketplaces 레퍼런스](/docs/en/settings#strictknownmarketplaces) - 엔터프라이즈 마켓플레이스 제한

이 페이지가 도움이 되었나요?
