---
name: claude-blog-scraper
description: |
  Claude 블로그(claude.com/blog) 콘텐츠를 스크래핑하여 영어-한국어 병렬 읽기 서비스용 콘텐츠로 변환.
  사용 시점: (1) claude.com/blog URL이 제공될 때, (2) Claude 블로그 글을 콘텐츠로 만들어달라는 요청 시,
  (3) "이 글 스크래핑해줘" 같은 요청에 claude.com/blog URL이 포함될 때.
  Playwright로 전체 본문, 이미지를 추출하고 meta.yaml, en.md, ko.md 형식으로 생성.
---

# Claude Blog Scraper

claude.com/blog 콘텐츠를 reading-service 형식으로 변환.

> **참조**: [공통 콘텐츠 스키마](../CONTENT_SCHEMA.md) - 필수 형식 및 검증 규칙

## 워크플로우

### 🚀 권장: 자동화 파이프라인 (v2.0)

URL 하나로 콘텐츠 생성 + 자동 검증까지 완료:

```bash
node .claude/skills/claude-blog-scraper/scripts/pipeline.js "https://claude.com/blog/example-post"
```

**출력:**
```
contents/claude-blog/{slug}/
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
- 코드 블록: 코드 내용이 정확히 포함되었는지 확인
- 테이블: 각 셀 내용이 마크다운에 존재하는지 확인

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

### 🔄 Self-Improving Agent (v2.0)

검증 실패 시 자동으로 진단 및 수정 제안을 생성합니다:

```
URL → 스크래핑 → 변환 → 검증 → [실패 시] → 진단 → 수정 제안 → Claude Code 수정 → 재실행
                                   ↓
                          동일 에러 재발 방지
```

**검증 실패 시 출력:**
1. **진단 결과**: 에러 원인 분류 (YouTube regex 문제, 선택자 불일치 등)
2. **수정 제안**: 어떤 파일의 어느 부분을 어떻게 수정해야 하는지
3. **알려진 패턴**: `known-issues.json`에서 이미 해결된 패턴인지 확인

**파일 구조:**
```
.claude/skills/claude-blog-scraper/
├── SKILL.md
├── known-issues.json           # 학습된 문제 패턴 DB
└── scripts/
    ├── config.js               # 스크래퍼 설정
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
node .claude/skills/claude-blog-scraper/scripts/scraper.js "<URL>"
```

결과 JSON:
- `title`: 기사 제목
- `date`: 발행일
- `content`: 순서대로 정렬된 콘텐츠 배열 [{type, ...}]
  - `{type: "h1"|"h2"|"h3"|"h4", text}`: 헤딩
  - `{type: "p", text}`: 문단 (인라인 마크다운 포함)
  - `{type: "li", text}`: 리스트 아이템 (인라인 마크다운 포함)
  - `{type: "blockquote", text}`: 인용구 (인라인 마크다운 포함)
  - `{type: "image", src, alt}`: 이미지
  - `{type: "figure", src, alt, caption}`: 캡션 있는 이미지
  - `{type: "table", rows}`: 테이블 (rows는 2D 배열)
  - `{type: "code", lang, code}`: 코드 블록 (lang은 언어, code는 코드 내용)
  - `{type: "youtube", videoId, src}`: YouTube 비디오
  - `{type: "vimeo", videoId, src}`: Vimeo 비디오
  - `{type: "iframe", src}`: 기타 iframe

**인라인 마크다운 자동 변환:**
- `<a href="url">text</a>` → `[text](url)`
- `<strong>`, `<b>` → `**bold**`
- `<em>`, `<i>` → `*italic*`
- `<code>` → `` `code` ``

> **⚠️ 중요: 스크래퍼 출력의 text 필드에 이미 마크다운 형식의 링크가 포함되어 있습니다.**
> **text 필드를 그대로 사용해야 합니다. 임의로 재작성하면 링크가 손실됩니다!**

#### 2. 콘텐츠 파일 생성

`contents/claude-blog/{slug}/` 폴더에 3개 파일:

**meta.yaml** (필수 형식 - 반드시 준수)
```yaml
id: {slug}
created: "{YYYY-MM-DD}"
channel: Claude Blog

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
> - `channel: Claude Blog` 정확히 사용 (소문자 `claude-blog` 금지)

