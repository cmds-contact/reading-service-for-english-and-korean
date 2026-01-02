# Claude Code GitHub Actions

한국어

# Claude Code GitHub Actions

Claude Code GitHub Actions를 사용하여 Claude Code를 개발 워크플로우에 통합하는 방법을 알아봅니다

> Claude Code GitHub Actions는 [Claude Code
> SDK](https://docs.claude.com/en/docs/agent-sdk) 위에 구축되어 있으며, 이를 통해 애플리케이션에
> Claude Code를 프로그래밍 방식으로 통합할 수 있습니다. SDK를 사용하여 GitHub Actions 외의
> 맞춤형 자동화 워크플로우를 구축할 수 있습니다.

> **Claude Opus 4.5가 출시되었습니다.** Claude Code GitHub Actions는 기본적으로 Sonnet을 사용합니다. Opus 4.5를 사용하려면 [model 파라미터](#breaking-changes-reference)를 `claude-opus-4-5-20251101`로 설정하세요.

## Claude Code GitHub Actions를 사용해야 하는 이유

- **즉각적인 PR 생성**: 필요한 내용을 설명하면 Claude가 모든 필수 변경 사항이 포함된 완전한 PR을 생성합니다
- **자동화된 코드 구현**: 단일 명령으로 이슈를 작동하는 코드로 변환합니다
- **표준 준수**: Claude는 `CLAUDE.md` 가이드라인과 기존 코드 패턴을 준수합니다
- **간단한 설정**: 설치 프로그램과 API 키로 몇 분 만에 시작할 수 있습니다
- **기본 보안**: 코드는 GitHub 러너에서만 실행됩니다

## Claude가 할 수 있는 일

### Claude Code Action

## 설정

## 빠른 설정

> 저장소 관리자여야 GitHub 앱을 설치하고 시크릿을 추가할 수 있습니다
> GitHub 앱은 Contents, Issues, Pull requests에 대한 읽기 및 쓰기 권한을 요청합니다
> 이 빠른 시작 방법은 Claude API를 직접 사용하는 사용자만 이용할 수 있습니다. AWS
> Bedrock이나 Google Vertex AI를 사용하는 경우 [AWS
> Bedrock & Google Vertex AI와 함께 사용하기](#using-with-aws-bedrock-%26-google-vertex-ai)
> 섹션을 참조하세요.

- 저장소 관리자여야 GitHub 앱을 설치하고 시크릿을 추가할 수 있습니다
- GitHub 앱은 Contents, Issues, Pull requests에 대한 읽기 및 쓰기 권한을 요청합니다
- 이 빠른 시작 방법은 Claude API를 직접 사용하는 사용자만 이용할 수 있습니다.
AWS Bedrock이나 Google Vertex AI를 사용하는 경우 [AWS
Bedrock & Google Vertex AI와 함께 사용하기](#using-with-aws-bedrock-%26-google-vertex-ai)
섹션을 참조하세요.

## 수동 설정

- **Claude GitHub 앱 설치**: [https://github.com/apps/claude](https://github.com/apps/claude)
Claude GitHub 앱에는 다음 저장소 권한이 필요합니다:

**Contents**: 읽기 및 쓰기 (저장소 파일 수정용)
**Issues**: 읽기 및 쓰기 (이슈에 응답하기 위함)
**Pull requests**: 읽기 및 쓰기 (PR 생성 및 변경사항 푸시용)

보안 및 권한에 대한 자세한 내용은 [보안 문서](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md)를 참조하세요.
- **Contents**: 읽기 및 쓰기 (저장소 파일 수정용)
- **Issues**: 읽기 및 쓰기 (이슈에 응답하기 위함)
- **Pull requests**: 읽기 및 쓰기 (PR 생성 및 변경사항 푸시용)
- **ANTHROPIC_API_KEY**를 저장소 시크릿에 추가 ([GitHub Actions에서 시크릿 사용하는 방법 알아보기](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions))
- **워크플로우 파일 복사**: [examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml)에서 저장소의 `.github/workflows/`로 복사

> 빠른 설정이나 수동 설정을 완료한 후, 이슈나 PR 댓글에서 `@claude`를 태그하여 액션을 테스트하세요.

## Beta에서 업그레이드

> Claude Code GitHub Actions v1.0은 beta 버전에서 v1.0으로 업그레이드하기 위해 워크플로우 파일 업데이트가 필요한 주요 변경 사항을 도입합니다.

### 필수 변경 사항

- **액션 버전 업데이트**: `@beta`를 `@v1`으로 변경
- **모드 설정 제거**: `mode: "tag"` 또는 `mode: "agent"` 삭제 (이제 자동 감지됨)
- **프롬프트 입력 업데이트**: `direct_prompt`를 `prompt`로 교체
- **CLI 옵션 이동**: `max_turns`, `model`, `custom_instructions` 등을 `claude_args`로 변환

### 주요 변경 사항 참조

### 변경 전후 예시

```
- uses: anthropics/claude-code-action@beta
  with:
    mode: "tag"
    direct_prompt: "Review this PR for security issues"
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    custom_instructions: "Follow our coding standards"
    max_turns: "10"
    model: "claude-sonnet-4-5-20250929"
```

```
- uses: anthropics/claude-code-action@v1
  with:
    prompt: "Review this PR for security issues"
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude_args: |
      --system-prompt "Follow our coding standards"
      --max-turns 10
      --model claude-sonnet-4-5-20250929
```

> 액션은 이제 설정에 따라 대화형 모드(`@claude` 멘션에 응답)로 실행할지 자동화 모드(프롬프트로 즉시 실행)로 실행할지 자동으로 감지합니다.

## 사용 사례 예시

### 기본 워크플로우

```
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # 댓글에서 @claude 멘션에 응답
```

### 슬래시 명령어 사용

```
name: Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "/review"
          claude_args: "--max-turns 5"
```

### 프롬프트를 사용한 맞춤 자동화

```
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
          claude_args: "--model claude-opus-4-5-20251101"
```

### 일반적인 사용 사례

```
@claude implement this feature based on the issue description
@claude how should I implement user authentication for this endpoint?
@claude fix the TypeError in the user dashboard component
```

## 모범 사례

### CLAUDE.md 설정

### 보안 고려 사항

> API 키를 저장소에 직접 커밋하지 마세요.

- API 키를 `ANTHROPIC_API_KEY`라는 저장소 시크릿으로 추가
- 워크플로우에서 참조: `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`
- 액션 권한을 필요한 것만으로 제한
- 병합 전에 Claude의 제안 검토

### 성능 최적화

### CI 비용

- Claude Code는 GitHub 호스팅 러너에서 실행되며, GitHub Actions 분을 소비합니다
- 자세한 가격 및 분 제한은 [GitHub 결제 문서](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions)를 참조하세요
- 각 Claude 상호작용은 프롬프트 및 응답 길이에 따라 API 토큰을 소비합니다
- 토큰 사용량은 작업 복잡도와 코드베이스 크기에 따라 다릅니다
- 현재 토큰 요금은 [Claude 가격 페이지](https://claude.com/platform/api)를 참조하세요
- 불필요한 API 호출을 줄이기 위해 구체적인 `@claude` 명령어 사용
- `claude_args`에서 적절한 `--max-turns`를 설정하여 과도한 반복 방지
- 작업 초과를 방지하기 위해 워크플로우 수준 타임아웃 설정
- 병렬 실행을 제한하기 위해 GitHub의 동시성 제어 사용 고려

## 설정 예시

```
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: "Your instructions here" # 선택사항
    claude_args: "--max-turns 5" # 선택적 CLI 인수
```

- **통합 프롬프트 인터페이스** - 모든 지시에 `prompt` 사용
- **슬래시 명령어** - `/review` 또는 `/fix`와 같은 미리 빌드된 프롬프트
- **CLI 통과** - `claude_args`를 통한 모든 Claude Code CLI 인수
- **유연한 트리거** - 모든 GitHub 이벤트와 함께 작동

> 이슈나 PR 댓글에 응답할 때, Claude는 @claude 멘션에 자동으로 응답합니다. 다른 이벤트의 경우 `prompt` 파라미터를 사용하여 지시를 제공하세요.

## AWS Bedrock & Google Vertex AI와 함께 사용하기

### 사전 요구 사항

#### Google Cloud Vertex AI의 경우:

- Vertex AI가 활성화된 Google Cloud 프로젝트
- GitHub Actions용 Workload Identity Federation 설정
- 필수 권한이 있는 서비스 계정
- GitHub 앱 (권장) 또는 기본 GITHUB_TOKEN 사용

#### AWS Bedrock의 경우:

- Amazon Bedrock이 활성화된 AWS 계정
- AWS에서 GitHub OIDC ID 공급자 설정
- Bedrock 권한이 있는 IAM 역할

사용자 정의 GitHub 앱 생성 (타사 공급자에 권장)

- [https://github.com/settings/apps/new](https://github.com/settings/apps/new)로 이동
- 기본 정보 입력:

**GitHub 앱 이름**: 고유한 이름 선택 (예: "YourOrg Claude Assistant")
**홈페이지 URL**: 조직의 웹사이트 또는 저장소 URL
- **GitHub 앱 이름**: 고유한 이름 선택 (예: "YourOrg Claude Assistant")
- **홈페이지 URL**: 조직의 웹사이트 또는 저장소 URL
- 앱 설정 구성:

**Webhooks**: "Active" 체크 해제 (이 통합에는 필요 없음)
- **Webhooks**: "Active" 체크 해제 (이 통합에는 필요 없음)
- 필수 권한 설정:

**저장소 권한**:

Contents: 읽기 및 쓰기
Issues: 읽기 및 쓰기
Pull requests: 읽기 및 쓰기
- **저장소 권한**:

Contents: 읽기 및 쓰기
Issues: 읽기 및 쓰기
Pull requests: 읽기 및 쓰기
- Contents: 읽기 및 쓰기
- Issues: 읽기 및 쓰기
- Pull requests: 읽기 및 쓰기
- "Create GitHub App" 클릭
- 생성 후 "Generate a private key"를 클릭하고 다운로드된 `.pem` 파일 저장
- 앱 설정 페이지에서 앱 ID 기록
- 저장소에 앱 설치:

앱 설정 페이지에서 왼쪽 사이드바의 "Install App" 클릭
계정 또는 조직 선택
"Only select repositories"를 선택하고 특정 저장소 선택
"Install" 클릭
- 앱 설정 페이지에서 왼쪽 사이드바의 "Install App" 클릭
- 계정 또는 조직 선택
- "Only select repositories"를 선택하고 특정 저장소 선택
- "Install" 클릭
- 저장소에 개인 키를 시크릿으로 추가:

저장소의 Settings → Secrets and variables → Actions로 이동
`.pem` 파일 내용으로 `APP_PRIVATE_KEY`라는 새 시크릿 생성
- 저장소의 Settings → Secrets and variables → Actions로 이동
- `.pem` 파일 내용으로 `APP_PRIVATE_KEY`라는 새 시크릿 생성
- 앱 ID를 시크릿으로 추가:
- GitHub 앱의 ID로 `APP_ID`라는 새 시크릿 생성

> 이 앱은 워크플로우에서 인증 토큰을 생성하기 위해 [actions/create-github-app-token](https://github.com/actions/create-github-app-token) 액션과 함께 사용됩니다.

- 설치 위치: [https://github.com/apps/claude](https://github.com/apps/claude)
- 인증을 위한 추가 설정 불필요

클라우드 공급자 인증 구성

AWS Bedrock

> **보안 참고**: 저장소별 설정을 사용하고 최소 필요 권한만 부여하세요.

- **Amazon Bedrock 활성화**:

Amazon Bedrock에서 Claude 모델 액세스 요청
교차 리전 모델의 경우 모든 필요한 리전에서 액세스 요청
- Amazon Bedrock에서 Claude 모델 액세스 요청
- 교차 리전 모델의 경우 모든 필요한 리전에서 액세스 요청
- **GitHub OIDC ID 공급자 설정**:

공급자 URL: `https://token.actions.githubusercontent.com`
대상: `sts.amazonaws.com`
- 공급자 URL: `https://token.actions.githubusercontent.com`
- 대상: `sts.amazonaws.com`
- **GitHub Actions용 IAM 역할 생성**:

신뢰할 수 있는 엔티티 유형: 웹 ID
ID 공급자: `token.actions.githubusercontent.com`
권한: `AmazonBedrockFullAccess` 정책
특정 저장소에 대한 신뢰 정책 구성
- 신뢰할 수 있는 엔티티 유형: 웹 ID
- ID 공급자: `token.actions.githubusercontent.com`
- 권한: `AmazonBedrockFullAccess` 정책
- 특정 저장소에 대한 신뢰 정책 구성
- **AWS_ROLE_TO_ASSUME**: 생성한 IAM 역할의 ARN

> OIDC는 자격 증명이 임시적이고 자동으로 갱신되므로 정적 AWS 액세스 키를 사용하는 것보다 더 안전합니다.

Google Vertex AI

- Google Cloud 프로젝트에서 **API 활성화**:

IAM Credentials API
Security Token Service (STS) API
Vertex AI API
- IAM Credentials API
- Security Token Service (STS) API
- Vertex AI API
- **Workload Identity Federation 리소스 생성**:

Workload Identity Pool 생성
다음을 포함한 GitHub OIDC 공급자 추가:

발급자: `https://token.actions.githubusercontent.com`
저장소 및 소유자에 대한 속성 매핑
**보안 권장 사항**: 저장소별 속성 조건 사용
- Workload Identity Pool 생성
- 다음을 포함한 GitHub OIDC 공급자 추가:

발급자: `https://token.actions.githubusercontent.com`
저장소 및 소유자에 대한 속성 매핑
**보안 권장 사항**: 저장소별 속성 조건 사용
- 발급자: `https://token.actions.githubusercontent.com`
- 저장소 및 소유자에 대한 속성 매핑
- **보안 권장 사항**: 저장소별 속성 조건 사용
- **서비스 계정 생성**:

`Vertex AI User` 역할만 부여
**보안 권장 사항**: 저장소당 전용 서비스 계정 생성
- `Vertex AI User` 역할만 부여
- **보안 권장 사항**: 저장소당 전용 서비스 계정 생성
- **IAM 바인딩 구성**:

Workload Identity Pool이 서비스 계정을 가장하도록 허용
**보안 권장 사항**: 저장소별 주체 집합 사용
- Workload Identity Pool이 서비스 계정을 가장하도록 허용
- **보안 권장 사항**: 저장소별 주체 집합 사용
- **GCP_WORKLOAD_IDENTITY_PROVIDER**: 전체 공급자 리소스 이름
- **GCP_SERVICE_ACCOUNT**: 서비스 계정 이메일 주소

> Workload Identity Federation은 다운로드 가능한 서비스 계정 키의 필요성을 없애 보안을 향상시킵니다.

필수 시크릿 추가

#### Claude API (직접) 사용 시:

- **API 인증용**:

`ANTHROPIC_API_KEY`: [console.anthropic.com](https://console.anthropic.com)에서 받은 Claude API 키
- `ANTHROPIC_API_KEY`: [console.anthropic.com](https://console.anthropic.com)에서 받은 Claude API 키
- **GitHub 앱 사용 시 (자체 앱 사용 시)**:

`APP_ID`: GitHub 앱의 ID
`APP_PRIVATE_KEY`: 개인 키 (.pem) 내용
- `APP_ID`: GitHub 앱의 ID
- `APP_PRIVATE_KEY`: 개인 키 (.pem) 내용

#### Google Cloud Vertex AI의 경우

- **GCP 인증용**:

`GCP_WORKLOAD_IDENTITY_PROVIDER`
`GCP_SERVICE_ACCOUNT`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

#### AWS Bedrock의 경우

- **AWS 인증용**:

`AWS_ROLE_TO_ASSUME`
- `AWS_ROLE_TO_ASSUME`

워크플로우 파일 생성

AWS Bedrock 워크플로우

- Claude 모델 권한이 있는 AWS Bedrock 액세스 활성화
- AWS에서 OIDC ID 공급자로 GitHub 설정
- GitHub Actions를 신뢰하는 Bedrock 권한이 있는 IAM 역할

```
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    env:
      AWS_REGION: us-west-2
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
          aws-region: us-west-2

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          use_bedrock: "true"
          claude_args: '--model us.anthropic.claude-sonnet-4-5-20250929-v1:0 --max-turns 10'
```

> Bedrock의 모델 ID 형식은 리전 접두사(예: `us.anthropic.claude...`)와 버전 접미사를 포함합니다.

Google Vertex AI 워크플로우

- GCP 프로젝트에서 Vertex AI API 활성화
- GitHub용 Workload Identity Federation 설정
- Vertex AI 권한이 있는 서비스 계정

```
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          trigger_phrase: "@claude"
          use_vertex: "true"
          claude_args: '--model claude-sonnet-4@20250514 --max-turns 10'
        env:
          ANTHROPIC_VERTEX_PROJECT_ID: ${{ steps.auth.outputs.project_id }}
          CLOUD_ML_REGION: us-east5
          VERTEX_REGION_CLAUDE_3_7_SONNET: us-east5
```

> 프로젝트 ID는 Google Cloud 인증 단계에서 자동으로 검색되므로 하드코딩할 필요가 없습니다.

## 문제 해결

### Claude가 @claude 명령어에 응답하지 않음

### Claude 커밋에서 CI가 실행되지 않음

### 인증 오류

## 고급 설정

### 액션 파라미터

#### CLI 인수 전달

```
claude_args: "--max-turns 5 --model claude-sonnet-4-5-20250929 --mcp-config /path/to/config.json"
```

- `--max-turns`: 최대 대화 턴 수 (기본값: 10)
- `--model`: 사용할 모델 (예: `claude-sonnet-4-5-20250929`)
- `--mcp-config`: MCP 설정 경로
- `--allowed-tools`: 허용된 도구의 쉼표로 구분된 목록
- `--debug`: 디버그 출력 활성화

### 대안 통합 방법

- **사용자 정의 GitHub 앱**: 브랜드 사용자 이름이나 사용자 정의 인증 흐름이 필요한 조직용. 필요한 권한(contents, issues, pull requests)이 있는 자체 GitHub 앱을 생성하고 actions/create-github-app-token 액션을 사용하여 워크플로우에서 토큰을 생성합니다.
- **수동 GitHub Actions**: 최대 유연성을 위한 직접 워크플로우 설정
- **MCP 설정**: Model Context Protocol 서버의 동적 로딩

### Claude 동작 사용자 정의

- **CLAUDE.md**: 저장소 루트의 `CLAUDE.md` 파일에 코딩 표준, 검토 기준 및 프로젝트별 규칙을 정의합니다. Claude는 PR을 생성하고 요청에 응답할 때 이 가이드라인을 따릅니다. 자세한 내용은 [메모리 문서](/docs/en/memory)를 참조하세요.
- **사용자 정의 프롬프트**: 워크플로우 파일의 `prompt` 파라미터를 사용하여 워크플로우별 지시를 제공합니다. 이를 통해 다양한 워크플로우나 작업에 대해 Claude의 동작을 사용자 정의할 수 있습니다.

이 페이지가 도움이 되었나요?
