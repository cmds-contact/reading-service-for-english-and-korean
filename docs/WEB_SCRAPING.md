# 웹 스크래핑

외부 블로그 콘텐츠를 스크래핑하여 서비스 형식으로 변환.

## 지원 소스

| 소스 | 도구 | 스킬 | 상태 |
|------|------|------|------|
| blog.google | Playwright | google-blog-scraper | ✅ 완료 |
| claude.com/blog | Playwright | claude-blog-scraper | ✅ 완료 |
| code.claude.com/docs | Playwright | claude-docs-scraper | ✅ 완료 |

---

## 아키텍처 개요

모든 스크래퍼는 `scraper-core` 공통 모듈을 기반으로 동작합니다.

```
                    ┌─────────────────────────────────────┐
                    │           scraper-core              │
                    │                                     │
                    │  file-utils │ meta-utils │ json-to-md
                    │  validate   │ diagnose   │ fix      │
                    │  ─────────────────────────────────  │
                    │         pipeline-runner             │
                    └─────────────────┬───────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
   claude-blog              google-blog               claude-docs
     scraper                  scraper                   scraper
```

### 스킬 구조

```
.claude/skills/
├── scraper-core/                    # 공통 모듈
│   ├── SKILL.md
│   └── scripts/
│       ├── file-utils.js            # 파일 저장/백업
│       ├── meta-utils.js            # meta.yaml 생성
│       ├── json-to-markdown.js      # JSON → Markdown 변환
│       ├── validate-base.js         # 콘텐츠 검증
│       ├── diagnose-base.js         # 문제 진단
│       ├── fix-base.js              # 수정 제안
│       └── pipeline-runner.js       # 파이프라인 팩토리
│
├── claude-blog-scraper/
│   ├── SKILL.md
│   ├── known-issues.json            # 학습된 문제 패턴
│   └── scripts/
│       ├── config.js                # 스크래퍼 설정
│       ├── scraper.js               # Playwright 스크래핑
│       └── pipeline.js              # 파이프라인 실행
│
├── google-blog-scraper/             # 동일 구조
└── claude-docs-scraper/             # 동일 구조
```

---

## 파이프라인 흐름

```
URL 입력
    │
    ▼
[1] extractSlug(url)        ← config.js에서 정의
    │
    ▼
[2] scrape(url)             ← scraper.js (Playwright)
    │
    ├─→ json (구조화된 콘텐츠)
    └─→ html (진단용 원본)
    │
    ▼
[3] jsonToMarkdown(json)    ← scraper-core
    │
    ▼
[4] generateMeta(...)       ← scraper-core
    │
    ▼
[5] validateContent(...)    ← scraper-core + validateItems
    │
    ├─→ 성공: 파일 저장 완료
    │
    └─→ 실패:
        ▼
    [6] diagnose(...)       ← 문제 원인 분석
        ▼
    [7] generateFixReport() ← 수정 가이드 생성
        ▼
    [8] checkKnownIssues()  ← 기존 해결 패턴 확인
```

---

## 공통 가이드

### 콘텐츠 출력 구조

```
contents/{channel}/{slug}/
├── meta.yaml              # 메타데이터
├── en.md                  # 영문 원본
├── ko.md                  # 한국어 번역 (수동 생성)
├── .scraper-output.json   # 디버깅용 JSON (자동)
└── .page.html             # 디버깅용 HTML (검증 실패 시)
```

### 스크래핑 출력 JSON 표준

```json
{
  "title": "기사 제목",
  "date": "Dec 08, 2025",
  "content": [
    { "type": "h1", "text": "제목" },
    { "type": "p", "text": "문단 내용 [링크](url)도 포함" },
    { "type": "li", "text": "목록 항목" },
    { "type": "blockquote", "text": "인용문" },
    { "type": "image", "src": "https://...", "alt": "대체 텍스트" },
    { "type": "figure", "src": "https://...", "alt": "...", "caption": "캡션" },
    { "type": "youtube", "videoId": "VIDEO_ID", "src": "https://..." },
    { "type": "code", "lang": "javascript", "code": "const x = 1;" },
    { "type": "table", "rows": [["헤더1", "헤더2"], ["값1", "값2"]] }
  ]
}
```

### meta.yaml 표준 형식

```yaml
id: {slug}
created: "2025-01-02"
channel: Claude Blog

source:
  url: https://claude.com/blog/example
  published: "2025-01-01"

languages:
  en:
    title: "English Title"
    type: original
  ko:
    title: "한국어 제목"
    type: translation
    translator: ai
```

