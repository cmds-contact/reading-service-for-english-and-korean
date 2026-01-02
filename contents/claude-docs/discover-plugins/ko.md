# 마켓플레이스를 통해 미리 빌드된 플러그인 탐색 및 설치

한국어

# 마켓플레이스를 통해 미리 빌드된 플러그인 탐색 및 설치

마켓플레이스에서 플러그인을 찾아 설치하여 새로운 명령어, 에이전트, 기능으로 Claude Code를 확장하세요.

## 마켓플레이스 작동 방식

마켓플레이스 추가

개별 플러그인 설치

## 공식 Anthropic 마켓플레이스

```
/plugin install plugin-name@claude-plugins-official
```

> 공식 마켓플레이스는 Anthropic에서 유지 관리합니다. 자체 플러그인을 배포하려면 [자체 마켓플레이스를 생성](/docs/en/plugin-marketplaces)하고 사용자와 공유하세요.

### 코드 인텔리전스

> 플러그인 설치 후 `/plugin` Errors 탭에서 `Executable not found in $PATH`가 표시되면 위 표에서 필요한 바이너리를 설치하세요.

### 외부 통합

- **소스 제어**: `github`, `gitlab`
- **프로젝트 관리**: `atlassian` (Jira/Confluence), `asana`, `linear`, `notion`
- **디자인**: `figma`
- **인프라**: `vercel`, `firebase`, `supabase`
- **커뮤니케이션**: `slack`
- **모니터링**: `sentry`

### 개발 워크플로우

- **commit-commands**: 커밋, 푸시, PR 생성을 포함한 Git 커밋 워크플로우
- **pr-review-toolkit**: 풀 리퀘스트 검토를 위한 전문 에이전트
- **agent-sdk-dev**: Claude Agent SDK로 빌드하기 위한 도구
- **plugin-dev**: 자체 플러그인 생성을 위한 툴킷

### 출력 스타일

- **explanatory-output-style**: 구현 선택에 대한 교육적 인사이트
- **learning-output-style**: 기술 향상을 위한 대화형 학습 모드

## 사용해 보기: 데모 마켓플레이스 추가

```
/plugin marketplace add anthropics/claude-code
```

사용 가능한 플러그인 탐색

- **Discover**: 모든 마켓플레이스에서 사용 가능한 플러그인 탐색
- **Installed**: 설치된 플러그인 보기 및 관리
- **Marketplaces**: 추가한 마켓플레이스 추가, 제거, 업데이트
- **Errors**: 플러그인 로딩 오류 보기

플러그인 설치

- **User scope**: 모든 프로젝트에서 자신을 위해 설치
- **Project scope**: 이 저장소의 모든 협력자를 위해 설치
- **Local scope**: 이 저장소에서 자신만을 위해 설치

```
/plugin install commit-commands@anthropics-claude-code
```

새 플러그인 사용

```
/commit-commands:commit
```

## 마켓플레이스 추가

> **단축키**: `/plugin marketplace` 대신 `/plugin market`을 사용할 수 있고, `remove` 대신 `rm`을 사용할 수 있습니다.

- **GitHub 저장소**: `owner/repo` 형식 (예: `anthropics/claude-code`)
- **Git URL**: 모든 git 저장소 URL (GitLab, Bitbucket, 셀프 호스팅)
- **로컬 경로**: 디렉토리 또는 `marketplace.json` 파일의 직접 경로
- **원격 URL**: 호스팅된 `marketplace.json` 파일의 직접 URL

### GitHub에서 추가

### 다른 Git 호스트에서 추가

```
/plugin marketplace add https://gitlab.com/company/plugins.git
```

```
/plugin marketplace add git@gitlab.com:company/plugins.git
```

```
/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0
```

### 로컬 경로에서 추가

```
/plugin marketplace add ./my-marketplace
```

```
/plugin marketplace add ./path/to/marketplace.json
```

```
/plugin marketplace add https://example.com/marketplace.json
```

## 플러그인 설치

```
/plugin install plugin-name@marketplace-name
```

