# Claude Code on Google Vertex AI

English

# Claude Code on Google Vertex AI

Learn about configuring Claude Code through Google Vertex AI, including setup, IAM configuration, and troubleshooting.

## Prerequisites

- A Google Cloud Platform (GCP) account with billing enabled
- A GCP project with Vertex AI API enabled
- Access to desired Claude models (for example, Claude Sonnet 4.5)
- Google Cloud SDK (`gcloud`) installed and configured
- Quota allocated in desired GCP region

## Region Configuration

> Vertex AI may not support the Claude Code default models on all regions. You may need to switch to a [supported region or model](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations#genai-partner-models).

> Vertex AI may not support the Claude Code default models on global endpoints. You may need to switch to a regional endpoint or [supported model](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-partner-models#supported_models).

## Setup

### 1. Enable Vertex AI API

```
# Set your project ID
gcloud config set project YOUR-PROJECT-ID

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com
```

### 2. Request model access

- Navigate to the [Vertex AI Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)
- Search for “Claude” models
- Request access to desired Claude models (for example, Claude Sonnet 4.5)
- Wait for approval (may take 24-48 hours)

### 3. Configure GCP credentials

> When authenticating, Claude Code will automatically use the project ID from the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable. To override this, set one of these environment variables: `GCLOUD_PROJECT`, `GOOGLE_CLOUD_PROJECT`, or `GOOGLE_APPLICATION_CREDENTIALS`.

### 4. Configure Claude Code

```
# Enable Vertex AI integration
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=global
export ANTHROPIC_VERTEX_PROJECT_ID=YOUR-PROJECT-ID

# Optional: Disable prompt caching if needed
export DISABLE_PROMPT_CACHING=1

# When CLOUD_ML_REGION=global, override region for unsupported models
export VERTEX_REGION_CLAUDE_3_5_HAIKU=us-east5

# Optional: Override regions for other specific models
export VERTEX_REGION_CLAUDE_3_5_SONNET=us-east5
export VERTEX_REGION_CLAUDE_3_7_SONNET=us-east5
export VERTEX_REGION_CLAUDE_4_0_OPUS=europe-west1
export VERTEX_REGION_CLAUDE_4_0_SONNET=us-east5
export VERTEX_REGION_CLAUDE_4_1_OPUS=europe-west1
```

> [Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching) is automatically supported when you specify the `cache_control` ephemeral flag. To disable it, set `DISABLE_PROMPT_CACHING=1`. For heightened rate limits, contact Google Cloud support.

> When using Vertex AI, the `/login` and `/logout` commands are disabled since authentication is handled through Google Cloud credentials.

### 5. Model configuration

> For Vertex AI users, Claude Code will not automatically upgrade from Haiku 3.5 to Haiku 4.5. To manually switch to a newer Haiku model, set the `ANTHROPIC_DEFAULT_HAIKU_MODEL` environment variable to the full model name (for example, `claude-haiku-4-5@20251001`).

```
export ANTHROPIC_MODEL='claude-opus-4-1@20250805'
export ANTHROPIC_SMALL_FAST_MODEL='claude-haiku-4-5@20251001'
```

## IAM configuration

- `aiplatform.endpoints.predict` - Required for model invocation and token counting

> We recommend creating a dedicated GCP project for Claude Code to simplify cost tracking and access control.

## 1M token context window

> The 1M token context window is currently in beta. To use the extended context window, include the `context-1m-2025-08-07` beta header in your Vertex AI requests.

## Troubleshooting

- Check current quotas or request quota increase through [Cloud Console](https://cloud.google.com/docs/quotas/view-manage)
- Confirm model is Enabled in [Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)
- Verify you have access to the specified region
- If using `CLOUD_ML_REGION=global`, check that your models support global endpoints in [Model Garden](https://console.cloud.google.com/vertex-ai/model-garden) under “Supported features”. For models that don’t support global endpoints, either:

Specify a supported model via `ANTHROPIC_MODEL` or `ANTHROPIC_SMALL_FAST_MODEL`, or
Set a regional endpoint using `VERTEX_REGION_<MODEL_NAME>` environment variables
- Specify a supported model via `ANTHROPIC_MODEL` or `ANTHROPIC_SMALL_FAST_MODEL`, or
- Set a regional endpoint using `VERTEX_REGION_<MODEL_NAME>` environment variables
- For regional endpoints, ensure the primary model and small/fast model are supported in your selected region
- Consider switching to `CLOUD_ML_REGION=global` for better availability

## Additional resources

- [Vertex AI documentation](https://cloud.google.com/vertex-ai/docs)
- [Vertex AI pricing](https://cloud.google.com/vertex-ai/pricing)
- [Vertex AI quotas and limits](https://cloud.google.com/vertex-ai/docs/quotas)

Was this page helpful?
