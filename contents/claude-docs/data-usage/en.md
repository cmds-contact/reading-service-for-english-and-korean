# Data usage

English

# Data usage

Learn about Anthropic’s data usage policies for Claude

## Data policies

### Data training policy

- If you’re a current user, you can select your preference now and your selection will immediately go into effect.
This setting will only apply to new or resumed chats and coding sessions on Claude. Previous chats with no additional activity will not be used for model training.
- You have until October 8, 2025 to make your selection.
If you’re a new user, you can pick your setting for model training during the signup process.
You can change your selection at any time in your Privacy Settings.

### Development Partner Program

### Feedback using the /bug command

### Session quality surveys

### Data retention

- Users who allow data use for model improvement: 5-year retention period to support model development and safety improvements
- Users who don’t allow data use for model improvement: 30-day retention period
- Privacy settings can be changed at any time at [claude.ai/settings/data-privacy-controls](https://claude.ai/settings/data-privacy-controls).
- Standard: 30-day retention period
- Zero data retention: Available with appropriately configured API keys - Claude Code will not retain chat transcripts on servers
- Local caching: Claude Code clients may store sessions locally for up to 30 days to enable session resumption (configurable)

## Data flow and dependencies

### Cloud execution

> The above data flow diagram and description applies to Claude Code CLI running locally on your machine. For cloud-based sessions using Claude Code on the web, see the section below.

- **Code storage**: Your repository is cloned to an isolated VM and automatically deleted after session completion
- **Credentials**: GitHub authentication is handled through a secure proxy; your GitHub credentials never enter the sandbox
- **Network traffic**: All outbound traffic goes through a security proxy for audit logging and abuse prevention
- **Data retention**: Code and session data are subject to the retention and usage policies for your account type
- **Session data**: Prompts, code changes, and outputs follow the same data policies as local Claude Code usage

## Telemetry services

## Default behaviors by API provider

Was this page helpful?