> **❌ 잘못된 형식 (사용 금지)**
> ```yaml
> title: "제목"           # ← 루트에 title 금지
> slug: example          # ← slug 대신 id 사용
> channel: claude-blog   # ← 소문자 금지
> ```

**en.md / ko.md**: 마크다운 본문

#### 3. content 배열을 마크다운으로 변환

content 배열의 순서대로 마크다운 생성:

```javascript
// 테이블 변환 예시
{type: "table", rows: [
  ["", "Skills", "MCP"],
  ["What it is", "Procedural knowledge", "Tool connectivity"]
]}
// →
// |  | Skills | MCP |
// |---|---|---|
// | What it is | Procedural knowledge | Tool connectivity |

// Figure 변환 예시
{type: "figure", src: "https://cdn.../img.png", alt: "description", caption: "Caption text"}
// →
// ![description](https://cdn.../img.png)
// *Caption text*

// 코드 블록 변환 예시
{type: "code", lang: "javascript", code: "const x = 1;\nconsole.log(x);"}
// →
// ```javascript
// const x = 1;
// console.log(x);
// ```

// YouTube 변환 예시
{type: "youtube", videoId: "dQw4w9WgXcQ", src: "https://www.youtube.com/embed/dQw4w9WgXcQ"}
// →
// <iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>

