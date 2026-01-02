# Google Vertex AI에서 Claude Code 사용하기

한국어

# Google Vertex AI에서 Claude Code 사용하기

설정, IAM 구성 및 문제 해결을 포함하여 Google Vertex AI를 통해 Claude Code를 구성하는 방법을 알아봅니다.

## 사전 요구사항

- 결제가 활성화된 Google Cloud Platform (GCP) 계정
- Vertex AI API가 활성화된 GCP 프로젝트
- 원하는 Claude 모델(예: Claude Sonnet 4.5)에 대한 접근 권한
- Google Cloud SDK (`gcloud`) 설치 및 구성
- 원하는 GCP 리전에 할당된 할당량

## 리전 구성

> Vertex AI는 모든 리전에서 Claude Code 기본 모델을 지원하지 않을 수 있습니다. [지원되는 리전 또는 모델](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations#genai-partner-models)로 전환해야 할 수 있습니다.

> Vertex AI는 전역 엔드포인트에서 Claude Code 기본 모델을 지원하지 않을 수 있습니다. 리전 엔드포인트나 [지원되는 모델](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-partner-models#supported_models)로 전환해야 할 수 있습니다.

## 설정

### 1. Vertex AI API 활성화

```
# Set your project ID
gcloud config set project YOUR-PROJECT-ID

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com
```

### 2. 모델 접근 요청

- [Vertex AI Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)으로 이동합니다
- "Claude" 모델을 검색합니다
- 원하는 Claude 모델(예: Claude Sonnet 4.5)에 대한 접근을 요청합니다
- 승인을 기다립니다 (24-48시간 소요될 수 있음)

### 3. GCP 자격 증명 구성

> 인증 시 Claude Code는 `ANTHROPIC_VERTEX_PROJECT_ID` 환경 변수에서 프로젝트 ID를 자동으로 사용합니다. 이를 재정의하려면 다음 환경 변수 중 하나를 설정하세요: `GCLOUD_PROJECT`, `GOOGLE_CLOUD_PROJECT` 또는 `GOOGLE_APPLICATION_CREDENTIALS`.

### 4. Claude Code 구성

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

> [프롬프트 캐싱](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)은 `cache_control` ephemeral 플래그를 지정할 때 자동으로 지원됩니다. 비활성화하려면 `DISABLE_PROMPT_CACHING=1`을 설정하세요. 더 높은 속도 제한이 필요하면 Google Cloud 지원에 문의하세요.

> Vertex AI를 사용할 때는 인증이 Google Cloud 자격 증명을 통해 처리되므로 `/login` 및 `/logout` 명령어가 비활성화됩니다.

### 5. 모델 구성

> Vertex AI 사용자의 경우 Claude Code는 Haiku 3.5에서 Haiku 4.5로 자동 업그레이드되지 않습니다. 새로운 Haiku 모델로 수동 전환하려면 `ANTHROPIC_DEFAULT_HAIKU_MODEL` 환경 변수를 전체 모델 이름으로 설정하세요 (예: `claude-haiku-4-5@20251001`).

```
export ANTHROPIC_MODEL='claude-opus-4-1@20250805'
export ANTHROPIC_SMALL_FAST_MODEL='claude-haiku-4-5@20251001'
```

## IAM 구성

- `aiplatform.endpoints.predict` - 모델 호출 및 토큰 카운팅에 필요

> 비용 추적 및 접근 제어를 간소화하기 위해 Claude Code 전용 GCP 프로젝트를 생성하는 것을 권장합니다.

## 1M 토큰 컨텍스트 윈도우

> 1M 토큰 컨텍스트 윈도우는 현재 베타입니다. 확장된 컨텍스트 윈도우를 사용하려면 Vertex AI 요청에 `context-1m-2025-08-07` 베타 헤더를 포함하세요.

## 문제 해결

- [Cloud Console](https://cloud.google.com/docs/quotas/view-manage)을 통해 현재 할당량을 확인하거나 할당량 증가를 요청합니다
- [Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)에서 모델이 활성화되었는지 확인합니다
- 지정된 리전에 대한 접근 권한이 있는지 확인합니다
- `CLOUD_ML_REGION=global`을 사용하는 경우 [Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)의 "Supported features"에서 모델이 전역 엔드포인트를 지원하는지 확인합니다. 전역 엔드포인트를 지원하지 않는 모델의 경우:

`ANTHROPIC_MODEL` 또는 `ANTHROPIC_SMALL_FAST_MODEL`을 통해 지원되는 모델을 지정하거나,
`VERTEX_REGION_<MODEL_NAME>` 환경 변수를 사용하여 리전 엔드포인트를 설정합니다
- `ANTHROPIC_MODEL` 또는 `ANTHROPIC_SMALL_FAST_MODEL`을 통해 지원되는 모델을 지정하거나,
- `VERTEX_REGION_<MODEL_NAME>` 환경 변수를 사용하여 리전 엔드포인트를 설정합니다
- 리전 엔드포인트의 경우 선택한 리전에서 기본 모델과 소형/빠른 모델이 모두 지원되는지 확인합니다
- 더 나은 가용성을 위해 `CLOUD_ML_REGION=global`로 전환하는 것을 고려하세요

## 추가 리소스

- [Vertex AI 문서](https://cloud.google.com/vertex-ai/docs)
- [Vertex AI 가격](https://cloud.google.com/vertex-ai/pricing)
- [Vertex AI 할당량 및 제한](https://cloud.google.com/vertex-ai/docs/quotas)

이 페이지가 도움이 되었나요?
