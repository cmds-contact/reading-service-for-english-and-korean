---
name: claude-docs-scraper
description: |
  Claude Code 문서(code.claude.com/docs) 콘텐츠를 스크래핑하여 영어-한국어 병렬 읽기 서비스용 콘텐츠로 변환.
  사용 시점: (1) code.claude.com/docs URL이 제공될 때, (2) Claude Code 문서를 콘텐츠로 만들어달라는 요청 시,
  (3) "이 문서 스크래핑해줘" 같은 요청에 code.claude.com/docs URL이 포함될 때.
  Playwright로 전체 본문, 코드 블록을 추출하고 meta.yaml, en.md, ko.md 형식으로 생성.
---

# Claude Docs Scraper

code.claude.com/docs 콘텐츠를 reading-service 형식으로 변환.

> **참조**: [공통 콘텐츠 스키마](../CONTENT_SCHEMA.md) - 필수 형식 및 검증 규칙

## 워크플로우

### 권장: 자동화 파이프라인 (v2.0)

URL 하나로 콘텐츠 생성 + 자동 검증까지 완료:

```bash
node .claude/skills/claude-docs-scraper/scripts/pipeline.js "https://code.claude.com/docs/en/example-page"
```

**출력:**
```
contents/claude-docs/{slug}/
├── meta.yaml        # 자동 생성
├── en.md            # 자동 생성 + 검증 완료
└── .scraper-output.json  # 디버깅용 원본 JSON
```

**옵션:**
- `--force`: 기존 파일이 있어도 덮어쓰기 (기존 파일은 `.trash/`로 이동)

**자동 검증 항목:**
- 코드 블록: 각 코드 블록이 마크다운에 포함되었는지 확인
- 링크: 원본 text의 모든 링크 URL이 보존되었는지 확인

**검증 실패 시:**
```
╔═══════════════════════════════════════════════════════════╗
║                  검증 실패: 원문 누락 발견                   ║
╠═══════════════════════════════════════════════════════════╣
║ 코드 블록 누락 (1개)                                       ║
║   - "const x = 1;..."                                    ║
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
1. **진단 결과**: 에러 원인 분류 (코드 블록 선택자 문제, 링크 변환 실패 등)
2. **수정 제안**: 어떤 파일의 어느 부분을 어떻게 수정해야 하는지
3. **알려진 패턴**: `known-issues.json`에서 이미 해결된 패턴인지 확인

**파일 구조:**
```
.claude/skills/claude-docs-scraper/
├── SKILL.md
├── known-issues.json           # 학습된 문제 패턴 DB
└── scripts/
    ├── config.js               # 스크래퍼 설정 (Docs 전용 진단기 포함)
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
node .claude/skills/claude-docs-scraper/scripts/scraper.js "<URL>"
```

결과 JSON:
- `title`: 문서 제목
- `date`: 발행일 (없으면 빈 문자열)
- `content`: 순서대로 정렬된 콘텐츠 배열 [{type, ...}]
  - `{type: "h1"|"h2"|"h3"|"h4", text}`: 헤딩
  - `{type: "p", text}`: 문단 (인라인 마크다운 포함)
  - `{type: "li", text}`: 리스트 아이템 (인라인 마크다운 포함)
  - `{type: "blockquote", text}`: 인용구 (callouts 포함)
  - `{type: "code", lang, code}`: 코드 블록

**인라인 마크다운 자동 변환:**
- `<a href="url">text</a>` → `[text](url)`
- `<strong>`, `<b>` → `**bold**`
- `<em>`, `<i>` → `*italic*`
- `<code>` → `` `code` ``

> **⚠️ 중요: 스크래퍼 출력의 text 필드에 이미 마크다운 형식의 링크가 포함되어 있습니다.**
> **text 필드를 그대로 사용해야 합니다. 임의로 재작성하면 링크가 손실됩니다!**

#### 2. 콘텐츠 파일 생성

`contents/claude-docs/{slug}/` 폴더에 3개 파일:

**meta.yaml** (필수 형식 - 반드시 준수)
```yaml
id: {slug}
created: "{YYYY-MM-DD}"
channel: Claude Code Docs