- **User scope** (기본값): 모든 프로젝트에서 자신을 위해 설치
- **Project scope**: 이 저장소의 모든 협력자를 위해 설치 (`.claude/settings.json`에 추가)
- **Local scope**: 이 저장소에서 자신만을 위해 설치 (협력자와 공유되지 않음)

> 플러그인을 설치하기 전에 신뢰할 수 있는지 확인하세요. Anthropic은 플러그인에 포함된 MCP 서버, 파일 또는 기타 소프트웨어를 제어하지 않으며 의도한 대로 작동하는지 확인할 수 없습니다. 자세한 내용은 각 플러그인의 홈페이지를 확인하세요.

## 설치된 플러그인 관리

```
/plugin disable plugin-name@marketplace-name
```

```
/plugin enable plugin-name@marketplace-name
```

```
/plugin uninstall plugin-name@marketplace-name
```

```
claude plugin install formatter@your-org --scope project
claude plugin uninstall formatter@your-org --scope project
```

## 마켓플레이스 관리

### 대화형 인터페이스 사용

- 소스 및 상태와 함께 추가한 모든 마켓플레이스 보기
- 새 마켓플레이스 추가
- 최신 플러그인을 가져오기 위해 마켓플레이스 목록 업데이트
- 더 이상 필요하지 않은 마켓플레이스 제거

### CLI 명령어 사용

```
/plugin marketplace list
```

```
/plugin marketplace update marketplace-name
```

```
/plugin marketplace remove marketplace-name
```

> 마켓플레이스를 제거하면 해당 마켓플레이스에서 설치한 플러그인도 모두 제거됩니다.

### 자동 업데이트 구성

- `/plugin`을 실행하여 플러그인 관리자 열기
- **Marketplaces** 선택
- 목록에서 마켓플레이스 선택
- **Enable auto-update** 또는 **Disable auto-update** 선택

## 팀 마켓플레이스 구성

## 문제 해결

### /plugin 명령이 인식되지 않음

- **버전 확인**: `claude --version` 실행. 플러그인에는 버전 1.0.33 이상이 필요합니다.
- **Claude Code 업데이트**:

**Homebrew**: `brew upgrade claude-code`
**npm**: `npm update -g @anthropic-ai/claude-code`
**네이티브 설치 프로그램**: [설정](/docs/en/setup)에서 설치 명령 다시 실행
- **Homebrew**: `brew upgrade claude-code`
- **npm**: `npm update -g @anthropic-ai/claude-code`
- **네이티브 설치 프로그램**: [설정](/docs/en/setup)에서 설치 명령 다시 실행
- **Claude Code 재시작**: 업데이트 후 터미널을 재시작하고 `claude`를 다시 실행하세요.

### 일반적인 문제

- **마켓플레이스가 로드되지 않음**: URL에 액세스할 수 있고 해당 경로에 `.claude-plugin/marketplace.json`이 있는지 확인
- **플러그인 설치 실패**: 플러그인 소스 URL에 액세스할 수 있고 저장소가 공개되어 있거나 액세스 권한이 있는지 확인
- **설치 후 파일을 찾을 수 없음**: 플러그인은 캐시에 복사되므로 플러그인 디렉토리 외부의 파일을 참조하는 경로는 작동하지 않습니다
- **플러그인 Skill이 나타나지 않음**: `rm -rf ~/.claude/plugins/cache`로 캐시를 지우고, Claude Code를 재시작한 다음 플러그인을 다시 설치하세요. 자세한 내용은 [플러그인 Skill이 나타나지 않음](/docs/en/skills#plugin-skills-not-appearing-after-installation) 참조.

## 다음 단계

- **자체 플러그인 빌드**: 맞춤 명령어, 에이전트, 훅을 생성하려면 [플러그인](/docs/en/plugins) 참조
- **마켓플레이스 생성**: 팀이나 커뮤니티에 플러그인을 배포하려면 [플러그인 마켓플레이스 생성](/docs/en/plugin-marketplaces) 참조
- **기술 참조**: 완전한 사양은 [플러그인 참조](/docs/en/plugins-reference) 참조

이 페이지가 도움이 되었나요?
