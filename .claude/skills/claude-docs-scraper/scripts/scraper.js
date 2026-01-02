#!/usr/bin/env node
/**
 * Claude Docs Scraper
 * code.claude.com/docs 콘텐츠를 스크래핑하여 JSON으로 출력
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

  // Zero-width space 제거
  text = text.replace(/\u200B/g, '');

  return text.trim();
}

/**
 * Claude Docs 스크래핑
 * @param {string} url - 스크래핑할 URL
 * @param {Object} options - 옵션
 * @param {boolean} options.returnHtml - 페이지 HTML 반환 여부 (디버깅용)
 * @returns {Promise<{json: Object, html: string|null}>}
 */
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
        text = text.replace(/\u200B/g, '');
        return text.trim();
      };

      const cleanText = (text) => text?.replace(/\u200B/g, '').trim() || '';

      const result = {
        title: '',
        date: '', // docs는 날짜가 없을 수 있음
        content: []
      };

      // 제목
      const h1 = document.querySelector('h1');
      if (h1) result.title = cleanText(h1.textContent);

      // 본문 영역 찾기
      let bodyEl = document.querySelector('article') || document.querySelector('main') || document.body;

      if (bodyEl) {
        const walker = document.createTreeWalker(
          bodyEl,
          NodeFilter.SHOW_ELEMENT,
          null,
          false
        );

        let node;
        const seenTexts = new Set();
        const seenCodeBlocks = new Set();

        while (node = walker.nextNode()) {
          const tag = node.tagName?.toLowerCase();

          // 제외할 요소들 (네비게이션, 사이드바 등)
          if (node.closest('nav') ||
              node.closest('aside') ||
              node.closest('[class*="sidebar"]') ||
              node.closest('[class*="toc"]') ||
              node.closest('footer')) {
            continue;
          }

          // 코드 블록 (우선 처리)
          if (tag === 'pre') {
            const codeEl = node.querySelector('code');
            const codeText = cleanText(codeEl?.textContent || node.textContent);

            if (codeText && !seenCodeBlocks.has(codeText)) {
              seenCodeBlocks.add(codeText);

              // 언어 추출 시도
              let lang = '';
              const classAttr = codeEl?.getAttribute('class') || node.getAttribute('class') || '';
              const langMatch = classAttr.match(/language-(\w+)/);
              if (langMatch) {
                lang = langMatch[1];
              } else if (classAttr.includes('shiki')) {
                const dataLang = node.getAttribute('data-language') || codeEl?.getAttribute('data-language');
                if (dataLang) lang = dataLang;
              }

              result.content.push({ type: 'code', lang, code: codeText });
            }
            continue;
          }

          // 헤딩
          if (tag && tag.match(/^h[1-6]$/)) {
            const text = cleanText(node.textContent);
            if (text && !seenTexts.has(text)) {
              seenTexts.add(text);
              result.content.push({ type: tag, text });
            }
          }
          // 문단
          else if (tag === 'p') {
            // 코드 블록 내부의 p는 제외
            if (!node.closest('pre')) {
              const innerHTML = node.innerHTML;
              const text = htmlToMarkdown(innerHTML);
              if (text && !seenTexts.has(text)) {
                seenTexts.add(text);
                result.content.push({ type: 'p', text });
              }
            }
          }
          // 리스트 아이템
          else if (tag === 'li') {
            const innerHTML = node.innerHTML;
            const text = htmlToMarkdown(innerHTML);
            if (text && !seenTexts.has(text)) {
              seenTexts.add(text);
              result.content.push({ type: 'li', text });
            }
          }
          // 블록쿼트 (callouts 등)
          else if (tag === 'blockquote' || node.matches('[class*="callout"]') || node.matches('[class*="note"]')) {
            const innerHTML = node.innerHTML;
            const text = htmlToMarkdown(innerHTML);
            if (text && !seenTexts.has(text)) {
              seenTexts.add(text);
              result.content.push({ type: 'blockquote', text });
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
