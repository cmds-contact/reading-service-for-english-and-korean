# Hooks reference

English

# Hooks reference

This page provides reference documentation for implementing hooks in Claude Code.

> For a quickstart guide with examples, see [Get started with Claude Code hooks](/docs/en/hooks-guide).

## Configuration

- `~/.claude/settings.json` - User settings
- `.claude/settings.json` - Project settings
- `.claude/settings.local.json` - Local project settings (not committed)
- Enterprise managed policy settings

> Enterprise administrators can use `allowManagedHooksOnly` to block user, project, and plugin hooks. See [Hook configuration](/docs/en/settings#hook-configuration).

### Structure

```
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

- **matcher**: Pattern to match tool names, case-sensitive (only applicable for
`PreToolUse`, `PermissionRequest`, and `PostToolUse`)

Simple strings match exactly: `Write` matches only the Write tool
Supports regex: `Edit|Write` or `Notebook.*`
Use `*` to match all tools. You can also use empty string (`""`) or leave
`matcher` blank.
- Simple strings match exactly: `Write` matches only the Write tool
- Supports regex: `Edit|Write` or `Notebook.*`
- Use `*` to match all tools. You can also use empty string (`""`) or leave
`matcher` blank.
- **hooks**: Array of hooks to execute when the pattern matches

`type`: Hook execution type - `"command"` for bash commands or `"prompt"` for LLM-based evaluation
`command`: (For `type: "command"`) The bash command to execute (can use `$CLAUDE_PROJECT_DIR` environment variable)
`prompt`: (For `type: "prompt"`) The prompt to send to the LLM for evaluation
`timeout`: (Optional) How long a hook should run, in seconds, before canceling that specific hook
- `type`: Hook execution type - `"command"` for bash commands or `"prompt"` for LLM-based evaluation
- `command`: (For `type: "command"`) The bash command to execute (can use `$CLAUDE_PROJECT_DIR` environment variable)
- `prompt`: (For `type: "prompt"`) The prompt to send to the LLM for evaluation
- `timeout`: (Optional) How long a hook should run, in seconds, before canceling that specific hook

```
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/prompt-validator.py"
          }
        ]
      }
    ]
  }
}
```

### Project-Specific Hook Scripts

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

### Plugin hooks

- Plugin hooks are defined in the plugin’s `hooks/hooks.json` file or in a file given by a custom path to the `hooks` field.
- When a plugin is enabled, its hooks are merged with user and project hooks
- Multiple hooks from different sources can respond to the same event
- Plugin hooks use the `${CLAUDE_PLUGIN_ROOT}` environment variable to reference plugin files

```
{
  "description": "Automatic code formatting",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

> Plugin hooks use the same format as regular hooks with an optional `description` field to explain the hook’s purpose.

> Plugin hooks run alongside your custom hooks. If multiple hooks match an event, they all execute in parallel.

- `${CLAUDE_PLUGIN_ROOT}`: Absolute path to the plugin directory
- `${CLAUDE_PROJECT_DIR}`: Project root directory (same as for project hooks)
- All standard environment variables are available

## Prompt-Based Hooks

### How prompt-based hooks work

- Send the hook input and your prompt to a fast LLM (Haiku)
- The LLM responds with structured JSON containing a decision
- Claude Code processes the decision automatically

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if Claude should stop: $ARGUMENTS. Check if all tasks are complete."
          }
        ]
      }
    ]
  }
}
```

- `type`: Must be `"prompt"`
- `prompt`: The prompt text to send to the LLM

Use `$ARGUMENTS` as a placeholder for the hook input JSON
If `$ARGUMENTS` is not present, input JSON is appended to the prompt
- Use `$ARGUMENTS` as a placeholder for the hook input JSON
- If `$ARGUMENTS` is not present, input JSON is appended to the prompt
- `timeout`: (Optional) Timeout in seconds (default: 30 seconds)

### Response schema

```
{
  "decision": "approve" | "block",
  "reason": "Explanation for the decision",
  "continue": false,  // Optional: stops Claude entirely
  "stopReason": "Message shown to user",  // Optional: custom stop message
  "systemMessage": "Warning or context"  // Optional: shown to user
}
```

- `decision`: `"approve"` allows the action, `"block"` prevents it
- `reason`: Explanation shown to Claude when decision is `"block"`
- `continue`: (Optional) If `false`, stops Claude’s execution entirely
- `stopReason`: (Optional) Message shown when `continue` is false
- `systemMessage`: (Optional) Additional message shown to the user

### Supported hook events

- **Stop**: Intelligently decide if Claude should continue working
- **SubagentStop**: Evaluate if a subagent has completed its task
- **UserPromptSubmit**: Validate user prompts with LLM assistance
- **PreToolUse**: Make context-aware permission decisions
- **PermissionRequest**: Intelligently allow or deny permission dialogs

### Example: Intelligent Stop hook

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are evaluating whether Claude should stop working. Context: $ARGUMENTS\n\nAnalyze the conversation and determine if:\n1. All user-requested tasks are complete\n2. Any errors need to be addressed\n3. Follow-up work is needed\n\nRespond with JSON: {\"decision\": \"approve\" or \"block\", \"reason\": \"your explanation\"}",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Example: SubagentStop with custom logic

```
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if this subagent should stop. Input: $ARGUMENTS\n\nCheck if:\n- The subagent completed its assigned task\n- Any errors occurred that need fixing\n- Additional context gathering is needed\n\nReturn: {\"decision\": \"approve\" or \"block\", \"reason\": \"explanation\"}"
          }
        ]
      }
    ]
  }
}
```

### Comparison with bash command hooks

### Best practices

- **Be specific in prompts**: Clearly state what you want the LLM to evaluate
- **Include decision criteria**: List the factors the LLM should consider
- **Test your prompts**: Verify the LLM makes correct decisions for your use cases
- **Set appropriate timeouts**: Default is 30 seconds, adjust if needed
- **Use for complex decisions**: Bash hooks are better for simple, deterministic rules

## Hook Events

### PreToolUse

- `Task` - Subagent tasks (see [subagents documentation](/docs/en/sub-agents))
- `Bash` - Shell commands
- `Glob` - File pattern matching
- `Grep` - Content search
- `Read` - File reading
- `Edit` - File editing
- `Write` - File writing
- `WebFetch`, `WebSearch` - Web operations

### PermissionRequest

### PostToolUse

### Notification

- `permission_prompt` - Permission requests from Claude Code
- `idle_prompt` - When Claude is waiting for user input (after 60+ seconds of idle time)
- `auth_success` - Authentication success notifications
- `elicitation_dialog` - When Claude Code needs input for MCP tool elicitation

```
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/permission-alert.sh"
          }
        ]
      },
      {
        "matcher": "idle_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/idle-notification.sh"
          }
        ]
      }
    ]
  }
}
```

### UserPromptSubmit

### Stop

### SubagentStop

### PreCompact

- `manual` - Invoked from `/compact`
- `auto` - Invoked from auto-compact (due to full context window)

### SessionStart

- `startup` - Invoked from startup
- `resume` - Invoked from `--resume`, `--continue`, or `/resume`
- `clear` - Invoked from `/clear`
- `compact` - Invoked from auto or manual compact.

#### Persisting environment variables

```
#!/bin/bash