---

## 사용법

### 자동화 파이프라인 (권장)

각 스크래퍼의 `pipeline.js`를 실행:

```bash
# Claude Blog
node .claude/skills/claude-blog-scraper/scripts/pipeline.js "https://claude.com/blog/example"

# Google Blog
node .claude/skills/google-blog-scraper/scripts/pipeline.js "https://blog.google/outreach/example"

# Claude Docs
node .claude/skills/claude-docs-scraper/scripts/pipeline.js "https://code.claude.com/docs/hooks"
```

**옵션:**
- `--force`: 기존 파일 덮어쓰기 (백업은 `.trash/`로)

### 출력 예시

**성공 시:**
```
╔══════════════════════════════════════════════════════════════════╗
║                     성공! 파일 생성 완료                          ║
╠══════════════════════════════════════════════════════════════════╣
║ contents/claude-blog/example/meta.yaml                           ║
║ contents/claude-blog/example/en.md                               ║
║                                                                  ║
║ 다음 단계: Claude Code로 ko.md 번역 생성                          ║
╚══════════════════════════════════════════════════════════════════╝
```

**검증 실패 시:**
```
╔═══════════════════════════════════════════════════════════╗
║                  검증 실패: 원문 누락 발견                   ║
╠═══════════════════════════════════════════════════════════╣
║ YouTube 비디오 누락 (1개)                                  ║
║   - videoId: dQw4w9WgXcQ                                  ║
╚═══════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════╗
║                         진단 결과                                  ║
╠═══════════════════════════════════════════════════════════════════╣
║ [YOUTUBE_REGEX_MISS]                                             ║
║   YouTube ID 'dQw4w9WgXcQ'가 페이지에 있지만 추출 실패            ║
╚═══════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════╗
║                       수정 제안 보고서                             ║
╠═══════════════════════════════════════════════════════════════════╣
║ 🟠 HIGH:                                                         ║
║    - YOUTUBE_REGEX_MISS                                          ║
╠═══════════════════════════════════════════════════════════════════╣
║ [YOUTUBE_REGEX_MISS] scraper.js                                  ║
║   섹션: iframe 처리 (YouTube regex)                               ║
║   지침: 새로운 YouTube URL 패턴 추가 필요                          ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 사이트별 가이드

### Claude Blog (claude.com/blog)

**스킬**: `.claude/skills/claude-blog-scraper/`
**채널 폴더**: `contents/claude-blog/`

```bash
node .claude/skills/claude-blog-scraper/scripts/pipeline.js "https://claude.com/blog/..."
```

**검증 항목:** YouTube, 이미지, 링크, 코드 블록

**특이사항:**
- Webflow 기반 사이트
- `<article>` 또는 `.rich-text` 컨테이너 사용
- 이미지: `cdn.prod.website-files.com` CDN (URL 변환 불필요)
- 날짜: 텍스트 패턴 탐색 (`Dec 25, 2025` 형식)

---

### Google Blog (blog.google)

**스킬**: `.claude/skills/google-blog-scraper/`
**채널 폴더**: `contents/google/`

```bash
node .claude/skills/google-blog-scraper/scripts/pipeline.js "https://blog.google/..."
```

**검증 항목:** YouTube, 이미지, 링크

**특이사항:**
- YouTube: `<uni-youtube-player-hero video-id="...">` 커스텀 요소 사용
- 이미지 URL: `width-100` → `width-1000` 자동 변환
- 날짜 형식: `Dec 08, 2025`

**이미지 403 대응:**
```
width-1000 → width-800 → width-500
```

---

### Claude Code Docs (code.claude.com/docs)

**스킬**: `.claude/skills/claude-docs-scraper/`
**채널 폴더**: `contents/claude-docs/`

```bash
node .claude/skills/claude-docs-scraper/scripts/pipeline.js "https://code.claude.com/docs/hooks"
```

**검증 항목:** 코드 블록, 링크

**특이사항:**
- 헤딩에 `​` (zero-width space) 포함 → 자동 제거
- 코드 블록: shiki 하이라이터 사용
- Callout/Note 요소 → blockquote로 변환
- 날짜 없음 (문서는 날짜가 없을 수 있음)

---

## 새 스크래퍼 추가 가이드

### Step 1: 폴더 생성

```bash
mkdir -p .claude/skills/{channel}-scraper/scripts
```

### Step 2: 4개 파일 작성

1. **config.js** - 스크래퍼 설정

```javascript
const path = require('path');
const PROJECT_ROOT = path.resolve(__dirname, '../../../..');

