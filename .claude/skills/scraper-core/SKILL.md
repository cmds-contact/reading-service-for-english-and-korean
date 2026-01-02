---
name: scraper-core
description: |
  스크래퍼 공통 기능 모듈. 다른 스크래퍼 Skills에서 호출하여 사용.
  직접 호출하지 않음. claude-blog-scraper, google-blog-scraper, claude-docs-scraper 등이 내부적으로 사용.
---

# Scraper Core

스크래퍼 공통 기능을 제공하는 베이스 Skill. 모든 스크래퍼가 이 모듈을 공유하여 코드 중복을 최소화합니다.

## 아키텍처

```
                    ┌─────────────────────────────────────┐
                    │           scraper-core              │
                    │                                     │
                    │  ┌─────────────┐ ┌──────────────┐  │
                    │  │ file-utils  │ │  meta-utils  │  │
                    │  └─────────────┘ └──────────────┘  │
                    │  ┌─────────────┐ ┌──────────────┐  │
                    │  │json-to-md   │ │validate-base │  │
                    │  └─────────────┘ └──────────────┘  │
                    │  ┌─────────────┐ ┌──────────────┐  │
                    │  │diagnose-base│ │   fix-base   │  │
                    │  └─────────────┘ └──────────────┘  │
                    │  ┌──────────────────────────────┐  │
                    │  │       pipeline-runner        │  │
                    │  │    createPipeline(config)    │  │
                    │  └──────────────────────────────┘  │
                    └─────────────────┬───────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ claude-blog     │         │ google-blog     │         │ claude-docs     │
│    scraper      │         │    scraper      │         │    scraper      │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ config.js       │         │ config.js       │         │ config.js       │
│ scraper.js      │         │ scraper.js      │         │ scraper.js      │
│ pipeline.js     │         │ pipeline.js     │         │ pipeline.js     │
│ known-issues.json│        │ known-issues.json│        │ known-issues.json│
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 파이프라인 흐름

```
URL 입력
    │
    ▼
[1] extractSlug(url)        ← config.js
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
[5] validateContent(...)    ← scraper-core + config.validateItems
    │
    ├─→ 성공: 파일 저장 완료
    │
    └─→ 실패:
        │
        ▼
    [6] diagnose(...)       ← scraper-core + config.customDiagnosers
        │
        ▼
    [7] generateFixReport() ← scraper-core + config.customFixRecommendations
        │
        ▼
    [8] checkKnownIssues()  ← known-issues.json
```

---

## 모듈 레퍼런스

### 1. pipeline-runner.js

파이프라인 팩토리 함수를 제공합니다.

```javascript
const { createPipeline } = require('./pipeline-runner');

const pipeline = createPipeline({
  // 필수 설정
  channel: 'Claude Blog',           // 채널 표시명
  channelFolder: 'claude-blog',     // contents/ 하위 폴더명
  extractSlug: (url) => {...},      // URL → slug 추출 함수
  scrape: async (url, opts) => {...}, // 스크래핑 함수
  projectRoot: '/path/to/project',  // 프로젝트 루트 경로

  // 선택 설정
  validateItems: ['youtube', 'images', 'links'],  // 검증 항목
  extraTypeHandlers: {},            // json-to-markdown 확장
  customDiagnosers: {},             // 추가 진단기
  customFixRecommendations: {},     // 추가 수정 제안
  scraperFile: 'scraper.js',        // 수정 제안에 표시할 파일명
  knownIssuesPath: './known-issues.json'  // 알려진 문제 DB 경로
});

// 실행
await pipeline(url, { force: false });
```

**반환값:**
```javascript
// 성공 시
{ success: true, outputDir: '...', validation: {...} }

