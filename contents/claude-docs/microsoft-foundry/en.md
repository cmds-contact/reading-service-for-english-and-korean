# Claude Code on Microsoft Foundry

English

# Claude Code on Microsoft Foundry

Learn about configuring Claude Code through Microsoft Foundry, including setup, configuration, and troubleshooting.

## Prerequisites

- An Azure subscription with access to Microsoft Foundry
- RBAC permissions to create Microsoft Foundry resources and deployments
- Azure CLI installed and configured (optional - only needed if you don’t have another mechanism for getting credentials)

## Setup

### 1. Provision Microsoft Foundry resource

- Navigate to the [Microsoft Foundry portal](https://ai.azure.com/)
- Create a new resource, noting your resource name
- Create deployments for the Claude models:

Claude Opus
Claude Sonnet
Claude Haiku
- Claude Opus
- Claude Sonnet
- Claude Haiku

### 2. Configure Azure credentials

- Navigate to your resource in the Microsoft Foundry portal
- Go to the **Endpoints and keys** section
- Copy **API Key**
- Set the environment variable:

```
export ANTHROPIC_FOUNDRY_API_KEY=your-azure-api-key
```

```
az login
```

> When using Microsoft Foundry, the `/login` and `/logout` commands are disabled since authentication is handled through Azure credentials.

### 3. Configure Claude Code

```
# Enable Microsoft Foundry integration
export CLAUDE_CODE_USE_FOUNDRY=1

# Azure resource name (replace {resource} with your resource name)
export ANTHROPIC_FOUNDRY_RESOURCE={resource}
# Or provide the full base URL:
# export ANTHROPIC_FOUNDRY_BASE_URL=https://{resource}.services.ai.azure.com

# Set models to your resource's deployment names
export ANTHROPIC_DEFAULT_SONNET_MODEL='claude-sonnet-4-5'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='claude-haiku-4-5'
export ANTHROPIC_DEFAULT_OPUS_MODEL='claude-opus-4-1'
```

## Azure RBAC configuration

```
{
  "permissions": [
    {
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/providers/*"
      ]
    }
  ]
}
```

## Troubleshooting

- Configure Entra ID on the environment, or set `ANTHROPIC_FOUNDRY_API_KEY`.

## Additional resources

- [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-azure-ai-foundry)
- [Microsoft Foundry models](https://ai.azure.com/explore/models)
- [Microsoft Foundry pricing](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/)

Was this page helpful?
