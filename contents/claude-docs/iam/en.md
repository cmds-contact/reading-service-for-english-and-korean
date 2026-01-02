# Identity and Access Management

English

# Identity and Access Management

Learn how to configure user authentication, authorization, and access controls for Claude Code in your organization.

## Authentication methods

- Claude API via the Claude Console
- Amazon Bedrock
- Microsoft Foundry
- Google Vertex AI

### Claude API authentication

- Use your existing Claude Console account or create a new Claude Console account
- You can add users through either method below:

Bulk invite users from within the Console (Console -> Settings -> Members -> Invite)
[Set up SSO](https://support.claude.com/en/articles/10280258-setting-up-single-sign-on-on-the-api-console)
- Bulk invite users from within the Console (Console -> Settings -> Members -> Invite)
- [Set up SSO](https://support.claude.com/en/articles/10280258-setting-up-single-sign-on-on-the-api-console)
- When inviting users, they need one of the following roles:

“Claude Code” role means users can only create Claude Code API keys
“Developer” role means users can create any kind of API key
- “Claude Code” role means users can only create Claude Code API keys
- “Developer” role means users can create any kind of API key
- Each invited user needs to complete these steps:

Accept the Console invite
[Check system requirements](/docs/en/setup#system-requirements)
[Install Claude Code](/docs/en/setup#installation)
Login with Console account credentials
- Accept the Console invite
- [Check system requirements](/docs/en/setup#system-requirements)
- [Install Claude Code](/docs/en/setup#installation)
- Login with Console account credentials

### Cloud provider authentication

- Follow the [Bedrock docs](/docs/en/amazon-bedrock), [Vertex docs](/docs/en/google-vertex-ai), or [Microsoft Foundry docs](/docs/en/microsoft-foundry)
- Distribute the environment variables and instructions for generating cloud credentials to your users. Read more about how to [manage configuration here](/docs/en/settings).
- Users can [install Claude Code](/docs/en/setup#installation)

## Access control and permissions

### Permission system

### Configuring permissions

- **Allow** rules will allow Claude Code to use the specified tool without further manual approval.
- **Ask** rules will ask the user for confirmation whenever Claude Code tries to use the specified tool. Ask rules take precedence over allow rules.
- **Deny** rules will prevent Claude Code from using the specified tool. Deny rules take precedence over allow and ask rules.
- **Additional directories** extend Claude’s file access to directories beyond the initial working directory.
- **Default mode** controls Claude’s permission behavior when encountering new requests.

#### Permission modes

#### Working directories

- **During startup**: Use `--add-dir <path>` CLI argument
- **During session**: Use `/add-dir` slash command
- **Persistent configuration**: Add to `additionalDirectories` in [settings files](/docs/en/settings#settings-files)

#### Tool-specific permission rules

- `Bash(npm run build)` Matches the exact Bash command `npm run build`
- `Bash(npm run test:*)` Matches Bash commands starting with `npm run test`
- `Bash(curl http://site.com/:*)` Matches curl commands that start with exactly `curl http://site.com/`

> Claude Code is aware of shell operators (like `&&`) so a prefix match rule like `Bash(safe-cmd:*)` won’t give it permission to run the command `safe-cmd && other-cmd`

> Important limitations of Bash permission patterns:
> This tool uses **prefix matches**, not regex or glob patterns
> The wildcard `:*` only works at the end of a pattern to match any continuation
> Patterns like `Bash(curl http://github.com/:*)` can be bypassed in many ways:
> 
> Options before URL: `curl -X GET http://github.com/...` won’t match
> Different protocol: `curl https://github.com/...` won’t match
> Redirects: `curl -L http://bit.ly/xyz` (redirects to github)
> Variables: `URL=http://github.com && curl $URL` won’t match
> Extra spaces: `curl  http://github.com` won’t match
> 
> 
> For more reliable URL filtering, consider:
> Using the WebFetch tool with `WebFetch(domain:github.com)` permission
> Instructing Claude Code about your allowed curl patterns via CLAUDE.md
> Using hooks for custom permission validation

- This tool uses **prefix matches**, not regex or glob patterns
- The wildcard `:*` only works at the end of a pattern to match any continuation
- Patterns like `Bash(curl http://github.com/:*)` can be bypassed in many ways:

Options before URL: `curl -X GET http://github.com/...` won’t match
Different protocol: `curl https://github.com/...` won’t match
Redirects: `curl -L http://bit.ly/xyz` (redirects to github)
Variables: `URL=http://github.com && curl $URL` won’t match
Extra spaces: `curl  http://github.com` won’t match
- Options before URL: `curl -X GET http://github.com/...` won’t match
- Different protocol: `curl https://github.com/...` won’t match
- Redirects: `curl -L http://bit.ly/xyz` (redirects to github)
- Variables: `URL=http://github.com && curl $URL` won’t match
- Extra spaces: `curl  http://github.com` won’t match
- Using the WebFetch tool with `WebFetch(domain:github.com)` permission
- Instructing Claude Code about your allowed curl patterns via CLAUDE.md
- Using hooks for custom permission validation

> A pattern like `/Users/alice/file` is NOT an absolute path - it’s relative to your settings file! Use `//Users/alice/file` for absolute paths.

- `Edit(/docs/**)` - Edits in `<project>/docs/` (NOT `/docs/`!)
- `Read(~/.zshrc)` - Reads your home directory’s `.zshrc`
- `Edit(//tmp/scratch.txt)` - Edits the absolute path `/tmp/scratch.txt`
- `Read(src/**)` - Reads from `<current-directory>/src/`
- `WebFetch(domain:example.com)` Matches fetch requests to example.com
- `mcp__puppeteer` Matches any tool provided by the `puppeteer` server (name configured in Claude Code)
- `mcp__puppeteer__*` Wildcard syntax that also matches all tools from the `puppeteer` server
- `mcp__puppeteer__puppeteer_navigate` Matches the `puppeteer_navigate` tool provided by the `puppeteer` server

### Additional permission control with hooks

### Enterprise managed settings

### Settings precedence

- Managed settings (via Claude.ai admin console)
- File-based managed settings (`managed-settings.json`)
- Command line arguments
- Local project settings (`.claude/settings.local.json`)
- Shared project settings (`.claude/settings.json`)
- User settings (`~/.claude/settings.json`)

## Credential management

- **Storage location**: On macOS, API keys, OAuth tokens, and other credentials are stored in the encrypted macOS Keychain.
- **Supported authentication types**: Claude.ai credentials, Claude API credentials, Azure Auth, Bedrock Auth, and Vertex Auth.
- **Custom credential scripts**: The `apiKeyHelper` setting can be configured to run a shell script that returns an API key.
- **Refresh intervals**: By default, `apiKeyHelper` is called after 5 minutes or on HTTP 401 response. Set `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` environment variable for custom refresh intervals.

Was this page helpful?