// 링크가 포함된 문단 예시 (text 그대로 사용!)
{type: "p", text: "Visit the [documentation](https://docs.example.com) for more info."}
// →
// Visit the [documentation](https://docs.example.com) for more info.
```

## 사이트 구조 특이사항

### 플랫폼
- Webflow 기반 사이트
- `<article>` 컨테이너 사용
- rich-text 클래스 사용

### ⚠️ 페이지 구조 변형 (자동 처리됨)

Claude 블로그는 두 가지 페이지 구조를 사용합니다:

1. **표준 구조**: `<article>` 요소에 본문 콘텐츠가 직접 포함
2. **변형 구조**: `<article>` 요소에 사이드바/CTA가 포함되고, 본문은 `.rich-text` 클래스 요소에 위치

**스크래퍼 동작:**
```
1. 먼저 [class*="rich-text"] 요소들을 검색
2. 가장 많은 콘텐츠(p, h2, h3, h4, li)를 가진 요소 선택
3. 충분한 콘텐츠가 없으면 <article> 또는 <main> 사용
```

**영향받는 페이지 예시:**
- `building-ai-agents-in-financial-services` - 사이드바가 article에 포함
- 향후 유사한 구조의 새 페이지

**문제 발생 시 확인사항:**
- 스크래퍼 출력에서 본문 내용이 누락된 경우
- 예상보다 적은 콘텐츠가 추출된 경우
→ 페이지의 HTML 구조를 확인하고 스크래퍼의 선택자 업데이트 필요할 수 있음

### 이미지
- CDN: `cdn.prod.website-files.com`
- URL 변환 불필요 (원본 URL 그대로 사용)

### 날짜
- `<time>` 태그가 아닌 텍스트로 표시될 수 있음
- "Dec 25, 2025" 형식 패턴 탐색

## 주의사항

### 🚨 절대 규칙

1. **스크래퍼 출력 그대로 사용**: `text` 필드를 임의로 재작성하지 마세요. 링크, 볼드, 이탤릭 등이 이미 마크다운 형식으로 변환되어 있습니다.

2. **링크 손실 금지**: 스크래퍼가 `[text](url)` 형식으로 추출한 링크를 반드시 유지하세요.
   ```
   # ❌ 잘못된 예 (링크 손실)
   원문: "Visit the [docs](https://example.com) for help."
   결과: "Visit the docs for help."

   # ✅ 올바른 예
   원문: "Visit the [docs](https://example.com) for help."
   결과: "Visit the [docs](https://example.com) for help."
   ```

3. **번역 시 링크 처리**: URL은 그대로 유지, 링크 텍스트만 번역
   ```
   # 영문
   Check the [documentation](https://docs.example.com) for details.

   # 한국어
   자세한 내용은 [문서](https://docs.example.com)를 확인하세요.
   ```

### 기타 규칙

- **콘텐츠 순서 유지**: content 배열 순서대로 마크다운 생성 (이미지, 테이블, 비디오 위치 정확히 유지)
- **테이블 완전 추출**: rows 배열의 첫 행을 헤더로, 나머지를 데이터 행으로 변환
- **YouTube 임베딩**: `{type: "youtube"}` → `<iframe>` 태그로 변환
- 본문 전체 추출 (누락 금지)
- 영문 먼저 작성 후 한국어 번역
- 이미지/비디오 URL은 양쪽 동일
- Related articles, Newsletter 등 부가 섹션은 자동 제외됨

---

## Troubleshooting Guide

검증 실패 시 파이프라인이 자동으로 진단 결과와 수정 제안을 출력합니다.
아래는 주요 문제 유형별 해결 방법입니다.

### 문제: YouTube 비디오 누락

**진단 코드:** `YOUTUBE_REGEX_MISS` 또는 `YOUTUBE_NOT_IN_PAGE`

**확인 사항:**
1. `known-issues.json` 확인 → 이미 해결된 패턴인지
2. 출력된 `.page.html`에서 iframe 검색
3. 새로운 URL 패턴이면 스크래퍼 regex 추가

**수정 위치:** `scraper.js` - iframe 처리 부분
```javascript
// 현재 패턴
/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/

// YouTube Shorts 등 새 패턴 추가 시
/(?:embed\/|v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]+)/
```

### 문제: 이미지 누락

**진단 코드:** `IMAGE_SELECTOR_MISS`

**확인 사항:**
1. lazy-load (`data-src` 속성) 확인
2. 필터링 로직 (placeholder, icon, logo, avatar) 확인
3. 새로운 이미지 컨테이너 클래스 확인

**수정 위치:** `scraper.js` - 이미지 추출 부분

### 문제: 링크 누락

**진단 코드:** `LINK_CONVERSION_FAIL`

**확인 사항:**
1. `htmlToMarkdown` 함수의 `<a>` 태그 처리
2. 중첩 링크 구조
3. `javascript:` href 제외 처리

**수정 위치:** `scraper.js` - htmlToMarkdown 함수

### 문제: 콘텐츠 대부분 누락

**진단 코드:** `CONTENT_CONTAINER_CHANGE`

**확인 사항:**
1. 페이지 구조 변경 의심
2. `.rich-text` / `article` / `main` 선택자 확인
3. 새로운 컨테이너 클래스 추가 필요

**수정 절차:**
1. `.page.html` 파일로 페이지 구조 분석
2. 본문 컨테이너 클래스/태그 확인
3. `scraper.js`의 `bodyEl` 선택 로직 업데이트
4. `known-issues.json`에 새 페이지 구조 기록

### 문제 해결 후

수정 완료 후 반드시:
1. 파이프라인 재실행하여 검증 통과 확인
2. `known-issues.json`에 해결 패턴 기록 (동일 문제 재발 방지)

```json
// known-issues.json에 추가 예시
{
  "id": "youtube-shorts-regex",
  "type": "YOUTUBE_REGEX_MISS",
  "pattern": "youtube.com/shorts/",
  "addedDate": "2025-01-02",
  "status": "resolved",
  "fix": {
    "file": "scraper.js",
    "action": "add_regex",
    "description": "YouTube Shorts URL 패턴 추가"
  }
}
```
