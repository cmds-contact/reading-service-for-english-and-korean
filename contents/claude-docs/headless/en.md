# Run Claude Code programmatically

English

# Run Claude Code programmatically

Use the Agent SDK to run Claude Code programmatically from the CLI, Python, or TypeScript.

> The CLI was previously called “headless mode.” The `-p` flag and all CLI options work the same way.

```
claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
```

## Basic usage

- `--continue` for [continuing conversations](#continue-conversations)
- `--allowedTools` for [auto-approving tools](#auto-approve-tools)
- `--output-format` for [structured output](#get-structured-output)

```
claude -p "What does the auth module do?"
```

## Examples

### Get structured output

- `text` (default): plain text output
- `json`: structured JSON with result, session ID, and metadata
- `stream-json`: newline-delimited JSON for real-time streaming

```
claude -p "Summarize this project" --output-format json
```

```
claude -p "Extract the main function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

> Use a tool like [jq](https://jqlang.github.io/jq/) to parse the response and extract specific fields:CopyAsk AI# Extract the text result
> claude -p "Summarize this project" --output-format json | jq -r '.result'
> 
> # Extract structured output
> claude -p "Extract function names from auth.py" \
>   --output-format json \
>   --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}' \
>   | jq '.structured_output'

```
# Extract the text result
claude -p "Summarize this project" --output-format json | jq -r '.result'

# Extract structured output
claude -p "Extract function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}' \
  | jq '.structured_output'
```

### Auto-approve tools

```
claude -p "Run the test suite and fix any failures" \
  --allowedTools "Bash,Read,Edit"
```

### Create a commit

```
claude -p "Look at my staged changes and create an appropriate commit" \
  --allowedTools "Bash(git diff:*),Bash(git log:*),Bash(git status:*),Bash(git commit:*)"
```

> [Slash commands](/docs/en/slash-commands) like `/commit` are only available in interactive mode. In `-p` mode, describe the task you want to accomplish instead.

### Customize the system prompt

```
gh pr diff "$1" | claude -p \
  --append-system-prompt "You are a security engineer. Review for vulnerabilities." \
  --output-format json
```

### Continue conversations

```
# First request
claude -p "Review this codebase for performance issues"

# Continue the most recent conversation
claude -p "Now focus on the database queries" --continue
claude -p "Generate a summary of all issues found" --continue
```

```
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

## Next steps

## Agent SDK quickstart

## CLI reference

## GitHub Actions

## GitLab CI/CD

Was this page helpful?
