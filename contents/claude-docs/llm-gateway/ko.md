# LLM Gateway 구성

Korean

# LLM Gateway 구성

LLM Gateway 솔루션과 함께 작동하도록 Claude Code를 구성하는 방법을 알아봅니다. Gateway 요구 사항, 인증 구성, 모델 선택 및 공급자별 엔드포인트 설정을 다룹니다.

- **중앙 집중식 인증** - API 키 관리를 위한 단일 지점
- **사용량 추적** - 팀 및 프로젝트 전반의 사용량 모니터링
- **비용 관리** - 예산 및 속도 제한 구현
- **감사 로깅** - 규정 준수를 위한 모든 모델 상호 작용 추적
- **모델 라우팅** - 코드 변경 없이 공급자 간 전환

## Gateway 요구 사항

- **Anthropic Messages**: `/v1/messages`, `/v1/messages/count_tokens`

요청 헤더 전달 필수: `anthropic-beta`, `anthropic-version`
- 요청 헤더 전달 필수: `anthropic-beta`, `anthropic-version`
- **Bedrock InvokeModel**: `/invoke`, `/invoke-with-response-stream`

요청 본문 필드 보존 필수: `anthropic_beta`, `anthropic_version`
- 요청 본문 필드 보존 필수: `anthropic_beta`, `anthropic_version`
- **Vertex rawPredict**: `:rawPredict`, `:streamRawPredict`, `/count-tokens:rawPredict`

요청 헤더 전달 필수: `anthropic-beta`, `anthropic-version`

> Claude Code는 API 형식에 따라 활성화할 기능을 결정합니다. Bedrock 또는 Vertex에서 Anthropic Messages 형식을 사용하는 경우 환경 변수 `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`을 설정해야 할 수 있습니다.

## 구성

### 모델 선택

## LiteLLM 구성

> LiteLLM은 타사 프록시 서비스입니다. Anthropic은 LiteLLM의 보안 또는 기능을 보증, 유지 관리 또는 감사하지 않습니다. 이 가이드는 정보 제공 목적으로 제공되며 오래될 수 있습니다. 재량에 따라 사용하세요.

### 사전 요구 사항

- 최신 버전으로 업데이트된 Claude Code
- 배포되고 접근 가능한 LiteLLM Proxy Server
- 선택한 공급자를 통한 Claude 모델 접근

### 기본 LiteLLM 설정

#### 인증 방법

##### 정적 API 키

```
# 환경에 설정
export ANTHROPIC_AUTH_TOKEN=sk-litellm-static-key

# 또는 Claude Code 설정에서
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-litellm-static-key"
  }
}
```

##### 헬퍼를 사용한 동적 API 키

- API 키 헬퍼 스크립트를 생성합니다:

```
#!/bin/bash
# ~/bin/get-litellm-key.sh

# 예시: vault에서 키 가져오기
vault kv get -field=api_key secret/litellm/claude-code

# 예시: JWT 토큰 생성
jwt encode \
  --secret="${JWT_SECRET}" \
  --exp="+1h" \
  '{"user":"'${USER}'","team":"engineering"}'
```

- 헬퍼를 사용하도록 Claude Code 설정을 구성합니다:

```
{
  "apiKeyHelper": "~/bin/get-litellm-key.sh"
}
```

- 토큰 갱신 간격을 설정합니다:

```
# 매시간 갱신 (3600000 ms)
export CLAUDE_CODE_API_KEY_HELPER_TTL_MS=3600000
```

#### 통합 엔드포인트 (권장)

```
export ANTHROPIC_BASE_URL=https://litellm-server:4000
```

- 로드 밸런싱
- 폴백
- 비용 추적 및 최종 사용자 추적에 대한 일관된 지원

#### 공급자별 패스스루 엔드포인트 (대안)

##### LiteLLM을 통한 Claude API

```
export ANTHROPIC_BASE_URL=https://litellm-server:4000/anthropic
```

##### LiteLLM을 통한 Amazon Bedrock

```
export ANTHROPIC_BEDROCK_BASE_URL=https://litellm-server:4000/bedrock
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1
export CLAUDE_CODE_USE_BEDROCK=1
```

##### LiteLLM을 통한 Google Vertex AI

```
export ANTHROPIC_VERTEX_BASE_URL=https://litellm-server:4000/vertex_ai/v1
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
```

## 추가 리소스

- [LiteLLM 문서](https://docs.litellm.ai/)
- [Claude Code 설정](/docs/en/settings)
- [엔터프라이즈 네트워크 구성](/docs/en/network-config)
- [타사 통합 개요](/docs/en/third-party-integrations)

이 페이지가 도움이 되었나요?
