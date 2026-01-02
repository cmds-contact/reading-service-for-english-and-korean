# Identity and Access Management

Korean

# Identity and Access Management

조직에서 Claude Code에 대한 사용자 인증, 권한 부여 및 접근 제어를 구성하는 방법을 알아봅니다.

## 인증 방법

- Claude Console을 통한 Claude API
- Amazon Bedrock
- Microsoft Foundry
- Google Vertex AI

### Claude API 인증

- 기존 Claude Console 계정을 사용하거나 새 Claude Console 계정 생성
- 아래 방법 중 하나를 통해 사용자를 추가할 수 있습니다:

Console 내에서 사용자 대량 초대 (Console -> Settings -> Members -> Invite)
[SSO 설정](https://support.claude.com/en/articles/10280258-setting-up-single-sign-on-on-the-api-console)
- Console 내에서 사용자 대량 초대 (Console -> Settings -> Members -> Invite)
- [SSO 설정](https://support.claude.com/en/articles/10280258-setting-up-single-sign-on-on-the-api-console)
- 사용자를 초대할 때 다음 역할 중 하나가 필요합니다:

"Claude Code" 역할은 사용자가 Claude Code API 키만 생성할 수 있음을 의미
"Developer" 역할은 사용자가 모든 종류의 API 키를 생성할 수 있음을 의미
- "Claude Code" 역할은 사용자가 Claude Code API 키만 생성할 수 있음을 의미
- "Developer" 역할은 사용자가 모든 종류의 API 키를 생성할 수 있음을 의미
- 각 초대된 사용자는 다음 단계를 완료해야 합니다:

Console 초대 수락
[시스템 요구 사항 확인](/docs/en/setup#system-requirements)
[Claude Code 설치](/docs/en/setup#installation)
Console 계정 자격 증명으로 로그인
- Console 초대 수락
- [시스템 요구 사항 확인](/docs/en/setup#system-requirements)
- [Claude Code 설치](/docs/en/setup#installation)
- Console 계정 자격 증명으로 로그인

### 클라우드 공급자 인증

- [Bedrock 문서](/docs/en/amazon-bedrock), [Vertex 문서](/docs/en/google-vertex-ai) 또는 [Microsoft Foundry 문서](/docs/en/microsoft-foundry)를 따르세요
- 클라우드 자격 증명 생성에 대한 환경 변수 및 지침을 사용자에게 배포하세요. [여기서 구성 관리 방법](/docs/en/settings)에 대해 자세히 알아보세요.
- 사용자는 [Claude Code를 설치](/docs/en/setup#installation)할 수 있습니다

## 접근 제어 및 권한

### 권한 시스템

### 권한 구성

- **Allow** 규칙은 Claude Code가 추가 수동 승인 없이 지정된 도구를 사용할 수 있도록 합니다.
- **Ask** 규칙은 Claude Code가 지정된 도구를 사용하려고 할 때마다 사용자에게 확인을 요청합니다. Ask 규칙은 allow 규칙보다 우선합니다.
- **Deny** 규칙은 Claude Code가 지정된 도구를 사용하지 못하게 합니다. Deny 규칙은 allow 및 ask 규칙보다 우선합니다.
- **추가 디렉터리**는 Claude의 파일 접근을 초기 작업 디렉터리 이외의 디렉터리로 확장합니다.
- **기본 모드**는 새 요청을 만났을 때 Claude의 권한 동작을 제어합니다.

#### 권한 모드

#### 작업 디렉터리

- **시작 중**: `--add-dir <path>` CLI 인수 사용
- **세션 중**: `/add-dir` 슬래시 명령 사용
- **영구 구성**: [설정 파일](/docs/en/settings#settings-files)의 `additionalDirectories`에 추가

#### 도구별 권한 규칙

- `Bash(npm run build)` 정확히 `npm run build` Bash 명령과 일치
- `Bash(npm run test:*)` `npm run test`로 시작하는 Bash 명령과 일치
- `Bash(curl http://site.com/:*)` 정확히 `curl http://site.com/`으로 시작하는 curl 명령과 일치

> Claude Code는 셸 연산자(예: `&&`)를 인식하므로 `Bash(safe-cmd:*)`와 같은 접두사 일치 규칙은 `safe-cmd && other-cmd` 명령을 실행할 권한을 부여하지 않습니다

> Bash 권한 패턴의 중요한 제한 사항:
> 이 도구는 정규식이나 glob 패턴이 아닌 **접두사 일치**를 사용합니다
> 와일드카드 `:*`는 패턴 끝에서만 작동하여 모든 연속을 일치시킵니다
> `Bash(curl http://github.com/:*)`와 같은 패턴은 여러 방법으로 우회할 수 있습니다:
>
> URL 앞의 옵션: `curl -X GET http://github.com/...`는 일치하지 않음
> 다른 프로토콜: `curl https://github.com/...`는 일치하지 않음
> 리다이렉트: `curl -L http://bit.ly/xyz` (github으로 리다이렉트)
> 변수: `URL=http://github.com && curl $URL`는 일치하지 않음
> 추가 공백: `curl  http://github.com`은 일치하지 않음
>
>
> 더 신뢰할 수 있는 URL 필터링을 위해 다음을 고려하세요:
> `WebFetch(domain:github.com)` 권한과 함께 WebFetch 도구 사용
> CLAUDE.md를 통해 허용된 curl 패턴에 대해 Claude Code에 지시
> 사용자 정의 권한 검증을 위한 후크 사용

- 이 도구는 정규식이나 glob 패턴이 아닌 **접두사 일치**를 사용합니다
- 와일드카드 `:*`는 패턴 끝에서만 작동하여 모든 연속을 일치시킵니다
- `Bash(curl http://github.com/:*)`와 같은 패턴은 여러 방법으로 우회할 수 있습니다:

URL 앞의 옵션: `curl -X GET http://github.com/...`는 일치하지 않음
다른 프로토콜: `curl https://github.com/...`는 일치하지 않음
리다이렉트: `curl -L http://bit.ly/xyz` (github으로 리다이렉트)
변수: `URL=http://github.com && curl $URL`는 일치하지 않음
추가 공백: `curl  http://github.com`은 일치하지 않음
- URL 앞의 옵션: `curl -X GET http://github.com/...`는 일치하지 않음
- 다른 프로토콜: `curl https://github.com/...`는 일치하지 않음
- 리다이렉트: `curl -L http://bit.ly/xyz` (github으로 리다이렉트)
- 변수: `URL=http://github.com && curl $URL`는 일치하지 않음
- 추가 공백: `curl  http://github.com`은 일치하지 않음
- `WebFetch(domain:github.com)` 권한과 함께 WebFetch 도구 사용
- CLAUDE.md를 통해 허용된 curl 패턴에 대해 Claude Code에 지시
- 사용자 정의 권한 검증을 위한 후크 사용

> `/Users/alice/file`과 같은 패턴은 절대 경로가 아닙니다 - 설정 파일을 기준으로 한 상대 경로입니다! 절대 경로의 경우 `//Users/alice/file`을 사용하세요.

- `Edit(/docs/**)` - `<project>/docs/`에서 편집 (`/docs/`가 아님!)
- `Read(~/.zshrc)` - 홈 디렉터리의 `.zshrc` 읽기
- `Edit(//tmp/scratch.txt)` - 절대 경로 `/tmp/scratch.txt` 편집
- `Read(src/**)` - `<current-directory>/src/`에서 읽기
- `WebFetch(domain:example.com)` example.com에 대한 fetch 요청과 일치
- `mcp__puppeteer` `puppeteer` 서버에서 제공하는 모든 도구와 일치 (Claude Code에서 구성된 이름)
- `mcp__puppeteer__*` puppeteer 서버의 모든 도구와 일치하는 와일드카드 구문
- `mcp__puppeteer__puppeteer_navigate` `puppeteer` 서버에서 제공하는 `puppeteer_navigate` 도구와 일치

### 후크를 사용한 추가 권한 제어

### 엔터프라이즈 관리 설정

### 설정 우선순위

- 관리 설정 (Claude.ai 관리 콘솔을 통해)
- 파일 기반 관리 설정 (`managed-settings.json`)
- 명령줄 인수
- 로컬 프로젝트 설정 (`.claude/settings.local.json`)
- 공유 프로젝트 설정 (`.claude/settings.json`)
- 사용자 설정 (`~/.claude/settings.json`)

## 자격 증명 관리

- **저장 위치**: macOS에서 API 키, OAuth 토큰 및 기타 자격 증명은 암호화된 macOS 키체인에 저장됩니다.
- **지원되는 인증 유형**: Claude.ai 자격 증명, Claude API 자격 증명, Azure Auth, Bedrock Auth 및 Vertex Auth.
- **사용자 정의 자격 증명 스크립트**: `apiKeyHelper` 설정은 API 키를 반환하는 셸 스크립트를 실행하도록 구성할 수 있습니다.
- **갱신 간격**: 기본적으로 `apiKeyHelper`는 5분 후 또는 HTTP 401 응답 시 호출됩니다. 사용자 정의 갱신 간격을 위해 `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` 환경 변수를 설정하세요.

이 페이지가 도움이 되었나요?
