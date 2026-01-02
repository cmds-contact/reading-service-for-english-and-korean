#!/usr/bin/env node
/**
 * Content Migration Script
 * Migrates content from contents_migration/ to contents/ folder structure.
 * Tracks progress and can resume from where it left off.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Configuration
const PROJECT_ROOT = path.dirname(__dirname);
const MIGRATION_SOURCE = path.join(PROJECT_ROOT, 'contents_migration');
const CONTENTS_DIR = path.join(PROJECT_ROOT, 'contents');
const PROGRESS_FILE = path.join(PROJECT_ROOT, 'scripts', 'migration_progress.json');

// Channel mapping based on source folder
const CHANNEL_MAP = {
  'claude-blog': 'Anthropic',
  'gemini-blog': 'Google',
  'openai-blog': 'OpenAI',
};

// Category normalization
const CATEGORY_MAP = {
  'AI/Gemini Models': 'Product',
  'AI': 'AI',
  'Product': 'Product',
  'Research': 'Research',
  'Business': 'Business',
  'Policy': 'Policy',
  'Infrastructure': 'Infrastructure',
};

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { migrated: [], failed: [], skipped: [] };
}

function saveProgress(progress) {
  fs.mkdirSync(path.dirname(PROGRESS_FILE), { recursive: true });
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (match) {
    try {
      const frontmatter = yaml.parse(match[1]);
      const body = content.slice(match[0].length);
      return { frontmatter, body };
    } catch (e) {
      return { frontmatter: null, body: content };
    }
  }
  return { frontmatter: null, body: content };
}

function extractSlugFromFilename(filename) {
  const name = filename.replace('.md', '');
  const match = name.match(/\d{4}-\d{2}-\d{2}_(.+)/);
  if (match) {
    let slug = match[1];
    if (slug.endsWith('_kr')) {
      slug = slug.slice(0, -3);
    }
    return slug;
  }
  return name;
}

function extractDateFromFilename(filename) {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})_/);
  return match ? match[1] : null;
}

function findFilePairs(sourceDir) {
  const pairs = {};

  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const slug = extractSlugFromFilename(file);

    if (!pairs[slug]) {
      pairs[slug] = { en: null, ko: null, date: null };
    }

    const filePath = path.join(sourceDir, file);
    if (file.includes('_kr.md')) {
      pairs[slug].ko = filePath;
    } else {
      pairs[slug].en = filePath;
      pairs[slug].date = extractDateFromFilename(file);
    }
  }

  return pairs;
}

function normalizeCategory(category) {
  return CATEGORY_MAP[category] || 'AI';
}

function generateTags(frontmatter, channel) {
  const tags = [];
  const title = (frontmatter?.title || '').toLowerCase();

  // Add channel-specific tags
  if (channel === 'Anthropic') tags.push('Claude');
  else if (channel === 'Google') tags.push('Gemini');
  else if (channel === 'OpenAI') tags.push('ChatGPT');

  // Add topic-based tags
  if (/model|opus|haiku|sonnet|flash|pro/i.test(title)) tags.push('AI Model');
  if (/code|coding|developer/i.test(title)) tags.push('Coding');
  if (/agent/i.test(title)) tags.push('AI Agent');
  if (/safety|security/i.test(title)) tags.push('AI Safety');
  if (/partner/i.test(title)) tags.push('Partnership');

  return tags.length > 0 ? tags : ['AI'];
}

function createMetaYaml(slug, enFrontmatter, koFrontmatter, channel, date) {
  const category = normalizeCategory(enFrontmatter?.category);
  const tags = generateTags(enFrontmatter, channel);

  const meta = {
    id: slug,
    created: date,
    updated: date,
    channel: channel,
    source: {
      url: enFrontmatter?.source || '',
      published: date,
    },
    category: category,
    tags: tags,
    languages: {
      en: {
        title: enFrontmatter?.title || '',
        type: 'original',
      },
      ko: {
        title: koFrontmatter?.title || enFrontmatter?.title || '',
        type: 'translation',
        translator: 'human',
      },
    },
  };

  return meta;
}

function migrateContentPair(slug, pair, channel, progress) {
  const targetDir = path.join(CONTENTS_DIR, slug);

  // Check if already migrated
  if (fs.existsSync(targetDir) && fs.existsSync(path.join(targetDir, 'meta.yaml'))) {
    console.log(`  [SKIP] ${slug} - already exists`);
    if (!progress.skipped.includes(slug)) {
      progress.skipped.push(slug);
    }
    return true;
  }

  // Need at least English version
  if (!pair.en) {
    console.log(`  [SKIP] ${slug} - no English version`);
    if (!progress.skipped.includes(slug)) {
      progress.skipped.push(slug);
    }
    return false;
  }

  try {
    // Read and parse English file
    const enContent = fs.readFileSync(pair.en, 'utf-8');
    const { frontmatter: enFrontmatter, body: enBody } = parseFrontmatter(enContent);

    // Read and parse Korean file if exists
    let koFrontmatter = null, koBody = null;
    if (pair.ko) {
      const koContent = fs.readFileSync(pair.ko, 'utf-8');
      const parsed = parseFrontmatter(koContent);
      koFrontmatter = parsed.frontmatter;
      koBody = parsed.body;
    }

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Generate meta.yaml
    let date = pair.date || enFrontmatter?.date;
    if (date instanceof Date) {
      date = date.toISOString().split('T')[0];
    }
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    const meta = createMetaYaml(slug, enFrontmatter || {}, koFrontmatter, channel, date);

    // Write meta.yaml
    fs.writeFileSync(
      path.join(targetDir, 'meta.yaml'),
      yaml.stringify(meta, { lineWidth: 0 })
    );

    // Write en.md
    fs.writeFileSync(
      path.join(targetDir, 'en.md'),
      enBody.trim() + '\n'
    );

    // Write ko.md
    if (koBody) {
      fs.writeFileSync(
        path.join(targetDir, 'ko.md'),
        koBody.trim() + '\n'
      );
    } else {
      fs.writeFileSync(
        path.join(targetDir, 'ko.md'),
        `# ${meta.languages.ko.title}\n\n[Translation pending]\n`
      );
    }

    console.log(`  [OK] ${slug}`);
    if (!progress.migrated.includes(slug)) {
      progress.migrated.push(slug);
    }
    return true;

  } catch (e) {
    console.log(`  [FAIL] ${slug} - ${e.message}`);
    if (!progress.failed.includes(slug)) {
      progress.failed.push(slug);
    }
    return false;
  }
}

function migrateBlogFolder(folderName, progress) {
  const sourceDir = path.join(MIGRATION_SOURCE, folderName);
  const channel = CHANNEL_MAP[folderName] || folderName;

  if (!fs.existsSync(sourceDir)) {
    console.log(`Source folder not found: ${sourceDir}`);
    return;
  }

  console.log(`\n=== Migrating ${folderName} (channel: ${channel}) ===`);

  const pairs = findFilePairs(sourceDir);
  console.log(`Found ${Object.keys(pairs).length} content items`);

  for (const [slug, pair] of Object.entries(pairs).sort()) {
    migrateContentPair(slug, pair, channel, progress);
    saveProgress(progress);
  }
}

function printSummary(progress) {
  console.log('\n' + '='.repeat(50));
  console.log('MIGRATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Migrated: ${progress.migrated.length}`);
  console.log(`Skipped:  ${progress.skipped.length}`);
  console.log(`Failed:   ${progress.failed.length}`);

  if (progress.failed.length > 0) {
    console.log('\nFailed items:');
    for (const item of progress.failed) {
      console.log(`  - ${item}`);
    }
  }
}

function main() {
  console.log('Content Migration Script');
  console.log(`Source: ${MIGRATION_SOURCE}`);
  console.log(`Target: ${CONTENTS_DIR}`);

  const progress = loadProgress();
  console.log(`\nResuming from previous progress:`);
  console.log(`  Already migrated: ${progress.migrated.length}`);
  console.log(`  Already skipped: ${progress.skipped.length}`);

  // Migrate each blog folder
  for (const folderName of ['claude-blog', 'gemini-blog', 'openai-blog']) {
    migrateBlogFolder(folderName, progress);
  }

  saveProgress(progress);
  printSummary(progress);
}

main();
