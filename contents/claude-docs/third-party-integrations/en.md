# Enterprise deployment overview

English

# Enterprise deployment overview

Learn how Claude Code can integrate with various third-party services and infrastructure to meet enterprise deployment requirements.

## Provider comparison

## Cloud providers

## Amazon Bedrock

## Google Vertex AI

## Microsoft Foundry

## Corporate infrastructure

## Enterprise Network

## LLM Gateway

## Configuration overview

> Understand the difference between:
> **Corporate proxy**: An HTTP/HTTPS proxy for routing traffic (set via `HTTPS_PROXY` or `HTTP_PROXY`)
> **LLM Gateway**: A service that handles authentication and provides provider-compatible endpoints (set via `ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL`, or `ANTHROPIC_VERTEX_BASE_URL`)
> Both configurations can be used in tandem.

- **Corporate proxy**: An HTTP/HTTPS proxy for routing traffic (set via `HTTPS_PROXY` or `HTTP_PROXY`)
- **LLM Gateway**: A service that handles authentication and provides provider-compatible endpoints (set via `ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL`, or `ANTHROPIC_VERTEX_BASE_URL`)

### Using Bedrock with corporate proxy

```
# Enable Bedrock
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### Using Bedrock with LLM Gateway

```
# Enable Bedrock
export CLAUDE_CODE_USE_BEDROCK=1

# Configure LLM gateway
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1  # If gateway handles AWS auth
```

### Using Foundry with corporate proxy

```
# Enable Microsoft Foundry
export CLAUDE_CODE_USE_FOUNDRY=1
export ANTHROPIC_FOUNDRY_RESOURCE=your-resource
export ANTHROPIC_FOUNDRY_API_KEY=your-api-key  # Or omit for Entra ID auth

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### Using Foundry with LLM Gateway

```
# Enable Microsoft Foundry
export CLAUDE_CODE_USE_FOUNDRY=1

# Configure LLM gateway
export ANTHROPIC_FOUNDRY_BASE_URL='https://your-llm-gateway.com'
export CLAUDE_CODE_SKIP_FOUNDRY_AUTH=1  # If gateway handles Azure auth
```

### Using Vertex AI with corporate proxy

```
# Enable Vertex
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### Using Vertex AI with LLM Gateway

```
# Enable Vertex
export CLAUDE_CODE_USE_VERTEX=1

# Configure LLM gateway
export ANTHROPIC_VERTEX_BASE_URL='https://your-llm-gateway.com/vertex'
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1  # If gateway handles GCP auth
```

### Authentication configuration

## Choosing the right deployment configuration

### Direct provider access

- Want the simplest setup
- Have existing AWS or GCP infrastructure
- Need provider-native monitoring and compliance

### Corporate proxy

- Have existing corporate proxy requirements
- Need traffic monitoring and compliance
- Must route all traffic through specific network paths
- Need usage tracking across teams
- Want to dynamically switch between models
- Require custom rate limiting or budgets
- Need centralized authentication management

## Debugging

- Use the `claude /status` [slash command](/docs/en/slash-commands). This command provides observability into any applied authentication, proxy, and URL settings.
- Set environment variable `export ANTHROPIC_LOG=debug` to log requests.

## Best practices for organizations

### 1. Invest in documentation and memory

- **Organization-wide**: Deploy to system directories like `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) for company-wide standards
- **Repository-level**: Create `CLAUDE.md` files in repository roots containing project architecture, build commands, and contribution guidelines. Check these into source control so all users benefit
[Learn more](/docs/en/memory).

### 2. Simplify deployment

### 3. Start with guided usage

### 4. Configure security policies

### 5. Leverage MCP for integrations

## Next steps

- [Set up Amazon Bedrock](/docs/en/amazon-bedrock) for AWS-native deployment
- [Configure Google Vertex AI](/docs/en/google-vertex-ai) for GCP deployment
- [Set up Microsoft Foundry](/docs/en/microsoft-foundry) for Azure deployment
- [Configure Enterprise Network](/docs/en/network-config) for network requirements
- [Deploy LLM Gateway](/docs/en/llm-gateway) for enterprise management
- [Settings](/docs/en/settings) for configuration options and environment variables

Was this page helpful?
