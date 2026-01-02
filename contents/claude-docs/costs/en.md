# Manage costs effectively

English

# Manage costs effectively

Learn how to track and optimize token usage and costs when using Claude Code.

## Track your costs

### Using the /cost command

> The `/cost` command is not intended for Claude Max and Pro subscribers.

```
Total cost:            $0.55
Total duration (API):  6m 19.7s
Total duration (wall): 6h 33m 10.2s
Total code changes:    0 lines added, 0 lines removed
```

### Additional tracking options

> When you first authenticate Claude Code with your Claude Console account, a workspace called “Claude Code” is automatically created for you. This workspace provides centralized cost tracking and management for all Claude Code usage in your organization. You cannot create API keys for this workspace - it is exclusively for Claude Code authentication and usage.

## Managing costs for teams

### Rate limit recommendations

> If you anticipate scenarios with unusually high concurrent usage (such as live training sessions with large groups), you may need higher TPM allocations per user.

## Reduce token usage

- **Compact conversations:**


Claude uses auto-compact by default when context exceeds 95% capacity


Toggle auto-compact: Run `/config` and navigate to “Auto-compact enabled”


Use `/compact` manually when context gets large


Add custom instructions: `/compact Focus on code samples and API usage`


Customize compaction by adding to CLAUDE.md:
CopyAsk AI# Summary instructions

When you are using compact, please focus on test output and code changes
- Claude uses auto-compact by default when context exceeds 95% capacity
- Toggle auto-compact: Run `/config` and navigate to “Auto-compact enabled”
- Use `/compact` manually when context gets large
- Add custom instructions: `/compact Focus on code samples and API usage`
- Customize compaction by adding to CLAUDE.md:
CopyAsk AI# Summary instructions

When you are using compact, please focus on test output and code changes

```
# Summary instructions

When you are using compact, please focus on test output and code changes
```

- **Write specific queries:** Avoid vague requests that trigger unnecessary scanning
- **Break down complex tasks:** Split large tasks into focused interactions
- **Clear history between tasks:** Use `/clear` to reset context
- Size of codebase being analyzed
- Complexity of queries
- Number of files being searched or modified
- Length of conversation history
- Frequency of compacting conversations

## Background token usage

- **Conversation summarization**: Background jobs that summarize previous conversations for the `claude --resume` feature
- **Command processing**: Some commands like `/cost` may generate requests to check status

## Tracking version changes and updates

### Current version information

```
claude doctor
```

### Understanding changes in Claude Code behavior

- **Version tracking**: Use `claude doctor` to see your current version
- **Behavior changes**: Features like `/cost` may display information differently across versions
- **Documentation access**: Claude always has access to the latest documentation, which can help explain current feature behavior

### When cost reporting changes

- **Verify your version**: Run `claude doctor` to confirm your current version
- **Consult documentation**: Ask Claude directly about current feature behavior, as it has access to up-to-date documentation
- **Contact support**: For specific billing questions, contact Anthropic support through your Console account

> For team deployments, we recommend starting with a small pilot group to
> establish usage patterns before wider rollout.

Was this page helpful?