// 실패 시
{
  success: false,
  outputDir: '...',
  validation: {...},
  diagnosis: [...],      // 진단된 문제 목록
  fixReport: {...},      // 수정 제안 보고서
  knownPatterns: [...],  // 매칭된 알려진 패턴
  nextAction: 'APPLY_KNOWN_FIX' | 'ANALYZE_AND_FIX'
}
```

---

### 2. file-utils.js

파일 작업 유틸리티.

```javascript
const {
  getProjectRoot,     // 프로젝트 루트 경로 반환
  writeFileSafe,      // 안전한 파일 저장 (기존 파일 → .trash)
  checkKnownIssues,   // known-issues.json 확인
  hasExistingFiles    // 폴더에 파일 존재 여부
} = require('./file-utils');

// 파일 저장 (기존 파일 백업)
writeFileSafe('/path/to/file.md', content, trashDir);

// 알려진 문제 확인
const matched = checkKnownIssues(issues, knownIssuesPath);
// → [{ type: 'YOUTUBE_REGEX_MISS', knownFix: {...} }, ...]
```

---

### 3. meta-utils.js

meta.yaml 생성 유틸리티.

```javascript
const {
  parseDate,          // 날짜 문자열 파싱 → YYYY-MM-DD
  getTodayDate,       // 오늘 날짜 반환
  escapeYamlString,   // YAML 문자열 이스케이프
  generateMeta        // meta.yaml 생성
} = require('./meta-utils');

const yaml = generateMeta({
  slug: 'example-post',
  title: 'Example Title',
  url: 'https://example.com/post',
  published: 'Jan 15, 2025',
  channel: 'Claude Blog'
});
// → meta.yaml 문자열 반환
```

**생성되는 meta.yaml 구조:**
```yaml
id: example-post
created: "2025-01-02"
channel: Claude Blog

source:
  url: https://example.com/post
  published: "2025-01-15"

languages:
  en:
    title: "Example Title"
    type: original
  ko:
    title: ""
    type: translation
    translator: ai
```

---

### 4. json-to-markdown.js

JSON 콘텐츠를 마크다운으로 변환.

```javascript
const {
  jsonToMarkdown,        // JSON → Markdown 변환
  DEFAULT_TYPE_HANDLERS  // 기본 타입 핸들러
} = require('./json-to-markdown');

// 기본 사용
const markdown = jsonToMarkdown(json);

// 커스텀 핸들러 추가
const markdown = jsonToMarkdown(json, {
  customType: (item) => [`Custom: ${item.value}`, '']
});
```

**기본 지원 타입:**

| 타입 | 변환 결과 |
|------|----------|
| `h1`-`h6` | `# 제목` ~ `###### 제목` |
| `p` | 문단 텍스트 |
| `li` | `- 리스트 아이템` |
| `blockquote` | `> 인용문` |
| `image` | `![alt](src)` |
| `figure` | `![alt](src)` + `*caption*` |
| `table` | 마크다운 테이블 |
| `code` | ` ```lang ... ``` ` |
| `youtube` | `<iframe>` 태그 |
| `vimeo` | `<iframe>` 태그 |
| `iframe` | `<iframe>` 태그 |

---

### 5. validate-base.js

콘텐츠 검증 로직.

```javascript
const {
  validateContent,          // 검증 실행
  formatValidationResult,   // 결과 포맷팅
  extractLinkUrls,          // 마크다운에서 URL 추출
  VALIDATORS               // 검증기 객체
} = require('./validate-base');

const result = validateContent(
  originalJson,      // 스크래퍼 출력 JSON
  generatedMarkdown, // 생성된 마크다운
  ['youtube', 'images', 'links', 'codeBlocks', 'tables']  // 검증 항목
);
// → { valid: boolean, errors: [...], warnings: [...], stats: {...} }

console.log(formatValidationResult(result, ['youtube', 'images']));
```

**검증 항목 (validateItems):**

| 항목 | 검증 내용 |
|------|----------|
| `youtube` | 모든 videoId가 마크다운에 존재하는지 |
| `images` | 모든 이미지 src가 마크다운에 존재하는지 |
| `links` | 모든 링크 URL이 마크다운에 존재하는지 |
| `codeBlocks` | 코드 블록 첫 줄이 마크다운에 존재하는지 |
| `tables` | 테이블 셀 내용이 마크다운에 존재하는지 |

