# 데이터 구조 설계 제안서

> **문서 버전:** v1.0
> **작성일:** 2024-12-31
> **상태:** 확정

---

## 결정사항 요약

| 항목 | 결정 |
|------|------|
| **채택 옵션** | Option A (폴더 기반 구조) |
| **지원 언어** | en, ko (향후 확장 가능) |
| **파일명 날짜** | 제거 (메타데이터에서 관리) |
| **Frontmatter** | 제안대로 진행, 필요시 수정 |

### 확정된 구조

```
contents/
├── compliance-framework-SB53/
│   ├── meta.yaml              # 공통 메타데이터
│   ├── en.md                  # 영어 원문
│   └── ko.md                  # 한국어 번역
│
├── claude-model-spec/
│   ├── meta.yaml
│   ├── en.md
│   └── ko.md
```

---

## 1. 현재 상태 분석

### 1.1 현재 파일 구조

```
contents/
├── 2025-12-20_compliance-framework-SB53.md      # 원문 (영어)
└── 2025-12-20_compliance-framework-SB53_kr.md   # 한국어 번역
```

### 1.2 현재 네이밍 규칙

- 원문: `{date}_{slug}.md`
- 번역: `{date}_{slug}_kr.md`

### 1.3 현재 Frontmatter

**원문:**
```yaml
title: "Sharing our compliance framework..."
date: 2025-12-20
source: https://...
company: Anthropic
category: Policy
```

**번역본:**
```yaml
title: "캘리포니아 프론티어 AI 투명성법..."
date: 2025-12-20
source: https://...
company: Anthropic
category: Policy
translated: true
original_title: "Sharing our compliance framework..."
```

### 1.4 현재 코드 로직

```typescript
// content.ts
- _kr.md로 끝나지 않는 파일을 원문으로 인식
- slug로 {slug}.md와 {slug}_kr.md 페어를 찾음
- 영어-한국어 하드코딩
```

### 1.5 현재 구조의 한계

| 문제 | 설명 |
|------|------|
| 언어 확장 불가 | `_kr` 하드코딩으로 일본어, 중국어 등 추가 어려움 |
| 노트 유형 한정 | 요약, 메모 등 다른 유형 지원 불가 |
| 관계 표현 한계 | 원문-번역 관계만 표현 가능 |
| 옵시디언 호환성 | 플랫 구조로 콘텐츠 많아지면 관리 어려움 |

---

## 2. 요구사항 정리

### 2.1 필수 요구사항

- [ ] **다국어 지원**: 영어, 한국어 + 일본어, 중국어 등 확장 가능
- [ ] **노트 유형 다양화**: 원문, 번역, 요약, 메모, 어휘집 등
- [ ] **옵시디언 호환**: 옵시디언에서 편하게 편집 가능한 구조
- [ ] **로컬 파일 기반**: Git 기반 버전 관리

### 2.2 선택 요구사항

- [ ] 시리즈/컬렉션 지원
- [ ] 태그 기반 분류
- [ ] 관련 콘텐츠 연결
- [ ] 읽기 진행률 저장 (미래)

---

## 3. 데이터 구조 안건

### Option A: 폴더 기반 구조 (권장)

```
contents/
├── compliance-framework-SB53/
│   ├── meta.yaml              # 공통 메타데이터
│   ├── en.md                  # 영어 원문
│   ├── ko.md                  # 한국어 번역
│   ├── ja.md                  # 일본어 번역 (선택)
│   └── summary.md             # 요약 노트 (선택)
│
├── claude-model-spec/
│   ├── meta.yaml
│   ├── en.md
│   ├── ko.md
│   └── vocab.md               # 어휘집 (선택)
```

**meta.yaml 구조:**
```yaml
# meta.yaml
id: compliance-framework-SB53
created: 2025-12-20
updated: 2025-12-31

# 원본 정보
source:
  url: https://www.anthropic.com/news/compliance-framework-SB53
  company: Anthropic
  published: 2025-12-20

# 분류
category: Policy
tags:
  - AI Safety
  - Regulation
  - California

# 사용 가능한 언어
languages:
  - code: en
    type: original
    title: "Sharing our compliance framework..."
  - code: ko
    type: translation
    title: "캘리포니아 프론티어 AI 투명성법..."
    translator: human  # human | ai | hybrid

# 추가 노트
notes:
  - type: summary
    file: summary.md
```

**개별 언어 파일 (en.md):**
```yaml
---
# 최소한의 frontmatter (대부분 meta.yaml에서 상속)
lang: en
---

# Sharing our compliance framework...

On January 1, California's Transparency...
```

#### 장점
- **명확한 구조**: 관련 파일들이 한 폴더에 모여있음
- **확장성**: 새 언어/노트 유형 추가가 파일 추가만으로 가능
- **옵시디언 친화적**: 폴더별로 콘텐츠 관리
- **메타데이터 중앙화**: `meta.yaml`에서 공통 정보 관리

#### 단점
- **파일 수 증가**: 콘텐츠당 최소 3개 파일 (meta + 2언어)
- **옵시디언 링크**: `[[폴더/파일]]` 형태로 길어짐
- **마이그레이션 필요**: 기존 구조 변환 작업 필요

