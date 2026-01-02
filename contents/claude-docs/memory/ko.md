# Claude의 메모리 관리

한국어

# Claude의 메모리 관리

다양한 메모리 위치와 모범 사례를 통해 세션 간 Claude Code의 메모리를 관리하는 방법을 알아보세요.

## 메모리 유형 결정

> CLAUDE.local.md 파일은 자동으로 .gitignore에 추가되어 버전 관리에 체크인하면 안 되는 비공개 프로젝트별 기본 설정에 이상적입니다.

## CLAUDE.md 가져오기

```
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

```
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

```
This code span will not be treated as an import: `@anthropic-ai/claude-code`
```

## Claude가 메모리를 조회하는 방법

## /memory로 메모리 직접 편집

## 프로젝트 메모리 설정

```
> /init
```

> 팁:
> 반복적인 검색을 피하기 위해 자주 사용하는 명령(build, test, lint) 포함
> 코드 스타일 기본 설정 및 명명 규칙 문서화
> 프로젝트에 특정한 중요한 아키텍처 패턴 추가
> CLAUDE.md 메모리는 팀과 공유하는 지침과 개인 기본 설정 모두에 사용할 수 있습니다.

- 반복적인 검색을 피하기 위해 자주 사용하는 명령(build, test, lint) 포함
- 코드 스타일 기본 설정 및 명명 규칙 문서화
- 프로젝트에 특정한 중요한 아키텍처 패턴 추가
- CLAUDE.md 메모리는 팀과 공유하는 지침과 개인 기본 설정 모두에 사용할 수 있습니다.

## .claude/rules/를 사용한 모듈식 규칙

### 기본 구조

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # 메인 프로젝트 지침
│   └── rules/
│       ├── code-style.md   # 코드 스타일 가이드라인
│       ├── testing.md      # 테스트 규칙
│       └── security.md     # 보안 요구사항
```

### 경로별 규칙

```
---
paths: src/api/**/*.ts
---

# API 개발 규칙

- 모든 API 엔드포인트에 입력 검증 포함
- 표준 오류 응답 형식 사용
- OpenAPI 문서 주석 포함
```

### Glob 패턴

```
---
paths: src/**/*.{ts,tsx}
---

# TypeScript/React 규칙
```

```
---
paths: {src,lib}/**/*.ts, tests/**/*.test.ts
---
```

### 하위 디렉토리

```
.claude/rules/
├── frontend/
│   ├── react.md
│   └── styles.md
├── backend/
│   ├── api.md
│   └── database.md
└── general.md
```

### 심볼릭 링크

```
# 공유 규칙 디렉토리 심볼릭 링크
ln -s ~/shared-claude-rules .claude/rules/shared

# 개별 규칙 파일 심볼릭 링크
ln -s ~/company-standards/security.md .claude/rules/security.md
```

### 사용자 수준 규칙

```
~/.claude/rules/
├── preferences.md    # 개인 코딩 기본 설정
└── workflows.md      # 선호하는 워크플로우
```

> `.claude/rules/` 모범 사례:
> **규칙을 집중적으로 유지**: 각 파일은 하나의 주제를 다루어야 합니다 (예: `testing.md`, `api-design.md`)
> **설명적인 파일 이름 사용**: 파일 이름이 규칙의 내용을 나타내야 합니다
> **조건부 규칙은 신중하게 사용**: 규칙이 특정 파일 유형에만 적용될 때만 `paths` frontmatter 추가
> **하위 디렉토리로 구성**: 관련 규칙을 그룹화 (예: `frontend/`, `backend/`)

- **규칙을 집중적으로 유지**: 각 파일은 하나의 주제를 다루어야 합니다 (예: `testing.md`, `api-design.md`)
- **설명적인 파일 이름 사용**: 파일 이름이 규칙의 내용을 나타내야 합니다
- **조건부 규칙은 신중하게 사용**: 규칙이 특정 파일 유형에만 적용될 때만 `paths` frontmatter 추가
- **하위 디렉토리로 구성**: 관련 규칙을 그룹화 (예: `frontend/`, `backend/`)

## 조직 수준 메모리 관리

- [위 메모리 유형 표](#메모리-유형-결정)에 표시된 **Enterprise 정책** 위치에 엔터프라이즈 메모리 파일을 생성합니다.
- 모든 개발자 머신에서 일관된 배포를 보장하기 위해 구성 관리 시스템(MDM, Group Policy, Ansible 등)을 통해 배포합니다.

## 메모리 모범 사례

- **구체적으로 작성**: "2칸 들여쓰기 사용"이 "코드를 적절히 포맷"보다 좋습니다.
- **구조를 사용하여 구성**: 각 개별 메모리를 글머리 기호로 형식화하고 관련 메모리를 설명적인 마크다운 제목 아래에 그룹화합니다.
- **주기적으로 검토**: Claude가 항상 최신 정보와 컨텍스트를 사용하도록 프로젝트가 발전함에 따라 메모리를 업데이트합니다.

이 페이지가 도움이 되었나요?
