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
└── stores/
    └── readerStore.ts        # Zustand 스토어

contents/                      # 마크다운 콘텐츠 파일
├── {slug}.md                  # 영어 원문
└── {slug}_kr.md               # 한글 번역
```

## Content Format

콘텐츠는 YAML frontmatter가 있는 마크다운 파일:

```markdown
---
title: Article Title
date: 2024-12-28
source: https://example.com
company: Company Name
category: Category
---

Content here...
```

## License

Private - Personal use only
