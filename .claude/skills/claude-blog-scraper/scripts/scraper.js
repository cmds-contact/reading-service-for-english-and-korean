#!/usr/bin/env node
/**
 * Claude Blog Scraper
 * claude.com/blog 콘텐츠를 스크래핑하여 JSON으로 출력
 *
 * Usage: node scraper.js "<URL>"
 *
 * 출력:
 * - title: 기사 제목
 * - date: 발행일
 * - content: 순서대로 정렬된 콘텐츠 배열 [{type, ...}]
 *   - type: h1, h2, h3, h4, p, li, blockquote, image, figure, table, code, youtube
 */

const { chromium } = require('playwright');

/**
 * 스크래핑 실행 (HTML 반환 옵션 포함)
 * @param {string} url - 스크래핑할 URL
 * @param {Object} options
 * @param {boolean} options.returnHtml - true면 HTML도 함께 반환
 * @returns {Promise<{json: Object, html?: string}>}
 */
async function scrape(url, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

    // HTML 추출 (진단용)
    let html = null;
    if (options.returnHtml) {
      html = await page.content();
    }

    const content = await page.evaluate(() => {
      // HTML을 마크다운으로 변환 (링크, 볼드, 이탤릭 등)
      function htmlToMarkdown(el) {
        let result = '';
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            result += node.textContent;
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const innerText = htmlToMarkdown(node);

            if (tag === 'a') {
              const href = node.getAttribute('href');
              if (href && innerText) {
                result += `[${innerText}](${href})`;
              } else {
                result += innerText;
              }
            } else if (tag === 'strong' || tag === 'b') {
              result += `**${innerText}**`;
            } else if (tag === 'em' || tag === 'i') {
              result += `*${innerText}*`;
            } else if (tag === 'code') {
              result += `\`${innerText}\``;
            } else if (tag === 'br') {
              result += '\n';
            } else {
              result += innerText;
            }
          }
        });
        return result;
      }

      const result = {
        title: '',
        date: '',
        content: []
      };

      // 제목
      const h1 = document.querySelector('h1');
      if (h1) result.title = h1.textContent?.trim();

      // 날짜 패턴 탐색
      const datePattern = /(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/;
      const bodyText = document.body.innerText;
      const dateMatch = bodyText.match(datePattern);
      if (dateMatch) result.date = dateMatch[0];

      // 본문 영역 찾기
      let bodyEl = null;
      const richTextEls = document.querySelectorAll('[class*="rich-text"]');
      if (richTextEls.length > 0) {
        let maxChildren = 0;
        richTextEls.forEach(el => {
          const childCount = el.querySelectorAll('p, h2, h3, h4, li').length;
          if (childCount > maxChildren) {
            maxChildren = childCount;
            bodyEl = el;
          }
        });
      }

      if (!bodyEl || bodyEl.querySelectorAll('p, h2, h3').length < 3) {
        bodyEl = document.querySelector('article') || document.querySelector('main');
      }

      if (!bodyEl) return result;

      const excludeHeadings = ['Related articles', 'Related posts', 'Transform how your organization'];
      let skipSection = false;

      const elements = bodyEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote, figure, img, table, pre, iframe');
      const seenTexts = new Set();
      const seenImages = new Set();

      elements.forEach((el) => {
        const tag = el.tagName.toLowerCase();

        if (el.closest('nav') || el.closest('footer') || el.closest('[class*="newsletter"]') || el.closest('[class*="share"]')) {
          return;
        }

        if (tag.match(/^h[1-6]$/)) {
          const headingText = el.textContent?.trim() || '';
          if (excludeHeadings.some(ex => headingText.startsWith(ex))) {
            skipSection = true;
            return;
          }
          if (tag === 'h2' && !excludeHeadings.some(ex => headingText.startsWith(ex))) {
            skipSection = false;
          }
        }

        if (skipSection) return;

        if (tag.match(/^h[1-6]$/)) {
          const text = el.textContent?.trim();
          if (text && !seenTexts.has(text)) {
            seenTexts.add(text);
            result.content.push({ type: tag, text });
          }
        }
        else if (tag === 'p') {
          if (el.closest('pre') || el.closest('table') || el.closest('figure')) return;
          const plainText = el.textContent?.trim();
          if (plainText && plainText.length > 5 && !seenTexts.has(plainText)) {
            seenTexts.add(plainText);
            const text = htmlToMarkdown(el).trim();
            result.content.push({ type: 'p', text });
          }
        }
        else if (tag === 'li') {
          const plainText = el.textContent?.trim();
          if (plainText && !plainText.startsWith('Category') && !plainText.startsWith('Date') &&
              !plainText.startsWith('Reading time') && !plainText.startsWith('Share') &&
              !plainText.startsWith('Product') && plainText.length > 5) {
            if (!seenTexts.has(plainText)) {
              seenTexts.add(plainText);
              const text = htmlToMarkdown(el).trim();
              result.content.push({ type: 'li', text });
            }
          }
        }
        else if (tag === 'blockquote') {
          const plainText = el.textContent?.trim();
          if (plainText && !seenTexts.has(plainText)) {
            seenTexts.add(plainText);
            const text = htmlToMarkdown(el).trim();
            result.content.push({ type: 'blockquote', text });
          }
        }
        else if (tag === 'figure') {
          const img = el.querySelector('img');
          const caption = el.querySelector('figcaption')?.textContent?.trim();
          if (img) {
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            if (src && !src.includes('placeholder') && !src.includes('icon') && !seenImages.has(src)) {
              seenImages.add(src);
              result.content.push({
                type: 'figure',
                src,
                alt: img.getAttribute('alt') || '',
                caption: caption || ''
              });
            }
          }
        }
        else if (tag === 'img') {
          if (el.closest('figure')) return;
          const src = el.getAttribute('src') || el.getAttribute('data-src');
          const alt = el.getAttribute('alt') || '';
          if (src && !src.includes('placeholder') && !src.includes('icon') &&
              !src.includes('logo') && !src.includes('avatar') && !seenImages.has(src)) {
            seenImages.add(src);
            result.content.push({ type: 'image', src, alt });
          }
        }
        else if (tag === 'table') {
          const rows = [];
          el.querySelectorAll('tr').forEach(tr => {
            const cells = [];
            tr.querySelectorAll('th, td').forEach(cell => {
              cells.push(cell.textContent?.trim() || '');
            });
            if (cells.length > 0) rows.push(cells);
          });
          if (rows.length > 0) {
            result.content.push({ type: 'table', rows });
          }
        }
        else if (tag === 'pre') {
          const codeEl = el.querySelector('code');
          const code = (codeEl || el).textContent?.trim() || '';
          if (code) {
            let lang = '';
            if (codeEl) {
              const langClass = Array.from(codeEl.classList).find(c => c.startsWith('language-'));
              if (langClass) lang = langClass.replace('language-', '');
            }
            if (!lang) lang = el.getAttribute('data-language') || '';
            result.content.push({ type: 'code', lang, code });
          }
        }
        else if (tag === 'iframe') {
          const src = el.getAttribute('src') || '';
          if (src.includes('youtube.com') || src.includes('youtube-nocookie.com') || src.includes('youtu.be')) {
            const videoIdMatch = src.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (videoIdMatch) {
              result.content.push({ type: 'youtube', videoId: videoIdMatch[1], src });
            }
          }
          else if (src.includes('vimeo.com')) {
            const vimeoIdMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
            if (vimeoIdMatch) {
              result.content.push({ type: 'vimeo', videoId: vimeoIdMatch[1], src });
            }
          }
          else if (src) {
            result.content.push({ type: 'iframe', src });
          }
        }
      });

      return result;
    });

    return { json: content, html };

  } finally {
    await browser.close();
  }
}

// CLI 실행
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

module.exports = { scrape };
