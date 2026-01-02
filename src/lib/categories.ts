// Claude Docs 카테고리 구조 정의
// Claude Code 문서 사이트 구조를 따름

export interface Subsection {
  name: string
  nameKo: string
  items: string[]
}

export interface Category {
  name: string
  nameKo: string
  slug: string
  items: string[]
  subsections?: Subsection[]
}

export const CLAUDE_DOCS_CATEGORIES: Category[] = [
  {
    name: 'Getting started',
    nameKo: '시작하기',
    slug: 'getting-started',
    items: ['overview', 'quickstart', 'common-workflows'],
    subsections: [
      {
        name: 'Outside of the terminal',
        nameKo: '터미널 외부에서',
        items: [
          'claude-code-on-the-web',
          'desktop',
          'chrome',
          'vs-code',
          'jetbrains',
          'github-actions',
          'gitlab-ci-cd',
          'slack',
        ],
      },
    ],
  },
  {
    name: 'Build with Claude Code',
    nameKo: 'Claude Code로 빌드',
    slug: 'build',
    items: [
      'sub-agents',
      'plugins',
      'discover-plugins',
      'skills',
      'output-styles',
      'hooks',
      'hooks-guide',
      'headless',
      'mcp',
      'troubleshooting',
    ],
  },
  {
    name: 'Deployment',
    nameKo: '배포',
    slug: 'deployment',
    items: [
      'setup',
      'amazon-bedrock',
      'google-vertex-ai',
      'microsoft-foundry',
      'network-config',
      'llm-gateway',
      'devcontainer',
      'sandboxing',
    ],
  },
  {
    name: 'Administration',
    nameKo: '관리',
    slug: 'administration',
    items: [
      'iam',
      'security',
      'data-usage',
      'monitoring-usage',
      'costs',
      'analytics',
      'plugin-marketplaces',
    ],
  },
  {
    name: 'Configuration',
    nameKo: '설정',
    slug: 'configuration',
    items: ['settings', 'terminal-config', 'model-config', 'memory', 'statusline'],
  },
  {
    name: 'Reference',
    nameKo: '레퍼런스',
    slug: 'reference',
    items: [
      'cli-reference',
      'interactive-mode',
      'slash-commands',
      'checkpointing',
      'plugins-reference',
    ],
  },
  {
    name: 'Resources',
    nameKo: '리소스',
    slug: 'resources',
    items: ['legal-and-compliance', 'third-party-integrations'],
  },
]

// slug로 카테고리 찾기
export function findCategoryBySlug(slug: string): Category | null {
  for (const category of CLAUDE_DOCS_CATEGORIES) {
    if (category.items.includes(slug)) {
      return category
    }
    if (category.subsections) {
      for (const subsection of category.subsections) {
        if (subsection.items.includes(slug)) {
          return category
        }
      }
    }
  }
  return null
}

// slug가 서브섹션에 속하는지 확인
export function findSubsectionBySlug(slug: string): Subsection | null {
  for (const category of CLAUDE_DOCS_CATEGORIES) {
    if (category.subsections) {
      for (const subsection of category.subsections) {
        if (subsection.items.includes(slug)) {
          return subsection
        }
      }
    }
  }
  return null
}

// 모든 문서 slug 목록 반환
export function getAllDocsSlugs(): string[] {
  const slugs: string[] = []
  for (const category of CLAUDE_DOCS_CATEGORIES) {
    slugs.push(...category.items)
    if (category.subsections) {
      for (const subsection of category.subsections) {
        slugs.push(...subsection.items)
      }
    }
  }
  return slugs
}
