#!/usr/bin/env node
/**
 * Claude Docs Pipeline - Self-Improving Agent
 * scraper-core를 사용한 간소화된 파이프라인
 *
 * Usage: node pipeline.js "https://code.claude.com/docs/hooks" [--force]
 */

const { createPipeline } = require('../../scraper-core/scripts/pipeline-runner');
const { scrape } = require('./scraper');
const config = require('./config');

// 파이프라인 생성
const pipeline = createPipeline({
  channel: config.channel,
  channelFolder: config.channelFolder,
  extractSlug: config.extractSlug,
  scrape: scrape,
  validateItems: config.validateItems,
  extraTypeHandlers: config.extraTypeHandlers,
  customDiagnosers: config.customDiagnosers,
  customFixRecommendations: config.customFixRecommendations,
  scraperFile: config.scraperFile,
  knownIssuesPath: config.knownIssuesPath,
  projectRoot: config.projectRoot
});

// CLI 실행
if (require.main === module) {
  const args = process.argv.slice(2);
  const url = args.find(arg => arg.startsWith('http'));
  const force = args.includes('--force');

  if (!url) {
    console.error('Usage: node pipeline.js "https://code.claude.com/docs/hooks" [--force]');
    console.error('');
    console.error('Options:');
    console.error('  --force    기존 파일 덮어쓰기');
    process.exit(1);
  }

  pipeline(url, { force })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { pipeline };
