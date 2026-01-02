# Agent Skill

한국어

# Agent Skill

Claude Code에서 Claude의 기능을 확장하기 위해 Skill을 생성, 관리, 공유합니다.

## 첫 번째 Skill 생성

사용 가능한 Skill 확인

```
What Skills are available?
```

Skill 디렉토리 생성

```
mkdir -p ~/.claude/skills/explaining-code
```

SKILL.md 작성

```
---
name: explaining-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?

Keep explanations conversational. For complex concepts, use multiple analogies.
```

Skill 로드 및 확인

Skill 테스트

```
How does this code work?
```

## Skill 작동 방식

탐색

활성화

실행

### Skill이 있는 위치

### Skill vs 다른 옵션 사용 시기

> Agent Skill의 아키텍처와 실제 응용 프로그램에 대한 심층 분석은 [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)를 참조하세요.

## Skill 설정

```
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

#### 사용 가능한 메타데이터 필드

### Skill 업데이트 또는 삭제

### 점진적 공개로 지원 파일 추가

> 최적의 성능을 위해 `SKILL.md`를 500줄 미만으로 유지하세요. 내용이 이를 초과하면 상세 참조 자료를 별도 파일로 분할하세요.

#### 예시: 다중 파일 Skill 구조

```
my-skill/
├── SKILL.md (필수 - 개요 및 탐색)
├── reference.md (상세 API 문서 - 필요시 로드)
├── examples.md (사용 예시 - 필요시 로드)
└── scripts/
    └── helper.py (유틸리티 스크립트 - 로드되지 않고 실행됨)
```

```
## Overview

[필수 지침 여기]

## Additional resources

- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)

## Utility scripts

To validate input files, run the helper script. It checks for required fields and returns any validation errors:
```bash
python scripts/helper.py input.txt
```
```

> 참조를 한 단계 깊이로 유지하세요. `SKILL.md`에서 참조 파일로 직접 연결하세요. 깊게 중첩된 참조(파일 A가 파일 B를 연결하고 파일 B가 파일 C를 연결)는 Claude가 파일을 부분적으로 읽게 될 수 있습니다.

- 산문으로 설명하기 장황할 복잡한 유효성 검사 로직
- 생성된 코드보다 테스트된 코드가 더 신뢰할 수 있는 데이터 처리
- 사용 간 일관성이 필요한 작업

```
Run the validation script to check the form:
python scripts/validate_form.py input.pdf
```

### allowed-tools로 도구 액세스 제한

```
---
name: reading-files-safely
description: Read files without making changes. Use when you need read-only file access.
allowed-tools: Read, Grep, Glob
---

# Safe File Reader

This Skill provides read-only file access.

## Instructions
1. Use Read to view file contents
2. Use Grep to search within files
3. Use Glob to find files by pattern
```

- 파일을 수정하면 안 되는 읽기 전용 Skill
- 범위가 제한된 Skill: 예를 들어, 데이터 분석만 하고 파일 쓰기는 없음
- 기능을 제한하려는 보안에 민감한 워크플로우

> `allowed-tools`는 Claude Code의 Skill에서만 지원됩니다.

### Subagent와 함께 Skill 사용

```
# .claude/agents/code-reviewer/AGENT.md
---
name: code-reviewer
description: Review code for quality and best practices
skills: pr-review, security-check
---
```

> 내장 에이전트(Explore, Plan, Verify)와 Task 도구는 Skill에 액세스할 수 없습니다. `.claude/agents/`에서 명시적 `skills` 필드로 정의한 맞춤 subagent만 Skill을 사용할 수 있습니다.

### Skill 배포

- **프로젝트 Skill**: `.claude/skills/`를 버전 관리에 커밋하세요. 저장소를 클론하는 모든 사람이 Skill을 받습니다.
- **플러그인**: 여러 저장소에서 Skill을 공유하려면 [플러그인](/docs/en/plugins)에 `SKILL.md` 파일이 포함된 Skill 폴더로 `skills/` 디렉토리를 생성하세요. [플러그인 마켓플레이스](/docs/en/plugin-marketplaces)를 통해 배포하세요.
- **엔터프라이즈**: 관리자는 [관리 설정](/docs/en/iam#enterprise-managed-settings)을 통해 조직 전체에 Skill을 배포할 수 있습니다. 엔터프라이즈 Skill 경로는 [Skill이 있는 위치](#where-skills-live)를 참조하세요.

## 예시

### 간단한 Skill (단일 파일)

```
commit-helper/
└── SKILL.md
```

```
---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Generating Commit Messages

## Instructions

1. Run `git diff --staged` to see changes
2. I'll suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components

## Best practices

- Use present tense
- Explain what and why, not how
```

### 다중 파일 사용

```
pdf-processing/
├── SKILL.md              # 개요 및 빠른 시작
├── FORMS.md              # 폼 필드 매핑 및 채우기 지침
├── REFERENCE.md          # pypdf 및 pdfplumber API 세부 정보
└── scripts/
    ├── fill_form.py      # 폼 필드 채우기 유틸리티
    └── validate.py       # PDF에서 필수 필드 확인
```

```
---
name: pdf-processing
description: Extract text, fill forms, merge PDFs. Use when working with PDF files, forms, or document extraction. Requires pypdf and pdfplumber packages.
allowed-tools: Read, Bash(python:*)
---

# PDF Processing

## Quick start

Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For form filling, see [FORMS.md](FORMS.md).
For detailed API reference, see [REFERENCE.md](REFERENCE.md).

## Requirements

Packages must be installed in your environment:
```bash
pip install pypdf pdfplumber
```
```

> Skill에 외부 패키지가 필요한 경우 설명에 나열하세요. Claude가 사용하기 전에 패키지가 환경에 설치되어 있어야 합니다.

## 문제 해결

### Skill 보기 및 테스트

### Skill이 트리거되지 않음

- **이 Skill이 무엇을 하나요?** 특정 기능을 나열하세요.
- **Claude가 언제 사용해야 하나요?** 사용자가 언급할 트리거 용어를 포함하세요.

```
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

### Skill이 로드되지 않음

### Skill에 오류가 있음

### 여러 Skill이 충돌함

### 플러그인 Skill이 나타나지 않음

```
rm -rf ~/.claude/plugins/cache
```

```
/plugin install plugin-name@marketplace-name
```

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── my-skill/
        └── SKILL.md
```

## 다음 단계

## 작성 모범 사례

## Agent Skill 개요

## Agent SDK에서 Skill 사용

## Agent Skill 시작하기

이 페이지가 도움이 되었나요?
