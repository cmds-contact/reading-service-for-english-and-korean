# Amazon Bedrock에서 Claude Code 사용하기

한국어

# Amazon Bedrock에서 Claude Code 사용하기

설정, IAM 구성 및 문제 해결을 포함하여 Amazon Bedrock을 통해 Claude Code를 구성하는 방법을 알아봅니다.

## 사전 요구사항

- Bedrock 접근이 활성화된 AWS 계정
- Bedrock에서 원하는 Claude 모델(예: Claude Sonnet 4.5)에 대한 접근 권한
- AWS CLI 설치 및 구성 (선택 사항 - 자격 증명을 얻는 다른 메커니즘이 없는 경우에만 필요)
- 적절한 IAM 권한

## 설정

### 1. 사용 사례 세부 정보 제출

- 올바른 IAM 권한이 있는지 확인하세요 (아래에서 자세히 설명)
- [Amazon Bedrock 콘솔](https://console.aws.amazon.com/bedrock/)로 이동합니다
- **Chat/Text playground**를 선택합니다
- Anthropic 모델을 선택하면 사용 사례 양식을 작성하라는 메시지가 표시됩니다

### 2. AWS 자격 증명 구성

```
aws configure
```

```
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_SESSION_TOKEN=your-session-token
```

```
aws sso login --profile=<your-profile-name>

export AWS_PROFILE=your-profile-name
```

```
aws login
```

```
export AWS_BEARER_TOKEN_BEDROCK=your-bedrock-api-key
```

#### 고급 자격 증명 구성

##### 구성 예제

```
{
  "awsAuthRefresh": "aws sso login --profile myprofile",
  "env": {
    "AWS_PROFILE": "myprofile"
  }
}
```

##### 구성 설정 설명

```
{
  "Credentials": {
    "AccessKeyId": "value",
    "SecretAccessKey": "value",
    "SessionToken": "value"
  }
}
```

### 3. Claude Code 구성

```
# Enable Bedrock integration
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1  # or your preferred region

# Optional: Override the region for the small/fast model (Haiku)
export ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION=us-west-2
```

- `AWS_REGION`은 필수 환경 변수입니다. Claude Code는 이 설정을 위해 `.aws` 설정 파일을 읽지 않습니다.
- Bedrock을 사용할 때는 인증이 AWS 자격 증명을 통해 처리되므로 `/login` 및 `/logout` 명령어가 비활성화됩니다.
- 다른 프로세스에 노출되지 않도록 하려는 `AWS_PROFILE`과 같은 환경 변수에 대해 설정 파일을 사용할 수 있습니다. 자세한 내용은 [설정](/docs/en/settings)을 참조하세요.

### 4. 모델 구성

> Bedrock 사용자의 경우 Claude Code는 Haiku 3.5에서 Haiku 4.5로 자동 업그레이드되지 않습니다. 새로운 Haiku 모델로 수동 전환하려면 `ANTHROPIC_DEFAULT_HAIKU_MODEL` 환경 변수를 전체 모델 이름으로 설정하세요 (예: `us.anthropic.claude-haiku-4-5-20251001-v1:0`).

```
# Using inference profile ID
export ANTHROPIC_MODEL='global.anthropic.claude-sonnet-4-5-20250929-v1:0'
export ANTHROPIC_SMALL_FAST_MODEL='us.anthropic.claude-haiku-4-5-20251001-v1:0'

# Using application inference profile ARN
export ANTHROPIC_MODEL='arn:aws:bedrock:us-east-2:your-account-id:application-inference-profile/your-model-id'

# Optional: Disable prompt caching if needed
export DISABLE_PROMPT_CACHING=1
```

> [프롬프트 캐싱](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)은 모든 리전에서 사용 가능하지 않을 수 있습니다.

### 5. 출력 토큰 구성

```
# Recommended output token settings for Bedrock
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096
export MAX_THINKING_TOKENS=1024
```

- `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096`: Bedrock의 번다운 스로틀링 로직은 `max_token` 페널티로 최소 4096 토큰을 설정합니다. 이보다 낮게 설정해도 비용이 줄어들지 않지만 긴 도구 사용이 중단되어 Claude Code 에이전트 루프가 지속적으로 실패할 수 있습니다. Claude Code는 일반적으로 확장된 사고 없이 4096 출력 토큰 미만을 사용하지만, 상당한 파일 생성이나 Write 도구 사용을 포함하는 작업에는 이 여유가 필요할 수 있습니다.
- `MAX_THINKING_TOKENS=1024`: 이것은 도구 사용 응답을 중단하지 않으면서 확장된 사고를 위한 공간을 제공하고, 여전히 집중된 추론 체인을 유지합니다. 이 균형은 특히 코딩 작업에 항상 도움이 되지 않는 궤적 변경을 방지하는 데 도움이 됩니다.

## IAM 구성

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowModelAndInferenceProfileAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:ListInferenceProfiles"
      ],
      "Resource": [
        "arn:aws:bedrock:*:*:inference-profile/*",
        "arn:aws:bedrock:*:*:application-inference-profile/*",
        "arn:aws:bedrock:*:*:foundation-model/*"
      ]
    },
    {
      "Sid": "AllowMarketplaceSubscription",
      "Effect": "Allow",
      "Action": [
        "aws-marketplace:ViewSubscriptions",
        "aws-marketplace:Subscribe"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:CalledViaLast": "bedrock.amazonaws.com"
        }
      }
    }
  ]
}
```

> 비용 추적 및 접근 제어를 간소화하기 위해 Claude Code 전용 AWS 계정을 생성하는 것을 권장합니다.

## 문제 해결

- 모델 가용성 확인: `aws bedrock list-inference-profiles --region your-region`
- 지원되는 리전으로 전환: `export AWS_REGION=us-east-1`
- 교차 리전 접근을 위해 추론 프로필 사용 고려
- 모델을 [추론 프로필](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html) ID로 지정

## 추가 리소스

- [Bedrock 문서](https://docs.aws.amazon.com/bedrock/)
- [Bedrock 가격](https://aws.amazon.com/bedrock/pricing/)
- [Bedrock 추론 프로필](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html)
- [Amazon Bedrock에서 Claude Code: 빠른 설정 가이드](https://community.aws/content/2tXkZKrZzlrlu0KfH8gST5Dkppq/claude-code-on-amazon-bedrock-quick-setup-guide)
- [Claude Code 모니터링 구현 (Bedrock)](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock/blob/main/assets/docs/MONITORING.md)

이 페이지가 도움이 되었나요?