---

### 6. diagnose-base.js

검증 실패 시 원인 분석.

```javascript
const {
  diagnose,           // 진단 실행
  formatDiagnosis,    // 결과 포맷팅
  extractIframes,     // HTML에서 iframe 추출
  extractImages,      // HTML에서 이미지 추출
  extractLinks,       // HTML에서 링크 추출
  extractCodeBlocks   // HTML에서 코드 블록 추출
} = require('./diagnose-base');

const issues = diagnose(
  validationResult,    // validateContent 결과
  originalJson,        // 스크래퍼 출력 JSON
  pageHtml,           // 원본 페이지 HTML
  customDiagnosers    // 추가 진단기 (선택)
);
// → [{ type: 'YOUTUBE_REGEX_MISS', message: '...', ... }, ...]
```

**기본 진단 타입:**

| 타입 | 설명 |
|------|------|
| `YOUTUBE_REGEX_MISS` | YouTube iframe이 HTML에 있지만 추출 실패 |
| `YOUTUBE_NOT_IN_PAGE` | YouTube가 HTML에 없음 (동적 로딩) |
| `IMAGE_SELECTOR_MISS` | 이미지가 HTML에 있지만 추출 실패 |
| `IMAGE_DATA_URL` | data-src 속성 처리 필요 |
| `LINK_CONVERSION_FAIL` | 링크 마크다운 변환 실패 |
| `CODE_BLOCK_SELECTOR_MISS` | 코드 블록 선택자 누락 |
| `CONTENT_CONTAINER_CHANGE` | 본문 컨테이너 변경됨 |

---

### 7. fix-base.js

수정 제안 생성.

```javascript
const {
  generateFixReport,            // 수정 보고서 생성
  formatFixReport,              // 보고서 포맷팅
  DEFAULT_FIX_RECOMMENDATIONS   // 기본 수정 제안 매핑
} = require('./fix-base');

const report = generateFixReport(
  issues,                     // diagnose 결과
  'scraper.js',              // 스크래퍼 파일명
  customFixRecommendations   // 추가 수정 제안 (선택)
);
// → { timestamp, totalIssues, byPriority: {...}, fixes: [...] }

console.log(formatFixReport(report));
```

**우선순위 레벨:**
- `critical`: 본문 컨테이너 변경 등 심각한 문제
- `high`: regex 실패, 선택자 누락 등
- `medium`: 속성 처리 실패 등
- `low`: 알 수 없는 문제 유형

---

## 새 스크래퍼 추가 가이드

### Step 1: 폴더 생성

```bash
mkdir -p .claude/skills/{channel}-scraper/scripts
```

### Step 2: config.js 작성

```javascript
// .claude/skills/{channel}-scraper/scripts/config.js

const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../../../..');

function extractSlug(url) {
  // URL에서 slug 추출 로직
  const match = url.match(/example\.com\/posts\/([^/?#]+)/);
  return match ? match[1] : null;
}

// 채널 전용 진단기 (선택)
const customDiagnosers = {
  CUSTOM_ELEMENT_ISSUE: (validationResult, json, html) => {
    // 커스텀 진단 로직
    return null; // 또는 { type: 'CUSTOM_ELEMENT_ISSUE', message: '...' }
  }
};

// 채널 전용 수정 제안 (선택)
const customFixRecommendations = {
  CUSTOM_ELEMENT_ISSUE: {
    description: '커스텀 요소 처리 실패',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: '해당 섹션',
      instruction: '수정 지침',
      priority: 'high'
    })
  }
};

module.exports = {
  channel: 'Example Channel',
  channelFolder: 'example-channel',
  projectRoot: PROJECT_ROOT,
  knownIssuesPath: path.join(__dirname, '..', 'known-issues.json'),
  extractSlug,
  validateItems: ['youtube', 'images', 'links'],
  scraperFile: 'scraper.js',
  extraTypeHandlers: {},
  customDiagnosers,
  customFixRecommendations
};
```

### Step 3: scraper.js 작성

