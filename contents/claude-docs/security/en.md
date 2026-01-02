# Security

English

# Security

Learn about Claude Code’s security safeguards and best practices for safe usage.

## How we approach security

### Security foundation

### Permission-based architecture

### Built-in protections

- **Sandboxed bash tool**: [Sandbox](/docs/en/sandboxing) bash commands with filesystem and network isolation, reducing permission prompts while maintaining security. Enable with `/sandbox` to define boundaries where Claude Code can work autonomously
- **Write access restriction**: Claude Code can only write to the folder where it was started and its subfolders—it cannot modify files in parent directories without explicit permission. While Claude Code can read files outside the working directory (useful for accessing system libraries and dependencies), write operations are strictly confined to the project scope, creating a clear security boundary
- **Prompt fatigue mitigation**: Support for allowlisting frequently used safe commands per-user, per-codebase, or per-organization
- **Accept Edits mode**: Batch accept multiple edits while maintaining permission prompts for commands with side effects

### User responsibility

## Protect against prompt injection

### Core protections

- **Permission system**: Sensitive operations require explicit approval
- **Context-aware analysis**: Detects potentially harmful instructions by analyzing the full request
- **Input sanitization**: Prevents command injection by processing user inputs
- **Command blocklist**: Blocks risky commands that fetch arbitrary content from the web like `curl` and `wget` by default. When explicitly allowed, be aware of [permission pattern limitations](/docs/en/iam#tool-specific-permission-rules)

### Privacy safeguards

- Limited retention periods for sensitive information (see the [Privacy Center](https://privacy.anthropic.com/en/articles/10023548-how-long-do-you-store-my-data) to learn more)
- Restricted access to user session data
- User control over data training preferences. Consumer users can change their [privacy settings](https://claude.ai/settings/privacy) at any time.

### Additional safeguards

- **Network request approval**: Tools that make network requests require user approval by default
- **Isolated context windows**: Web fetch uses a separate context window to avoid injecting potentially malicious prompts
- **Trust verification**: First-time codebase runs and new MCP servers require trust verification

Note: Trust verification is disabled when running non-interactively with the `-p` flag
- Note: Trust verification is disabled when running non-interactively with the `-p` flag
- **Command injection detection**: Suspicious bash commands require manual approval even if previously allowlisted
- **Fail-closed matching**: Unmatched commands default to requiring manual approval
- **Natural language descriptions**: Complex bash commands include explanations for user understanding
- **Secure credential storage**: API keys and tokens are encrypted. See [Credential Management](/docs/en/iam#credential-management)

> **Windows WebDAV security risk**: When running Claude Code on Windows, we recommend against enabling WebDAV or allowing Claude Code to access paths such as `\\*` that may contain WebDAV subdirectories. [WebDAV has been deprecated by Microsoft](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features#:~:text=The%20Webclient%20(WebDAV)%20service%20is%20deprecated) due to security risks. Enabling WebDAV may allow Claude Code to trigger network requests to remote hosts, bypassing the permission system.

- Review suggested commands before approval
- Avoid piping untrusted content directly to Claude
- Verify proposed changes to critical files
- Use virtual machines (VMs) to run scripts and make tool calls, especially when interacting with external web services
- Report suspicious behavior with `/bug`

> While these protections significantly reduce risk, no system is completely
> immune to all attacks. Always maintain good security practices when working
> with any AI tool.

## MCP security

## IDE security

## Cloud execution security

- **Isolated virtual machines**: Each cloud session runs in an isolated, Anthropic-managed VM
- **Network access controls**: Network access is limited by default and can be configured to be disabled or allow only specific domains
- **Credential protection**: Authentication is handled through a secure proxy that uses a scoped credential inside the sandbox, which is then translated to your actual GitHub authentication token
- **Branch restrictions**: Git push operations are restricted to the current working branch
- **Audit logging**: All operations in cloud environments are logged for compliance and audit purposes
- **Automatic cleanup**: Cloud environments are automatically terminated after session completion

## Security best practices

### Working with sensitive code

- Review all suggested changes before approval
- Use project-specific permission settings for sensitive repositories
- Consider using [devcontainers](/docs/en/devcontainer) for additional isolation
- Regularly audit your permission settings with `/permissions`

### Team security

- Use [enterprise managed settings](/docs/en/iam#enterprise-managed-settings) to enforce organizational standards
- Share approved permission configurations through version control
- Train team members on security best practices
- Monitor Claude Code usage through [OpenTelemetry metrics](/docs/en/monitoring-usage)

### Reporting security issues

- Do not disclose it publicly
- Report it through our [HackerOne program](https://hackerone.com/anthropic-vdp/reports/new?type=team&report_type=vulnerability)
- Include detailed reproduction steps
- Allow time for us to address the issue before public disclosure

## Related resources

- [Sandboxing](/docs/en/sandboxing) - Filesystem and network isolation for bash commands
- [Identity and Access Management](/docs/en/iam) - Configure permissions and access controls
- [Monitoring usage](/docs/en/monitoring-usage) - Track and audit Claude Code activity
- [Development containers](/docs/en/devcontainer) - Secure, isolated environments
- [Anthropic Trust Center](https://trust.anthropic.com) - Security certifications and compliance

Was this page helpful?
