/**
 * Claude Blog Scraper - Configuration
 * scraper-core를 사용하기 위한 설정
 */

const path = require('path');

// 프로젝트 루트 경로
// __dirname: .claude/skills/claude-blog-scraper/scripts/
const PROJECT_ROOT = path.resolve(__dirname, '../../../..');

/**
 * URL에서 slug 추출
 * @param {string} url
 * @returns {string|null}
 */
function extractSlug(url) {
  const match = url.match(/claude\.com\/blog\/([^\/\?#]+)/);
  return match ? match[1] : null;
}

module.exports = {
  // 채널 정보
  channel: 'Claude Blog',
  channelFolder: 'claude-blog',

  // 경로
  projectRoot: PROJECT_ROOT,
  knownIssuesPath: path.join(__dirname, '..', 'known-issues.json'),

  // 함수
  extractSlug,

  // 검증 항목 (Claude Blog는 YouTube, 이미지, 링크, 코드 블록 모두 검증)
  validateItems: ['youtube', 'images', 'links', 'codeBlocks'],

  // 스크래퍼 파일명 (수정 제안용)
  scraperFile: 'scraper.js',

  // 추가 타입 핸들러 (필요시)
  extraTypeHandlers: {},

  // 추가 진단기 (필요시)
  customDiagnosers: {},

  // 추가 수정 제안 (필요시)
  customFixRecommendations: {}
};
