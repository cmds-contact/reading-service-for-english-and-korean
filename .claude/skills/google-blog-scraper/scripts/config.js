/**
 * Google Blog Scraper - Configuration
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
  // blog.google/outreach-initiatives/example-post → example-post
  // blog.google/products/assistant/post-title → post-title
  const match = url.match(/blog\.google\/[^\/]+\/(?:[^\/]+\/)?([^\/\?#]+)/);
  return match ? match[1] : null;
}

/**
 * Google 전용 진단기: uni-youtube-player-hero 요소 확인
 */
const customDiagnosers = {
  GOOGLE_YOUTUBE_CUSTOM_ELEMENT: (validationResult, json, html) => {
    if (!html) return null;

    // uni-youtube-player-hero 요소가 있는지 확인
    const hasCustomElement = html.includes('uni-youtube-player-hero');
    const youtubeInJson = json.content.filter(c => c.type === 'youtube').length;

    if (hasCustomElement && youtubeInJson === 0) {
      return {
        type: 'GOOGLE_YOUTUBE_CUSTOM_ELEMENT',
        message: 'uni-youtube-player-hero 요소가 있지만 YouTube 추출 실패'
      };
    }

    return null;
  }
};

/**
 * Google 전용 수정 제안
 */
const customFixRecommendations = {
  GOOGLE_YOUTUBE_CUSTOM_ELEMENT: {
    description: 'Google 커스텀 YouTube 요소 처리 실패',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: 'uni-youtube-player-hero 처리',
      instruction: 'video-id 속성 추출 로직 확인',
      priority: 'high'
    })
  }
};

module.exports = {
  // 채널 정보
  channel: 'Google',
  channelFolder: 'google',

  // 경로
  projectRoot: PROJECT_ROOT,
  knownIssuesPath: path.join(__dirname, '..', 'known-issues.json'),

  // 함수
  extractSlug,

  // 검증 항목 (Google Blog는 YouTube, 이미지, 링크)
  validateItems: ['youtube', 'images', 'links'],

  // 스크래퍼 파일명
  scraperFile: 'scraper.js',

  // 추가 타입 핸들러 (기본 사용)
  extraTypeHandlers: {},

  // Google 전용 진단기
  customDiagnosers,

  // Google 전용 수정 제안
  customFixRecommendations
};
