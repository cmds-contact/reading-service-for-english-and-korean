# Common workflows

English

# Common workflows

Learn about common workflows with Claude Code.

## Understand new codebases

### Get a quick codebase overview

Navigate to the project root directory

```
cd /path/to/project
```

Start Claude Code

```
claude
```

Ask for a high-level overview

```
> give me an overview of this codebase
```

Dive deeper into specific components

```
> explain the main architecture patterns used here
```

```
> what are the key data models?
```

```
> how is authentication handled?
```

> Tips:
> Start with broad questions, then narrow down to specific areas
> Ask about coding conventions and patterns used in the project
> Request a glossary of project-specific terms

- Start with broad questions, then narrow down to specific areas
- Ask about coding conventions and patterns used in the project
- Request a glossary of project-specific terms

### Find relevant code

Ask Claude to find relevant files

```
> find the files that handle user authentication
```

Get context on how components interact

```
> how do these authentication files work together?
```

Understand the execution flow

```
> trace the login process from front-end to database
```

> Tips:
> Be specific about what you’re looking for
> Use domain language from the project

- Be specific about what you’re looking for
- Use domain language from the project

## Fix bugs efficiently

Share the error with Claude

```
> I'm seeing an error when I run npm test
```

Ask for fix recommendations

```
> suggest a few ways to fix the @ts-ignore in user.ts
```

Apply the fix

```
> update user.ts to add the null check you suggested
```

> Tips:
> Tell Claude the command to reproduce the issue and get a stack trace
> Mention any steps to reproduce the error
> Let Claude know if the error is intermittent or consistent

- Tell Claude the command to reproduce the issue and get a stack trace
- Mention any steps to reproduce the error
- Let Claude know if the error is intermittent or consistent

## Refactor code

Identify legacy code for refactoring

```
> find deprecated API usage in our codebase
```

Get refactoring recommendations

```
> suggest how to refactor utils.js to use modern JavaScript features
```

Apply the changes safely

```
> refactor utils.js to use ES2024 features while maintaining the same behavior
```

Verify the refactoring

```
> run tests for the refactored code
```

> Tips:
> Ask Claude to explain the benefits of the modern approach
> Request that changes maintain backward compatibility when needed
> Do refactoring in small, testable increments

- Ask Claude to explain the benefits of the modern approach
- Request that changes maintain backward compatibility when needed
- Do refactoring in small, testable increments

## Use specialized subagents

View available subagents

```
> /agents
```

Use subagents automatically

```
> review my recent code changes for security issues
```

```
> run all tests and fix any failures
```

Explicitly request specific subagents

```
> use the code-reviewer subagent to check the auth module
```

```
> have the debugger subagent investigate why users can't log in
```

Create custom subagents for your workflow

- A unique identifier that describes the subagent’s purpose (for example, `code-reviewer`, `api-designer`).
- When Claude should use this agent
- Which tools it can access
- A system prompt describing the agent’s role and behavior

> Tips:
> Create project-specific subagents in `.claude/agents/` for team sharing
> Use descriptive `description` fields to enable automatic delegation
> Limit tool access to what each subagent actually needs
> Check the [subagents documentation](/docs/en/sub-agents) for detailed examples

- Create project-specific subagents in `.claude/agents/` for team sharing
- Use descriptive `description` fields to enable automatic delegation
- Limit tool access to what each subagent actually needs
- Check the [subagents documentation](/docs/en/sub-agents) for detailed examples

## Use Plan Mode for safe code analysis

### When to use Plan Mode

- **Multi-step implementation**: When your feature requires making edits to many files
- **Code exploration**: When you want to research the codebase thoroughly before changing anything
- **Interactive development**: When you want to iterate on the direction with Claude

### How to use Plan Mode

```
claude --permission-mode plan
```

```
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

### Example: Planning a complex refactor

```
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
```

```
> What about backward compatibility?
> How should we handle database migration?
```

### Configure Plan Mode as default

```
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

## Work with tests

Identify untested code

```
> find functions in NotificationsService.swift that are not covered by tests
```

Generate test scaffolding

```
> add tests for the notification service
```

Add meaningful test cases

```
> add test cases for edge conditions in the notification service
```

Run and verify tests

```
> run the new tests and fix any failures
```

## Create pull requests

Summarize your changes

```
> summarize the changes I've made to the authentication module
```

