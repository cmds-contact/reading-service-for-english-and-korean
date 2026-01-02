const { chromium } = require('playwright');

async function scrapeArticle(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // 페이지 로딩 대기
    await page.waitForTimeout(2000);

    // 전체 페이지 HTML과 텍스트 추출
    const content = await page.evaluate(() => {
      const result = {
        title: '',
        subtitle: '',
        author: '',
        date: '',
        bodyText: '',
        bodyHtml: '',
        images: [],
        videos: [],
        iframes: []
      };

      // 제목
      const h1 = document.querySelector('h1');
      if (h1) result.title = h1.textContent?.trim();

      // 날짜 - 다양한 위치에서 찾기
      const timeEl = document.querySelector('time');
      if (timeEl) {
        result.date = timeEl.getAttribute('datetime') || timeEl.textContent?.trim();
      }

      // 본문 영역 찾기 - Google 블로그 구조
      let bodyEl = document.querySelector('article');
      if (!bodyEl) bodyEl = document.querySelector('[class*="article-body"]');
      if (!bodyEl) bodyEl = document.querySelector('[class*="post-content"]');
      if (!bodyEl) bodyEl = document.querySelector('[class*="entry-content"]');
      if (!bodyEl) bodyEl = document.querySelector('main');

      if (bodyEl) {
        // 모든 텍스트 노드와 구조 수집
        const walker = document.createTreeWalker(
          bodyEl,
          NodeFilter.SHOW_ELEMENT,
          null,
          false
        );

        let node;
        const textParts = [];

        while (node = walker.nextNode()) {
          const tag = node.tagName?.toLowerCase();
          const text = node.textContent?.trim();

          // 제외할 요소들
          if (node.closest('nav') || node.closest('footer') || node.closest('[class*="related"]') || node.closest('[class*="newsletter"]')) {
            continue;
          }

          if (tag === 'p' && text) {
            textParts.push({ type: 'p', text });
          } else if (tag && tag.match(/^h[1-6]$/) && text) {
            textParts.push({ type: tag, text });
          } else if (tag === 'blockquote' && text) {
            textParts.push({ type: 'blockquote', text });
          } else if (tag === 'li' && text) {
            textParts.push({ type: 'li', text });
          } else if (tag === 'img') {
            let src = node.getAttribute('src') || node.getAttribute('data-src');
            if (src && !src.includes('icon') && !src.includes('logo')) {
              // 작은 썸네일 이미지를 큰 버전으로 변환
              if (src.includes('width-100')) {
                src = src.replace('width-100', 'width-1000');
              }
              result.images.push({
                src,
                alt: node.getAttribute('alt') || ''
              });
            }
          } else if (tag === 'iframe') {
            const src = node.getAttribute('src') || '';
            result.iframes.push({ src });
            if (src.includes('youtube')) {
              const match = src.match(/embed\/([^?\/]+)/);
              if (match) {
                result.videos.push({ type: 'youtube', id: match[1] });
              }
            }
          } else if (tag === 'video') {
            const src = node.getAttribute('src') || node.querySelector('source')?.getAttribute('src');
            if (src) {
              result.videos.push({ type: 'video', src });
            }
          }
        }

        result.bodyText = textParts;
        result.bodyHtml = bodyEl.innerHTML;
      }

      // innerText로 전체 텍스트도 가져오기
      if (bodyEl) {
        result.fullInnerText = bodyEl.innerText;
      }

      return result;
    });

    // 결과 출력
    console.log(JSON.stringify(content, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'https://blog.google/products/gemini/meta-prompting-veo-gemini-tips/';
scrapeArticle(url);
