# Changelog

## [0.4.0] - 2025-01-02

### Added

#### scraper-core 아키텍처
- `scraper-core` 공통 모듈 도입 (모든 스크래퍼가 공유)
  - `file-utils.js`: 파일 저장/백업 (`.trash/` 이동)
  - `meta-utils.js`: meta.yaml 생성
  - `json-to-markdown.js`: JSON → Markdown 변환 (확장 가능)
  - `validate-base.js`: 콘텐츠 검증 (YouTube, 이미지, 링크, 코드 블록, 테이블)
  - `diagnose-base.js`: 문제 진단 (원인 분류)
  - `fix-base.js`: 수정 제안 생성
  - `pipeline-runner.js`: `createPipeline()` 팩토리 함수

#### Self-Improving Agent 패턴
- 검증 실패 시 자동 진단 및 수정 제안 출력
- `known-issues.json`으로 문제 패턴 학습/재발 방지
- 각 스크래퍼에 커스텀 진단기/수정 제안 확장 가능

### Changed

#### 스크래퍼 리팩토링
- 3개 스크래퍼를 scraper-core 기반으로 리팩토링
  - `claude-blog-scraper`: 7개 파일 → 3개 파일
  - `google-blog-scraper`: 7개 파일 → 3개 파일
  - `claude-docs-scraper`: 7개 파일 → 3개 파일
- 각 스크래퍼 구조 통일: `config.js`, `scraper.js`, `pipeline.js`
- 코드 중복 ~77% 감소 (4,768 라인 → ~1,100 라인)

### Documentation
- `docs/WEB_SCRAPING.md` 전면 업데이트
- `scraper-core/SKILL.md` 상세 API 문서화
- 각 스크래퍼 `SKILL.md` 파일 구조 반영

---

## [0.3.0] - 2025-01-02

### Added

#### 미디어 지원
- 이미지 스타일링 (라운드 코너, 그림자, 중앙 정렬)
- 이미지 캡션 지원 (이탤릭 텍스트)
- 이미지 갤러리 UI (가로 스크롤, snap)
- YouTube iframe 임베딩 (16:9 반응형)
- `::youtube[VIDEO_ID]` 커스텀 구문
- `ParsedParagraph.type`에 `'image'`, `'video'` 추가

#### 웹 스크래핑
- Playwright 기반 Google 블로그 스크래퍼 (`scripts/scrape-article.js`)
- 이미지 썸네일 → 큰 버전 자동 변환
- YouTube 비디오 ID 추출
- `google-blog-scraper` Claude 스킬

#### 새 콘텐츠
- `meta-prompting-veo`: Google 블로그 "메타 프롬프팅" 글
  - YouTube 비디오 3개
  - 이미지 4개 (갤러리 포함)
  - 영문/한국어 완전 번역

### Changed
- `globals.css`: 미디어 스타일 추가
- `content.ts`: 타입 확장
- `markdown.ts`: 이미지/비디오 감지, YouTube 변환 함수

### Dependencies
- `playwright` 추가 (dev)

---

## [0.2.0] - 2025-01-01

### Added
- 폴더 기반 콘텐츠 구조 (`contents/{slug}/meta.yaml, en.md, ko.md`)
- 콘텐츠 마이그레이션 스크립트

---

## [0.1.0] - 2024-12-31

### Added
- 초기 프로젝트 설정
- 영어-한국어 병렬 읽기 UI
- 3가지 레이아웃 모드 (side-by-side, top-bottom, toggle)
- 다크 모드
- 채널별 필터링
