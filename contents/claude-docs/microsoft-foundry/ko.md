# Microsoft Foundry에서 Claude Code 사용하기

한국어

# Microsoft Foundry에서 Claude Code 사용하기

설정, 구성 및 문제 해결을 포함하여 Microsoft Foundry를 통해 Claude Code를 구성하는 방법을 알아봅니다.

## 사전 요구사항

- Microsoft Foundry에 대한 접근 권한이 있는 Azure 구독
- Microsoft Foundry 리소스 및 배포를 생성하기 위한 RBAC 권한
- Azure CLI 설치 및 구성 (선택 사항 - 자격 증명을 얻는 다른 메커니즘이 없는 경우에만 필요)

## 설정

### 1. Microsoft Foundry 리소스 프로비저닝

- [Microsoft Foundry 포털](https://ai.azure.com/)로 이동합니다
- 새 리소스를 생성하고 리소스 이름을 기록합니다
- Claude 모델에 대한 배포를 생성합니다:

Claude Opus
Claude Sonnet
Claude Haiku
- Claude Opus
- Claude Sonnet
- Claude Haiku

### 2. Azure 자격 증명 구성

- Microsoft Foundry 포털에서 리소스로 이동합니다
- **Endpoints and keys** 섹션으로 이동합니다
- **API Key**를 복사합니다
- 환경 변수를 설정합니다:

```
export ANTHROPIC_FOUNDRY_API_KEY=your-azure-api-key
```

```
az login
```

> Microsoft Foundry를 사용할 때는 인증이 Azure 자격 증명을 통해 처리되므로 `/login` 및 `/logout` 명령어가 비활성화됩니다.

### 3. Claude Code 구성

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

## Azure RBAC 구성

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

## 문제 해결

- 환경에서 Entra ID를 구성하거나 `ANTHROPIC_FOUNDRY_API_KEY`를 설정하세요.

## 추가 리소스

- [Microsoft Foundry 문서](https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-azure-ai-foundry)
- [Microsoft Foundry 모델](https://ai.azure.com/explore/models)
- [Microsoft Foundry 가격](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/)

이 페이지가 도움이 되었나요?
