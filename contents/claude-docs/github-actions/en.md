# Claude Code GitHub Actions

English

# Claude Code GitHub Actions

Learn about integrating Claude Code into your development workflow with Claude Code GitHub Actions

> Claude Code GitHub Actions is built on top of the [Claude Code
> SDK](https://docs.claude.com/en/docs/agent-sdk), which enables programmatic integration of
> Claude Code into your applications. You can use the SDK to build custom
> automation workflows beyond GitHub Actions.

> **Claude Opus 4.5 is now available.** Claude Code GitHub Actions default to Sonnet. To use Opus 4.5, configure the [model parameter](#breaking-changes-reference) to use `claude-opus-4-5-20251101`.

## Why use Claude Code GitHub Actions?

- **Instant PR creation**: Describe what you need, and Claude creates a complete PR with all necessary changes
- **Automated code implementation**: Turn issues into working code with a single command
- **Follows your standards**: Claude respects your `CLAUDE.md` guidelines and existing code patterns
- **Simple setup**: Get started in minutes with our installer and API key
- **Secure by default**: Your code stays on Github’s runners

## What can Claude do?

### Claude Code Action

## Setup

## Quick setup

> You must be a repository admin to install the GitHub app and add secrets
> The GitHub app will request read & write permissions for Contents, Issues, and Pull requests
> This quickstart method is only available for direct Claude API users. If
> you’re using AWS Bedrock or Google Vertex AI, please see the [Using with AWS
> Bedrock & Google Vertex AI](#using-with-aws-bedrock-%26-google-vertex-ai)
> section.

- You must be a repository admin to install the GitHub app and add secrets
- The GitHub app will request read & write permissions for Contents, Issues, and Pull requests
- This quickstart method is only available for direct Claude API users. If
you’re using AWS Bedrock or Google Vertex AI, please see the [Using with AWS
Bedrock & Google Vertex AI](#using-with-aws-bedrock-%26-google-vertex-ai)
section.

## Manual setup

- **Install the Claude GitHub app** to your repository: [https://github.com/apps/claude](https://github.com/apps/claude)
The Claude GitHub app requires the following repository permissions:

**Contents**: Read & write (to modify repository files)
**Issues**: Read & write (to respond to issues)
**Pull requests**: Read & write (to create PRs and push changes)

For more details on security and permissions, see the [security documentation](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md).
- **Contents**: Read & write (to modify repository files)
- **Issues**: Read & write (to respond to issues)
- **Pull requests**: Read & write (to create PRs and push changes)
- **Add ANTHROPIC_API_KEY** to your repository secrets ([Learn how to use secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions))
- **Copy the workflow file** from [examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) into your repository’s `.github/workflows/`

> After completing either the quickstart or manual setup, test the action by tagging `@claude` in an issue or PR comment.

## Upgrading from Beta

> Claude Code GitHub Actions v1.0 introduces breaking changes that require updating your workflow files in order to upgrade to v1.0 from the beta version.

### Essential changes

- **Update the action version**: Change `@beta` to `@v1`
- **Remove mode configuration**: Delete `mode: "tag"` or `mode: "agent"` (now auto-detected)
- **Update prompt inputs**: Replace `direct_prompt` with `prompt`
- **Move CLI options**: Convert `max_turns`, `model`, `custom_instructions`, etc. to `claude_args`

### Breaking Changes Reference

### Before and After Example

```
- uses: anthropics/claude-code-action@beta
  with:
    mode: "tag"
    direct_prompt: "Review this PR for security issues"
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    custom_instructions: "Follow our coding standards"
    max_turns: "10"
    model: "claude-sonnet-4-5-20250929"
```

```
- uses: anthropics/claude-code-action@v1
  with:
    prompt: "Review this PR for security issues"
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude_args: |
      --system-prompt "Follow our coding standards"
      --max-turns 10
      --model claude-sonnet-4-5-20250929
```

> The action now automatically detects whether to run in interactive mode (responds to `@claude` mentions) or automation mode (runs immediately with a prompt) based on your configuration.

## Example use cases

### Basic workflow

```
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # Responds to @claude mentions in comments
```

### Using slash commands

```
name: Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "/review"
          claude_args: "--max-turns 5"
```

### Custom automation with prompts

```
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
          claude_args: "--model claude-opus-4-5-20251101"
```

### Common use cases

```
@claude implement this feature based on the issue description
@claude how should I implement user authentication for this endpoint?
@claude fix the TypeError in the user dashboard component
```

## Best practices

### CLAUDE.md configuration

### Security considerations

> Never commit API keys directly to your repository.

- Add your API key as a repository secret named `ANTHROPIC_API_KEY`
- Reference it in workflows: `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`
- Limit action permissions to only what’s necessary
- Review Claude’s suggestions before merging

### Optimizing performance

### CI costs

- Claude Code runs on GitHub-hosted runners, which consume your GitHub Actions minutes
- See [GitHub’s billing documentation](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) for detailed pricing and minute limits
- Each Claude interaction consumes API tokens based on the length of prompts and responses
- Token usage varies by task complexity and codebase size
- See [Claude’s pricing page](https://claude.com/platform/api) for current token rates
- Use specific `@claude` commands to reduce unnecessary API calls
- Configure appropriate `--max-turns` in `claude_args` to prevent excessive iterations
- Set workflow-level timeouts to avoid runaway jobs
- Consider using GitHub’s concurrency controls to limit parallel runs

## Configuration examples

```
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: "Your instructions here" # Optional
    claude_args: "--max-turns 5" # Optional CLI arguments
```

- **Unified prompt interface** - Use `prompt` for all instructions
- **Slash commands** - Pre-built prompts like `/review` or `/fix`
- **CLI passthrough** - Any Claude Code CLI argument via `claude_args`
- **Flexible triggers** - Works with any GitHub event

> When responding to issue or PR comments, Claude automatically responds to @claude mentions. For other events, use the `prompt` parameter to provide instructions.

## Using with AWS Bedrock & Google Vertex AI

### Prerequisites

#### For Google Cloud Vertex AI:

- A Google Cloud Project with Vertex AI enabled
- Workload Identity Federation configured for GitHub Actions
- A service account with the required permissions
- A GitHub App (recommended) or use the default GITHUB_TOKEN

#### For AWS Bedrock:

- An AWS account with Amazon Bedrock enabled
- GitHub OIDC Identity Provider configured in AWS
- An IAM role with Bedrock permissions

Create a custom GitHub App (Recommended for 3P Providers)

- Go to [https://github.com/settings/apps/new](https://github.com/settings/apps/new)
- Fill in the basic information:

**GitHub App name**: Choose a unique name (e.g., “YourOrg Claude Assistant”)
**Homepage URL**: Your organization’s website or the repository URL
- **GitHub App name**: Choose a unique name (e.g., “YourOrg Claude Assistant”)
- **Homepage URL**: Your organization’s website or the repository URL
- Configure the app settings:

**Webhooks**: Uncheck “Active” (not needed for this integration)
- **Webhooks**: Uncheck “Active” (not needed for this integration)
- Set the required permissions:

**Repository permissions**:

Contents: Read & Write
Issues: Read & Write
Pull requests: Read & Write
- **Repository permissions**:

Contents: Read & Write
Issues: Read & Write
Pull requests: Read & Write
- Contents: Read & Write
- Issues: Read & Write
- Pull requests: Read & Write
- Click “Create GitHub App”
- After creation, click “Generate a private key” and save the downloaded `.pem` file
- Note your App ID from the app settings page
- Install the app to your repository:

From your app’s settings page, click “Install App” in the left sidebar
Select your account or organization
Choose “Only select repositories” and select the specific repository
Click “Install”
- From your app’s settings page, click “Install App” in the left sidebar
- Select your account or organization
- Choose “Only select repositories” and select the specific repository
- Click “Install”
- Add the private key as a secret to your repository:

Go to your repository’s Settings → Secrets and variables → Actions
Create a new secret named `APP_PRIVATE_KEY` with the contents of the `.pem` file
- Go to your repository’s Settings → Secrets and variables → Actions
- Create a new secret named `APP_PRIVATE_KEY` with the contents of the `.pem` file
- Add the App ID as a secret:
- Create a new secret named `APP_ID` with your GitHub App’s ID

> This app will be used with the [actions/create-github-app-token](https://github.com/actions/create-github-app-token) action to generate authentication tokens in your workflows.

- Install from: [https://github.com/apps/claude](https://github.com/apps/claude)
- No additional configuration needed for authentication

Configure cloud provider authentication

AWS Bedrock

> **Security Note**: Use repository-specific configurations and grant only the minimum required permissions.

- **Enable Amazon Bedrock**:

Request access to Claude models in Amazon Bedrock
For cross-region models, request access in all required regions
- Request access to Claude models in Amazon Bedrock
- For cross-region models, request access in all required regions
- **Set up GitHub OIDC Identity Provider**:

Provider URL: `https://token.actions.githubusercontent.com`
Audience: `sts.amazonaws.com`
- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`
- **Create IAM Role for GitHub Actions**:

Trusted entity type: Web identity
Identity provider: `token.actions.githubusercontent.com`
Permissions: `AmazonBedrockFullAccess` policy
Configure trust policy for your specific repository
- Trusted entity type: Web identity
- Identity provider: `token.actions.githubusercontent.com`
- Permissions: `AmazonBedrockFullAccess` policy
- Configure trust policy for your specific repository
- **AWS_ROLE_TO_ASSUME**: The ARN of the IAM role you created

> OIDC is more secure than using static AWS access keys because credentials are temporary and automatically rotated.

Google Vertex AI

- **Enable APIs** in your Google Cloud project:

IAM Credentials API
Security Token Service (STS) API
Vertex AI API
- IAM Credentials API
- Security Token Service (STS) API
- Vertex AI API
- **Create Workload Identity Federation resources**:

Create a Workload Identity Pool
Add a GitHub OIDC provider with:

Issuer: `https://token.actions.githubusercontent.com`
Attribute mappings for repository and owner
**Security recommendation**: Use repository-specific attribute conditions
- Create a Workload Identity Pool
- Add a GitHub OIDC provider with:

Issuer: `https://token.actions.githubusercontent.com`
Attribute mappings for repository and owner
**Security recommendation**: Use repository-specific attribute conditions
- Issuer: `https://token.actions.githubusercontent.com`
- Attribute mappings for repository and owner
- **Security recommendation**: Use repository-specific attribute conditions
- **Create a Service Account**:

Grant only `Vertex AI User` role
**Security recommendation**: Create a dedicated service account per repository
- Grant only `Vertex AI User` role
- **Security recommendation**: Create a dedicated service account per repository
- **Configure IAM bindings**:

Allow the Workload Identity Pool to impersonate the service account
**Security recommendation**: Use repository-specific principal sets
- Allow the Workload Identity Pool to impersonate the service account
- **Security recommendation**: Use repository-specific principal sets
- **GCP_WORKLOAD_IDENTITY_PROVIDER**: The full provider resource name
- **GCP_SERVICE_ACCOUNT**: The service account email address

> Workload Identity Federation eliminates the need for downloadable service account keys, improving security.

Add Required Secrets

#### For Claude API (Direct):

- **For API Authentication**:

`ANTHROPIC_API_KEY`: Your Claude API key from [console.anthropic.com](https://console.anthropic.com)
- `ANTHROPIC_API_KEY`: Your Claude API key from [console.anthropic.com](https://console.anthropic.com)
- **For GitHub App (if using your own app)**:

`APP_ID`: Your GitHub App’s ID
`APP_PRIVATE_KEY`: The private key (.pem) content
- `APP_ID`: Your GitHub App’s ID
- `APP_PRIVATE_KEY`: The private key (.pem) content

#### For Google Cloud Vertex AI

- **For GCP Authentication**:

`GCP_WORKLOAD_IDENTITY_PROVIDER`
`GCP_SERVICE_ACCOUNT`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

#### For AWS Bedrock

- **For AWS Authentication**:

`AWS_ROLE_TO_ASSUME`
- `AWS_ROLE_TO_ASSUME`

Create workflow files

AWS Bedrock workflow

- AWS Bedrock access enabled with Claude model permissions
- GitHub configured as an OIDC identity provider in AWS
- IAM role with Bedrock permissions that trusts GitHub Actions

```
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    env:
      AWS_REGION: us-west-2
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
          aws-region: us-west-2

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          use_bedrock: "true"
          claude_args: '--model us.anthropic.claude-sonnet-4-5-20250929-v1:0 --max-turns 10'
```

> The model ID format for Bedrock includes the region prefix (e.g., `us.anthropic.claude...`) and version suffix.

Google Vertex AI workflow

- Vertex AI API enabled in your GCP project
- Workload Identity Federation configured for GitHub
- Service account with Vertex AI permissions

```
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          trigger_phrase: "@claude"
          use_vertex: "true"
          claude_args: '--model claude-sonnet-4@20250514 --max-turns 10'
        env:
          ANTHROPIC_VERTEX_PROJECT_ID: ${{ steps.auth.outputs.project_id }}
          CLOUD_ML_REGION: us-east5
          VERTEX_REGION_CLAUDE_3_7_SONNET: us-east5
```

> The project ID is automatically retrieved from the Google Cloud authentication step, so you don’t need to hardcode it.

## Troubleshooting

### Claude not responding to @claude commands

### CI not running on Claude’s commits

### Authentication errors

## Advanced configuration

### Action parameters

#### Pass CLI arguments

```
claude_args: "--max-turns 5 --model claude-sonnet-4-5-20250929 --mcp-config /path/to/config.json"
```

- `--max-turns`: Maximum conversation turns (default: 10)
- `--model`: Model to use (for example, `claude-sonnet-4-5-20250929`)
- `--mcp-config`: Path to MCP configuration
- `--allowed-tools`: Comma-separated list of allowed tools
- `--debug`: Enable debug output

### Alternative integration methods

- **Custom GitHub App**: For organizations needing branded usernames or custom authentication flows. Create your own GitHub App with required permissions (contents, issues, pull requests) and use the actions/create-github-app-token action to generate tokens in your workflows.
- **Manual GitHub Actions**: Direct workflow configuration for maximum flexibility
- **MCP Configuration**: Dynamic loading of Model Context Protocol servers

### Customizing Claude’s behavior

- **CLAUDE.md**: Define coding standards, review criteria, and project-specific rules in a `CLAUDE.md` file at the root of your repository. Claude will follow these guidelines when creating PRs and responding to requests. Check out our [Memory documentation](/docs/en/memory) for more details.
- **Custom prompts**: Use the `prompt` parameter in the workflow file to provide workflow-specific instructions. This allows you to customize Claude’s behavior for different workflows or tasks.

Was this page helpful?
