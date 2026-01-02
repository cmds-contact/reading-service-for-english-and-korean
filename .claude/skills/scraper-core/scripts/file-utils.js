/**
 * File Utilities - Scraper Core
 * 파일 저장, known-issues 확인 등 공통 파일 작업
 */

const fs = require('fs');
const path = require('path');

/**
 * 프로젝트 루트 경로 계산
 * @param {string} fromDir - 현재 스크립트 디렉토리 (__dirname)
 * @param {number} levels - 올라갈 레벨 수
 * @returns {string} 프로젝트 루트 경로
 */
function getProjectRoot(fromDir, levels = 4) {
  let root = fromDir;
  for (let i = 0; i < levels; i++) {
    root = path.dirname(root);
  }
  return root;
}

/**
 * 파일 저장 (기존 파일은 .trash로 이동)
 * @param {string} filePath - 저장할 파일 경로
 * @param {string} content - 파일 내용
 * @param {string} trashDir - .trash 디렉토리 경로
 */
function writeFileSafe(filePath, content, trashDir) {
  // 기존 파일 있으면 .trash로 이동
  if (fs.existsSync(filePath)) {
    if (!fs.existsSync(trashDir)) {
      fs.mkdirSync(trashDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = path.basename(filePath);
    const trashPath = path.join(trashDir, `${timestamp}_${fileName}`);
    fs.renameSync(filePath, trashPath);
    console.log(`  기존 파일을 .trash/로 이동: ${fileName}`);
  }

  // 디렉토리 생성
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 파일 저장
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * known-issues.json에서 알려진 문제 패턴 확인
 * @param {Array} issues - 진단된 문제 목록
 * @param {string} knownIssuesPath - known-issues.json 경로
 * @returns {Array} 매칭된 알려진 문제들
 */
function checkKnownIssues(issues, knownIssuesPath) {
  try {
    if (!fs.existsSync(knownIssuesPath)) {
      return [];
    }
    const knownIssues = JSON.parse(fs.readFileSync(knownIssuesPath, 'utf-8'));
    const matched = [];

    for (const issue of issues) {
      const known = knownIssues.issues.find(k =>
        k.type === issue.type && k.status === 'resolved'
      );
      if (known) {
        matched.push({ ...issue, knownFix: known.fix });
      }
    }

    return matched;
  } catch (e) {
    return [];
  }
}

/**
 * 디렉토리 존재 및 파일 확인
 * @param {string} dirPath - 확인할 디렉토리 경로
 * @returns {boolean} 파일이 있으면 true
 */
function hasExistingFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return false;
  }
  const files = fs.readdirSync(dirPath);
  return files.length > 0;
}

module.exports = {
  getProjectRoot,
  writeFileSafe,
  checkKnownIssues,
  hasExistingFiles
};
