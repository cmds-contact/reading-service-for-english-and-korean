# Agent Skills

English

# Agent Skills

Create, manage, and share Skills to extend Claude’s capabilities in Claude Code.

## Create your first Skill

Check available Skills

```
What Skills are available?
```

Create the Skill directory

```
mkdir -p ~/.claude/skills/explaining-code
```

Write SKILL.md

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

Load and verify the Skill

Test the Skill

```
How does this code work?
```

## How Skills work

Discovery

Activation

Execution

### Where Skills live

### When to use Skills versus other options

> For a deep dive into the architecture and real-world applications of Agent Skills, read [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).

## Configure Skills

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

#### Available metadata fields

### Update or delete a Skill

### Add supporting files with progressive disclosure

> Keep `SKILL.md` under 500 lines for optimal performance. If your content exceeds this, split detailed reference material into separate files.

#### Example: multi-file Skill structure

```
my-skill/
├── SKILL.md (required - overview and navigation)
├── reference.md (detailed API docs - loaded when needed)
├── examples.md (usage examples - loaded when needed)
└── scripts/
    └── helper.py (utility script - executed, not loaded)
```

```
## Overview

[Essential instructions here]

## Additional resources

- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)

## Utility scripts

To validate input files, run the helper script. It checks for required fields and returns any validation errors:
```bash
python scripts/helper.py input.txt
```
```

> Keep references one level deep. Link directly from `SKILL.md` to reference files. Deeply nested references (file A links to file B which links to file C) may result in Claude partially reading files.

- Complex validation logic that would be verbose to describe in prose
- Data processing that’s more reliable as tested code than generated code
- Operations that benefit from consistency across uses

```
Run the validation script to check the form:
python scripts/validate_form.py input.pdf
```

### Restrict tool access with allowed-tools

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

- Read-only Skills that shouldn’t modify files
- Skills with limited scope: for example, only data analysis, no file writing
- Security-sensitive workflows where you want to restrict capabilities

> `allowed-tools` is only supported for Skills in Claude Code.

### Use Skills with subagents

```
# .claude/agents/code-reviewer/AGENT.md
---
name: code-reviewer
description: Review code for quality and best practices
skills: pr-review, security-check
---
```

> Built-in agents (Explore, Plan, Verify) and the Task tool do not have access to your Skills. Only custom subagents you define in `.claude/agents/` with an explicit `skills` field can use Skills.

### Distribute Skills

- **Project Skills**: Commit `.claude/skills/` to version control. Anyone who clones the repository gets the Skills.
- **Plugins**: To share Skills across multiple repositories, create a `skills/` directory in your [plugin](/docs/en/plugins) with Skill folders containing `SKILL.md` files. Distribute through a [plugin marketplace](/docs/en/plugin-marketplaces).
- **Enterprise**: Administrators can deploy Skills organization-wide through [managed settings](/docs/en/iam#enterprise-managed-settings). See [Where Skills live](#where-skills-live) for enterprise Skill paths.

## Examples

### Simple Skill (single file)

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

### Use multiple files

```
pdf-processing/
├── SKILL.md              # Overview and quick start
├── FORMS.md              # Form field mappings and filling instructions
├── REFERENCE.md          # API details for pypdf and pdfplumber
└── scripts/
    ├── fill_form.py      # Utility to populate form fields
    └── validate.py       # Checks PDFs for required fields
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

> If your Skill requires external packages, list them in the description. Packages must be installed in your environment before Claude can use them.

## Troubleshooting

### View and test Skills

### Skill not triggering

- **What does this Skill do?** List the specific capabilities.
- **When should Claude use it?** Include trigger terms users would mention.

```
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

### Skill doesn’t load

### Skill has errors

### Multiple Skills conflict

### Plugin Skills not appearing

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

## Next steps

## Authoring best practices

## Agent Skills overview

## Use Skills in the Agent SDK

## Get started with Agent Skills

Was this page helpful?