if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
  echo 'export API_KEY=your-api-key' >> "$CLAUDE_ENV_FILE"
  echo 'export PATH="$PATH:./node_modules/.bin"' >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

```
#!/bin/bash

ENV_BEFORE=$(export -p | sort)

# Run your setup commands that modify the environment
source ~/.nvm/nvm.sh
nvm use 20

if [ -n "$CLAUDE_ENV_FILE" ]; then
  ENV_AFTER=$(export -p | sort)
  comm -13 <(echo "$ENV_BEFORE") <(echo "$ENV_AFTER") >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

> `CLAUDE_ENV_FILE` is only available for SessionStart hooks. Other hook types do not have access to this variable.

### SessionEnd

- `clear` - Session cleared with /clear command
- `logout` - User logged out
- `prompt_input_exit` - User exited while prompt input was visible
- `other` - Other exit reasons

## Hook Input

```
{
  // Common fields
  session_id: string
  transcript_path: string  // Path to conversation JSON
  cwd: string              // The current working directory when the hook is invoked
  permission_mode: string  // Current permission mode: "default", "plan", "acceptEdits", or "bypassPermissions"

  // Event-specific fields
  hook_event_name: string
  ...
}
```

### PreToolUse Input

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

### PostToolUse Input

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

### Notification Input

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Notification",
  "message": "Claude needs your permission to use Bash",
  "notification_type": "permission_prompt"
}
```

