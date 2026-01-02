/**
 * JSON to Markdown Converter - Scraper Core
 * 스크래퍼 출력 JSON을 마크다운으로 변환
 *
 * 핵심: text 필드를 그대로 사용하여 링크 손실 방지
 */

/**
 * 기본 타입 핸들러
 */
const DEFAULT_TYPE_HANDLERS = {
  h1: (item) => [`# ${item.text}`, ''],
  h2: (item) => [`## ${item.text}`, ''],
  h3: (item) => [`### ${item.text}`, ''],
  h4: (item) => [`#### ${item.text}`, ''],
  h5: (item) => [`##### ${item.text}`, ''],
  h6: (item) => [`###### ${item.text}`, ''],

  p: (item) => [item.text, ''],

  blockquote: (item) => {
    const lines = item.text.split('\n').map(line => `> ${line}`);
    return [...lines, ''];
  },

  image: (item) => [`![${item.alt || ''}](${item.src})`, ''],

  figure: (item) => {
    const lines = [`![${item.alt || ''}](${item.src})`];
    if (item.caption) {
      lines.push(`*${item.caption}*`);
    }
    lines.push('');
    return lines;
  },

  table: (item) => {
    if (!item.rows || item.rows.length === 0) return [];
    const lines = [];
    const header = item.rows[0];
    lines.push('| ' + header.join(' | ') + ' |');
    lines.push('|' + header.map(() => '---').join('|') + '|');
    for (let i = 1; i < item.rows.length; i++) {
      lines.push('| ' + item.rows[i].join(' | ') + ' |');
    }
    lines.push('');
    return lines;
  },

  code: (item) => [
    '```' + (item.lang || ''),
    item.code,
    '```',
    ''
  ],

  youtube: (item) => [
    `<iframe width="100%" height="400" src="${item.src}" frameborder="0" allowfullscreen></iframe>`,
    ''
  ],

  vimeo: (item) => [
    `<iframe width="100%" height="400" src="${item.src}" frameborder="0" allowfullscreen></iframe>`,
    ''
  ],

  iframe: (item) => [
    `<iframe width="100%" height="400" src="${item.src}" frameborder="0"></iframe>`,
    ''
  ]
};

/**
 * JSON content 배열을 마크다운 문자열로 변환
 * @param {Object} json - 스크래퍼 출력 {title, date, content: [...]}
 * @param {Object} extraHandlers - 추가 타입 핸들러 (기본 핸들러 확장/오버라이드)
 * @returns {string} 마크다운 문자열
 */
function jsonToMarkdown(json, extraHandlers = {}) {
  const handlers = { ...DEFAULT_TYPE_HANDLERS, ...extraHandlers };
  const lines = [];

  // 제목 추가
  if (json.title) {
    lines.push(`# ${json.title}`);
    lines.push('');
  }

  let inList = false;

  for (const item of json.content) {
    // 리스트 종료 감지
    if (inList && item.type !== 'li') {
      lines.push('');
      inList = false;
    }

    // 리스트 아이템 특별 처리
    if (item.type === 'li') {
      if (!inList) {
        inList = true;
      }
      lines.push(`- ${item.text}`);
      continue;
    }

    // 핸들러 실행
    const handler = handlers[item.type];
    if (handler) {
      const result = handler(item);
      if (Array.isArray(result)) {
        lines.push(...result);
      } else if (result) {
        lines.push(result);
      }
    } else {
      console.warn(`Unknown content type: ${item.type}`);
    }
  }

  // 마지막 리스트 종료
  if (inList) {
    lines.push('');
  }

  return lines.join('\n').trim() + '\n';
}

module.exports = {
  jsonToMarkdown,
  DEFAULT_TYPE_HANDLERS
};