```javascript
// .claude/skills/{channel}-scraper/scripts/scraper.js

const { chromium } = require('playwright');

async function scrape(url, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    let html = null;
    if (options.returnHtml) {
      html = await page.content();
    }

    const content = await page.evaluate(() => {
      const result = { title: '', date: '', content: [] };

      // 페이지별 스크래핑 로직 구현
      // ...

      return result;
    });

    return { json: content, html };
  } finally {
    await browser.close();
  }
}

module.exports = { scrape };
```

### Step 4: pipeline.js 작성

```javascript
// .claude/skills/{channel}-scraper/scripts/pipeline.js

const { createPipeline } = require('../../scraper-core/scripts/pipeline-runner');
const { scrape } = require('./scraper');
const config = require('./config');

const pipeline = createPipeline({
  channel: config.channel,
  channelFolder: config.channelFolder,
  extractSlug: config.extractSlug,
  scrape: scrape,
  validateItems: config.validateItems,
  extraTypeHandlers: config.extraTypeHandlers,
  customDiagnosers: config.customDiagnosers,
  customFixRecommendations: config.customFixRecommendations,
  scraperFile: config.scraperFile,
  knownIssuesPath: config.knownIssuesPath,
  projectRoot: config.projectRoot
});

if (require.main === module) {
  const args = process.argv.slice(2);
  const url = args.find(arg => arg.startsWith('http'));
  const force = args.includes('--force');

  if (!url) {
    console.error('Usage: node pipeline.js "<URL>" [--force]');
    process.exit(1);
  }

  pipeline(url, { force }).catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = { pipeline };
```

### Step 5: known-issues.json 초기화

```json
{
  "version": "1.0",
  "lastUpdated": "2025-01-02",
  "issues": []
}
```

### Step 6: SKILL.md 작성

스크래퍼 사용법, 워크플로우, 사이트 특이사항 등 문서화.

---

## 확장 포인트

### 1. 커스텀 타입 핸들러

`config.js`의 `extraTypeHandlers`로 json-to-markdown 변환 확장:

```javascript
extraTypeHandlers: {
  // 기존 핸들러 오버라이드
  table: (item) => {
    // 커스텀 테이블 변환
    return ['| Custom Table |', ''];
  },

  // 새 타입 추가
  tweet: (item) => {
    return [`[Tweet: ${item.tweetId}](https://twitter.com/i/status/${item.tweetId})`, ''];
  }
}
```

### 2. 커스텀 진단기

`config.js`의 `customDiagnosers`로 채널별 진단 추가:

```javascript
customDiagnosers: {
  LAZY_LOAD_IMAGE: (validationResult, json, html) => {
    if (!html) return null;

    const hasLazyImages = html.includes('loading="lazy"');
    const missingImages = validationResult.stats.images?.missing?.length || 0;

    if (hasLazyImages && missingImages > 0) {
      return {
        type: 'LAZY_LOAD_IMAGE',
        message: 'Lazy-load 이미지 처리 필요',
        count: missingImages
      };
    }
    return null;
  }
}
```

### 3. 커스텀 수정 제안

`config.js`의 `customFixRecommendations`로 수정 가이드 추가:

```javascript
customFixRecommendations: {
  LAZY_LOAD_IMAGE: {
    description: 'Lazy-load 이미지 처리',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: '이미지 추출 (img 선택자)',
      instruction: 'data-src 또는 data-lazy-src 속성 우선 확인',
      example: `const src = img.getAttribute('data-src') || img.getAttribute('src');`,
      priority: 'medium'
    })
  }
}
```

---

## 문제 해결

### 파이프라인 오류 발생 시

1. **스크래핑 실패**: 페이지 로딩 시간 조정 (`waitForTimeout`)
2. **선택자 실패**: 페이지 구조 확인 후 `scraper.js` 수정
3. **검증 실패**: 진단 결과 확인 후 스크래퍼 수정

### known-issues.json 활용

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

동일 문제 재발 시 자동으로 해결 방법 제시.