#### 코드 변경 영향도
- `content.ts`: 전면 재작성 필요
- `types/content.ts`: Language 타입 확장
- 라우팅: 변경 없음 (`/read/[slug]`)

---

### Option B: 파일명 접미사 확장

```
contents/
├── compliance-framework-SB53.md           # 메타 + 영어 원문
├── compliance-framework-SB53.ko.md        # 한국어 번역
├── compliance-framework-SB53.ja.md        # 일본어 번역
├── compliance-framework-SB53.summary.md   # 요약
│
├── claude-model-spec.md
├── claude-model-spec.ko.md
└── claude-model-spec.vocab.md             # 어휘집
```

**원문 파일 Frontmatter:**
```yaml
---
title: "Sharing our compliance framework..."
date: 2025-12-20
source: https://...
company: Anthropic
category: Policy
tags:
  - AI Safety
  - Regulation

# 언어 설정
lang: en
type: original

# 사용 가능한 번역/노트 (자동 감지도 가능)
translations:
  - ko
  - ja
notes:
  - summary
---
```

**번역 파일 Frontmatter:**
```yaml
---
title: "캘리포니아 프론티어 AI 투명성법..."
lang: ko
type: translation
original: compliance-framework-SB53
translator: human
---
```

#### 장점
- **단순한 구조**: 폴더 없이 파일만으로 관리
- **마이그레이션 용이**: 기존 `_kr` → `.ko` 변환만 필요
- **옵시디언 친화적**: 플랫 구조, 간단한 링크
- **기존 코드 수정 최소화**: 파일명 파싱 로직만 변경

#### 단점
- **파일 수 증가시 복잡**: 콘텐츠 많아지면 관리 어려움
- **메타데이터 중복**: 각 파일에 일부 정보 반복
- **관계 표현 한계**: 복잡한 관계 표현 어려움

#### 코드 변경 영향도
- `content.ts`: 파일명 파싱 로직 수정
- `types/content.ts`: Language 타입 확장
- 라우팅: 변경 없음

---

### Option C: 하이브리드 (폴더 선택적 사용)

```
contents/
# 단순한 콘텐츠 (폴더 없이)
├── simple-article.md
├── simple-article.ko.md

# 복잡한 콘텐츠 (폴더 사용)
├── compliance-framework-SB53/
│   ├── index.md               # 영어 원문 + 메타
│   ├── ko.md
│   ├── ja.md
│   ├── summary.md
│   └── assets/               # 이미지 등
│       └── diagram.png
```

**파일명 규칙:**
- 폴더 외부: `{slug}.md`, `{slug}.{lang}.md`
- 폴더 내부: `index.md` (원문), `{lang}.md` (번역)

#### 장점
- **유연성**: 콘텐츠 복잡도에 따라 구조 선택
- **점진적 마이그레이션**: 기존 파일 유지하며 새 콘텐츠만 폴더화
- **에셋 관리**: 폴더 내 이미지 등 관리 용이

#### 단점
- **일관성 부족**: 두 가지 패턴 혼재
- **코드 복잡도**: 두 패턴 모두 처리해야 함
- **혼란 가능성**: 어떤 구조를 쓸지 결정 필요

---

### Option D: 단일 파일 멀티 섹션

```
contents/
└── compliance-framework-SB53.md
```

**파일 내용:**
```yaml
---
title: "Sharing our compliance framework..."
date: 2025-12-20
source: https://...
languages:
  en:
    title: "Sharing our compliance framework..."
  ko:
    title: "캘리포니아 프론티어 AI 투명성법..."
---

<!-- lang: en -->
# Sharing our compliance framework...

On January 1, California's Transparency...

<!-- lang: ko -->
# 캘리포니아 프론티어 AI 투명성법 준수 프레임워크 공개

1월 1일, 캘리포니아의 프론티어 AI 투명성법...

<!-- note: summary -->
## 요약

핵심 포인트:
1. SB 53 법안 시행
2. FCF 프레임워크 공개
3. 연방 표준 필요성
```

#### 장점
- **단일 파일**: 모든 내용이 한 파일에
- **비교 용이**: 원문-번역 나란히 편집 가능
- **옵시디언 최적**: 하나의 노트로 관리

#### 단점
- **파일 크기**: 언어 많으면 매우 길어짐
- **파싱 복잡**: 커스텀 구분자 파싱 필요
- **Git diff**: 변경사항 추적 어려움
- **부분 편집**: 특정 언어만 수정하기 번거로움

---

## 4. 비교 분석

### 4.1 요구사항 충족도

| 요구사항 | Option A (폴더) | Option B (접미사) | Option C (하이브리드) | Option D (단일) |
|----------|:---------------:|:-----------------:|:--------------------:|:---------------:|
| 다국어 지원 | ★★★ | ★★★ | ★★★ | ★★☆ |
| 노트 유형 다양화 | ★★★ | ★★☆ | ★★★ | ★★☆ |
| 옵시디언 호환 | ★★☆ | ★★★ | ★★☆ | ★★★ |
| 확장성 | ★★★ | ★★☆ | ★★★ | ★☆☆ |
| 마이그레이션 용이성 | ★☆☆ | ★★★ | ★★☆ | ★☆☆ |
| 코드 변경 최소화 | ★☆☆ | ★★☆ | ★☆☆ | ★☆☆ |

