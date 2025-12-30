# Roadmap

## Current Status: v0.1.1 (2024-12-30)

### Completed
- [x] 병렬 리더 UI
- [x] 레이아웃 모드 (좌우/상하/토글)
- [x] 다크모드
- [x] 문단 하이라이트 동기화
- [x] 불렛포인트/번호 리스트 표시 수정

### In Progress
- [ ] 문단 분할 로직 개선 (패턴 기반 자동 분할)

---

## Next: 데이터 구조 설계 (v0.2.0)

### 요구사항
- **로컬 저장**: 옵시디언에서 콘텐츠 편집 → 로컬 파일 시스템 기반
- **다국어 지원**: 한국어 외 다른 언어 번역본도 추가 가능
- **노트 유형**: 원문, 번역본, Summary 노트 등 다양한 유형 지원

### 제안: 폴더/파일 구조

```
contents/
├── {article-slug}/
│   ├── meta.yaml           # 메타데이터 (title, date, source, tags)
│   ├── original.md         # 원문 (영어 등)
│   ├── ko.md               # 한국어 번역
│   ├── ja.md               # 일본어 번역 (선택)
│   ├── zh.md               # 중국어 번역 (선택)
│   └── summary.md          # 요약 노트 (선택)
```

또는 현재 방식 확장:
```
contents/
├── {slug}.md               # 원문
├── {slug}_ko.md            # 한국어 번역
├── {slug}_ja.md            # 일본어 번역
├── {slug}_summary.md       # 요약 노트
```

### 검토 필요
- [ ] 옵시디언 폴더 구조와의 호환성
- [ ] frontmatter에 언어/유형 명시 방식
- [ ] 다국어 UI 지원 (리더에서 언어 선택)

---

## 배포 방식 설계 (v0.3.0)

### 현재 워크플로우
1. 옵시디언에서 마크다운 편집
2. Git commit & push
3. (미정) 자동 빌드 & 배포

### 제안: 배포 옵션

**옵션 A: Vercel + GitHub 자동 배포**
- GitHub push → Vercel 자동 빌드/배포
- 장점: 무료, 자동화, 빠름
- 단점: 콘텐츠가 GitHub에 공개됨 (private repo 필요시 유료)

**옵션 B: 로컬 빌드 후 수동 배포**
- `npm run build && npm run export`
- 정적 파일을 원하는 호스팅에 업로드
- 장점: 콘텐츠 비공개 유지
- 단점: 수동 작업 필요

**옵션 C: Obsidian Git Plugin + GitHub Actions**
- 옵시디언에서 저장 시 자동 Git sync
- GitHub Actions로 빌드/배포 자동화
- 장점: 옵시디언에서 모든 작업 완료
- 단점: 초기 설정 복잡

### 검토 필요
- [ ] 콘텐츠 공개/비공개 여부
- [ ] 배포 주기 (실시간 vs 수동)
- [ ] 호스팅 선택 (Vercel, Netlify, Cloudflare Pages 등)

---

## Future Ideas (검토 중)

- 관리자 인증 (필요시)
- 태그/카테고리 필터링
- 검색 기능
- 읽은 글 표시
- 즐겨찾기
- URL에서 콘텐츠 가져오기
- 번역 API 연동

---

## Technical Decisions Log

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2024-12-28 | Next.js 14 + Tailwind | SSG 지원, 빠른 개발 |
| 2024-12-28 | Zustand | 가벼운 상태 관리 |
| 2024-12-30 | 로컬 파일 기반 콘텐츠 | 옵시디언 편집 워크플로우 |
