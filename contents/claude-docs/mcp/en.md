# Connect Claude Code to tools via MCP

English

# Connect Claude Code to tools via MCP

Learn how to connect Claude Code to your tools with the Model Context Protocol.

## What you can do with MCP

- **Implement features from issue trackers**: “Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub.”
- **Analyze monitoring data**: “Check Sentry and Statsig to check the usage of the feature described in ENG-4521.”
- **Query databases**: “Find emails of 10 random users who used feature ENG-4521, based on our PostgreSQL database.”
- **Integrate designs**: “Update our standard email template based on the new Figma designs that were posted in Slack”
- **Automate workflows**: “Create Gmail drafts inviting these 10 users to a feedback session about the new feature.”

## Popular MCP servers

> Use third party MCP servers at your own risk - Anthropic has not verified
> the correctness or security of all these servers.
> Make sure you trust MCP servers you are installing.
> Be especially careful when using MCP servers that could fetch untrusted
> content, as these can expose you to prompt injection risk.

> **Need a specific integration?** [Find hundreds more MCP servers on GitHub](https://github.com/modelcontextprotocol/servers), or build your own using the [MCP SDK](https://modelcontextprotocol.io/quickstart/server).

## Installing MCP servers

### Option 1: Add a remote HTTP server

```
# Basic syntax
claude mcp add --transport http <name> <url>

# Real example: Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Example with Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### Option 2: Add a remote SSE server

> The SSE (Server-Sent Events) transport is deprecated. Use HTTP servers instead, where available.

```
# Basic syntax
claude mcp add --transport sse <name> <url>

# Real example: Connect to Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# Example with authentication header
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### Option 3: Add a local stdio server

```
# Basic syntax
claude mcp add --transport stdio <name> <command> [args...]

# Real example: Add Airtable server
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

> **Understanding the ”—” parameter:**
> The `--` (double dash) separates Claude’s own CLI flags from the command and arguments that get passed to the MCP server. Everything before `--` are options for Claude (like `--env`, `--scope`), and everything after `--` is the actual command to run the MCP server.For example:
> `claude mcp add --transport stdio myserver -- npx server` → runs `npx server`
> `claude mcp add --transport stdio myserver --env KEY=value -- python server.py --port 8080` → runs `python server.py --port 8080` with `KEY=value` in environment
> This prevents conflicts between Claude’s flags and the server’s flags.

- `claude mcp add --transport stdio myserver -- npx server` → runs `npx server`
- `claude mcp add --transport stdio myserver --env KEY=value -- python server.py --port 8080` → runs `python server.py --port 8080` with `KEY=value` in environment

### Managing your servers

```
# List all configured servers
claude mcp list

# Get details for a specific server
claude mcp get github

# Remove a server
claude mcp remove github

# (within Claude Code) Check server status
/mcp
```

> Tips:
> Use the `--scope` flag to specify where the configuration is stored:
> 
> `local` (default): Available only to you in the current project (was called `project` in older versions)
> `project`: Shared with everyone in the project via `.mcp.json` file
> `user`: Available to you across all projects (was called `global` in older versions)
> 
> 
> Set environment variables with `--env` flags (for example, `--env KEY=value`)
> Configure MCP server startup timeout using the MCP_TIMEOUT environment variable (for example, `MCP_TIMEOUT=10000 claude` sets a 10-second timeout)
> Claude Code will display a warning when MCP tool output exceeds 10,000 tokens. To increase this limit, set the `MAX_MCP_OUTPUT_TOKENS` environment variable (for example, `MAX_MCP_OUTPUT_TOKENS=50000`)
> Use `/mcp` to authenticate with remote servers that require OAuth 2.0 authentication

- Use the `--scope` flag to specify where the configuration is stored:

`local` (default): Available only to you in the current project (was called `project` in older versions)
`project`: Shared with everyone in the project via `.mcp.json` file
`user`: Available to you across all projects (was called `global` in older versions)
- `local` (default): Available only to you in the current project (was called `project` in older versions)
- `project`: Shared with everyone in the project via `.mcp.json` file
- `user`: Available to you across all projects (was called `global` in older versions)
- Set environment variables with `--env` flags (for example, `--env KEY=value`)
- Configure MCP server startup timeout using the MCP_TIMEOUT environment variable (for example, `MCP_TIMEOUT=10000 claude` sets a 10-second timeout)
- Claude Code will display a warning when MCP tool output exceeds 10,000 tokens. To increase this limit, set the `MAX_MCP_OUTPUT_TOKENS` environment variable (for example, `MAX_MCP_OUTPUT_TOKENS=50000`)
- Use `/mcp` to authenticate with remote servers that require OAuth 2.0 authentication

> **Windows Users**: On native Windows (not WSL), local MCP servers that use `npx` require the `cmd /c` wrapper to ensure proper execution.CopyAsk AI# This creates command="cmd" which Windows can execute
> claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
> Without the `cmd /c` wrapper, you’ll encounter “Connection closed” errors because Windows cannot directly execute `npx`. (See the note above for an explanation of the `--` parameter.)

```
# This creates command="cmd" which Windows can execute
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

### Plugin-provided MCP servers

- Plugins define MCP servers in `.mcp.json` at the plugin root or inline in `plugin.json`
- When a plugin is enabled, its MCP servers start automatically
- Plugin MCP tools appear alongside manually configured MCP tools
- Plugin servers are managed through plugin installation (not `/mcp` commands)

```
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

```
{
  "name": "my-plugin",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

- **Automatic lifecycle**: Servers start when plugin enables, but you must restart Claude Code to apply MCP server changes (enabling or disabling)
- **Environment variables**: Use `${CLAUDE_PLUGIN_ROOT}` for plugin-relative paths
- **User environment access**: Access to same environment variables as manually configured servers
- **Multiple transport types**: Support stdio, SSE, and HTTP transports (transport support may vary by server)

```
# Within Claude Code, see all MCP servers including plugin ones
/mcp
```

- **Bundled distribution**: Tools and servers packaged together
- **Automatic setup**: No manual MCP configuration needed
- **Team consistency**: Everyone gets the same tools when plugin is installed

## MCP installation scopes

### Local scope

```
# Add a local-scoped server (default)
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicitly specify local scope
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### Project scope

```
# Add a project-scoped server
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

```
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

### User scope

```
# Add a user server
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### Choosing the right scope

- **Local scope**: Personal servers, experimental configurations, or sensitive credentials specific to one project
- **Project scope**: Team-shared servers, project-specific tools, or services required for collaboration
- **User scope**: Personal utilities needed across multiple projects, development tools, or frequently used services

> **Where are MCP servers stored?**
> **User and local scope**: `~/.claude.json` (in the `mcpServers` field or under project paths)
> **Project scope**: `.mcp.json` in your project root (checked into source control)
> **Enterprise managed**: `managed-mcp.json` in system directories (see [Enterprise MCP configuration](#enterprise-mcp-configuration))

- **User and local scope**: `~/.claude.json` (in the `mcpServers` field or under project paths)
- **Project scope**: `.mcp.json` in your project root (checked into source control)
- **Enterprise managed**: `managed-mcp.json` in system directories (see [Enterprise MCP configuration](#enterprise-mcp-configuration))

### Scope hierarchy and precedence

### Environment variable expansion in .mcp.json

- `${VAR}` - Expands to the value of environment variable `VAR`
- `${VAR:-default}` - Expands to `VAR` if set, otherwise uses `default`
- `command` - The server executable path
- `args` - Command-line arguments
- `env` - Environment variables passed to the server
- `url` - For HTTP server types
- `headers` - For HTTP server authentication

```
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

## Practical examples

### Example: Monitor errors with Sentry

```
# 1. Add the Sentry MCP server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. Use /mcp to authenticate with your Sentry account
> /mcp

# 3. Debug production issues
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
> "Which deployment introduced these new errors?"
```

### Example: Connect to GitHub for code reviews

```
# 1. Add the GitHub MCP server
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. In Claude Code, authenticate if needed
> /mcp
# Select "Authenticate" for GitHub

# 3. Now you can ask Claude to work with GitHub
> "Review PR #456 and suggest improvements"
> "Create a new issue for the bug we just found"
> "Show me all open PRs assigned to me"
```

### Example: Query your PostgreSQL database

```
# 1. Add the database server with your connection string
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"

# 2. Query your database naturally
> "What's our total revenue this month?"
> "Show me the schema for the orders table"
> "Find customers who haven't made a purchase in 90 days"
```

## Authenticate with remote MCP servers

Add the server that requires authentication

```
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

Use the /mcp command within Claude Code

```
> /mcp
```

> Tips:
> Authentication tokens are stored securely and refreshed automatically
> Use “Clear authentication” in the `/mcp` menu to revoke access
> If your browser doesn’t open automatically, copy the provided URL
> OAuth authentication works with HTTP servers

- Authentication tokens are stored securely and refreshed automatically
- Use “Clear authentication” in the `/mcp` menu to revoke access
- If your browser doesn’t open automatically, copy the provided URL
- OAuth authentication works with HTTP servers

## Add MCP servers from JSON configuration

Add an MCP server from JSON

```
# Basic syntax
claude mcp add-json <name> '<json>'

# Example: Adding an HTTP server with JSON configuration
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

# Example: Adding a stdio server with JSON configuration
claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
```

Verify the server was added

```
claude mcp get weather-api
```

> Tips:
> Make sure the JSON is properly escaped in your shell
> The JSON must conform to the MCP server configuration schema
> You can use `--scope user` to add the server to your user configuration instead of the project-specific one

- Make sure the JSON is properly escaped in your shell
- The JSON must conform to the MCP server configuration schema
- You can use `--scope user` to add the server to your user configuration instead of the project-specific one

## Import MCP servers from Claude Desktop

Import servers from Claude Desktop

```
# Basic syntax 
claude mcp add-from-claude-desktop
```

Select which servers to import

Verify the servers were imported

```
claude mcp list
```

> Tips:
> This feature only works on macOS and Windows Subsystem for Linux (WSL)
> It reads the Claude Desktop configuration file from its standard location on those platforms
> Use the `--scope user` flag to add servers to your user configuration
> Imported servers will have the same names as in Claude Desktop
> If servers with the same names already exist, they will get a numerical suffix (for example, `server_1`)

- This feature only works on macOS and Windows Subsystem for Linux (WSL)
- It reads the Claude Desktop configuration file from its standard location on those platforms
- Use the `--scope user` flag to add servers to your user configuration
- Imported servers will have the same names as in Claude Desktop
- If servers with the same names already exist, they will get a numerical suffix (for example, `server_1`)

## Use Claude Code as an MCP server

```
# Start Claude as a stdio MCP server
claude mcp serve
```

```
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

> **Configuring the executable path**: The `command` field must reference the Claude Code executable. If the `claude` command is not in your system’s PATH, you’ll need to specify the full path to the executable.To find the full path:CopyAsk AIwhich claude
> Then use the full path in your configuration:CopyAsk AI{
>   "mcpServers": {
>     "claude-code": {
>       "type": "stdio",
>       "command": "/full/path/to/claude",
>       "args": ["mcp", "serve"],
>       "env": {}
>     }
>   }
> }
> Without the correct executable path, you’ll encounter errors like `spawn claude ENOENT`.

```
which claude
```

```
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "/full/path/to/claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

> Tips:
> The server provides access to Claude’s tools like View, Edit, LS, etc.
> In Claude Desktop, try asking Claude to read files in a directory, make edits, and more.
> Note that this MCP server is only exposing Claude Code’s tools to your MCP client, so your own client is responsible for implementing user confirmation for individual tool calls.

- The server provides access to Claude’s tools like View, Edit, LS, etc.
- In Claude Desktop, try asking Claude to read files in a directory, make edits, and more.
- Note that this MCP server is only exposing Claude Code’s tools to your MCP client, so your own client is responsible for implementing user confirmation for individual tool calls.

## MCP output limits and warnings

- **Output warning threshold**: Claude Code displays a warning when any MCP tool output exceeds 10,000 tokens
- **Configurable limit**: You can adjust the maximum allowed MCP output tokens using the `MAX_MCP_OUTPUT_TOKENS` environment variable
- **Default limit**: The default maximum is 25,000 tokens

```
# Set a higher limit for MCP tool outputs
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

- Query large datasets or databases
- Generate detailed reports or documentation
- Process extensive log files or debugging information

> If you frequently encounter output warnings with specific MCP servers, consider increasing the limit or configuring the server to paginate or filter its responses.

## Use MCP resources

### Reference MCP resources

List available resources

Reference a specific resource

```
> Can you analyze @github:issue://123 and suggest a fix?
```

```
> Please review the API documentation at @docs:file://api/authentication
```

Multiple resource references

```
> Compare @postgres:schema://users with @docs:file://database/user-model
```

> Tips:
> Resources are automatically fetched and included as attachments when referenced
> Resource paths are fuzzy-searchable in the @ mention autocomplete
> Claude Code automatically provides tools to list and read MCP resources when servers support them
> Resources can contain any type of content that the MCP server provides (text, JSON, structured data, etc.)

- Resources are automatically fetched and included as attachments when referenced
- Resource paths are fuzzy-searchable in the @ mention autocomplete
- Claude Code automatically provides tools to list and read MCP resources when servers support them
- Resources can contain any type of content that the MCP server provides (text, JSON, structured data, etc.)

## Use MCP prompts as slash commands

### Execute MCP prompts

Discover available prompts

Execute a prompt without arguments

```
> /mcp__github__list_prs
```

Execute a prompt with arguments

```
> /mcp__github__pr_review 456
```

```
> /mcp__jira__create_issue "Bug in login flow" high
```

> Tips:
> MCP prompts are dynamically discovered from connected servers
> Arguments are parsed based on the prompt’s defined parameters
> Prompt results are injected directly into the conversation
> Server and prompt names are normalized (spaces become underscores)

- MCP prompts are dynamically discovered from connected servers
- Arguments are parsed based on the prompt’s defined parameters
- Prompt results are injected directly into the conversation
- Server and prompt names are normalized (spaces become underscores)

## Enterprise MCP configuration

- Exclusive control with `managed-mcp.json`: Deploy a fixed set of MCP servers that users cannot modify or extend
- **Policy-based control with allowlists/denylists**: Allow users to add their own servers, but restrict which ones are permitted
- **Control which MCP servers employees can access**: Deploy a standardized set of approved MCP servers across the organization
- **Prevent unauthorized MCP servers**: Restrict users from adding unapproved MCP servers
- **Disable MCP entirely**: Remove MCP functionality completely if needed

### Option 1: Exclusive control with managed-mcp.json

- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux and WSL: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

> These are system-wide paths (not user home directories like `~/Library/...`) that require administrator privileges. They are designed to be deployed by IT administrators.

```
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

### Option 2: Policy-based control with allowlists and denylists

> **Choosing between options**: Use Option 1 (`managed-mcp.json`) when you want to deploy a fixed set of servers with no user customization. Use Option 2 (allowlists/denylists) when you want to allow users to add their own servers within policy constraints.

#### Restriction options

- **By server name** (`serverName`): Matches the configured name of the server
- **By command** (`serverCommand`): Matches the exact command and arguments used to start stdio servers
- **By URL pattern** (`serverUrl`): Matches remote server URLs with wildcard support

#### Example configuration

```
{
  "allowedMcpServers": [
    // Allow by server name
    { "serverName": "github" },
    { "serverName": "sentry" },

    // Allow by exact command (for stdio servers)
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] },
    { "serverCommand": ["python", "/usr/local/bin/approved-server.py"] },

    // Allow by URL pattern (for remote servers)
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverUrl": "https://*.internal.corp/*" }
  ],
  "deniedMcpServers": [
    // Block by server name
    { "serverName": "dangerous-server" },

    // Block by exact command (for stdio servers)
    { "serverCommand": ["npx", "-y", "unapproved-package"] },

    // Block by URL pattern (for remote servers)
    { "serverUrl": "https://*.untrusted.com/*" }
  ]
}
```

#### How command-based restrictions work

- Command arrays must match **exactly** - both the command and all arguments in the correct order
- Example: `["npx", "-y", "server"]` will NOT match `["npx", "server"]` or `["npx", "-y", "server", "--flag"]`
- When the allowlist contains **any** `serverCommand` entries, stdio servers **must** match one of those commands
- Stdio servers cannot pass by name alone when command restrictions are present
- This ensures administrators can enforce which commands are allowed to run
- Remote servers (HTTP, SSE, WebSocket) use URL-based matching when `serverUrl` entries exist in the allowlist
- If no URL entries exist, remote servers fall back to name-based matching
- Command restrictions do not apply to remote servers

#### How URL-based restrictions work

- `https://mcp.company.com/*` - Allow all paths on a specific domain
- `https://*.example.com/*` - Allow any subdomain of example.com
- `http://localhost:*/*` - Allow any port on localhost
- When the allowlist contains **any** `serverUrl` entries, remote servers **must** match one of those URL patterns
- Remote servers cannot pass by name alone when URL restrictions are present
- This ensures administrators can enforce which remote endpoints are allowed

Example: URL-only allowlist

```
{
  "allowedMcpServers": [
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverUrl": "https://*.internal.corp/*" }
  ]
}
```

- HTTP server at `https://mcp.company.com/api`: ✅ Allowed (matches URL pattern)
- HTTP server at `https://api.internal.corp/mcp`: ✅ Allowed (matches wildcard subdomain)
- HTTP server at `https://external.com/mcp`: ❌ Blocked (doesn’t match any URL pattern)
- Stdio server with any command: ❌ Blocked (no name or command entries to match)

Example: Command-only allowlist

```
{
  "allowedMcpServers": [
    { "serverCommand": ["npx", "-y", "approved-package"] }
  ]
}
```

- Stdio server with `["npx", "-y", "approved-package"]`: ✅ Allowed (matches command)
- Stdio server with `["node", "server.js"]`: ❌ Blocked (doesn’t match command)
- HTTP server named “my-api”: ❌ Blocked (no name entries to match)

Example: Mixed name and command allowlist

```
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverCommand": ["npx", "-y", "approved-package"] }
  ]
}
```

- Stdio server named “local-tool” with `["npx", "-y", "approved-package"]`: ✅ Allowed (matches command)
- Stdio server named “local-tool” with `["node", "server.js"]`: ❌ Blocked (command entries exist but doesn’t match)
- Stdio server named “github” with `["node", "server.js"]`: ❌ Blocked (stdio servers must match commands when command entries exist)
- HTTP server named “github”: ✅ Allowed (matches name)
- HTTP server named “other-api”: ❌ Blocked (name doesn’t match)

Example: Name-only allowlist

```
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "internal-tool" }
  ]
}
```

- Stdio server named “github” with any command: ✅ Allowed (no command restrictions)
- Stdio server named “internal-tool” with any command: ✅ Allowed (no command restrictions)
- Any server named “other”: ❌ Blocked (name doesn’t match)

#### Allowlist behavior (allowedMcpServers)

- `undefined` (default): No restrictions - users can configure any MCP server
- Empty array `[]`: Complete lockdown - users cannot configure any MCP servers
- List of entries: Users can only configure servers that match by name, command, or URL pattern

#### Denylist behavior (deniedMcpServers)

- `undefined` (default): No servers are blocked
- Empty array `[]`: No servers are blocked
- List of entries: Specified servers are explicitly blocked across all scopes

#### Important notes

- **Option 1 and Option 2 can be combined**: If `managed-mcp.json` exists, it has exclusive control and users cannot add servers. Allowlists/denylists still apply to the enterprise servers themselves.
- **Denylist takes absolute precedence**: If a server matches a denylist entry (by name, command, or URL), it will be blocked even if it’s on the allowlist
- Name-based, command-based, and URL-based restrictions work together: a server passes if it matches **either** a name entry, a command entry, or a URL pattern (unless blocked by denylist)

> When using `managed-mcp.json`: Users cannot add MCP servers through `claude mcp add` or configuration files. The `allowedMcpServers` and `deniedMcpServers` settings still apply to filter which enterprise servers are actually loaded.

Was this page helpful?
