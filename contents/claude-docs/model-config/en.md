# Model configuration

English

# Model configuration

Learn about the Claude Code model configuration, including model aliases like `opusplan`

## Available models

- A **model alias**
- A **model name**

Anthropic API: A full **[model name](https://docs.claude.com/en/docs/about-claude/models/overview#model-names)**
Bedrock: an inference profile ARN
Foundry: a deployment name
Vertex: a version name
- Anthropic API: A full **[model name](https://docs.claude.com/en/docs/about-claude/models/overview#model-names)**
- Bedrock: an inference profile ARN
- Foundry: a deployment name
- Vertex: a version name

### Model aliases

### Setting your model

- **During session** - Use `/model <alias|name>` to switch models mid-session
- **At startup** - Launch with `claude --model <alias|name>`
- **Environment variable** - Set `ANTHROPIC_MODEL=<alias|name>`
- **Settings** - Configure permanently in your settings file using the `model`
field.

```
# Start with Opus
claude --model opus

# Switch to Sonnet during session
/model sonnet
```

```
{
    "permissions": {
        ...
    },
    "model": "opus"
}
```

## Special model behavior

### default model setting

### opusplan model setting

- **In plan mode** - Uses `opus` for complex reasoning and architecture
decisions
- **In execution mode** - Automatically switches to `sonnet` for code generation
and implementation

### Extended context with [1m]

```
# Example of using a full model name with the [1m] suffix
/model anthropic.claude-sonnet-4-5-20250929-v1:0[1m]
```

## Checking your current model

- In [status line](/docs/en/statusline) (if configured)
- In `/status`, which also displays your account information.

## Environment variables

### Prompt caching configuration

Was this page helpful?