Generate a pull request with Claude

```
> create a pr
```

Review and refine

```
> enhance the PR description with more context about the security improvements
```

Add testing details

```
> add information about how these changes were tested
```

> Tips:
> Ask Claude directly to make a PR for you
> Review Claude’s generated PR before submitting
> Ask Claude to highlight potential risks or considerations

- Ask Claude directly to make a PR for you
- Review Claude’s generated PR before submitting
- Ask Claude to highlight potential risks or considerations

## Handle documentation

Identify undocumented code

```
> find functions without proper JSDoc comments in the auth module
```

Generate documentation

```
> add JSDoc comments to the undocumented functions in auth.js
```

Review and enhance

```
> improve the generated documentation with more context and examples
```

Verify documentation

```
> check if the documentation follows our project standards
```

> Tips:
> Specify the documentation style you want (JSDoc, docstrings, etc.)
> Ask for examples in the documentation
> Request documentation for public APIs, interfaces, and complex logic

- Specify the documentation style you want (JSDoc, docstrings, etc.)
- Ask for examples in the documentation
- Request documentation for public APIs, interfaces, and complex logic

## Work with images

Add an image to the conversation

- Drag and drop an image into the Claude Code window
- Copy an image and paste it into the CLI with ctrl+v (Do not use cmd+v)
- Provide an image path to Claude. E.g., “Analyze this image: /path/to/your/image.png”

Ask Claude to analyze the image

```
> What does this image show?
```

```
> Describe the UI elements in this screenshot
```

```
> Are there any problematic elements in this diagram?
```

Use images for context

```
> Here's a screenshot of the error. What's causing it?
```

```
> This is our current database schema. How should we modify it for the new feature?
```

Get code suggestions from visual content

```
> Generate CSS to match this design mockup
```

```
> What HTML structure would recreate this component?
```

> Tips:
> Use images when text descriptions would be unclear or cumbersome
> Include screenshots of errors, UI designs, or diagrams for better context
> You can work with multiple images in a conversation
> Image analysis works with diagrams, screenshots, mockups, and more

- Use images when text descriptions would be unclear or cumbersome
- Include screenshots of errors, UI designs, or diagrams for better context
- You can work with multiple images in a conversation
- Image analysis works with diagrams, screenshots, mockups, and more

## Reference files and directories

Reference a single file

```
> Explain the logic in @src/utils/auth.js
```

Reference a directory

```
> What's the structure of @src/components?
```

Reference MCP resources

```
> Show me the data from @github:repos/owner/repo/issues
```

> Tips:
> File paths can be relative or absolute
> @ file references add `CLAUDE.md` in the file’s directory and parent directories to context
> Directory references show file listings, not contents
> You can reference multiple files in a single message (for example, “@file1.js and @file2.js”)

- File paths can be relative or absolute
- @ file references add `CLAUDE.md` in the file’s directory and parent directories to context
- Directory references show file listings, not contents
- You can reference multiple files in a single message (for example, “@file1.js and @file2.js”)

## Use extended thinking (thinking mode)

> Sonnet 4.5 and Opus 4.5 have thinking enabled by default. All other models have thinking disabled by default. Use `/model` to view or switch your current model.

### Per-request thinking with ultrathink

```
> ultrathink: design a caching layer for our API
```

### How extended thinking token budgets work

