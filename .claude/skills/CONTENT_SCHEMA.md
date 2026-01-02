# Content Schema (콘텐츠 스키마)

모든 스크래퍼 스킬이 준수해야 하는 콘텐츠 형식 정의.

## 폴더 구조

```
contents/{channel-folder}/{slug}/
├── meta.yaml    # 메타데이터 (필수)
├── en.md        # 영문 본문 (필수)
└── ko.md        # 한국어 본문 (필수)
```

## meta.yaml 필수 스키마

```yaml
# === 필수 필드 ===
id: {slug}                    # 폴더명과 동일
created: "{YYYY-MM-DD}"       # 생성일
channel: {Channel Name}       # 채널명 (대문자 시작, 공백 포함 가능)

source:
  url: {원본URL}              # 원본 URL
  published: "{발행일}"        # 원본 발행일

languages:                    # ⚠️ 필수 - 없으면 런타임 에러
  en:
    title: "{영문 제목}"       # ⚠️ 필수
    type: original
  ko:
    title: "{한국어 제목}"     # ⚠️ 필수
    type: translation
    translator: ai

# === 선택 필드 ===
updated: "{YYYY-MM-DD}"       # 수정일 (선택)
category: {Category}          # 카테고리 (선택)
tags:                         # 태그 (선택)
  - Tag1
  - Tag2
```

## 필수 검증 규칙

### 1. languages 필드 필수
```yaml
# ✅ 올바름
languages:
  en:
    title: "Example Title"
    type: original
  ko:
    title: "예시 제목"
    type: translation
    translator: ai

# ❌ 오류 - languages 누락
title: "Example Title"
```

### 2. 채널명 형식
```yaml
# ✅ 올바름
channel: Claude Blog
channel: Google
channel: Claude Code Docs

# ❌ 오류 - 소문자/하이픈 사용
channel: claude-blog
channel: google-blog
```

### 3. id는 폴더명과 일치
```yaml
# 폴더: contents/claude-blog/my-article/

# ✅ 올바름
id: my-article

# ❌ 오류
slug: my-article
id: MyArticle
```

## 채널별 설정

| 채널 | channel 값 | 폴더 경로 |
|------|------------|-----------|
| Claude Blog | `Claude Blog` | `contents/claude-blog/` |
| Claude Code Docs | `Claude Code Docs` | `contents/claude-docs/` |
| Google Blog | `Google` | `contents/google/` |

## 공통 오류 패턴

### 오류 1: 루트 레벨 title
```yaml
# ❌ 잘못된 형식
title: "Article Title"
slug: article-slug
date: "2025-01-01"
channel: claude-blog

# ✅ 올바른 형식
id: article-slug
created: "2025-01-01"
channel: Claude Blog
languages:
  en:
    title: "Article Title"
    type: original
  ko:
    title: "기사 제목"
    type: translation
    translator: ai
```

### 오류 2: languages.ko 누락
```yaml
# ❌ 잘못된 형식
languages:
  en:
    title: "Title"
    type: original
# ko 누락!

# ✅ 올바른 형식
languages:
  en:
    title: "Title"
    type: original
  ko:
    title: "제목"
    type: translation
    translator: ai
```

## 스크래퍼 체크리스트

콘텐츠 생성 후 반드시 확인:

- [ ] `meta.yaml`에 `languages` 필드 존재
- [ ] `languages.en.title` 존재
- [ ] `languages.ko.title` 존재
- [ ] `channel` 값이 대문자로 시작하고 올바른 형식
- [ ] `id` 값이 폴더명과 일치
- [ ] `en.md` 파일 존재
- [ ] `ko.md` 파일 존재
