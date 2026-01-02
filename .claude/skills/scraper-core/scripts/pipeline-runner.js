/**
 * Pipeline Runner - Scraper Core
 * 공통 파이프라인 실행 로직
 */

const path = require('path');
const { writeFileSafe, checkKnownIssues, hasExistingFiles } = require('./file-utils');
const { generateMeta } = require('./meta-utils');
const { jsonToMarkdown } = require('./json-to-markdown');
const { validateContent, formatValidationResult } = require('./validate-base');
const { diagnose, formatDiagnosis } = require('./diagnose-base');
const { generateFixReport, formatFixReport } = require('./fix-base');

/**
 * 파이프라인 생성
 * @param {Object} config - 스크래퍼 설정
 * @param {string} config.channel - 채널명 (예: "Claude Blog")
 * @param {string} config.channelFolder - 채널 폴더명 (예: "claude-blog")
 * @param {Function} config.extractSlug - URL에서 slug 추출 함수
 * @param {Function} config.scrape - 스크래핑 함수 (async, returns {json, html})
 * @param {string[]} config.validateItems - 검증 항목 (예: ['youtube', 'images', 'links'])
 * @param {Object} config.extraTypeHandlers - 추가 타입 핸들러 (json-to-markdown용)
 * @param {Object} config.customDiagnosers - 추가 진단 로직
 * @param {Object} config.customFixRecommendations - 추가 수정 제안
 * @param {string} config.scraperFile - 스크래퍼 파일명 (수정 제안용)
 * @param {string} config.knownIssuesPath - known-issues.json 경로
 * @param {string} config.projectRoot - 프로젝트 루트 경로
 * @returns {Function} pipeline 함수
 */
function createPipeline(config) {
  const {
    channel,
    channelFolder,
    extractSlug,
    scrape,
    validateItems = ['links'],
    extraTypeHandlers = {},
    customDiagnosers = {},
    customFixRecommendations = {},
    scraperFile = 'scraper.js',
    knownIssuesPath,
    projectRoot
  } = config;

  const CONTENTS_DIR = path.join(projectRoot, 'contents');
  const TRASH_DIR = path.join(projectRoot, '.trash');

  /**
   * 메인 파이프라인
   * @param {string} url
   * @param {Object} options
   * @param {boolean} options.force - 기존 파일 덮어쓰기
   */
  async function pipeline(url, options = {}) {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log(`║     ${channel} Pipeline - Self-Improving Agent v2.0`.padEnd(67) + '║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('');

    // 1. URL 파싱
    console.log('[1/6] URL 파싱...');
    const slug = extractSlug(url);

    if (!slug) {
      throw new Error('URL에서 slug를 추출할 수 없습니다');
    }

    const outputDir = path.join(CONTENTS_DIR, channelFolder, slug);
    console.log(`      Channel: ${channel}`);
    console.log(`      Slug: ${slug}`);
    console.log(`      Output: ${outputDir}/`);
    console.log('');

    // 기존 파일 확인
    if (!options.force && hasExistingFiles(outputDir)) {
      console.log('⚠️  이미 존재하는 콘텐츠입니다. --force 옵션으로 덮어쓸 수 있습니다.');
      console.log(`    경로: ${outputDir}`);
      return { success: false, reason: 'ALREADY_EXISTS' };
    }

    // 2. 스크래핑
    console.log('[2/6] 스크래핑 실행...');
    const { json, html } = await scrape(url, { returnHtml: true });
    console.log(`      Title: ${json.title}`);
    if (json.date) console.log(`      Date: ${json.date}`);
    console.log(`      Content items: ${json.content.length}`);
    console.log('');

    // 3. 마크다운 변환
    console.log('[3/6] 마크다운 변환...');
    const markdown = jsonToMarkdown(json, extraTypeHandlers);
    const wordCount = markdown.split(/\s+/).length;
    console.log(`      en.md 생성 완료 (${wordCount} words)`);
    console.log('');

    // 4. meta.yaml 생성
    console.log('[4/6] meta.yaml 생성...');
    const meta = generateMeta({
      slug,
      title: json.title,
      url,
      published: json.date,
      channel
    });
    console.log('      meta.yaml 생성 완료');
    console.log('');

    // 5. 검증
    console.log('[5/6] 원문 정확성 검증...');
    const validationResult = validateContent(json, markdown, validateItems);
    console.log('');
    console.log(formatValidationResult(validationResult, validateItems));

    // 6. 검증 실패 시 진단 및 수정 제안
    if (!validationResult.valid) {
      console.log('');
      console.log('[6/6] 진단 및 수정 제안...');

      // 진단 실행
      const issues = diagnose(validationResult, json, html, customDiagnosers);
      console.log(formatDiagnosis(issues));

      // 수정 제안 생성
      const fixReport = generateFixReport(issues, scraperFile, customFixRecommendations);
      console.log('');
      console.log(formatFixReport(fixReport));

      // 알려진 문제 확인
      const knownPatterns = checkKnownIssues(issues, knownIssuesPath);
      if (knownPatterns.length > 0) {
        console.log('');
        console.log('╔═══════════════════════════════════════════════════════════════════╗');
        console.log('║                  알려진 문제 패턴 발견                              ║');
        console.log('╠═══════════════════════════════════════════════════════════════════╣');
        for (const p of knownPatterns) {
          console.log(`║ ${p.type}: ${p.knownFix?.description || 'Fix available'}`.padEnd(68) + '║');
        }
        console.log('╚═══════════════════════════════════════════════════════════════════╝');
      }

      // 파일 저장 (경고와 함께)
      writeFileSafe(path.join(outputDir, 'en.md'), markdown, TRASH_DIR);
      writeFileSafe(path.join(outputDir, 'meta.yaml'), meta, TRASH_DIR);
      writeFileSafe(path.join(outputDir, '.scraper-output.json'), JSON.stringify(json, null, 2), TRASH_DIR);

      if (html) {
        writeFileSafe(path.join(outputDir, '.page.html'), html, TRASH_DIR);
      }

      process.exitCode = 1;

      return {
        success: false,
        outputDir,
        validation: validationResult,
        diagnosis: issues,
        fixReport,
        knownPatterns,
        nextAction: knownPatterns.length > 0 ? 'APPLY_KNOWN_FIX' : 'ANALYZE_AND_FIX'
      };
    }

    // 성공
    writeFileSafe(path.join(outputDir, 'en.md'), markdown, TRASH_DIR);
    writeFileSafe(path.join(outputDir, 'meta.yaml'), meta, TRASH_DIR);
    writeFileSafe(path.join(outputDir, '.scraper-output.json'), JSON.stringify(json, null, 2), TRASH_DIR);

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                     성공! 파일 생성 완료                          ║');
    console.log('╠══════════════════════════════════════════════════════════════════╣');
    console.log(`║ ${path.join(outputDir, 'meta.yaml').padEnd(66)} ║`);
    console.log(`║ ${path.join(outputDir, 'en.md').padEnd(66)} ║`);
    console.log('║                                                                  ║');
    console.log('║ 다음 단계: Claude Code로 ko.md 번역 생성                          ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');

    return {
      success: true,
      outputDir,
      validation: validationResult
    };
  }

  return pipeline;
}

module.exports = { createPipeline };
