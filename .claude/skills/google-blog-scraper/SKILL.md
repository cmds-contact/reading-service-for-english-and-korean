---
name: google-blog-scraper
description: |
  Google 블로그(blog.google) 콘텐츠를 스크래핑하여 영어-한국어 병렬 읽기 서비스용 콘텐츠로 변환.
  사용 시점: (1) blog.google URL이 제공될 때, (2) Google 블로그 글을 콘텐츠로 만들어달라는 요청 시,
  (3) "이 글 스크래핑해줘" 같은 요청에 blog.google URL이 포함될 때.
  Playwright로 전체 본문, 이미지, YouTube 비디오를 추출하고 meta.yaml, en.md, ko.md 형식으로 생성.
---

# Google Blog Scraper

blog.google 콘텐츠를 reading-service 형식으로 변환.

> **참조**: [공통 콘텐츠 스키마](../CONTENT_SCHEMA.md) - 필수 형식 및 검증 규칙

## 워크플로우

### 권장: 자동화 파이프라인 (v2.0)

URL 하나로 콘텐츠 생성 + 자동 검증까지 완료:

```bash
node .claude/skills/google-blog-scraper/scripts/pipeline.js "https://blog.google/outreach/example-post"
```

**출력:**
```
contents/google/{slug}/
├── meta.yaml        # 자동 생성
├── en.md            # 자동 생성 + 검증 완료
└── .scraper-output.json  # 디버깅용 원본 JSON
```

**옵션:**
- `--force`: 기존 파일이 있어도 덮어쓰기 (기존 파일은 `.trash/`로 이동)

**자동 검증 항목:**
- YouTube: 각 videoId가 마크다운에 포함되었는지 확인
- 이미지: 모든 src URL이 마크다운에 포함되었는지 확인
- 링크: 원본 text의 모든 링크 URL이 보존되었는지 확인

**검증 실패 시:**
```
╔═══════════════════════════════════════════════════════════╗
║                  검증 실패: 원문 누락 발견                   ║
╠═══════════════════════════════════════════════════════════╣
║ YouTube 비디오 누락 (1개)                                  ║
║   - videoId: dQw4w9WgXcQ                                  ║
║ 링크 URL 누락 (2개)                                        ║
║   - https://docs.example.com                              ║
╚═══════════════════════════════════════════════════════════╝
```

**다음 단계:** Claude Code로 ko.md 번역 생성

---

### Self-Improving Agent (v2.0)

검증 실패 시 자동으로 진단 및 수정 제안을 생성합니다:

```
URL → 스크래핑 → 변환 → 검증 → [실패 시] → 진단 → 수정 제안 → Claude Code 수정 → 재실행
                                   ↓
                          동일 에러 재발 방지
```

**검증 실패 시 출력:**
1. **진단 결과**: 에러 원인 분류 (YouTube regex 문제, 커스텀 요소 등)
2. **수정 제안**: 어떤 파일의 어느 부분을 어떻게 수정해야 하는지
3. **알려진 패턴**: `known-issues.json`에서 이미 해결된 패턴인지 확인

**파일 구조:**
```
.claude/skills/google-blog-scraper/
├── SKILL.md
├── known-issues.json           # 학습된 문제 패턴 DB
└── scripts/
    ├── config.js               # 스크래퍼 설정 (Google 전용 진단기 포함)
    ├── scraper.js              # Playwright 스크래핑 로직
    └── pipeline.js             # 통합 파이프라인 (scraper-core 사용)

.claude/skills/scraper-core/    # 공통 모듈 (모든 스크래퍼가 공유)
└── scripts/
    ├── file-utils.js           # 파일 저장/이동
    ├── meta-utils.js           # meta.yaml 생성
    ├── json-to-markdown.js     # JSON → 마크다운 변환
    ├── validate-base.js        # 검증 로직
    ├── diagnose-base.js        # 진단 엔진
    ├── fix-base.js             # 수정 제안 생성
    └── pipeline-runner.js      # 파이프라인 팩토리
```

---

### 수동 워크플로우 (개별 스크립트)

#### 1. 스크래핑 실행

```bash
node .claude/skills/google-blog-scraper/scripts/scraper.js "<URL>"
```

결과 JSON:
- `title`: 기사 제목
- `date`: 발행일
- `content`: 순서대로 정렬된 콘텐츠 배열 [{type, ...}]
  - `{type: "h1"|"h2"|"h3"|"h4", text}`: 헤딩
  - `{type: "p", text}`: 문단 (인라인 마크다운 포함)
  - `{type: "li", text}`: 리스트 아이템 (인라인 마크다운 포함)
  - `{type: "blockquote", text}`: 인용구
  - `{type: "image", src, alt}`: 이미지
  - `{type: "figure", src, alt, caption}`: 캡션 있는 이미지
  - `{type: "youtube", videoId, src}`: YouTube 비디오

**인라인 마크다운 자동 변환:**
- `<a href="url">text</a>` → `[text](url)`
- `<strong>`, `<b>` → `**bold**`
- `<em>`, `<i>` → `*italic*`
- `<code>` → `` `code` ``

