#!/usr/bin/env node
/**
 * Google Blog Scraper
 * blog.google 콘텐츠를 스크래핑하여 JSON으로 출력
 *
 * Usage: node scraper.js "<URL>"
 *
 * Module Usage:
 *   const { scrape } = require('./scraper');
 *   const { json, html } = await scrape(url, { returnHtml: true });
 */

const { chromium } = require('playwright');

/**
 * HTML 텍스트를 마크다운으로 변환 (인라인 요소만)
 * @param {string} html - HTML 문자열
 * @returns {string} 마크다운 문자열
 */
function htmlToMarkdown(html) {
  if (!html) return '';

  let text = html;

  // 링크 변환: <a href="url">text</a> → [text](url)
  text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi, (match, url, linkText) => {
    // javascript: 링크 제외
    if (url.startsWith('javascript:')) return linkText;
    return `[${linkText.trim()}](${url})`;
  });

  // 볼드 변환
  text = text.replace(/<strong>([^<]*)<\/strong>/gi, '**$1**');
  text = text.replace(/<b>([^<]*)<\/b>/gi, '**$1**');

  // 이탤릭 변환
  text = text.replace(/<em>([^<]*)<\/em>/gi, '*$1*');
  text = text.replace(/<i>([^<]*)<\/i>/gi, '*$1*');

  // 인라인 코드 변환
  text = text.replace(/<code>([^<]*)<\/code>/gi, '`$1`');

  // 기타 태그 제거
  text = text.replace(/<[^>]+>/g, '');

  // HTML 엔티티 디코딩
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');

  return text.trim();
}

/**
 * Google Blog 스크래핑
 * @param {string} url - 스크래핑할 URL
 * @param {Object} options - 옵션
 * @param {boolean} options.returnHtml - 페이지 HTML 반환 여부 (디버깅용)
 * @returns {Promise<{json: Object, html: string|null}>}
 */
async function scrape(url, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    let html = null;
    if (options.returnHtml) {
      html = await page.content();
    }

    const content = await page.evaluate(() => {
      // htmlToMarkdown 함수를 브라우저 컨텍스트에 주입
      const htmlToMarkdown = (html) => {
        if (!html) return '';
        let text = html;
        text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi, (match, url, linkText) => {
          if (url.startsWith('javascript:')) return linkText;
          return '[' + linkText.trim() + '](' + url + ')';
        });
        text = text.replace(/<strong>([^<]*)<\/strong>/gi, '**$1**');
        text = text.replace(/<b>([^<]*)<\/b>/gi, '**$1**');
        text = text.replace(/<em>([^<]*)<\/em>/gi, '*$1*');
        text = text.replace(/<i>([^<]*)<\/i>/gi, '*$1*');
        text = text.replace(/<code>([^<]*)<\/code>/gi, '`$1`');
        text = text.replace(/<[^>]+>/g, '');
        text = text.replace(/&nbsp;/g, ' ');
        text = text.replace(/&amp;/g, '&');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&quot;/g, '"');
        return text.trim();
      };

      const result = {
        title: '',
        date: '',
        content: []
      };

      // 제목
      const h1 = document.querySelector('h1');
      if (h1) result.title = h1.textContent?.trim();

      // 날짜
      const dateText = document.body.innerText.match(/[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}/);
      if (dateText) result.date = dateText[0];

      // 본문 영역 찾기
      let bodyEl = document.querySelector('article') || document.querySelector('main');

      if (bodyEl) {
        const walker = document.createTreeWalker(
          bodyEl,
          NodeFilter.SHOW_ELEMENT,
          null,
          false
        );

        let node;
        const seenTexts = new Set();
        const seenImages = new Set();
        const seenVideos = new Set();

        while (node = walker.nextNode()) {
          const tag = node.tagName?.toLowerCase();

          // 제외할 요소들
          if (node.closest('nav') ||
              node.closest('footer') ||
              node.closest('[class*="related"]') ||
              node.closest('[class*="newsletter"]') ||
              node.closest('[class*="breadcrumb"]') ||
              node.closest('[class*="share"]')) {
            continue;
          }

          // 텍스트 요소 (innerHTML로 마크다운 변환)
          if (tag === 'p') {
            const innerHTML = node.innerHTML;
            const text = htmlToMarkdown(innerHTML);
            if (text && !seenTexts.has(text)) {
              seenTexts.add(text);
              result.content.push({ type: 'p', text });
            }
          } else if (tag && tag.match(/^h[1-6]$/)) {
            const text = node.textContent?.trim();
            if (text && !seenTexts.has(text)) {
              seenTexts.add(text);
              result.content.push({ type: tag, text });
            }
          } else if (tag === 'blockquote') {
            const innerHTML = node.innerHTML;
            const text = htmlToMarkdown(innerHTML);
            if (text && !seenTexts.has(text)) {
              seenTexts.add(text);
              result.content.push({ type: 'blockquote', text });
            }
          } else if (tag === 'li') {
            const innerHTML = node.innerHTML;
            const text = htmlToMarkdown(innerHTML);
            if (text && !seenTexts.has(text)) {
              seenTexts.add(text);
              result.content.push({ type: 'li', text });
            }
          }

          // 이미지
          if (tag === 'img') {
            let src = node.getAttribute('src') || node.getAttribute('data-src');
            const alt = node.getAttribute('alt') || '';

            if (src && !src.includes('icon') && !src.includes('logo') && !src.includes('avatar')) {
              // 썸네일 → 큰 이미지 변환
              if (src.includes('width-100')) {
                src = src.replace('width-100', 'width-1000');
              }

              // 중복 제거
              if (!seenImages.has(src)) {
                seenImages.add(src);

                // figcaption 확인
                const figure = node.closest('figure');
                const caption = figure?.querySelector('figcaption')?.textContent?.trim();

                if (caption) {
                  result.content.push({ type: 'figure', src, alt, caption });
                } else {
                  result.content.push({ type: 'image', src, alt });
                }
              }
            }
          }

          // YouTube 비디오 (커스텀 요소에서 추출)
          if (tag === 'uni-youtube-player-hero' || node.hasAttribute('video-id')) {
            const videoId = node.getAttribute('video-id');
            if (videoId && !seenVideos.has(videoId)) {
              seenVideos.add(videoId);
              result.content.push({
                type: 'youtube',
                videoId,
                src: `https://www.youtube.com/embed/${videoId}`
              });
            }
          }

          // iframe YouTube
          if (tag === 'iframe') {
            const src = node.getAttribute('src') || '';
            if (src.includes('youtube')) {
              const match = src.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              if (match && !seenVideos.has(match[1])) {
                seenVideos.add(match[1]);
                result.content.push({
                  type: 'youtube',
                  videoId: match[1],
                  src: src
                });
              }
            }
          }
        }
      }

      return result;
    });

    return { json: content, html };

  } finally {
    await browser.close();
  }
}

// CLI로 직접 실행 시
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node scraper.js "<URL>"');
    process.exit(1);
  }

  scrape(url)
    .then(({ json }) => {
      console.log(JSON.stringify(json, null, 2));
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { scrape, htmlToMarkdown };
