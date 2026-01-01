# English-Korean Parallel Reading Service

영어 원문과 한글 번역을 나란히 볼 수 있는 병렬 리딩 서비스

## Features

- **3가지 레이아웃 모드**: 좌우 분할, 상하 분할, 토글
- **다크모드**: 시스템 설정 자동 감지
- **문단 하이라이트**: 클릭 시 해당 문단 강조
- **반응형 디자인**: 모든 화면 크기에서 레이아웃 유지

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- next-themes (다크모드)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # 글 목록
│   └── read/[slug]/page.tsx  # 리더 페이지
├── components/
│   ├── layout/               # Header, ThemeToggle
│   └── reader/               # ParallelReader, ContentPane, etc.
├── lib/
│   ├── content.ts            # 콘텐츠 로딩
│   └── markdown.ts           # 마크다운 파싱
├── stores/
│   └── readerStore.ts        # Zustand 스토어
└── types/
    └── content.ts            # 타입 정의

contents/                      # 콘텐츠 폴더
├── {slug}/
│   ├── meta.yaml             # 메타데이터
│   ├── en.md                 # 영어 원문
│   └── ko.md                 # 한국어 번역

docs/                          # 프로젝트 문서
└── DATA_STRUCTURE_PROPOSAL.md
```

## Content Format

### 폴더 구조

각 콘텐츠는 `contents/{slug}/` 폴더에 3개 파일로 구성:

```
contents/my-article/
├── meta.yaml    # 메타데이터
├── en.md        # 영어 원문
└── ko.md        # 한국어 번역
```

### meta.yaml

```yaml
id: my-article
created: 2024-12-31
updated: 2024-12-31

source:
  url: https://example.com/article
  company: Company Name
  published: 2024-12-31

category: Category
tags:
  - tag1
  - tag2

languages:
  en:
    title: "English Title"
    type: original
  ko:
    title: "한국어 제목"
    type: translation
    translator: human  # human | ai | hybrid
```

### en.md / ko.md

순수 마크다운 (frontmatter 없음):

```markdown
# Article Title

Content goes here...
```

## Documentation

- [CHANGELOG.md](./CHANGELOG.md) - 버전별 변경사항
- [ROADMAP.md](./ROADMAP.md) - 개발 로드맵
- [docs/DATA_STRUCTURE_PROPOSAL.md](./docs/DATA_STRUCTURE_PROPOSAL.md) - 데이터 구조 설계

## License

Private - Personal use only