- More space to explore multiple solution approaches step-by-step
- Room to analyze edge cases and evaluate tradeoffs thoroughly
- Ability to revise reasoning and self-correct mistakes
- When thinking is **enabled** (via `/config` or `ultrathink`), Claude can use up to **31,999 tokens** from your output budget for internal reasoning
- When thinking is **disabled**, Claude uses **0 tokens** for thinking
- You can set a custom thinking token budget using the `MAX_THINKING_TOKENS` environment variable
- This takes highest priority and overrides the default 31,999 token budget
- See the [extended thinking documentation](https://docs.claude.com/en/docs/build-with-claude/extended-thinking) for valid token ranges

> You’re charged for all thinking tokens used, even though Claude 4 models show summarized thinking

## Resume previous conversations

- `claude --continue` continues the most recent conversation in the current directory
- `claude --resume` opens a conversation picker or resumes by name

### Name your sessions

Name the current session

```
> /rename auth-refactor
```

Resume by name later

```
claude --resume auth-refactor
```

```
> /resume auth-refactor
```

### Use the session picker

- Session name or initial prompt
- Time elapsed since last activity
- Message count
- Git branch (if applicable)

> Tips:
> **Name sessions early**: Use `/rename` when starting work on a distinct task—it’s much easier to find “payment-integration” than “explain this function” later
> Use `--continue` for quick access to your most recent conversation
> Use `--resume session-name` when you know which session you need
> Use `--resume` (without a name) when you need to browse and select
> For scripts, use `claude --continue --print "prompt"` to resume in non-interactive mode
> Press `P` in the picker to preview a session before resuming it
> The resumed conversation starts with the same model and configuration as the original
> How it works:
> **Conversation Storage**: All conversations are automatically saved locally with their full message history
> **Message Deserialization**: When resuming, the entire message history is restored to maintain context
> **Tool State**: Tool usage and results from the previous conversation are preserved
> **Context Restoration**: The conversation resumes with all previous context intact

- **Name sessions early**: Use `/rename` when starting work on a distinct task—it’s much easier to find “payment-integration” than “explain this function” later
- Use `--continue` for quick access to your most recent conversation
- Use `--resume session-name` when you know which session you need
- Use `--resume` (without a name) when you need to browse and select
- For scripts, use `claude --continue --print "prompt"` to resume in non-interactive mode
- Press `P` in the picker to preview a session before resuming it
- The resumed conversation starts with the same model and configuration as the original
- **Conversation Storage**: All conversations are automatically saved locally with their full message history
- **Message Deserialization**: When resuming, the entire message history is restored to maintain context
- **Tool State**: Tool usage and results from the previous conversation are preserved
- **Context Restoration**: The conversation resumes with all previous context intact

## Run parallel Claude Code sessions with Git worktrees

Understand Git worktrees

Create a new worktree

```
# Create a new worktree with a new branch 
git worktree add ../project-feature-a -b feature-a

# Or create a worktree with an existing branch
git worktree add ../project-bugfix bugfix-123
```

Run Claude Code in each worktree

```
# Navigate to your worktree 
cd ../project-feature-a

# Run Claude Code in this isolated environment
claude
```

Run Claude in another worktree

```
cd ../project-bugfix
claude
```

Manage your worktrees

```
# List all worktrees
git worktree list

# Remove a worktree when done
git worktree remove ../project-feature-a
```

> Tips:
> Each worktree has its own independent file state, making it perfect for parallel Claude Code sessions
> Changes made in one worktree won’t affect others, preventing Claude instances from interfering with each other
> All worktrees share the same Git history and remote connections
> For long-running tasks, you can have Claude working in one worktree while you continue development in another
> Use descriptive directory names to easily identify which task each worktree is for
> Remember to initialize your development environment in each new worktree according to your project’s setup. Depending on your stack, this might include:
> 
> JavaScript projects: Running dependency installation (`npm install`, `yarn`)
> Python projects: Setting up virtual environments or installing with package managers
> Other languages: Following your project’s standard setup process

- Each worktree has its own independent file state, making it perfect for parallel Claude Code sessions
- Changes made in one worktree won’t affect others, preventing Claude instances from interfering with each other
- All worktrees share the same Git history and remote connections
- For long-running tasks, you can have Claude working in one worktree while you continue development in another
- Use descriptive directory names to easily identify which task each worktree is for
- Remember to initialize your development environment in each new worktree according to your project’s setup. Depending on your stack, this might include:

JavaScript projects: Running dependency installation (`npm install`, `yarn`)
Python projects: Setting up virtual environments or installing with package managers
Other languages: Following your project’s standard setup process
- JavaScript projects: Running dependency installation (`npm install`, `yarn`)
- Python projects: Setting up virtual environments or installing with package managers
- Other languages: Following your project’s standard setup process

## Use Claude as a unix-style utility

### Add Claude to your verification process

```
// package.json
{
    ...
    "scripts": {
        ...
        "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
    }
}
```

> Tips:
> Use Claude for automated code review in your CI/CD pipeline
> Customize the prompt to check for specific issues relevant to your project
> Consider creating multiple scripts for different types of verification

- Use Claude for automated code review in your CI/CD pipeline
- Customize the prompt to check for specific issues relevant to your project
- Consider creating multiple scripts for different types of verification

### Pipe in, pipe out

```
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

> Tips:
> Use pipes to integrate Claude into existing shell scripts
> Combine with other Unix tools for powerful workflows
> Consider using —output-format for structured output

- Use pipes to integrate Claude into existing shell scripts
- Combine with other Unix tools for powerful workflows
- Consider using —output-format for structured output

### Control output format

Use text format (default)

```
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt
```

Use JSON format

```
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json
```

Use streaming JSON format

```
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json
```

> Tips:
> Use `--output-format text` for simple integrations where you just need Claude’s response
> Use `--output-format json` when you need the full conversation log
> Use `--output-format stream-json` for real-time output of each conversation turn

- Use `--output-format text` for simple integrations where you just need Claude’s response
- Use `--output-format json` when you need the full conversation log
- Use `--output-format stream-json` for real-time output of each conversation turn

## Create custom slash commands

### Create project-specific commands

Create a commands directory in your project

```
mkdir -p .claude/commands
```

Create a Markdown file for each command

```
echo "Analyze the performance of this code and suggest three specific optimizations:" > .claude/commands/optimize.md
```

Use your custom command in Claude Code

```
> /optimize
```

> Tips:
> Command names are derived from the filename (for example, `optimize.md` becomes `/optimize`)
> You can organize commands in subdirectories (for example, `.claude/commands/frontend/component.md` creates `/component` with “(project:frontend)” shown in the description)
> Project commands are available to everyone who clones the repository
> The Markdown file content becomes the prompt sent to Claude when the command is invoked

- Command names are derived from the filename (for example, `optimize.md` becomes `/optimize`)
- You can organize commands in subdirectories (for example, `.claude/commands/frontend/component.md` creates `/component` with “(project:frontend)” shown in the description)
- Project commands are available to everyone who clones the repository
- The Markdown file content becomes the prompt sent to Claude when the command is invoked

### Add command arguments with $ARGUMENTS

Create a command file with the $ARGUMENTS placeholder

```
echo 'Find and fix issue #$ARGUMENTS. Follow these steps: 1.
Understand the issue described in the ticket 2. Locate the relevant code in
our codebase 3. Implement a solution that addresses the root cause 4. Add
appropriate tests 5. Prepare a concise PR description' >
.claude/commands/fix-issue.md
```

Use the command with an issue number

```
> /fix-issue 123
```

> Tips:
> The $ARGUMENTS placeholder is replaced with any text that follows the command
> You can position $ARGUMENTS anywhere in your command template
> Other useful applications: generating test cases for specific functions, creating documentation for components, reviewing code in particular files, or translating content to specified languages

- The $ARGUMENTS placeholder is replaced with any text that follows the command
- You can position $ARGUMENTS anywhere in your command template
- Other useful applications: generating test cases for specific functions, creating documentation for components, reviewing code in particular files, or translating content to specified languages

### Create personal slash commands

Create a commands directory in your home folder

```
mkdir -p ~/.claude/commands
```

```
echo "Review this code for security vulnerabilities, focusing on:" >
~/.claude/commands/security-review.md
```

Use your personal custom command

```
> /security-review
```

> Tips:
> Personal commands show “(user)” in their description when listed with `/help`
> Personal commands are only available to you and not shared with your team
> Personal commands work across all your projects
> You can use these for consistent workflows across different codebases

- Personal commands show “(user)” in their description when listed with `/help`
- Personal commands are only available to you and not shared with your team
- Personal commands work across all your projects
- You can use these for consistent workflows across different codebases

## Ask Claude about its capabilities

### Example questions

```
> can Claude Code create pull requests?
```

```
> how does Claude Code handle permissions?
```

```
> what slash commands are available?
```

```
> how do I use MCP with Claude Code?
```

```
> how do I configure Claude Code for Amazon Bedrock?
```

```
> what are the limitations of Claude Code?
```

> Claude provides documentation-based answers to these questions. For executable examples and hands-on demonstrations, refer to the specific workflow sections above.

> Tips:
> Claude always has access to the latest Claude Code documentation, regardless of the version you’re using
> Ask specific questions to get detailed answers
> Claude can explain complex features like MCP integration, enterprise configurations, and advanced workflows

- Claude always has access to the latest Claude Code documentation, regardless of the version you’re using
- Ask specific questions to get detailed answers
- Claude can explain complex features like MCP integration, enterprise configurations, and advanced workflows

## Next steps

## Claude Code reference implementation

Was this page helpful?
