/**
 * Claude Docs Scraper - Configuration
 * scraper-core를 사용하기 위한 설정
 */

const path = require('path');

// 프로젝트 루트 경로
const PROJECT_ROOT = path.resolve(__dirname, '../../../..');

/**
 * URL에서 slug 추출
 * @param {string} url
 * @returns {string|null}
 */
function extractSlug(url) {
  // code.claude.com/docs/hooks → hooks
  // code.claude.com/docs/getting-started/basics → getting-started-basics
  const match = url.match(/code\.claude\.com\/docs\/(.+?)(?:\?|#|$)/);
  if (!match) return null;

  // 경로의 슬래시를 하이픈으로 변환
  return match[1].replace(/\//g, '-').replace(/-$/, '');
}

/**
 * Claude Docs 전용 진단기: 코드 블록 언어 감지 실패
 */
const customDiagnosers = {
  CODE_LANGUAGE_DETECTION: (validationResult, json, html) => {
    // 언어가 없는 코드 블록 확인
    const codeBlocks = json.content.filter(c => c.type === 'code');
    const noLangBlocks = codeBlocks.filter(c => !c.lang);

    if (noLangBlocks.length > 0) {
      return {
        type: 'CODE_LANGUAGE_DETECTION',
        message: `${noLangBlocks.length}개의 코드 블록에 언어가 감지되지 않음`,
        count: noLangBlocks.length
      };
    }

    return null;
  },

  CALLOUT_EXTRACTION: (validationResult, json, html) => {
    if (!html) return null;

    // callout/note 요소가 있는지 확인
    const hasCallouts = html.includes('class="callout"') || html.includes('class="note"');
    const blockquotesInJson = json.content.filter(c => c.type === 'blockquote').length;

    if (hasCallouts && blockquotesInJson === 0) {
      return {
        type: 'CALLOUT_EXTRACTION',
        message: 'Callout/Note 요소가 있지만 추출되지 않음'
      };
    }

    return null;
  }
};

/**
 * Claude Docs 전용 수정 제안
 */
const customFixRecommendations = {
  CODE_LANGUAGE_DETECTION: {
    description: '코드 블록 언어 감지 실패',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: '코드 블록 언어 추출 (shiki, language-* 클래스)',
      instruction: 'data-language 속성 또는 class 패턴 확인',
      priority: 'medium'
    })
  },

  CALLOUT_EXTRACTION: {
    description: 'Callout/Note 요소 추출 실패',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: 'blockquote 또는 callout/note 요소 처리',
      instruction: 'CSS 선택자 확인: [class*="callout"], [class*="note"]',
      priority: 'medium'
    })
  }
};

module.exports = {
  // 채널 정보
  channel: 'Claude Docs',
  channelFolder: 'claude-docs',

  // 경로
  projectRoot: PROJECT_ROOT,
  knownIssuesPath: path.join(__dirname, '..', 'known-issues.json'),

  // 함수
  extractSlug,

  // 검증 항목 (Claude Docs는 주로 코드 블록과 링크)
  validateItems: ['codeBlocks', 'links'],

  // 스크래퍼 파일명
  scraperFile: 'scraper.js',

  // 추가 타입 핸들러 (기본 사용)
  extraTypeHandlers: {},

  // Claude Docs 전용 진단기
  customDiagnosers,

  // Claude Docs 전용 수정 제안
  customFixRecommendations
};
