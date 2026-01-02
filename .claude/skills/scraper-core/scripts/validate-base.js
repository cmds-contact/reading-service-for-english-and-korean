/**
 * Validation Base - Scraper Core
 * 원본 JSON과 생성된 마크다운 비교 검증 기본 로직
 */

/**
 * 마크다운에서 링크 URL 추출
 * @param {string} text
 * @returns {string[]} URL 배열
 */
function extractLinkUrls(text) {
  const regex = /\[([^\]]*)\]\(([^)]+)\)/g;
  const urls = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    urls.push(match[2]);
  }
  return urls;
}

/**
 * 검증 항목별 검증기
 */
const VALIDATORS = {
  youtube: (json, markdown, stats) => {
    const items = json.content.filter(c => c.type === 'youtube');
    stats.youtube = { original: items.length, found: 0, missing: [] };

    for (const item of items) {
      if (item.videoId && markdown.includes(item.videoId)) {
        stats.youtube.found++;
      } else {
        stats.youtube.missing.push(item.videoId || item.src);
      }
    }

    if (stats.youtube.missing.length > 0) {
      return {
        error: `YouTube 비디오 누락 (${stats.youtube.missing.length}개)`,
        details: stats.youtube.missing.map(id => `  - videoId: ${id}`)
      };
    }
    return null;
  },

  images: (json, markdown, stats) => {
    const items = json.content.filter(c => c.type === 'image' || c.type === 'figure');
    stats.images = { original: items.length, found: 0, missing: [] };

    for (const item of items) {
      if (item.src && markdown.includes(item.src)) {
        stats.images.found++;
      } else {
        stats.images.missing.push(item.src);
      }
    }

    if (stats.images.missing.length > 0) {
      return {
        error: `이미지 누락 (${stats.images.missing.length}개)`,
        details: stats.images.missing.map(src => {
          const shortSrc = src.length > 60 ? src.substring(0, 60) + '...' : src;
          return `  - ${shortSrc}`;
        })
      };
    }
    return null;
  },

  links: (json, markdown, stats) => {
    const originalLinks = new Set();
    for (const item of json.content) {
      if (item.text) {
        extractLinkUrls(item.text).forEach(url => originalLinks.add(url));
      }
    }

    stats.links = { original: originalLinks.size, found: 0, missing: [] };

    for (const url of originalLinks) {
      if (markdown.includes(url)) {
        stats.links.found++;
      } else {
        stats.links.missing.push(url);
      }
    }

    if (stats.links.missing.length > 0) {
      return {
        error: `링크 URL 누락 (${stats.links.missing.length}개)`,
        details: stats.links.missing.map(url => `  - ${url}`)
      };
    }
    return null;
  },

  codeBlocks: (json, markdown, stats) => {
    const items = json.content.filter(c => c.type === 'code');
    stats.codeBlocks = { original: items.length, found: 0, missing: [] };

    for (const item of items) {
      if (item.code) {
        const codeFirstLine = item.code.split('\n')[0].trim();
        if (codeFirstLine && markdown.includes(codeFirstLine)) {
          stats.codeBlocks.found++;
        } else {
          stats.codeBlocks.missing.push(codeFirstLine.substring(0, 50));
        }
      }
    }

    if (stats.codeBlocks.missing.length > 0) {
      return {
        error: `코드 블록 누락 (${stats.codeBlocks.missing.length}개)`,
        details: stats.codeBlocks.missing.map(code => `  - "${code}..."`)
      };
    }
    return null;
  },

  tables: (json, markdown, stats) => {
    const items = json.content.filter(c => c.type === 'table');
    stats.tables = { original: items.length, found: 0, missing: [] };

    for (let i = 0; i < items.length; i++) {
      const table = items[i];
      let tableFound = true;

      if (table.rows) {
        for (const row of table.rows) {
          for (const cell of row) {
            if (cell && cell.trim() && !markdown.includes(cell.trim())) {
              tableFound = false;
              stats.tables.missing.push(`테이블 ${i + 1}의 셀: "${cell.substring(0, 30)}..."`);
              break;
            }
          }
          if (!tableFound) break;
        }
      }

      if (tableFound) {
        stats.tables.found++;
      }
    }

    if (stats.tables.missing.length > 0) {
      return {
        warning: `테이블 내용 누락 가능성 (${stats.tables.missing.length}개)`,
        details: stats.tables.missing.slice(0, 3).map(msg => `  - ${msg}`)
      };
    }
    return null;
  }
};

/**
 * 원본 JSON과 생성된 마크다운 검증
 * @param {Object} originalJson - 스크래퍼 출력 JSON
 * @param {string} generatedMarkdown - 생성된 마크다운
 * @param {string[]} validateItems - 검증할 항목 목록 (예: ['youtube', 'images', 'links'])
 * @returns {Object} { valid: boolean, errors: string[], warnings: string[], stats: Object }
 */
function validateContent(originalJson, generatedMarkdown, validateItems = ['links']) {
  const errors = [];
  const warnings = [];
  const stats = {};

  for (const itemType of validateItems) {
    const validator = VALIDATORS[itemType];
    if (validator) {
      const result = validator(originalJson, generatedMarkdown, stats);
      if (result) {
        if (result.error) {
          errors.push(result.error);
          if (result.details) errors.push(...result.details);
        }
        if (result.warning) {
          warnings.push(result.warning);
          if (result.details) warnings.push(...result.details);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats
  };
}

/**
 * 검증 결과를 포맷팅하여 출력
 * @param {Object} result - validateContent 결과
 * @param {string[]} validateItems - 검증 항목 목록
 */
function formatValidationResult(result, validateItems = []) {
  const lines = [];

  if (result.valid) {
    lines.push('╔═══════════════════════════════════════════════════════════╗');
    lines.push('║                    검증 성공: 원문 정확                     ║');
    lines.push('╚═══════════════════════════════════════════════════════════╝');
  } else {
    lines.push('╔═══════════════════════════════════════════════════════════╗');
    lines.push('║                  검증 실패: 원문 누락 발견                   ║');
    lines.push('╠═══════════════════════════════════════════════════════════╣');

    for (const error of result.errors) {
      lines.push(`║ ${error.padEnd(57)} ║`);
    }

    lines.push('╚═══════════════════════════════════════════════════════════╝');
  }

  // 통계 출력
  lines.push('');
  lines.push('통계:');
  for (const key of Object.keys(result.stats)) {
    const stat = result.stats[key];
    const label = {
      youtube: 'YouTube',
      images: '이미지',
      links: '링크',
      codeBlocks: '코드블록',
      tables: '테이블'
    }[key] || key;
    lines.push(`  ${label}: ${stat.found}/${stat.original}`);
  }

  // 경고 출력
  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('경고:');
    for (const warning of result.warnings) {
      lines.push(`  ${warning}`);
    }
  }

  return lines.join('\n');
}

module.exports = {
  validateContent,
  formatValidationResult,
  extractLinkUrls,
  VALIDATORS
};
