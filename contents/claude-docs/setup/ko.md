# Claude Code 설치

Korean

# Claude Code 설치

개발 머신에 Claude Code를 설치하고, 인증하고, 사용을 시작하세요.

## 시스템 요구 사항

- **운영 체제**: macOS 10.15+, Ubuntu 20.04+/Debian 10+ 또는 Windows 10+ (WSL 1, WSL 2 또는 Git for Windows 사용)
- **하드웨어**: 4 GB+ RAM
- **소프트웨어**: [Node.js 18+](https://nodejs.org/en/download) (npm 설치에만 필요)
- **네트워크**: 인증 및 AI 처리를 위한 인터넷 연결 필요
- **셸**: Bash, Zsh 또는 Fish에서 가장 잘 작동
- **위치**: [Anthropic 지원 국가](https://www.anthropic.com/supported-countries)

### 추가 종속성

- **ripgrep**: 일반적으로 Claude Code에 포함됩니다. 검색이 실패하면 [검색 문제 해결](/docs/en/troubleshooting#search-and-discovery-issues)을 참조하세요.

## 표준 설치

- 네이티브 설치 (권장)
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

> 일부 사용자는 개선된 설치 방법으로 자동 마이그레이션될 수 있습니다.

```
cd your-awesome-project
claude
```

- **Claude Console**: 기본 옵션입니다. Claude Console을 통해 연결하고 OAuth 프로세스를 완료합니다. [Anthropic 콘솔](https://console.anthropic.com)에서 활성화된 결제가 필요합니다. 사용량 추적 및 비용 관리를 위해 "Claude Code" 작업 공간이 자동으로 생성됩니다. Claude Code 작업 공간에 대한 API 키는 생성할 수 없습니다. 이 작업 공간은 Claude Code 사용에만 전용입니다.
- **Claude App (Pro 또는 Max 플랜 포함)**: Claude Code와 웹 인터페이스를 모두 포함하는 통합 구독을 위해 Claude의 [Pro 또는 Max 플랜](https://claude.com/pricing)을 구독하세요. 동일한 가격대에서 더 많은 가치를 얻고 한 곳에서 계정을 관리할 수 있습니다. Claude.ai 계정으로 로그인하세요. 실행 중에 구독 유형에 맞는 옵션을 선택하세요.
- **엔터프라이즈 플랫폼**: 기존 클라우드 인프라를 사용하는 엔터프라이즈 배포를 위해 [Amazon Bedrock, Google Vertex AI 또는 Microsoft Foundry](/docs/en/third-party-integrations)를 사용하도록 Claude Code를 구성하세요.

> Claude Code는 자격 증명을 안전하게 저장합니다. 자세한 내용은 [자격 증명 관리](/docs/en/iam#credential-management)를 참조하세요.

## Windows 설정

- WSL 1과 WSL 2 모두 지원됨
- [Git for Windows](https://git-scm.com/downloads/win) 필요
- 휴대용 Git 설치의 경우 `bash.exe` 경로를 지정하세요:
CopyAsk AI$env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"

```
$env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
```

## 대체 설치 방법

> 설치 후 `claude doctor`를 실행하여 설치 유형과 버전을 확인하세요.

### 네이티브 설치 옵션

- 하나의 독립형 실행 파일
- Node.js 종속성 없음
- 개선된 자동 업데이터 안정성

```
# 안정 버전 설치 (기본값)
curl -fsSL https://claude.ai/install.sh | bash

# 최신 버전 설치
curl -fsSL https://claude.ai/install.sh | bash -s latest

# 특정 버전 번호 설치
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

> **Alpine Linux 및 기타 musl/uClibc 기반 배포판**: 네이티브 빌드에는 `libgcc`, `libstdc++` 및 `ripgrep`이 필요합니다. Alpine의 경우: `apk add libgcc libstdc++ ripgrep`. `USE_BUILTIN_RIPGREP=0`을 설정하세요.

```
# 안정 버전 설치 (기본값)
irm https://claude.ai/install.ps1 | iex

# 최신 버전 설치
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# 특정 버전 번호 설치
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

```
REM 안정 버전 설치 (기본값)
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd

REM 최신 버전 설치
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd latest && del install.cmd

REM 특정 버전 번호 설치
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd 1.0.58 && del install.cmd
```

> 설치하기 전에 오래된 별칭이나 심볼릭 링크를 제거하세요.

- 모든 플랫폼에 대한 SHA256 체크섬은 릴리스 매니페스트에 게시되며, 현재 `https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/{VERSION}/manifest.json`에 있습니다 (예: `{VERSION}`을 `2.0.30`으로 대체)
- 서명된 바이너리는 다음 플랫폼용으로 배포됩니다:

macOS: "Anthropic PBC"로 서명되고 Apple에 의해 공증됨
Windows: "Anthropic, PBC"로 서명됨
- macOS: "Anthropic PBC"로 서명되고 Apple에 의해 공증됨
- Windows: "Anthropic, PBC"로 서명됨

### NPM 설치

> 권한 문제와 보안 위험으로 이어질 수 있으므로 `sudo npm install -g`를 사용하지 마세요.
> 권한 오류가 발생하면 권장 솔루션은 [Claude Code 구성](/docs/en/troubleshooting#linux-permission-issues)을 참조하세요.

## AWS 또는 GCP에서 실행

## Claude Code 업데이트

### 자동 업데이트

- **업데이트 확인**: 시작 시 및 실행 중 주기적으로 수행
- **업데이트 프로세스**: 백그라운드에서 자동으로 다운로드 및 설치
- **알림**: 업데이트가 설치되면 알림 표시
- **업데이트 적용**: 다음에 Claude Code를 시작할 때 업데이트가 적용됨

```
export DISABLE_AUTOUPDATER=1
```

### 수동 업데이트

```
claude update
```

## Claude Code 제거

### 네이티브 설치

```
rm -f ~/.local/bin/claude
rm -rf ~/.claude-code
```

```
Remove-Item -Path "$env:LOCALAPPDATA\Programs\claude-code" -Recurse -Force
Remove-Item -Path "$env:LOCALAPPDATA\Microsoft\WindowsApps\claude.exe" -Force
```

```
rmdir /s /q "%LOCALAPPDATA%\Programs\claude-code"
del "%LOCALAPPDATA%\Microsoft\WindowsApps\claude.exe"
```

### Homebrew 설치

```
brew uninstall --cask claude-code
```

```
npm uninstall -g @anthropic-ai/claude-code
```

### 구성 파일 정리 (선택 사항)

> 구성 파일을 제거하면 모든 설정, 허용된 도구, MCP 서버 구성 및 세션 기록이 삭제됩니다.

```
# 사용자 설정 및 상태 제거
rm -rf ~/.claude
rm ~/.claude.json

# 프로젝트별 설정 제거 (프로젝트 디렉터리에서 실행)
rm -rf .claude
rm -f .mcp.json
```

```
# 사용자 설정 및 상태 제거
Remove-Item -Path "$env:USERPROFILE\.claude" -Recurse -Force
Remove-Item -Path "$env:USERPROFILE\.claude.json" -Force

# 프로젝트별 설정 제거 (프로젝트 디렉터리에서 실행)
Remove-Item -Path ".claude" -Recurse -Force
Remove-Item -Path ".mcp.json" -Force
```

```
REM 사용자 설정 및 상태 제거
rmdir /s /q "%USERPROFILE%\.claude"
del "%USERPROFILE%\.claude.json"

REM 프로젝트별 설정 제거 (프로젝트 디렉터리에서 실행)
rmdir /s /q ".claude"
del ".mcp.json"
```

이 페이지가 도움이 되었나요?