### 4.2 사용 시나리오별 적합도

| 시나리오 | 최적 옵션 |
|----------|-----------|
| 2-3개 언어, 간단한 구조 | **Option B** |
| 5+ 언어, 요약/어휘집 등 다양한 노트 | **Option A** |
| 점진적 확장 필요 | **Option C** |
| 옵시디언 단일 노트 선호 | **Option D** |

### 4.3 옵시디언 워크플로우 고려

**현재 워크플로우 추정:**
1. 옵시디언에서 마크다운 편집
2. Git으로 버전 관리
3. Next.js로 빌드/렌더링

**옵시디언 플러그인 호환성:**
- Templater: 모든 옵션 호환
- Dataview: Option A (meta.yaml) 가장 적합
- Obsidian Git: 모든 옵션 호환
- 링크 자동완성: Option B, D 유리

---

## 5. 확정안: Option A (폴더 기반 구조)

### 5.1 폴더 구조

```
contents/
├── {slug}/
│   ├── meta.yaml    # 공통 메타데이터
│   ├── en.md        # 영어 원문
│   └── ko.md        # 한국어 번역
```

### 5.2 meta.yaml 스키마

```yaml
# === 필수 필드 ===
id: string              # slug와 동일, 폴더명
created: YYYY-MM-DD     # 생성일
updated: YYYY-MM-DD     # 수정일

# === 원본 정보 ===
source:
  url: string           # 원문 URL
  company: string       # 출처 회사/기관
  published: YYYY-MM-DD # 원문 발행일

# === 분류 ===
category: string        # 카테고리
tags:                   # 태그 목록
  - string

# === 언어별 정보 ===
languages:
  en:
    title: string       # 영어 제목
    type: original      # original | translation
  ko:
    title: string       # 한국어 제목
    type: translation
    translator: string  # human | ai | hybrid
```

### 5.3 언어 파일 (en.md, ko.md)

```markdown
# 제목

본문 내용...
```

- frontmatter 없음 (meta.yaml에서 모든 메타데이터 관리)
- 순수 마크다운 콘텐츠만 포함

### 5.4 마이그레이션

```bash
# 현재
contents/
├── 2025-12-20_compliance-framework-SB53.md
└── 2025-12-20_compliance-framework-SB53_kr.md

# 변환 후
contents/
├── compliance-framework-SB53/
│   ├── meta.yaml
│   ├── en.md
│   └── ko.md
```

---

## 6. 구현 계획

### 6.1 결정사항 (완료)

- [x] Option A (폴더 기반 구조) 채택
- [x] frontmatter 필드 확정 (5.2 참조)
- [x] 지원 언어: en, ko (향후 확장 가능)
- [x] 파일명에서 날짜 제거 (meta.yaml에서 관리)

### 6.2 구현 작업

| 단계 | 작업 | 파일 |
|------|------|------|
| 1 | 타입 정의 업데이트 | `types/content.ts` |
| 2 | YAML 파서 추가 | `lib/yaml.ts` (신규) |
| 3 | 콘텐츠 로더 재작성 | `lib/content.ts` |
| 4 | 기존 콘텐츠 마이그레이션 | `contents/` |
| 5 | 빌드 테스트 | - |

### 6.3 타입 정의 (types/content.ts)

```typescript
// 언어 코드
export type LangCode = 'en' | 'ko'

// 메타데이터 (meta.yaml)
export interface ContentMeta {
  id: string
  created: string
  updated: string
  source: {
    url: string
    company: string
    published: string
  }
  category?: string
  tags?: string[]
  languages: {
    [key in LangCode]?: {
      title: string
      type: 'original' | 'translation'
      translator?: 'human' | 'ai' | 'hybrid'
    }
  }
}

// 파싱된 콘텐츠
export interface ParsedContent {
  meta: ContentMeta
  paragraphs: ParsedParagraph[]
}

// 콘텐츠 페어
export interface ContentPair {
  slug: string
  meta: ContentMeta
  en: ParsedContent
  ko: ParsedContent
}
```

---

## 7. 부록

### A. ISO 639-1 언어 코드

| 코드 | 언어 |
|------|------|
| en | English |
| ko | 한국어 |
| ja | 日本語 |
| zh | 中文 |
| es | Español |
| fr | Français |
| de | Deutsch |

### B. 노트 유형 정의

| 타입 | 설명 | 용도 |
|------|------|------|
| original | 원문 | 영어 등 원본 콘텐츠 |
| translation | 번역 | 다른 언어로 번역된 콘텐츠 |
| summary | 요약 | 핵심 내용 요약 |
| vocab | 어휘집 | 용어 정리 |
| note | 메모 | 개인적인 메모/주석 |

### C. 참고 자료

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Obsidian Properties](https://help.obsidian.md/Editing+and+formatting/Properties)
- [YAML Frontmatter Spec](https://jekyllrb.com/docs/front-matter/)