### UserPromptSubmit Input

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Write a function to calculate the factorial of a number"
}
```

### Stop and SubagentStop Input

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": true
}
```

### PreCompact Input

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

### SessionStart Input

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "source": "startup"
}
```

### SessionEnd Input

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "exit"
}
```

## Hook Output

### Simple: Exit Code

- **Exit code 0**: Success. `stdout` is shown to the user in verbose mode
(ctrl+o), except for `UserPromptSubmit` and `SessionStart`, where stdout is
added to the context. JSON output in `stdout` is parsed for structured control
(see [Advanced: JSON Output](#advanced-json-output)).
- **Exit code 2**: Blocking error. Only `stderr` is used as the error message
and fed back to Claude. The format is `[command]: {stderr}`. JSON in `stdout`
is **not** processed for exit code 2. See per-hook-event behavior below.
- **Other exit codes**: Non-blocking error. `stderr` is shown to the user in verbose mode (ctrl+o) with
format `Failed with non-blocking status code: {stderr}`. If `stderr` is empty,
it shows `No stderr output`. Execution continues.

> Reminder: Claude Code does not see stdout if the exit code is 0, except for
> the `UserPromptSubmit` hook where stdout is injected as context.

#### Exit Code 2 Behavior

### Advanced: JSON Output

> JSON output is only processed when the hook exits with code 0. If your hook
> exits with code 2 (blocking error), `stderr` text is used directly—any JSON in `stdout`
> is ignored. For other non-zero exit codes, only `stderr` is shown to the user in verbose mode (ctrl+o).

#### Common JSON Fields

```
{
  "continue": true, // Whether Claude should continue after hook execution (default: true)
  "stopReason": "string", // Message shown when continue is false

  "suppressOutput": true, // Hide stdout from transcript mode (default: false)
  "systemMessage": "string" // Optional warning message shown to the user
}
```

- For `PreToolUse`, this is different from `"permissionDecision": "deny"`, which
only blocks a specific tool call and provides automatic feedback to Claude.
- For `PostToolUse`, this is different from `"decision": "block"`, which
provides automated feedback to Claude.
- For `UserPromptSubmit`, this prevents the prompt from being processed.
- For `Stop` and `SubagentStop`, this takes precedence over any
`"decision": "block"` output.
- In all cases, `"continue" = false` takes precedence over any
`"decision": "block"` output.

#### PreToolUse Decision Control

- `"allow"` bypasses the permission system. `permissionDecisionReason` is shown
to the user but not to Claude.
- `"deny"` prevents the tool call from executing. `permissionDecisionReason` is
shown to Claude.
- `"ask"` asks the user to confirm the tool call in the UI.
`permissionDecisionReason` is shown to the user but not to Claude.
- `updatedInput` allows you to modify the tool’s input parameters before the tool executes.
- This is most useful with `"permissionDecision": "allow"` to modify and approve tool calls.

```
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
    "permissionDecisionReason": "My reason here",
    "updatedInput": {
      "field_to_modify": "new value"
    }
  }
}
```

> The `decision` and `reason` fields are deprecated for PreToolUse hooks.
> Use `hookSpecificOutput.permissionDecision` and
> `hookSpecificOutput.permissionDecisionReason` instead. The deprecated fields
> `"approve"` and `"block"` map to `"allow"` and `"deny"` respectively.

#### PermissionRequest Decision Control

- For `"behavior": "allow"` you can also optionally pass in an `"updatedInput"` that modifies the tool’s input parameters before the tool executes.
- For `"behavior": "deny"` you can also optionally pass in a `"message"` string that tells the model why the permission was denied, and a boolean `"interrupt"` which will stop Claude.

```
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {
        "command": "npm run lint"
      }
    }
  }
}
```

#### PostToolUse Decision Control

- `"block"` automatically prompts Claude with `reason`.
- `undefined` does nothing. `reason` is ignored.
- `"hookSpecificOutput.additionalContext"` adds context for Claude to consider.

```
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Additional information for Claude"
  }
}
```

#### UserPromptSubmit Decision Control

- **Plain text stdout** (simpler): Any non-JSON text written to stdout is added
as context. This is the easiest way to inject information.
- JSON with `additionalContext` (structured): Use the JSON format below for
more control. The `additionalContext` field is added as context.
- `"decision": "block"` prevents the prompt from being processed. The submitted
prompt is erased from context. `"reason"` is shown to the user but not added
to context.
- `"decision": undefined` (or omitted) allows the prompt to proceed normally.

```
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "My additional context here"
  }
}
```

> The JSON format isn’t required for simple use cases. To add context, you can print plain text to stdout with exit code 0. Use JSON when you need to
> block prompts or want more structured control.

#### Stop/SubagentStop Decision Control

- `"block"` prevents Claude from stopping. You must populate `reason` for Claude
to know how to proceed.
- `undefined` allows Claude to stop. `reason` is ignored.

```
{
  "decision": "block" | undefined,
  "reason": "Must be provided when Claude is blocked from stopping"
}
```

#### SessionStart Decision Control

- `"hookSpecificOutput.additionalContext"` adds the string to the context.
- Multiple hooks’ `additionalContext` values are concatenated.

```
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "My additional context here"
  }
}
```

#### SessionEnd Decision Control

#### Exit Code Example: Bash Command Validation

```
#!/usr/bin/env python3
import json
import re
import sys

# Define validation rules as a list of (regex pattern, message) tuples
VALIDATION_RULES = [
    (
        r"\bgrep\b(?!.*\|)",
        "Use 'rg' (ripgrep) instead of 'grep' for better performance and features",
    ),
    (
        r"\bfind\s+\S+\s+-name\b",
        "Use 'rg --files | rg pattern' or 'rg --files -g pattern' instead of 'find -name' for better performance",
    ),
]


def validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues


try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})
command = tool_input.get("command", "")

if tool_name != "Bash" or not command:
    sys.exit(1)

# Validate the command
issues = validate_command(command)

if issues:
    for message in issues:
        print(f"• {message}", file=sys.stderr)
    # Exit code 2 blocks tool call and shows stderr to Claude
    sys.exit(2)
```

#### JSON Output Example: UserPromptSubmit to Add Context and Validation

> For `UserPromptSubmit` hooks, you can inject context using either method:
> **Plain text stdout** with exit code 0: Simplest approach, prints text
> **JSON output** with exit code 0: Use `"decision": "block"` to reject prompts,
> or `additionalContext` for structured context injection
> Remember: Exit code 2 only uses `stderr` for the error message. To block using
> JSON (with a custom reason), use `"decision": "block"` with exit code 0.

- **Plain text stdout** with exit code 0: Simplest approach, prints text
- **JSON output** with exit code 0: Use `"decision": "block"` to reject prompts,
or `additionalContext` for structured context injection

```
#!/usr/bin/env python3
import json
import sys
import re
import datetime

# Load input from stdin
try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

prompt = input_data.get("prompt", "")

# Check for sensitive patterns
sensitive_patterns = [
    (r"(?i)\b(password|secret|key|token)\s*[:=]", "Prompt contains potential secrets"),
]

for pattern, message in sensitive_patterns:
    if re.search(pattern, prompt):
        # Use JSON output to block with a specific reason
        output = {
            "decision": "block",
            "reason": f"Security policy violation: {message}. Please rephrase your request without sensitive information."
        }
        print(json.dumps(output))
        sys.exit(0)

# Add current time to context
context = f"Current time: {datetime.datetime.now()}"
print(context)

"""
The following is also equivalent:
print(json.dumps({
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": context,
  },
}))
"""

# Allow the prompt to proceed with the additional context
sys.exit(0)
```

#### JSON Output Example: PreToolUse with Approval

```
#!/usr/bin/env python3
import json
import sys

# Load input from stdin
try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Example: Auto-approve file reads for documentation files
if tool_name == "Read":
    file_path = tool_input.get("file_path", "")
    if file_path.endswith((".md", ".mdx", ".txt", ".json")):
        # Use JSON output to auto-approve the tool call
        output = {
            "decision": "approve",
            "reason": "Documentation file auto-approved",
            "suppressOutput": True  # Don't show in verbose mode
        }
        print(json.dumps(output))
        sys.exit(0)

# For other cases, let the normal permission flow proceed
sys.exit(0)
```

## Working with MCP Tools

### MCP Tool Naming

- `mcp__memory__create_entities` - Memory server’s create entities tool
- `mcp__filesystem__read_file` - Filesystem server’s read file tool
- `mcp__github__search_repositories` - GitHub server’s search tool

### Configuring Hooks for MCP Tools

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

## Examples

> For practical examples including code formatting, notifications, and file protection, see [More Examples](/docs/en/hooks-guide#more-examples) in the get started guide.

## Security Considerations

### Disclaimer

- You are solely responsible for the commands you configure
- Hooks can modify, delete, or access any files your user account can access
- Malicious or poorly written hooks can cause data loss or system damage
- Anthropic provides no warranty and assumes no liability for any damages
resulting from hook usage
- You should thoroughly test hooks in a safe environment before production use

### Security Best Practices

- **Validate and sanitize inputs** - Never trust input data blindly
- **Always quote shell variables** - Use `"$VAR"` not `$VAR`
- **Block path traversal** - Check for `..` in file paths
- **Use absolute paths** - Specify full paths for scripts (use
“$CLAUDE_PROJECT_DIR” for the project path)
- **Skip sensitive files** - Avoid `.env`, `.git/`, keys, etc.

### Configuration Safety

- Captures a snapshot of hooks at startup
- Uses this snapshot throughout the session
- Warns if hooks are modified externally
- Requires review in `/hooks` menu for changes to apply

## Hook Execution Details

- **Timeout**: 60-second execution limit by default, configurable per command.

A timeout for an individual command does not affect the other commands.
- A timeout for an individual command does not affect the other commands.
- **Parallelization**: All matching hooks run in parallel
- **Deduplication**: Multiple identical hook commands are deduplicated automatically
- **Environment**: Runs in current directory with Claude Code’s environment

The `CLAUDE_PROJECT_DIR` environment variable is available and contains the
absolute path to the project root directory (where Claude Code was started)
The `CLAUDE_CODE_REMOTE` environment variable indicates whether the hook is running in a remote (web) environment (`"true"`) or local CLI environment (not set or empty). Use this to run different logic based on execution context.
- The `CLAUDE_PROJECT_DIR` environment variable is available and contains the
absolute path to the project root directory (where Claude Code was started)
- The `CLAUDE_CODE_REMOTE` environment variable indicates whether the hook is running in a remote (web) environment (`"true"`) or local CLI environment (not set or empty). Use this to run different logic based on execution context.
- **Input**: JSON via stdin
- **Output**:

PreToolUse/PermissionRequest/PostToolUse/Stop/SubagentStop: Progress shown in verbose mode (ctrl+o)
Notification/SessionEnd: Logged to debug only (`--debug`)
UserPromptSubmit/SessionStart: stdout added as context for Claude
- PreToolUse/PermissionRequest/PostToolUse/Stop/SubagentStop: Progress shown in verbose mode (ctrl+o)
- Notification/SessionEnd: Logged to debug only (`--debug`)
- UserPromptSubmit/SessionStart: stdout added as context for Claude

## Debugging

### Basic Troubleshooting

- **Check configuration** - Run `/hooks` to see if your hook is registered
- **Verify syntax** - Ensure your JSON settings are valid
- **Test commands** - Run hook commands manually first
- **Check permissions** - Make sure scripts are executable
- **Review logs** - Use `claude --debug` to see hook execution details
- **Quotes not escaped** - Use `\"` inside JSON strings
- **Wrong matcher** - Check tool names match exactly (case-sensitive)
- **Command not found** - Use full paths for scripts

### Advanced Debugging

- **Inspect hook execution** - Use `claude --debug` to see detailed hook
execution
- **Validate JSON schemas** - Test hook input/output with external tools
- **Check environment variables** - Verify Claude Code’s environment is correct
- **Test edge cases** - Try hooks with unusual file paths or inputs
- **Monitor system resources** - Check for resource exhaustion during hook
execution
- **Use structured logging** - Implement logging in your hook scripts

### Debug Output Example

```
[DEBUG] Executing hooks for PostToolUse:Write
[DEBUG] Getting matching hook commands for PostToolUse with query: Write
[DEBUG] Found 1 hook matchers in settings
[DEBUG] Matched 1 hooks for query "Write"
[DEBUG] Found 1 hook commands to execute
[DEBUG] Executing hook command: <Your command> with timeout 60000ms
[DEBUG] Hook command completed with status 0: <Your stdout>
```

- Which hook is running
- Command being executed
- Success/failure status
- Output or error messages

Was this page helpful?
