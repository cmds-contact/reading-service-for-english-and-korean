# 엔터프라이즈 배포 개요

한국어

# 엔터프라이즈 배포 개요

Claude Code가 엔터프라이즈 배포 요구 사항을 충족하기 위해 다양한 타사 서비스 및 인프라와 어떻게 통합될 수 있는지 알아봅니다.

## 공급자 비교

## 클라우드 공급자

## Amazon Bedrock

## Google Vertex AI

## Microsoft Foundry

## 기업 인프라

## 엔터프라이즈 네트워크

## LLM Gateway

## 구성 개요

> 다음의 차이점을 이해하세요:
> **기업 프록시**: 트래픽을 라우팅하기 위한 HTTP/HTTPS 프록시 (`HTTPS_PROXY` 또는 `HTTP_PROXY`를 통해 설정)
> **LLM Gateway**: 인증을 처리하고 공급자 호환 엔드포인트를 제공하는 서비스 (`ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL` 또는 `ANTHROPIC_VERTEX_BASE_URL`을 통해 설정)
> 두 구성 모두 함께 사용할 수 있습니다.

- **기업 프록시**: 트래픽을 라우팅하기 위한 HTTP/HTTPS 프록시 (`HTTPS_PROXY` 또는 `HTTP_PROXY`를 통해 설정)
- **LLM Gateway**: 인증을 처리하고 공급자 호환 엔드포인트를 제공하는 서비스 (`ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL` 또는 `ANTHROPIC_VERTEX_BASE_URL`을 통해 설정)

### 기업 프록시와 함께 Bedrock 사용

```
# Enable Bedrock
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### LLM Gateway와 함께 Bedrock 사용

```
# Enable Bedrock
export CLAUDE_CODE_USE_BEDROCK=1

# Configure LLM gateway
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1  # If gateway handles AWS auth
```

### 기업 프록시와 함께 Foundry 사용

```
# Enable Microsoft Foundry
export CLAUDE_CODE_USE_FOUNDRY=1
export ANTHROPIC_FOUNDRY_RESOURCE=your-resource
export ANTHROPIC_FOUNDRY_API_KEY=your-api-key  # Or omit for Entra ID auth

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### LLM Gateway와 함께 Foundry 사용

```
# Enable Microsoft Foundry
export CLAUDE_CODE_USE_FOUNDRY=1

# Configure LLM gateway
export ANTHROPIC_FOUNDRY_BASE_URL='https://your-llm-gateway.com'
export CLAUDE_CODE_SKIP_FOUNDRY_AUTH=1  # If gateway handles Azure auth
```

### 기업 프록시와 함께 Vertex AI 사용

```
# Enable Vertex
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### LLM Gateway와 함께 Vertex AI 사용

```
# Enable Vertex
export CLAUDE_CODE_USE_VERTEX=1

# Configure LLM gateway
export ANTHROPIC_VERTEX_BASE_URL='https://your-llm-gateway.com/vertex'
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1  # If gateway handles GCP auth
```

### 인증 구성

## 올바른 배포 구성 선택하기

### 직접 공급자 접근

- 가장 간단한 설정을 원하는 경우
- 기존 AWS 또는 GCP 인프라가 있는 경우
- 공급자 네이티브 모니터링 및 규정 준수가 필요한 경우

### 기업 프록시

- 기존 기업 프록시 요구 사항이 있는 경우
- 트래픽 모니터링 및 규정 준수가 필요한 경우
- 모든 트래픽을 특정 네트워크 경로를 통해 라우팅해야 하는 경우
- 팀 전체의 사용량 추적이 필요한 경우
- 모델 간 동적 전환을 원하는 경우
- 커스텀 속도 제한이나 예산이 필요한 경우
- 중앙화된 인증 관리가 필요한 경우

## 디버깅

- `claude /status` [슬래시 명령어](/docs/en/slash-commands)를 사용하세요. 이 명령어는 적용된 인증, 프록시 및 URL 설정에 대한 가시성을 제공합니다.
- 요청을 로깅하려면 환경 변수 `export ANTHROPIC_LOG=debug`를 설정하세요.

## 조직을 위한 모범 사례

### 1. 문서화 및 메모리에 투자하기

- **조직 전체**: `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS)와 같은 시스템 디렉토리에 회사 전체 표준을 배포합니다
- **저장소 수준**: 프로젝트 아키텍처, 빌드 명령어 및 기여 가이드라인이 포함된 `CLAUDE.md` 파일을 저장소 루트에 생성합니다. 모든 사용자가 혜택을 받을 수 있도록 소스 컨트롤에 체크인하세요
[자세히 알아보기](/docs/en/memory).

### 2. 배포 간소화

### 3. 가이드된 사용으로 시작하기

### 4. 보안 정책 구성하기

### 5. 통합을 위해 MCP 활용하기

## 다음 단계

- [Amazon Bedrock 설정](/docs/en/amazon-bedrock) - AWS 네이티브 배포용
- [Google Vertex AI 구성](/docs/en/google-vertex-ai) - GCP 배포용
- [Microsoft Foundry 설정](/docs/en/microsoft-foundry) - Azure 배포용
- [엔터프라이즈 네트워크 구성](/docs/en/network-config) - 네트워크 요구 사항용
- [LLM Gateway 배포](/docs/en/llm-gateway) - 엔터프라이즈 관리용
- [설정](/docs/en/settings) - 구성 옵션 및 환경 변수

이 페이지가 도움이 되었나요?
