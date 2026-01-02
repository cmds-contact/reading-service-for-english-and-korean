# LLM gateway configuration

English

# LLM gateway configuration

Learn how to configure Claude Code to work with LLM gateway solutions. Covers gateway requirements, authentication configuration, model selection, and provider-specific endpoint setup.

- **Centralized authentication** - Single point for API key management
- **Usage tracking** - Monitor usage across teams and projects
- **Cost controls** - Implement budgets and rate limits
- **Audit logging** - Track all model interactions for compliance
- **Model routing** - Switch between providers without code changes

## Gateway requirements

- **Anthropic Messages**: `/v1/messages`, `/v1/messages/count_tokens`

Must forward request headers: `anthropic-beta`, `anthropic-version`
- Must forward request headers: `anthropic-beta`, `anthropic-version`
- **Bedrock InvokeModel**: `/invoke`, `/invoke-with-response-stream`

Must preserve request body fields: `anthropic_beta`, `anthropic_version`
- Must preserve request body fields: `anthropic_beta`, `anthropic_version`
- **Vertex rawPredict**: `:rawPredict`, `:streamRawPredict`, `/count-tokens:rawPredict`

Must forward request headers: `anthropic-beta`, `anthropic-version`

> Claude Code determines which features to enable based on the API format. When using the Anthropic Messages format with Bedrock or Vertex, you may need to set environment variable `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`.

## Configuration

### Model selection

## LiteLLM configuration

> LiteLLM is a third-party proxy service. Anthropic doesn’t endorse, maintain, or audit LiteLLM’s security or functionality. This guide is provided for informational purposes and may become outdated. Use at your own discretion.

### Prerequisites

- Claude Code updated to the latest version
- LiteLLM Proxy Server deployed and accessible
- Access to Claude models through your chosen provider

### Basic LiteLLM setup

#### Authentication methods

##### Static API key

```
# Set in environment
export ANTHROPIC_AUTH_TOKEN=sk-litellm-static-key

# Or in Claude Code settings
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-litellm-static-key"
  }
}
```

##### Dynamic API key with helper

- Create an API key helper script:

```
#!/bin/bash
# ~/bin/get-litellm-key.sh

# Example: Fetch key from vault
vault kv get -field=api_key secret/litellm/claude-code

# Example: Generate JWT token
jwt encode \
  --secret="${JWT_SECRET}" \
  --exp="+1h" \
  '{"user":"'${USER}'","team":"engineering"}'
```

- Configure Claude Code settings to use the helper:

```
{
  "apiKeyHelper": "~/bin/get-litellm-key.sh"
}
```

- Set token refresh interval:

```
# Refresh every hour (3600000 ms)
export CLAUDE_CODE_API_KEY_HELPER_TTL_MS=3600000
```

#### Unified endpoint (recommended)

```
export ANTHROPIC_BASE_URL=https://litellm-server:4000
```

- Load balancing
- Fallbacks
- Consistent support for cost tracking and end-user tracking

#### Provider-specific pass-through endpoints (alternative)

##### Claude API through LiteLLM

```
export ANTHROPIC_BASE_URL=https://litellm-server:4000/anthropic
```

##### Amazon Bedrock through LiteLLM

```
export ANTHROPIC_BEDROCK_BASE_URL=https://litellm-server:4000/bedrock
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1
export CLAUDE_CODE_USE_BEDROCK=1
```

##### Google Vertex AI through LiteLLM

```
export ANTHROPIC_VERTEX_BASE_URL=https://litellm-server:4000/vertex_ai/v1
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
```

## Additional resources

- [LiteLLM documentation](https://docs.litellm.ai/)
- [Claude Code settings](/docs/en/settings)
- [Enterprise network configuration](/docs/en/network-config)
- [Third-party integrations overview](/docs/en/third-party-integrations)

Was this page helpful?
