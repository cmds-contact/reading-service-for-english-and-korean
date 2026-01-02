# Claude Code in Slack

English

# Claude Code in Slack

Delegate coding tasks directly from your Slack workspace

## Use cases

- **Bug investigation and fixes**: Ask Claude to investigate and fix bugs as soon as they’re reported in Slack channels.
- **Quick code reviews and modifications**: Have Claude implement small features or refactor code based on team feedback.
- **Collaborative debugging**: When team discussions provide crucial context (e.g., error reproductions or user reports), Claude can use that information to inform its debugging approach.
- **Parallel task execution**: Kick off coding tasks in Slack while you continue other work, receiving notifications when complete.

## Prerequisites

## Setting up Claude Code in Slack

Install the Claude App in Slack

Connect your Claude account

- Open the Claude app in Slack by clicking on “Claude” in your Apps section
- Navigate to the App Home tab
- Click “Connect” to link your Slack account with your Claude account
- Complete the authentication flow in your browser

Configure Claude Code on the web

- Visit [claude.ai/code](https://claude.ai/code) and sign in with the same account you connected to Slack
- Connect your GitHub account if not already connected
- Authenticate at least one repository that you want Claude to work with

Choose your routing mode

> In Code + Chat mode, if Claude routes a message to Chat but you wanted a coding session, you can click “Retry as Code” to create a Claude Code session instead. Similarly, if it’s routed to Code but you wanted a Chat session, you can choose that option in that thread.

## How it works

### Automatic detection

> Claude Code in Slack only works in channels (public or private). It does not work in direct messages (DMs).

### Context gathering

> When @Claude is invoked in Slack, Claude is given access to the conversation context to better understand your request. Claude may follow directions from other messages in the context, so users should make sure to only use Claude in trusted Slack conversations.

### Session flow

- **Initiation**: You @mention Claude with a coding request
- **Detection**: Claude analyzes your message and detects coding intent
- **Session creation**: A new Claude Code session is created on claude.ai/code
- **Progress updates**: Claude posts status updates to your Slack thread as work progresses
- **Completion**: When finished, Claude @mentions you with a summary and action buttons
- **Review**: Click “View Session” to see the full transcript, or “Create PR” to open a pull request

## User interface elements

### App Home

### Message actions

- **View Session**: Opens the full Claude Code session in your browser where you can see all work performed, continue the session, or make additional requests.
- **Create PR**: Creates a pull request directly from the session’s changes.
- **Retry as Code**: If Claude initially responds as a chat assistant but you wanted a coding session, click this button to retry the request as a Claude Code task.
- **Change Repo**: Allows you to select a different repository if Claude chose incorrectly.

### Repository selection

## Access and permissions

### User-level access

### Workspace admin permissions

## What’s accessible where

## Best practices

### Writing effective requests

- **Be specific**: Include file names, function names, or error messages when relevant.
- **Provide context**: Mention the repository or project if it’s not clear from the conversation.
- **Define success**: Explain what “done” looks like—should Claude write tests? Update documentation? Create a PR?
- **Use threads**: Reply in threads when discussing bugs or features so Claude can gather the full context.

### When to use Slack vs. web

## Troubleshooting

### Sessions not starting

- Verify your Claude account is connected in the Claude App Home
- Check that you have Claude Code on the web access enabled
- Ensure you have at least one GitHub repository connected to Claude Code

### Repository not showing

- Connect the repository in Claude Code on the web at [claude.ai/code](https://claude.ai/code)
- Verify your GitHub permissions for that repository
- Try disconnecting and reconnecting your GitHub account

### Wrong repository selected

- Click the “Change Repo” button to select a different repository
- Include the repository name in your request for more accurate selection

### Authentication errors

- Disconnect and reconnect your Claude account in the App Home
- Ensure you’re signed into the correct Claude account in your browser
- Check that your Claude plan includes Claude Code access

### Session expiration

- Sessions remain accessible in your Claude Code history on the web
- You can continue or reference past sessions from [claude.ai/code](https://claude.ai/code)

## Current limitations

- **GitHub only**: Currently supports repositories on GitHub.
- **One PR at a time**: Each session can create one pull request.
- **Rate limits apply**: Sessions use your individual Claude plan’s rate limits.
- **Web access required**: Users must have Claude Code on the web access; those without it will only get standard Claude chat responses.

## Related resources

## Claude Code on the web

## Claude for Slack

## Slack App Marketplace

## Claude Help Center

Was this page helpful?
