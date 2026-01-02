# 미디어 지원 (v0.3.0)

이미지, YouTube 비디오 임베딩, 이미지 갤러리 지원 추가.

## 변경 사항

### 1. CSS 스타일 (`src/app/globals.css`)

#### 이미지 스타일
```css
.prose img {
  @apply rounded-lg shadow-md max-w-full h-auto my-4 mx-auto;
}

.prose figcaption,
.prose img + em,
.prose p > em:only-child {
  @apply block text-sm text-center text-slate-500 dark:text-slate-400 mt-2 italic;
}
```

#### 이미지 갤러리 (가로 스크롤)
```css
.prose .image-gallery {
  @apply flex gap-4 overflow-x-auto snap-x snap-mandatory my-6 pb-4 -mx-4 px-4;
}

.prose .image-gallery figure {
  @apply flex-shrink-0 snap-center m-0;
  width: 80%;
  max-width: 400px;
}
```

#### YouTube iframe
```css
.prose iframe {
  @apply w-full aspect-video rounded-lg my-4;
}
```

### 2. 타입 확장 (`src/types/content.ts`)

```typescript
type: 'heading' | 'paragraph' | 'list' | 'blockquote' | 'image' | 'video'
```

### 3. 마크다운 파서 (`src/lib/markdown.ts`)

#### 새로운 타입 감지
```typescript
// 이미지: ![...](...)
if (/^!\[.*\]\(.*\)/.test(trimmed)) return 'image'

// 비디오: <iframe...youtube/vimeo...> 또는 ::youtube[...]
if (/<iframe[^>]*(youtube|vimeo)[^>]*>/i.test(trimmed)) return 'video'
if (/^::youtube\[/.test(trimmed)) return 'video'
```

#### YouTube 커스텀 구문
```typescript
// ::youtube[VIDEO_ID] → iframe 변환
export function transformYouTubeEmbed(markdown: string): string {
  return markdown.replace(
    /::youtube\[([^\]]+)\]/g,
    (_, videoId) => `<iframe src="https://www.youtube.com/embed/${videoId}" ...></iframe>`
  )
}
```

## 마크다운 사용법

### 단일 이미지
```markdown
![대체 텍스트](https://example.com/image.jpg)

*이미지 캡션 (이탤릭)*
```

### 이미지 갤러리 (3개 이상 연속)
```html
<div class="image-gallery">
  <figure>
    <img src="..." alt="...">
    <figcaption>캡션</figcaption>
  </figure>
  <figure>
    <img src="..." alt="...">
    <figcaption>캡션</figcaption>
  </figure>
  <figure>
    <img src="..." alt="...">
    <figcaption>캡션</figcaption>
  </figure>
</div>
```

### YouTube 임베딩

**방법 1: HTML 직접**
```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*비디오 설명*
```

**방법 2: 커스텀 구문**
```markdown
::youtube[VIDEO_ID]
```

## 외부 이미지 URL 규칙

Google 블로그 이미지 크기 변환:
- `width-100` → 100px (썸네일, 사용 금지)
- `width-1000` → 1000px (권장)
- `max-1600x1600` → 최대 1600px (일부만 지원)

403 에러 발생 시 다른 크기 시도.