> **⚠️ 중요: 스크래퍼 출력의 text 필드에 이미 마크다운 형식의 링크가 포함되어 있습니다.**
> **text 필드를 그대로 사용해야 합니다. 임의로 재작성하면 링크가 손실됩니다!**

#### 2. 콘텐츠 파일 생성

`contents/google/{slug}/` 폴더에 3개 파일:

**meta.yaml** (필수 형식 - 반드시 준수)
```yaml
id: {slug}
created: "{YYYY-MM-DD}"
channel: Google

source:
  url: {원본URL}
  published: "{발행일}"

languages:
  en:
    title: "{영문 제목}"
    type: original
  ko:
    title: "{한국어 제목}"
    type: translation
    translator: ai
```

> **⚠️ 필수 검증 항목**
> - `languages` 필드 필수 (없으면 런타임 에러 발생)
> - `languages.en.title` 필수
> - `languages.ko.title` 필수
> - `channel: Google` 정확히 사용

> **❌ 잘못된 형식 (사용 금지)**
> ```yaml
> title: "제목"           # ← 루트에 title 금지
> slug: example          # ← slug 대신 id 사용
> ```

**en.md / ko.md**: 마크다운 본문

## 사이트 구조 특이사항

### 플랫폼
- Google 자체 플랫폼
- `<article>` 또는 `<main>` 컨테이너 사용

### YouTube 처리
Google 블로그는 커스텀 YouTube 요소를 사용합니다:
- `<uni-youtube-player-hero video-id="...">`
- `video-id` 속성에서 ID 추출

### 이미지
- 썸네일: `width-100` → `width-1000`으로 변환
- 중복 제거 처리

### 날짜
- "Dec 25, 2025" 형식 패턴 탐색

## 주의사항

### 절대 규칙

1. **스크래퍼 출력 그대로 사용**: `text` 필드를 임의로 재작성하지 마세요.

2. **링크 손실 금지**: 스크래퍼가 `[text](url)` 형식으로 추출한 링크를 반드시 유지하세요.

3. **번역 시 링크 처리**: URL은 그대로 유지, 링크 텍스트만 번역

### 기타 규칙

- 본문 전체 추출 (누락 금지)
- 이미지 403 에러 시 다른 크기 시도
- 영문 먼저 작성 후 한국어 번역
- 이미지/비디오 URL은 양쪽 동일

---

## Troubleshooting Guide

검증 실패 시 파이프라인이 자동으로 진단 결과와 수정 제안을 출력합니다.
아래는 주요 문제 유형별 해결 방법입니다.

### 문제: YouTube 비디오 누락

**진단 코드:** `YOUTUBE_REGEX_MISS`, `YOUTUBE_CUSTOM_ELEMENT`, `YOUTUBE_NOT_IN_PAGE`

**확인 사항:**
1. `known-issues.json` 확인 → 이미 해결된 패턴인지
2. 출력된 `.page.html`에서 YouTube 요소 검색
3. 커스텀 요소 태그명 또는 새 URL 패턴 확인

**수정 위치:** `scrape-google-blog.js` - YouTube 처리 부분
```javascript
// 커스텀 요소 선택자
tag === 'uni-youtube-player-hero' || node.hasAttribute('video-id')

// iframe 패턴
/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
```

### 문제: 이미지 누락

**진단 코드:** `IMAGE_SELECTOR_MISS`, `IMAGE_DATA_URL`

**확인 사항:**
1. lazy-load (`data-src` 속성) 확인
2. 필터링 로직 (icon, logo, avatar) 확인
3. 썸네일 변환 (width-100 → width-1000) 확인

**수정 위치:** `scrape-google-blog.js` - 이미지 추출 부분

### 문제: 링크 누락

**진단 코드:** `LINK_CONVERSION_FAIL`

**확인 사항:**
1. `htmlToMarkdown` 함수의 `<a>` 태그 처리
2. 중첩 링크 구조
3. `javascript:` href 제외 처리

**수정 위치:** `scrape-google-blog.js` - htmlToMarkdown 함수

### 문제: 콘텐츠 대부분 누락

**진단 코드:** `CONTENT_CONTAINER_CHANGE`

**확인 사항:**
1. 페이지 구조 변경 의심
2. `article` / `main` 선택자 확인
3. `.page.html` 파일로 페이지 구조 분석

### 문제 해결 후

수정 완료 후 반드시:
1. 파이프라인 재실행하여 검증 통과 확인
2. `known-issues.json`에 해결 패턴 기록

```json
{
  "id": "new-custom-youtube-tag",
  "type": "YOUTUBE_CUSTOM_ELEMENT",
  "pattern": "새로운 태그명",
  "addedDate": "2026-01-02",
  "status": "resolved",
  "fix": {
    "file": "scrape-google-blog.js",
    "action": "add_selector",
    "description": "새 커스텀 YouTube 요소 선택자 추가"
  }
}
```
