/**
 * Meta Utilities - Scraper Core
 * 날짜 파싱, YAML 생성 등 메타데이터 유틸리티
 */

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 * @param {string} dateStr - "Dec 25, 2025" 형식의 날짜
 * @returns {string} "2025-12-25" 형식
 */
function parseDate(dateStr) {
  if (!dateStr) return '';

  const months = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12',
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };

  // "Dec 25, 2025" 또는 "December 25, 2025" 형식 파싱
  const match = dateStr.match(/(\w+)\s+(\d{1,2}),\s+(\d{4})/);
  if (match) {
    const month = months[match[1]] || '01';
    const day = match[2].padStart(2, '0');
    const year = match[3];
    return `${year}-${month}-${day}`;
  }

  return dateStr;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string}
 */
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YAML 문자열에서 특수 문자 이스케이프
 * @param {string} str
 * @returns {string}
 */
function escapeYamlString(str) {
  if (!str) return '';
  return str.replace(/"/g, '\\"');
}

/**
 * meta.yaml YAML 문자열 생성
 * @param {Object} options
 * @param {string} options.slug - 콘텐츠 ID/slug
 * @param {string} options.title - 영문 제목
 * @param {string} options.url - 원본 URL
 * @param {string} options.published - 발행일 (원본 형식)
 * @param {string} options.channel - 채널명
 * @returns {string} YAML 문자열
 */
function generateMeta({ slug, title, url, published, channel }) {
  const created = getTodayDate();
  const publishedFormatted = parseDate(published) || created;

  const yaml = `id: ${slug}
created: "${created}"
channel: ${channel}

source:
  url: ${url}
  published: "${publishedFormatted}"

languages:
  en:
    title: "${escapeYamlString(title)}"
    type: original
`;

  return yaml;
}

module.exports = {
  parseDate,
  getTodayDate,
  escapeYamlString,
  generateMeta
};
