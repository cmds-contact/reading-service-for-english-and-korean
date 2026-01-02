# Claude Code GitLab CI/CD

한국어

# Claude Code GitLab CI/CD

GitLab CI/CD를 사용하여 Claude Code를 개발 워크플로우에 통합하는 방법을 알아봅니다

> Claude Code for GitLab CI/CD는 현재 베타 버전입니다. 경험을 개선함에 따라 기능이 발전할 수 있습니다. 이 통합은 GitLab에서 유지 관리합니다. 지원은 [GitLab 이슈](https://gitlab.com/gitlab-org/gitlab/-/issues/573776)를 참조하세요.

> 이 통합은 [Claude Code CLI 및 SDK](https://docs.claude.com/en/docs/agent-sdk) 위에 구축되어 있어 CI/CD 작업 및 맞춤형 자동화 워크플로우에서 Claude를 프로그래밍 방식으로 사용할 수 있습니다.

## GitLab에서 Claude Code를 사용해야 하는 이유

- **즉각적인 MR 생성**: 필요한 내용을 설명하면 Claude가 변경사항과 설명이 포함된 완전한 MR을 제안합니다
- **자동화된 구현**: 단일 명령어나 멘션으로 이슈를 작동하는 코드로 변환합니다
- **프로젝트 인식**: Claude는 `CLAUDE.md` 가이드라인과 기존 코드 패턴을 따릅니다
- **간단한 설정**: `.gitlab-ci.yml`에 하나의 작업과 마스킹된 CI/CD 변수 추가
- **엔터프라이즈 지원**: 데이터 거주지 및 조달 요구 사항을 충족하기 위해 Claude API, AWS Bedrock 또는 Google Vertex AI 선택
- **기본 보안**: 브랜치 보호 및 승인과 함께 GitLab 러너에서 실행

## 작동 방식

- **이벤트 기반 오케스트레이션**: GitLab은 선택한 트리거(예: 이슈, MR 또는 리뷰 스레드에서 `@claude`를 멘션하는 댓글)를 수신합니다. 작업은 스레드와 저장소에서 컨텍스트를 수집하고, 해당 입력에서 프롬프트를 구성하여 Claude Code를 실행합니다.
- **공급자 추상화**: 환경에 맞는 공급자 사용:

Claude API (SaaS)
AWS Bedrock (IAM 기반 액세스, 교차 리전 옵션)
Google Vertex AI (GCP 네이티브, Workload Identity Federation)
- Claude API (SaaS)
- AWS Bedrock (IAM 기반 액세스, 교차 리전 옵션)
- Google Vertex AI (GCP 네이티브, Workload Identity Federation)
- **샌드박스 실행**: 각 상호작용은 엄격한 네트워크 및 파일 시스템 규칙이 있는 컨테이너에서 실행됩니다. Claude Code는 쓰기를 제한하기 위해 워크스페이스 범위 권한을 적용합니다. 모든 변경 사항은 MR을 통해 흐르므로 리뷰어가 diff를 보고 승인이 여전히 적용됩니다.

## Claude가 할 수 있는 일

- 이슈 설명이나 댓글에서 MR 생성 및 업데이트
- 성능 저하 분석 및 최적화 제안
- 브랜치에서 직접 기능 구현 후 MR 열기
- 테스트나 댓글에서 식별된 버그 및 회귀 수정
- 후속 댓글에 응답하여 요청된 변경 사항 반복

## 설정

### 빠른 설정

- **마스킹된 CI/CD 변수 추가**

**Settings** → **CI/CD** → **Variables**로 이동
`ANTHROPIC_API_KEY` 추가 (마스킹, 필요시 보호)
- **Settings** → **CI/CD** → **Variables**로 이동
- `ANTHROPIC_API_KEY` 추가 (마스킹, 필요시 보호)
- `.gitlab-ci.yml`에 Claude 작업 추가

```
stages:
  - ai

claude:
  stage: ai
  image: node:24-alpine3.21
  # 작업을 트리거하는 방법에 맞게 규칙 조정:
  # - 수동 실행
  # - merge request 이벤트
  # - 댓글에 '@claude'가 포함된 경우 web/API 트리거
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  variables:
    GIT_STRATEGY: fetch
  before_script:
    - apk update
    - apk add --no-cache git curl bash
    - npm install -g @anthropic-ai/claude-code
  script:
    # 선택사항: 설정에서 제공하는 경우 GitLab MCP 서버 시작
    - /bin/gitlab-mcp-server || true
    # 컨텍스트 페이로드가 있는 web/API 트리거를 통해 호출할 때 AI_FLOW_* 변수 사용
    - echo "$AI_FLOW_INPUT for $AI_FLOW_CONTEXT on $AI_FLOW_EVENT"
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Review this MR and implement the requested changes'}"
      --permission-mode acceptEdits
      --allowedTools "Bash(*) Read(*) Edit(*) Write(*) mcp__gitlab"
      --debug
```

> Claude API 대신 AWS Bedrock이나 Google Vertex AI에서 실행하려면 아래 [AWS Bedrock & Google Vertex AI와 함께 사용하기](#using-with-aws-bedrock--google-vertex-ai) 섹션에서 인증 및 환경 설정을 참조하세요.

### 수동 설정 (프로덕션에 권장)

- **공급자 액세스 구성**:

**Claude API**: `ANTHROPIC_API_KEY`를 마스킹된 CI/CD 변수로 생성 및 저장
**AWS Bedrock**: **GitLab** → **AWS OIDC** 구성 및 Bedrock용 IAM 역할 생성
**Google Vertex AI**: **GitLab** → **GCP**용 Workload Identity Federation 구성
- **Claude API**: `ANTHROPIC_API_KEY`를 마스킹된 CI/CD 변수로 생성 및 저장
- **AWS Bedrock**: **GitLab** → **AWS OIDC** 구성 및 Bedrock용 IAM 역할 생성
- **Google Vertex AI**: **GitLab** → **GCP**용 Workload Identity Federation 구성
- **GitLab API 작업을 위한 프로젝트 자격 증명 추가**:

기본적으로 `CI_JOB_TOKEN` 사용, 또는 `api` 범위가 있는 Project Access Token 생성
PAT를 사용하는 경우 `GITLAB_ACCESS_TOKEN`으로 저장 (마스킹)
- 기본적으로 `CI_JOB_TOKEN` 사용, 또는 `api` 범위가 있는 Project Access Token 생성
- PAT를 사용하는 경우 `GITLAB_ACCESS_TOKEN`으로 저장 (마스킹)
- `.gitlab-ci.yml`에 Claude 작업 추가 (아래 예시 참조)
- **(선택사항) 멘션 기반 트리거 활성화**:

프로젝트 웹훅에 이벤트 리스너용 "Comments (notes)" 추가 (사용하는 경우)
댓글에 `@claude`가 포함된 경우 리스너가 `AI_FLOW_INPUT` 및 `AI_FLOW_CONTEXT`와 같은 변수로 파이프라인 트리거 API 호출
- 프로젝트 웹훅에 이벤트 리스너용 "Comments (notes)" 추가 (사용하는 경우)
- 댓글에 `@claude`가 포함된 경우 리스너가 `AI_FLOW_INPUT` 및 `AI_FLOW_CONTEXT`와 같은 변수로 파이프라인 트리거 API 호출

## 사용 사례 예시

### 이슈를 MR로 변환

```
@claude implement this feature based on the issue description
```

### 구현 도움 받기

```
@claude suggest a concrete approach to cache the results of this API call
```

### 버그 빠르게 수정

```
@claude fix the TypeError in the user dashboard component
```

## AWS Bedrock & Google Vertex AI와 함께 사용하기

- AWS Bedrock
- Google Vertex AI

### 사전 요구 사항

- 원하는 Claude 모델에 대한 Amazon Bedrock 액세스가 있는 AWS 계정
- AWS IAM에서 OIDC ID 공급자로 GitLab 구성
- Bedrock 권한 및 GitLab 프로젝트/ref로 제한된 신뢰 정책이 있는 IAM 역할
- 역할 가정을 위한 GitLab CI/CD 변수:

`AWS_ROLE_TO_ASSUME` (역할 ARN)
`AWS_REGION` (Bedrock 리전)
- `AWS_ROLE_TO_ASSUME` (역할 ARN)
- `AWS_REGION` (Bedrock 리전)

### 설정 지침

- Amazon Bedrock 활성화 및 대상 Claude 모델 액세스 요청
- 아직 없는 경우 GitLab용 IAM OIDC 공급자 생성
- GitLab OIDC 공급자가 신뢰하는 IAM 역할 생성, 프로젝트 및 보호된 ref로 제한
- Bedrock 호출 API에 대한 최소 권한 연결
- `AWS_ROLE_TO_ASSUME`
- `AWS_REGION`

```
# AWS Bedrock의 경우:
- AWS_ROLE_TO_ASSUME
- AWS_REGION
```

- 다음을 포함한 Google Cloud 프로젝트:

Vertex AI API 활성화
GitLab OIDC를 신뢰하도록 Workload Identity Federation 구성
- Vertex AI API 활성화
- GitLab OIDC를 신뢰하도록 Workload Identity Federation 구성
- 필요한 Vertex AI 역할만 있는 전용 서비스 계정
- WIF를 위한 GitLab CI/CD 변수:

`GCP_WORKLOAD_IDENTITY_PROVIDER` (전체 리소스 이름)
`GCP_SERVICE_ACCOUNT` (서비스 계정 이메일)
- `GCP_WORKLOAD_IDENTITY_PROVIDER` (전체 리소스 이름)
- `GCP_SERVICE_ACCOUNT` (서비스 계정 이메일)
- IAM Credentials API, STS API, Vertex AI API 활성화
- GitLab OIDC용 Workload Identity Pool 및 공급자 생성
- Vertex AI 역할이 있는 전용 서비스 계정 생성
- WIF 주체에 서비스 계정 가장 권한 부여
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

```
# Google Vertex AI의 경우:
- GCP_WORKLOAD_IDENTITY_PROVIDER
- GCP_SERVICE_ACCOUNT
- CLOUD_ML_REGION (예: us-east5)
```

## 설정 예시

### 기본 .gitlab-ci.yml (Claude API)

```
stages:
  - ai

claude:
  stage: ai
  image: node:24-alpine3.21
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  variables:
    GIT_STRATEGY: fetch
  before_script:
    - apk update
    - apk add --no-cache git curl bash
    - npm install -g @anthropic-ai/claude-code
  script:
    - /bin/gitlab-mcp-server || true
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Summarize recent changes and suggest improvements'}"
      --permission-mode acceptEdits
      --allowedTools "Bash(*) Read(*) Edit(*) Write(*) mcp__gitlab"
      --debug
  # Claude Code는 CI/CD 변수에서 ANTHROPIC_API_KEY를 사용합니다
```

### AWS Bedrock 작업 예시 (OIDC)

- 선택한 Claude 모델에 대한 Amazon Bedrock 활성화
- GitLab 프로젝트 및 ref를 신뢰하는 역할로 AWS에서 GitLab OIDC 구성
- Bedrock 권한이 있는 IAM 역할 (최소 권한 권장)
- `AWS_ROLE_TO_ASSUME`: Bedrock 액세스용 IAM 역할의 ARN
- `AWS_REGION`: Bedrock 리전 (예: `us-west-2`)

```
claude-bedrock:
  stage: ai
  image: node:24-alpine3.21
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
  before_script:
    - apk add --no-cache bash curl jq git python3 py3-pip
    - pip install --no-cache-dir awscli
    - npm install -g @anthropic-ai/claude-code
    # GitLab OIDC 토큰을 AWS 자격 증명으로 교환
    - export AWS_WEB_IDENTITY_TOKEN_FILE="${CI_JOB_JWT_FILE:-/tmp/oidc_token}"
    - if [ -n "${CI_JOB_JWT_V2}" ]; then printf "%s" "$CI_JOB_JWT_V2" > "$AWS_WEB_IDENTITY_TOKEN_FILE"; fi
    - >
      aws sts assume-role-with-web-identity
      --role-arn "$AWS_ROLE_TO_ASSUME"
      --role-session-name "gitlab-claude-$(date +%s)"
      --web-identity-token "file://$AWS_WEB_IDENTITY_TOKEN_FILE"
      --duration-seconds 3600 > /tmp/aws_creds.json
    - export AWS_ACCESS_KEY_ID="$(jq -r .Credentials.AccessKeyId /tmp/aws_creds.json)"
    - export AWS_SECRET_ACCESS_KEY="$(jq -r .Credentials.SecretAccessKey /tmp/aws_creds.json)"
    - export AWS_SESSION_TOKEN="$(jq -r .Credentials.SessionToken /tmp/aws_creds.json)"
  script:
    - /bin/gitlab-mcp-server || true
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Implement the requested changes and open an MR'}"
      --permission-mode acceptEdits
      --allowedTools "Bash(*) Read(*) Edit(*) Write(*) mcp__gitlab"
      --debug
  variables:
    AWS_REGION: "us-west-2"
```

> Bedrock의 모델 ID는 리전별 접두사와 버전 접미사를 포함합니다 (예: `us.anthropic.claude-sonnet-4-5-20250929-v1:0`). 워크플로우가 지원하는 경우 작업 구성이나 프롬프트를 통해 원하는 모델을 전달하세요.

### Google Vertex AI 작업 예시 (Workload Identity Federation)

- GCP 프로젝트에서 Vertex AI API 활성화
- Vertex AI 권한이 있는 서비스 계정
- `GCP_WORKLOAD_IDENTITY_PROVIDER`: 전체 공급자 리소스 이름
- `GCP_SERVICE_ACCOUNT`: 서비스 계정 이메일
- `CLOUD_ML_REGION`: Vertex 리전 (예: `us-east5`)

```
claude-vertex:
  stage: ai
  image: gcr.io/google.com/cloudsdktool/google-cloud-cli:slim
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
  before_script:
    - apt-get update && apt-get install -y git nodejs npm && apt-get clean
    - npm install -g @anthropic-ai/claude-code
    # WIF를 통해 Google Cloud에 인증 (다운로드된 키 없음)
    - >
      gcloud auth login --cred-file=<(cat <<EOF
      {
        "type": "external_account",
        "audience": "${GCP_WORKLOAD_IDENTITY_PROVIDER}",
        "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
        "service_account_impersonation_url": "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT}:generateAccessToken",
        "token_url": "https://sts.googleapis.com/v1/token"
      }
      EOF
      )
    - gcloud config set project "$(gcloud projects list --format='value(projectId)' --filter="name:${CI_PROJECT_NAMESPACE}" | head -n1)" || true
  script:
    - /bin/gitlab-mcp-server || true
    - >
      CLOUD_ML_REGION="${CLOUD_ML_REGION:-us-east5}"
      claude
      -p "${AI_FLOW_INPUT:-'Review and update code as requested'}"
      --permission-mode acceptEdits
      --allowedTools "Bash(*) Read(*) Edit(*) Write(*) mcp__gitlab"
      --debug
  variables:
    CLOUD_ML_REGION: "us-east5"
```

> Workload Identity Federation을 사용하면 서비스 계정 키를 저장할 필요가 없습니다. 저장소별 신뢰 조건과 최소 권한 서비스 계정을 사용하세요.

## 모범 사례

### CLAUDE.md 설정

### 보안 고려 사항

- `ANTHROPIC_API_KEY`를 마스킹된 변수로 추가 (필요시 보호)
- 가능한 경우 공급자별 OIDC 사용 (장기 키 없음)
- 작업 권한 및 네트워크 이그레스 제한
- 다른 기여자처럼 Claude의 MR 검토

### 성능 최적화

- `CLAUDE.md`를 집중적이고 간결하게 유지
- 반복을 줄이기 위해 명확한 이슈/MR 설명 제공
- 장기 실행을 피하기 위해 합리적인 작업 타임아웃 설정
- 가능한 경우 러너에서 npm 및 패키지 설치 캐시

### CI 비용

- **GitLab 러너 시간**:

Claude는 GitLab 러너에서 실행되며 컴퓨팅 분을 소비합니다
자세한 내용은 GitLab 요금제의 러너 청구 참조
- Claude는 GitLab 러너에서 실행되며 컴퓨팅 분을 소비합니다
- 자세한 내용은 GitLab 요금제의 러너 청구 참조
- **API 비용**:

각 Claude 상호작용은 프롬프트 및 응답 크기에 따라 토큰을 소비합니다
토큰 사용량은 작업 복잡도와 코드베이스 크기에 따라 다릅니다
자세한 내용은 [Anthropic 가격](https://docs.claude.com/en/docs/about-claude/pricing) 참조
- 각 Claude 상호작용은 프롬프트 및 응답 크기에 따라 토큰을 소비합니다
- 토큰 사용량은 작업 복잡도와 코드베이스 크기에 따라 다릅니다
- 자세한 내용은 [Anthropic 가격](https://docs.claude.com/en/docs/about-claude/pricing) 참조
- **비용 최적화 팁**:

불필요한 턴을 줄이기 위해 구체적인 `@claude` 명령어 사용
적절한 `max_turns` 및 작업 타임아웃 값 설정
병렬 실행을 제어하기 위해 동시성 제한
- 불필요한 턴을 줄이기 위해 구체적인 `@claude` 명령어 사용
- 적절한 `max_turns` 및 작업 타임아웃 값 설정
- 병렬 실행을 제어하기 위해 동시성 제한

## 보안 및 거버넌스

- 각 작업은 네트워크 액세스가 제한된 격리된 컨테이너에서 실행됩니다
- Claude의 변경 사항은 MR을 통해 흐르므로 리뷰어가 모든 diff를 볼 수 있습니다
- 브랜치 보호 및 승인 규칙이 AI 생성 코드에 적용됩니다
- Claude Code는 쓰기를 제한하기 위해 워크스페이스 범위 권한을 사용합니다
- 자체 공급자 자격 증명을 사용하므로 비용은 사용자가 관리합니다

## 문제 해결

### Claude가 @claude 명령어에 응답하지 않음

- 파이프라인이 트리거되는지 확인 (수동, MR 이벤트, 또는 노트 이벤트 리스너/웹훅을 통해)
- CI/CD 변수 (`ANTHROPIC_API_KEY` 또는 클라우드 공급자 설정)가 있고 마스킹되지 않았는지 확인
- 댓글에 `@claude`가 포함되어 있는지 (`/claude`가 아님) 확인하고 멘션 트리거가 구성되어 있는지 확인

### 작업이 댓글을 작성하거나 MR을 열 수 없음

- `CI_JOB_TOKEN`이 프로젝트에 대한 충분한 권한을 가지고 있는지 확인하거나, `api` 범위가 있는 Project Access Token 사용
- `--allowedTools`에서 `mcp__gitlab` 도구가 활성화되어 있는지 확인
- 작업이 MR 컨텍스트에서 실행되거나 `AI_FLOW_*` 변수를 통해 충분한 컨텍스트를 가지고 있는지 확인

### 인증 오류

- **Claude API의 경우**: `ANTHROPIC_API_KEY`가 유효하고 만료되지 않았는지 확인
- **Bedrock/Vertex의 경우**: OIDC/WIF 설정, 역할 가장, 시크릿 이름 확인; 리전 및 모델 가용성 확인

## 고급 설정

### 공통 파라미터 및 변수

- `prompt` / `prompt_file`: 인라인(`-p`) 또는 파일을 통해 지시 제공
- `max_turns`: 왕복 반복 횟수 제한
- `timeout_minutes`: 총 실행 시간 제한
- `ANTHROPIC_API_KEY`: Claude API에 필요 (Bedrock/Vertex에는 사용되지 않음)
- 공급자별 환경: `AWS_REGION`, Vertex용 프로젝트/리전 변수

> 정확한 플래그와 파라미터는 `@anthropic-ai/claude-code` 버전에 따라 다를 수 있습니다. 작업에서 `claude --help`를 실행하여 지원되는 옵션을 확인하세요.

### Claude 동작 사용자 정의

- **CLAUDE.md**: 코딩 표준, 보안 요구 사항 및 프로젝트 규칙을 정의합니다. Claude는 실행 중에 이를 읽고 규칙을 따릅니다.
- **사용자 정의 프롬프트**: 작업에서 `prompt`/`prompt_file`을 통해 작업별 지시를 전달합니다. 다른 작업에 대해 다른 프롬프트를 사용합니다 (예: 리뷰, 구현, 리팩토링).

이 페이지가 도움이 되었나요?