source:
  url: {원본URL}
  published: "{YYYY-MM-DD}"

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
> - `channel: Claude Code Docs` 정확히 사용

> **❌ 잘못된 형식 (사용 금지)**
> ```yaml
> title: "제목"           # ← 루트에 title 금지
> slug: example          # ← slug 대신 id 사용
> ```

**en.md / ko.md**: 마크다운 본문

## 사이트 구조 특이사항

### URL 패턴
- 기본: `https://code.claude.com/docs/en/{slug}`
- 다국어: `/docs/en/`, `/docs/ko/` 등 지원

### 구조
- sidebar 네비게이션
- `<h1>`: 페이지 제목
- `<h2>`: 섹션 제목 (​ zero-width space 문자 포함 - 자동 제거)
- `<pre>/<code>`: 코드 블록 (shiki 하이라이터)

### 특수 컴포넌트
- callouts (note, warning, tip 등) → blockquote로 변환
- tabs (플랫폼별 코드 예시)
- 코드 복사 버튼 (무시)

## 코드 블록 처리

```markdown
\`\`\`{lang}
{code}
\`\`\`
```

언어 추출 우선순위:
1. `class="language-{lang}"`
2. `data-language="{lang}"`
3. shiki 하이라이터 속성

## 주의사항

### 절대 규칙

1. **스크래퍼 출력 그대로 사용**: `text` 필드를 임의로 재작성하지 마세요.

2. **링크 손실 금지**: 스크래퍼가 `[text](url)` 형식으로 추출한 링크를 반드시 유지하세요.

3. **Zero-width space 제거**: 헤딩의 `​` (U+200B) 문자는 자동 제거됨

### 기타 규칙

- 본문 전체 추출 (누락 금지)
- 코드 블록 언어 정보 보존
- 영문 먼저 작성 후 한국어 번역

---

## Troubleshooting Guide

검증 실패 시 파이프라인이 자동으로 진단 결과와 수정 제안을 출력합니다.
아래는 주요 문제 유형별 해결 방법입니다.

### 문제: 코드 블록 누락

**진단 코드:** `CODE_BLOCK_SELECTOR_MISS`, `CODE_LANG_MISS`

**확인 사항:**
1. `known-issues.json` 확인 → 이미 해결된 패턴인지
2. 출력된 `.page.html`에서 `<pre>` 요소 검색
3. 새로운 코드 블록 구조 또는 하이라이터 확인

**수정 위치:** `scrape-claude-docs.js` - 코드 블록 처리 부분
```javascript
// 선택자
tag === 'pre'
node.querySelector('code')

// 언어 추출
classAttr.match(/language-(\w+)/)
node.getAttribute('data-language')
```

### 문제: 링크 누락

**진단 코드:** `LINK_CONVERSION_FAIL`

**확인 사항:**
1. `htmlToMarkdown` 함수의 `<a>` 태그 처리
2. 중첩 링크 구조
3. `javascript:` href 제외 처리

**수정 위치:** `scrape-claude-docs.js` - htmlToMarkdown 함수

### 문제: 사이드바 콘텐츠 누출

**진단 코드:** `SIDEBAR_CONTENT_LEAK`

**확인 사항:**
1. 제외 요소 필터링 선택자
2. 새로운 사이드바/TOC 클래스명

**수정 위치:** `scrape-claude-docs.js` - 제외 요소 필터
```javascript
node.closest('nav') ||
node.closest('aside') ||
node.closest('[class*="sidebar"]') ||
node.closest('[class*="toc"]')
```

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
  "id": "new-highlighter",
  "type": "CODE_LANG_MISS",
  "pattern": "새로운 코드 하이라이터",
  "addedDate": "2026-01-02",
  "status": "resolved",
  "fix": {
    "file": "scrape-claude-docs.js",
    "action": "add_lang_pattern",
    "description": "새 하이라이터 언어 추출 패턴 추가"
  }
}
```
