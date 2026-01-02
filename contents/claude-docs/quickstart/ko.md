# 빠른 시작

한국어

# 빠른 시작

Claude Code에 오신 것을 환영합니다!

## 시작하기 전에

- 터미널 또는 명령 프롬프트 열기
- 작업할 코드 프로젝트
- [Claude.ai](https://claude.ai) (권장) 또는 [Claude Console](https://console.anthropic.com/) 계정

## 1단계: Claude Code 설치

- 기본 설치 (권장)
- Homebrew
- NPM

```
curl -fsSL https://claude.ai/install.sh | bash
```

```
irm https://claude.ai/install.ps1 | iex
```

```
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

```
brew install --cask claude-code
```

```
npm install -g @anthropic-ai/claude-code
```

## 2단계: 계정에 로그인

```
claude
# 첫 사용 시 로그인 안내가 표시됩니다
```

```
/login
# 안내에 따라 계정으로 로그인하세요
```

- [Claude.ai](https://claude.ai) (구독 플랜 - 권장)
- [Claude Console](https://console.anthropic.com/) (선불 크레딧을 사용한 API 액세스)

> Claude Console 계정으로 Claude Code를 처음 인증하면 "Claude Code"라는 워크스페이스가 자동으로 생성됩니다. 이 워크스페이스는 조직 내 모든 Claude Code 사용에 대한 중앙 집중식 비용 추적 및 관리를 제공합니다.

> 동일한 이메일 주소로 두 가지 계정 유형을 모두 사용할 수 있습니다. 다시 로그인하거나 계정을 전환해야 하는 경우 Claude Code 내에서 `/login` 명령어를 사용하세요.

## 3단계: 첫 세션 시작

```
cd /path/to/your/project
claude
```

> 로그인(2단계) 후 자격 증명은 시스템에 저장됩니다. [자격 증명 관리](/docs/en/iam#credential-management)에서 자세히 알아보세요.

## 4단계: 첫 질문하기

```
> what does this project do?
```

```
> what technologies does this project use?
```

```
> where is the main entry point?
```

```
> explain the folder structure
```

```
> what can Claude Code do?
```

```
> how do I use slash commands in Claude Code?
```

```
> can Claude Code work with Docker?
```

> Claude Code는 필요에 따라 파일을 읽습니다 - 수동으로 컨텍스트를 추가할 필요가 없습니다. Claude는 자체 문서에도 액세스할 수 있어 기능과 역량에 대한 질문에 답변할 수 있습니다.

## 5단계: 첫 코드 변경하기

```
> add a hello world function to the main file
```

- 적절한 파일 찾기
- 제안된 변경 사항 보여주기
- 승인 요청하기
- 편집 수행하기

> Claude Code는 파일을 수정하기 전에 항상 허가를 요청합니다. 개별 변경 사항을 승인하거나 세션에 대해 "모두 수락" 모드를 활성화할 수 있습니다.

## 6단계: Claude Code로 Git 사용하기

```
> what files have I changed?
```

```
> commit my changes with a descriptive message
```

```
> create a new branch called feature/quickstart
```

```
> show me the last 5 commits
```

```
> help me resolve merge conflicts
```

## 7단계: 버그 수정 또는 기능 추가

```
> add input validation to the user registration form
```

```
> there's a bug where users can submit empty forms - fix it
```

- 관련 코드 찾기
- 컨텍스트 이해하기
- 솔루션 구현하기
- 가능한 경우 테스트 실행하기

## 8단계: 다른 일반적인 워크플로우 시험해보기

```
> refactor the authentication module to use async/await instead of callbacks
```

```
> write unit tests for the calculator functions
```

```
> update the README with installation instructions
```

```
> review my changes and suggest improvements
```

> **기억하세요**: Claude Code는 여러분의 AI 페어 프로그래머입니다. 도움이 되는 동료에게 말하듯이 대화하세요 - 달성하고자 하는 것을 설명하면 목표에 도달할 수 있도록 도와드립니다.

## 필수 명령어

## 초보자를 위한 프로 팁

요청을 구체적으로 하세요

단계별 지시 사용하기

```
> 1. create a new database table for user profiles
```

```
> 2. create an API endpoint to get and update user profiles
```

```
> 3. build a webpage that allows users to see and edit their information
```

Claude가 먼저 탐색하도록 하기

```
> analyze the database schema
```

```
> build a dashboard showing products that are most frequently returned by our UK customers
```

단축키로 시간 절약하기

- `?`를 눌러 사용 가능한 모든 키보드 단축키 확인
- Tab으로 명령어 자동 완성
- 위쪽 화살표로 명령어 히스토리 보기
- `/`를 입력하여 모든 슬래시 명령어 보기

## 다음은?

## 일반적인 워크플로우

## CLI 레퍼런스

## 설정

## 웹에서 Claude Code 사용

## Claude Code 소개

## 도움 받기

- **Claude Code 내에서**: `/help`를 입력하거나 "how do I..."라고 질문하세요
- **문서**: 여기 있습니다! 다른 가이드를 둘러보세요
- **커뮤니티**: [Discord](https://www.anthropic.com/discord)에 가입하여 팁과 지원을 받으세요

이 페이지가 도움이 되었나요?
