# 콘텐츠 마이그레이션 가이드

`contents_migration/` 폴더의 문서를 `contents/`로 마이그레이션하는 방법.

## Quick Start

```bash
# 마이그레이션 실행
node scripts/migrate_content.js

# 진행 상황 확인
cat scripts/migration_progress.json
```

## 폴더 구조

```
contents/
└── {slug}/           # 예: claude-haiku-4-5
    ├── meta.yaml     # 메타데이터 (필수)
    ├── en.md         # 영어 본문 (필수)
    └── ko.md         # 한국어 본문 (필수)
```

## meta.yaml 형식

```yaml
id: {slug}
created: YYYY-MM-DD
updated: YYYY-MM-DD
channel: Anthropic  # 콘텐츠 출처/채널 (범용: 블로그, 유튜브, 뉴스레터, 책 등)

source:
  url: https://...
  published: YYYY-MM-DD

category: Product | Research | Business | Policy | Infrastructure | AI
tags:
  - Tag1
  - Tag2

languages:
  en:
    title: "English Title"
    type: original
  ko:
    title: "한국어 제목"
    type: translation
    translator: human
```

### channel 예시

| 콘텐츠 유형 | channel 값 |
|-------------|------------|
| AI 회사 블로그 | `Anthropic`, `OpenAI`, `Google` |
| 유튜브 채널 | `3Blue1Brown`, `Fireship` |
| 뉴스레터 | `The Batch`, `AI Weekly` |
| 책/출판사 | `O'Reilly`, `Manning` |
| 개인 블로그 | `Simon Willison`, `Lilian Weng` |

## 마크다운 파일 규칙

- **frontmatter 금지**: `---` YAML 헤더 없이 바로 `# 제목`으로 시작
- 본문만 포함 (메타데이터는 meta.yaml에)

## 마이그레이션 소스 파일 형식

`contents_migration/` 내 파일 명명 규칙:
- 영어: `YYYY-MM-DD_slug.md`
- 한국어: `YYYY-MM-DD_slug_kr.md`

## 마이그레이션 절차

1. 폴더 생성: `contents/{slug}/`
2. `meta.yaml` 생성 (frontmatter에서 정보 추출, `channel` 필드 추가)
3. `en.md` 생성 (frontmatter 제거, 본문만)
4. `ko.md` 생성 (frontmatter 제거, 본문만)

## 예시

### 소스 파일 (contents_migration/claude-blog/2025-10-16_claude-haiku-4-5.md)

```markdown
---
title: "Introducing Claude Haiku 4.5"
date: 2025-10-16
source: https://www.anthropic.com/news/claude-haiku-4-5
company: Anthropic
category: Product
---

# Introducing Claude Haiku 4.5

본문 내용...
```

### 변환 결과

**contents/claude-haiku-4-5/meta.yaml**
```yaml
id: claude-haiku-4-5
created: 2025-10-16
updated: 2025-10-16
channel: Anthropic

source:
  url: https://www.anthropic.com/news/claude-haiku-4-5
  published: 2025-10-16

category: Product
tags:
  - Claude
  - AI Model

languages:
  en:
    title: "Introducing Claude Haiku 4.5"
    type: original
  ko:
    title: "Claude Haiku 4.5 소개"
    type: translation
    translator: human
```

**contents/claude-haiku-4-5/en.md**
```markdown
# Introducing Claude Haiku 4.5

본문 내용...
```

---

## 마이그레이션 스크립트

### 파일 위치

```
scripts/
├── migrate_content.js      # 마이그레이션 스크립트
└── migration_progress.json # 진행 상황 추적 (자동 생성)
```

### 사용법

```bash
# 전체 마이그레이션 실행
node scripts/migrate_content.js

# 중단 후 재개 시 동일 명령어 실행 (진행 상황 유지)
node scripts/migrate_content.js
```

### 지원 소스 폴더

| 소스 폴더 | channel 값 |
|-----------|------------|
| `contents_migration/claude-blog/` | Anthropic |
| `contents_migration/gemini-blog/` | Google |
| `contents_migration/openai-blog/` | OpenAI |

### 출력 예시

```
=== Migrating claude-blog (channel: Anthropic) ===
Found 32 content items
  [OK] claude-opus-4-5
  [SKIP] claude-haiku-4-5 - already exists
  [FAIL] some-content - error message

==================================================
MIGRATION SUMMARY
==================================================
Migrated: 131
Skipped:  11
Failed:   0
```

### 상태 코드

| 상태 | 설명 |
|------|------|
| `[OK]` | 마이그레이션 성공 |
| `[SKIP]` | 이미 존재하여 건너뜀 |
| `[FAIL]` | 오류 발생 |

### 진행 상황 파일 형식

`scripts/migration_progress.json`:

```json
{
  "migrated": ["slug-1", "slug-2"],
  "skipped": ["slug-3"],
  "failed": ["slug-4"]
}
```

### 자동 태그 생성 규칙

스크립트는 제목을 분석하여 자동으로 태그를 생성합니다:

| 키워드 | 생성 태그 |
|--------|-----------|
| model, opus, haiku, sonnet, flash, pro | AI Model |
| code, coding, developer | Coding |
| agent | AI Agent |
| safety, security | AI Safety |
| partner | Partnership |

### 수동 마이그레이션

스크립트 없이 수동으로 마이그레이션하려면:

1. `contents/{slug}/` 폴더 생성
2. 소스 파일에서 frontmatter 추출하여 `meta.yaml` 작성
3. 소스 파일에서 frontmatter 제거 후 `en.md` 저장
4. 한국어 파일(`_kr.md`)에서 frontmatter 제거 후 `ko.md` 저장
