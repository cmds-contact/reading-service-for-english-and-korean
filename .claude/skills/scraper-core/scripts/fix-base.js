/**
 * Fix Recommendation Base - Scraper Core
 * 진단된 문제에 대한 수정 제안 생성 기본 로직
 */

/**
 * 기본 수정 제안 매핑
 */
const DEFAULT_FIX_RECOMMENDATIONS = {
  YOUTUBE_REGEX_MISS: {
    description: 'YouTube URL regex 패턴 누락',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: 'iframe 처리 (YouTube regex)',
      instruction: `새로운 YouTube URL 패턴 추가 필요`,
      example: `// 문제의 URL: ${issue.iframeSrc || 'unknown'}`,
      priority: 'high'
    })
  },

  YOUTUBE_NOT_IN_PAGE: {
    description: 'YouTube가 페이지에 없음 (동적 로딩)',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: 'waitForSelector 또는 동적 로딩 대기',
      instruction: `YouTube 요소가 동적으로 로딩될 수 있음`,
      priority: 'medium'
    })
  },

  IMAGE_SELECTOR_MISS: {
    description: '이미지 선택자 누락',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: '이미지 추출 로직',
      instruction: `이미지 선택자 또는 필터링 로직 확인`,
      priority: 'high'
    })
  },

  IMAGE_DATA_URL: {
    description: 'data-src 속성 처리 실패',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: '이미지 src 추출',
      instruction: `data-src 속성 우선 확인 로직 추가`,
      priority: 'medium'
    })
  },

  LINK_CONVERSION_FAIL: {
    description: '링크 마크다운 변환 실패',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: 'htmlToMarkdown 함수',
      instruction: `링크 변환 regex 확인`,
      example: `// 실패한 링크: ${issue.url}`,
      priority: 'high'
    })
  },

  CODE_BLOCK_SELECTOR_MISS: {
    description: '코드 블록 선택자 누락',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: '코드 블록 추출 (pre/code 선택자)',
      instruction: `코드 블록 선택자 확인`,
      priority: 'high'
    })
  },

  CONTENT_CONTAINER_CHANGE: {
    description: '본문 컨테이너 변경',
    generateFix: (issue, scraperFile) => ({
      file: scraperFile,
      section: 'bodyEl 선택 로직',
      instruction: `페이지 구조 변경 확인 - .page.html 파일 분석 필요`,
      priority: 'critical'
    })
  }
};

/**
 * 진단된 문제들에 대한 수정 보고서 생성
 * @param {Array} issues - diagnose() 결과
 * @param {string} scraperFile - 스크래퍼 파일명
 * @param {Object} customRecommendations - 추가 수정 제안 매핑
 * @returns {Object} 수정 보고서
 */
function generateFixReport(issues, scraperFile = 'scraper.js', customRecommendations = {}) {
  const recommendations = { ...DEFAULT_FIX_RECOMMENDATIONS, ...customRecommendations };

  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    byPriority: { critical: [], high: [], medium: [], low: [] },
    fixes: []
  };

  for (const issue of issues) {
    const recommendation = recommendations[issue.type];

    if (recommendation) {
      const fix = recommendation.generateFix(issue, scraperFile);
      fix.issueType = issue.type;
      fix.issueMessage = issue.message;

      report.fixes.push(fix);
      report.byPriority[fix.priority]?.push(fix);
    } else {
      report.fixes.push({
        issueType: issue.type,
        issueMessage: issue.message,
        instruction: '알려지지 않은 문제 유형. 수동 분석 필요.',
        priority: 'low'
      });
      report.byPriority.low.push({ issueType: issue.type });
    }
  }

  return report;
}

/**
 * 수정 보고서 포맷팅
 * @param {Object} report
 * @returns {string}
 */
function formatFixReport(report) {
  const lines = [];

  lines.push('╔═══════════════════════════════════════════════════════════════════╗');
  lines.push('║                       수정 제안 보고서                             ║');
  lines.push('╠═══════════════════════════════════════════════════════════════════╣');

  if (report.byPriority.critical.length > 0) {
    lines.push('║ 🔴 CRITICAL:'.padEnd(68) + '║');
    for (const fix of report.byPriority.critical) {
      lines.push(`║    - ${fix.issueType}`.padEnd(68) + '║');
    }
  }

  if (report.byPriority.high.length > 0) {
    lines.push('║ 🟠 HIGH:'.padEnd(68) + '║');
    for (const fix of report.byPriority.high) {
      lines.push(`║    - ${fix.issueType}`.padEnd(68) + '║');
    }
  }

  if (report.byPriority.medium.length > 0) {
    lines.push('║ 🟡 MEDIUM:'.padEnd(68) + '║');
    for (const fix of report.byPriority.medium) {
      lines.push(`║    - ${fix.issueType}`.padEnd(68) + '║');
    }
  }

  lines.push('╠═══════════════════════════════════════════════════════════════════╣');
  lines.push('║                      상세 수정 지침                                ║');
  lines.push('╠═══════════════════════════════════════════════════════════════════╣');

  for (const fix of report.fixes) {
    lines.push(`║ [${fix.issueType}] ${fix.file || ''}`.padEnd(68) + '║');
    lines.push(`║   섹션: ${fix.section || 'N/A'}`.padEnd(68) + '║');
    lines.push(`║   지침: ${fix.instruction?.substring(0, 55) || ''}`.padEnd(68) + '║');
    lines.push('║'.padEnd(68) + '║');
  }

  lines.push('╚═══════════════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}

module.exports = {
  generateFixReport,
  formatFixReport,
  DEFAULT_FIX_RECOMMENDATIONS
};
