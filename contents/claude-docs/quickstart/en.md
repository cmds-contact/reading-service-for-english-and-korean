# Quickstart

English

# Quickstart

Welcome to Claude Code!

## Before you begin

- A terminal or command prompt open
- A code project to work with
- A [Claude.ai](https://claude.ai) (recommended) or [Claude Console](https://console.anthropic.com/) account

## Step 1: Install Claude Code

- Native Install (Recommended)
- Homebrew
- NPM

```
curl -fsSL https://claude.ai/install.sh | bash
```

```
irm https://claude.ai/install.ps1 | iex
```

```
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

```
brew install --cask claude-code
```

```
npm install -g @anthropic-ai/claude-code
```

## Step 2: Log in to your account

```
claude
# You'll be prompted to log in on first use
```

```
/login
# Follow the prompts to log in with your account
```

- [Claude.ai](https://claude.ai) (subscription plans - recommended)
- [Claude Console](https://console.anthropic.com/) (API access with pre-paid credits)

> When you first authenticate Claude Code with your Claude Console account, a workspace called “Claude Code” is automatically created for you. This workspace provides centralized cost tracking and management for all Claude Code usage in your organization.

> You can have both account types under the same email address. If you need to log in again or switch accounts, use the `/login` command within Claude Code.

## Step 3: Start your first session

```
cd /path/to/your/project
claude
```

> After logging in (Step 2), your credentials are stored on your system. Learn more in [Credential Management](/docs/en/iam#credential-management).

## Step 4: Ask your first question

```
> what does this project do?
```

```
> what technologies does this project use?
```

```
> where is the main entry point?
```

```
> explain the folder structure
```

```
> what can Claude Code do?
```

```
> how do I use slash commands in Claude Code?
```

```
> can Claude Code work with Docker?
```

> Claude Code reads your files as needed - you don’t have to manually add context. Claude also has access to its own documentation and can answer questions about its features and capabilities.

## Step 5: Make your first code change

```
> add a hello world function to the main file
```

- Find the appropriate file
- Show you the proposed changes
- Ask for your approval
- Make the edit

> Claude Code always asks for permission before modifying files. You can approve individual changes or enable “Accept all” mode for a session.

## Step 6: Use Git with Claude Code

```
> what files have I changed?
```

```
> commit my changes with a descriptive message
```

```
> create a new branch called feature/quickstart
```

```
> show me the last 5 commits
```

```
> help me resolve merge conflicts
```

## Step 7: Fix a bug or add a feature

```
> add input validation to the user registration form
```

```
> there's a bug where users can submit empty forms - fix it
```

- Locate the relevant code
- Understand the context
- Implement a solution
- Run tests if available

## Step 8: Test out other common workflows

```
> refactor the authentication module to use async/await instead of callbacks
```

```
> write unit tests for the calculator functions
```

```
> update the README with installation instructions
```

```
> review my changes and suggest improvements
```

> **Remember**: Claude Code is your AI pair programmer. Talk to it like you would a helpful colleague - describe what you want to achieve, and it will help you get there.

## Essential commands

## Pro tips for beginners

Be specific with your requests

Use step-by-step instructions

```
> 1. create a new database table for user profiles
```

```
> 2. create an API endpoint to get and update user profiles
```

```
> 3. build a webpage that allows users to see and edit their information
```

Let Claude explore first

```
> analyze the database schema
```

```
> build a dashboard showing products that are most frequently returned by our UK customers
```

Save time with shortcuts

- Press `?` to see all available keyboard shortcuts
- Use Tab for command completion
- Press ↑ for command history
- Type `/` to see all slash commands

## What’s next?

## Common workflows

## CLI reference

## Configuration

## Claude Code on the web

## About Claude Code

## Getting help

- **In Claude Code**: Type `/help` or ask “how do I…”
- **Documentation**: You’re here! Browse other guides
- **Community**: Join our [Discord](https://www.anthropic.com/discord) for tips and support

Was this page helpful?