function extractSlug(url) {
  const match = url.match(/example\.com\/posts\/([^/?#]+)/);
  return match ? match[1] : null;
}

module.exports = {
  channel: 'Example',
  channelFolder: 'example',
  projectRoot: PROJECT_ROOT,
  knownIssuesPath: path.join(__dirname, '..', 'known-issues.json'),
  extractSlug,
  validateItems: ['youtube', 'images', 'links'],
  scraperFile: 'scraper.js',
  extraTypeHandlers: {},
  customDiagnosers: {},
  customFixRecommendations: {}
};
```

2. **scraper.js** - Playwright 스크래핑

```javascript
const { chromium } = require('playwright');

async function scrape(url, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    let html = options.returnHtml ? await page.content() : null;

    const content = await page.evaluate(() => {
      // 페이지별 스크래핑 로직
      return { title: '', date: '', content: [] };
    });

    return { json: content, html };
  } finally {
    await browser.close();
  }
}

module.exports = { scrape };
```

3. **pipeline.js** - 파이프라인

```javascript
const { createPipeline } = require('../../scraper-core/scripts/pipeline-runner');
const { scrape } = require('./scraper');
const config = require('./config');

const pipeline = createPipeline({
  channel: config.channel,
  channelFolder: config.channelFolder,
  extractSlug: config.extractSlug,
  scrape,
  validateItems: config.validateItems,
  extraTypeHandlers: config.extraTypeHandlers,
  customDiagnosers: config.customDiagnosers,
  customFixRecommendations: config.customFixRecommendations,
  scraperFile: config.scraperFile,
  knownIssuesPath: config.knownIssuesPath,
  projectRoot: config.projectRoot
});

module.exports = { pipeline };
```

4. **known-issues.json** - 알려진 문제 DB

```json
{
  "version": "1.0",
  "lastUpdated": "2025-01-02",
  "issues": []
}
```

### Step 3: SKILL.md 작성

스크래퍼 사용법, 사이트 특이사항 등 문서화.

### Step 4: 이 문서 업데이트

"지원 소스" 테이블과 "사이트별 가이드" 섹션에 추가.

---

## 문제 해결

### 검증 실패 시

파이프라인이 자동으로 진단 결과와 수정 제안을 출력합니다.

1. **진단 결과 확인**: 어떤 콘텐츠가 누락되었는지
2. **수정 제안 확인**: 어떤 파일의 어느 부분을 수정해야 하는지
3. **`.page.html` 분석**: 페이지 구조 확인
4. **`scraper.js` 수정**: 선택자나 regex 업데이트
5. **파이프라인 재실행**: 검증 통과 확인
6. **`known-issues.json` 업데이트**: 동일 문제 재발 방지

### 일반적인 문제 유형

| 문제 | 원인 | 해결 |
|------|------|------|
| `YOUTUBE_REGEX_MISS` | YouTube URL 패턴 누락 | scraper.js의 regex 확장 |
| `YOUTUBE_NOT_IN_PAGE` | 동적 로딩 | waitForSelector 추가 |
| `IMAGE_SELECTOR_MISS` | 이미지 선택자 누락 | 이미지 추출 로직 수정 |
| `IMAGE_DATA_URL` | lazy-load | data-src 우선 확인 |
| `LINK_CONVERSION_FAIL` | 링크 변환 실패 | htmlToMarkdown 수정 |
| `CODE_BLOCK_SELECTOR_MISS` | 코드 블록 선택자 | pre/code 선택자 확인 |
| `CONTENT_CONTAINER_CHANGE` | 페이지 구조 변경 | bodyEl 선택 로직 업데이트 |

### known-issues.json 활용

문제 해결 후 패턴을 기록하면 동일 문제 발생 시 자동으로 해결 방법을 제시합니다.

```json
{
  "issues": [
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
  ]
}
```

---

## 설치

```bash
npm install playwright --save-dev
npx playwright install chromium
```

## WebFetch 한계

Claude의 WebFetch 도구는 다음 문제로 전체 본문 추출 불가:

1. 내부적으로 요약하는 경향
2. JavaScript 렌더링 콘텐츠 누락
3. 긴 콘텐츠 토큰 제한

**해결책**: Playwright 사용
