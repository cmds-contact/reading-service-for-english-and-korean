# 데스크톱에서 Claude Code 사용

한국어

# 데스크톱에서 Claude Code 사용

Claude 데스크톱 앱으로 Claude Code 작업을 로컬 또는 안전한 클라우드 인프라에서 실행하세요

## 데스크톱에서의 Claude Code (프리뷰)

## 기능

- `git` worktree로 병렬 로컬 세션: 동일한 저장소에서 여러 Claude Code 세션을 동시에 실행하며, 각각 자체 격리된 `git` worktree를 가집니다
- `.gitignore`에 나열된 파일을 worktree에 포함: `.worktreeinclude`를 사용하여 `.env`와 같이 `.gitignore`에 있는 파일을 새 worktree에 자동으로 복사합니다
- **웹에서 Claude Code 시작**: 데스크톱 앱에서 직접 안전한 클라우드 세션을 시작하세요

## 설치

> 로컬 세션은 Windows arm64 아키텍처에서 사용할 수 없습니다.

## Git worktree 사용

> Git이 초기화되지 않은 폴더에서 로컬 세션을 시작하면 데스크톱 앱이 새 worktree를 생성하지 않습니다.

### .gitignore로 무시된 파일 복사

```
.env
.env.local
.env.*
**/.claude/settings.local.json
```

> `.worktreeinclude`와 `.gitignore`에 모두 매칭되는 파일만 복사됩니다. 이는 추적되는 파일이 실수로 중복되는 것을 방지합니다.

### 웹에서 Claude Code 시작

## 번들된 Claude Code 버전

> Desktop에 번들된 Claude Code 버전은 최신 CLI 버전과 다를 수 있습니다. Desktop은 안정성을 우선시하고 CLI는 더 새로운 기능을 가질 수 있습니다.

## 환경 구성

### 사용자 정의 환경 변수

> 환경 변수는 `.env` 형식으로 키-값 쌍으로 지정해야 합니다. 예를 들어:

```
API_KEY=your_api_key
DEBUG=true

# 여러 줄 값 - 따옴표로 감싸기
CERT="-----BEGIN CERT-----
MIIE...
-----END CERT-----"
```

## 엔터프라이즈 구성

## 관련 리소스

- [웹에서 Claude Code](/docs/en/claude-code-on-the-web)
- [Claude Desktop 지원 문서](https://support.claude.com/en/collections/16163169-claude-desktop)
- [엔터프라이즈 구성](https://support.claude.com/en/articles/12622667-enterprise-configuration)
- [일반적인 워크플로우](/docs/en/common-workflows)
- [설정 레퍼런스](/docs/en/settings)

이 페이지가 도움이 되었나요?
