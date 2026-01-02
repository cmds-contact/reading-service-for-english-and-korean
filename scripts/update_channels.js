#!/usr/bin/env node
/**
 * Update channel values in existing meta.yaml files based on source URL.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const CONTENTS_DIR = path.join(__dirname, '..', 'contents')

function getChannelFromUrl(url) {
  if (!url) return null

  // Anthropic URLs
  if (url.includes('anthropic.com/news')) return 'anthropic-blog'
  if (url.includes('anthropic.com/research')) return 'anthropic-research'
  if (url.includes('docs.anthropic.com')) {
    if (url.includes('claude-code')) return 'claude-code-docs'
    return 'claude-docs'
  }
  if (url.includes('anthropic.com')) return 'anthropic-blog'

  // Google URLs
  if (url.includes('blog.google')) return 'google-blog'
  if (url.includes('developers.google')) return 'google-developers'
  if (url.includes('ai.google')) return 'google-ai'
  if (url.includes('google.com')) return 'google-blog'

  // OpenAI URLs
  if (url.includes('openai.com/index')) return 'openai-blog'
  if (url.includes('openai.com/research')) return 'openai-research'
  if (url.includes('platform.openai.com')) return 'openai-docs'
  if (url.includes('openai.com')) return 'openai-blog'

  return null
}

function updateMetaYaml(metaPath) {
  const content = fs.readFileSync(metaPath, 'utf-8')
  const meta = yaml.load(content)

  const sourceUrl = meta.source?.url || ''
  const oldChannel = meta.channel || ''
  const newChannel = getChannelFromUrl(sourceUrl)

  if (newChannel && newChannel !== oldChannel) {
    meta.channel = newChannel
    fs.writeFileSync(metaPath, yaml.dump(meta, { lineWidth: -1, noRefs: true }))
    return { oldChannel, newChannel }
  }
  return null
}

function main() {
  console.log('Updating channel values based on source URLs...')
  console.log(`Contents directory: ${CONTENTS_DIR}\n`)

  let updated = 0
  let unchanged = 0

  const contentDirs = fs.readdirSync(CONTENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  for (const dir of contentDirs) {
    const metaPath = path.join(CONTENTS_DIR, dir.name, 'meta.yaml')
    if (!fs.existsSync(metaPath)) continue

    const result = updateMetaYaml(metaPath)
    if (result) {
      console.log(`  ${dir.name}: ${result.oldChannel} -> ${result.newChannel}`)
      updated++
    } else {
      unchanged++
    }
  }

  console.log(`\n=== Summary ===`)
  console.log(`Updated: ${updated}`)
  console.log(`Unchanged: ${unchanged}`)
}

main()
