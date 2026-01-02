/**
 * Diagnosis Base - Scraper Core
 * 검증 실패 시 원인 분석 기본 로직
 */

/**
 * 페이지 HTML에서 iframe 추출
 * @param {string} html
 * @returns {Array}
 */
function extractIframes(html) {
  if (!html) return [];
  const iframes = [];
  const regex = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    iframes.push({ src: match[1], fullMatch: match[0] });
  }
  return iframes;
}

/**
 * 페이지 HTML에서 이미지 추출
 * @param {string} html
 * @returns {Array}
 */
function extractImages(html) {
  if (!html) return [];
  const images = [];
  const regex = /<img[^>]*(?:src|data-src)=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (!src.includes('icon') && !src.includes('logo') && !src.includes('avatar')) {
      images.push({ src, fullMatch: match[0] });
    }
  }
  return images;
}

/**
 * 페이지 HTML에서 링크 추출
 * @param {string} html
 * @returns {Array}
 */
function extractLinks(html) {
  if (!html) return [];
  const links = [];
  const regex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (!match[1].startsWith('javascript:') && !match[1].startsWith('#')) {
      links.push({ url: match[1], text: match[2], fullMatch: match[0] });
    }
  }
  return links;
}

/**
 * 페이지 HTML에서 코드 블록 추출
 * @param {string} html
 * @returns {Array}
 */
function extractCodeBlocks(html) {
  if (!html) return [];
  const blocks = [];
  const regex = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push({ content: match[1].substring(0, 100), fullMatch: match[0].substring(0, 200) });
  }
  return blocks;
}

/**
 * 기본 진단 로직
 * @param {Object} validationResult - validateContent 결과
 * @param {Object} originalJson - 원본 JSON
 * @param {string} pageHtml - 페이지 HTML
 * @param {Object} customDiagnosers - 추가 진단 로직 (타입별)
 * @returns {Array} 진단된 문제 목록
 */
function diagnose(validationResult, originalJson, pageHtml, customDiagnosers = {}) {
  const issues = [];
  const stats = validationResult.stats;

  // YouTube 진단
  if (stats.youtube?.missing?.length > 0) {
    const pageIframes = extractIframes(pageHtml);
    const youtubeIframes = pageIframes.filter(f => f.src.includes('youtube'));

    for (const missingId of stats.youtube.missing) {
      const inIframe = youtubeIframes.some(f => f.src.includes(missingId));

      if (inIframe) {
        issues.push({
          type: 'YOUTUBE_REGEX_MISS',
          videoId: missingId,
          message: `YouTube ID '${missingId}'가 페이지에 있지만 추출 실패`,
          iframeSrc: youtubeIframes.find(f => f.src.includes(missingId))?.src
        });
      } else {
        issues.push({
          type: 'YOUTUBE_NOT_IN_PAGE',
          videoId: missingId,
          message: `YouTube ID '${missingId}'가 페이지 HTML에 없음 (동적 로딩?)`
        });
      }
    }
  }

  // 이미지 진단
  if (stats.images?.missing?.length > 0) {
    const pageImages = extractImages(pageHtml);

    for (const missingSrc of stats.images.missing) {
      const inPage = pageImages.some(img => img.src === missingSrc);
      const hasDataSrc = pageHtml && pageHtml.includes(`data-src="${missingSrc}"`);

      if (inPage) {
        issues.push({
          type: 'IMAGE_SELECTOR_MISS',
          src: missingSrc,
          message: `이미지가 페이지에 있지만 추출 실패`
        });
      } else if (hasDataSrc) {
        issues.push({
          type: 'IMAGE_DATA_URL',
          src: missingSrc,
          message: `이미지가 data-src 속성으로 존재함`
        });
      } else {
        issues.push({
          type: 'IMAGE_SELECTOR_MISS',
          src: missingSrc,
          message: `이미지를 찾을 수 없음 (lazy-load?)`
        });
      }
    }
  }

  // 링크 진단
  if (stats.links?.missing?.length > 0) {
    const pageLinks = extractLinks(pageHtml);

    for (const missingUrl of stats.links.missing) {
      const inPage = pageLinks.some(link => link.url === missingUrl);

      issues.push({
        type: 'LINK_CONVERSION_FAIL',
        url: missingUrl,
        message: inPage
          ? `링크가 페이지에 있지만 변환 실패`
          : `링크를 페이지에서 찾을 수 없음`,
        pageLink: pageLinks.find(l => l.url === missingUrl)
      });
    }
  }

  // 코드 블록 진단
  if (stats.codeBlocks?.missing?.length > 0) {
    const pageCodeBlocks = extractCodeBlocks(pageHtml);

    for (const missingCode of stats.codeBlocks.missing) {
      const inPage = pageCodeBlocks.some(block =>
        block.content.includes(missingCode.substring(0, 30))
      );

      issues.push({
        type: 'CODE_BLOCK_SELECTOR_MISS',
        code: missingCode,
        message: inPage
          ? `코드 블록이 페이지에 있지만 추출 실패`
          : `코드 블록을 찾을 수 없음`
      });
    }
  }

  // 콘텐츠 컨테이너 변경 진단
  if (originalJson.content.length < 5 && pageHtml) {
    const pCount = (pageHtml.match(/<p[^>]*>/g) || []).length;
    const extractedP = originalJson.content.filter(c => c.type === 'p').length;

    if (pCount > 10 && extractedP < 3) {
      issues.push({
        type: 'CONTENT_CONTAINER_CHANGE',
        message: `페이지에 ${pCount}개의 <p>가 있지만 ${extractedP}개만 추출됨`,
        hasArticle: pageHtml.includes('<article'),
        hasMain: pageHtml.includes('<main')
      });
    }
  }

  // 커스텀 진단기 실행
  for (const [type, diagnoser] of Object.entries(customDiagnosers)) {
    const customIssues = diagnoser(validationResult, originalJson, pageHtml);
    if (customIssues) {
      issues.push(...(Array.isArray(customIssues) ? customIssues : [customIssues]));
    }
  }

  return issues;
}

/**
 * 진단 결과를 포맷팅
 * @param {Array} issues
 * @returns {string}
 */
function formatDiagnosis(issues) {
  if (issues.length === 0) {
    return '진단 결과: 특별한 문제 패턴 없음';
  }

  const lines = [];
  lines.push('');
  lines.push('╔═══════════════════════════════════════════════════════════════════╗');
  lines.push('║                         진단 결과                                  ║');
  lines.push('╠═══════════════════════════════════════════════════════════════════╣');

  for (const issue of issues) {
    lines.push(`║ [${issue.type}]`.padEnd(68) + '║');
    lines.push(`║   ${issue.message.substring(0, 62)}`.padEnd(68) + '║');
  }

  lines.push('╚═══════════════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}

module.exports = {
  diagnose,
  formatDiagnosis,
  extractIframes,
  extractImages,
  extractLinks,
  extractCodeBlocks
};
