# 문제 해결

한국어

# 문제 해결

Claude Code 설치 및 사용 시 발생하는 일반적인 문제에 대한 해결책을 확인하세요.

## 일반적인 설치 문제

### Windows 설치 문제: WSL 오류

- 설치 전에 `npm config set os linux` 실행
- `npm install -g @anthropic-ai/claude-code --force --no-os-check`로 설치 (`sudo`를 사용하지 마세요)
- `which npm`과 `which node` 실행 시 - Windows 경로(`/mnt/c/`로 시작)를 가리키면 Windows 버전이 사용되고 있는 것입니다
- WSL에서 nvm으로 Node 버전을 전환한 후 기능이 손상되는 경우

```
# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

```
source ~/.nvm/nvm.sh
```

```
export PATH="$HOME/.nvm/versions/node/$(node -v)/bin:$PATH"
```

> Windows PATH 가져오기를 비활성화(`appendWindowsPath = false`)하면 WSL에서 Windows 실행 파일을 호출하는 기능이 손상되므로 피하세요. 마찬가지로 Windows 개발에 사용하는 경우 Windows에서 Node.js를 제거하지 마세요.

### Linux 및 Mac 설치 문제: 권한 또는 명령어를 찾을 수 없음 오류

#### 권장 해결책: 네이티브 Claude Code 설치

```
# Install stable version (default)
curl -fsSL https://claude.ai/install.sh | bash

# Install latest version
curl -fsSL https://claude.ai/install.sh | bash -s latest

# Install specific version number
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

```
# Install stable version (default)
irm https://claude.ai/install.ps1 | iex

# Install latest version
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# Install specific version number
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

> 설치 디렉토리가 시스템 PATH에 있는지 확인하세요.

```
claude doctor # Check installation health
```

## 권한 및 인증

### 반복되는 권한 프롬프트

### 인증 문제

- `/logout`을 실행하여 완전히 로그아웃합니다
- Claude Code를 종료합니다
- `claude`로 다시 시작하고 인증 과정을 완료합니다

```
rm -rf ~/.config/claude-code/auth.json
claude
```

## 설정 파일 위치

- macOS: `/Library/Application Support/ClaudeCode/`
- Linux/WSL: `/etc/claude-code/`
- Windows: `C:\ProgramData\ClaudeCode\`

### 설정 초기화

```
# Reset all user settings and state
rm ~/.claude.json
rm -rf ~/.claude/

# Reset project-specific settings
rm -rf .claude/
rm .mcp.json
```

> 이렇게 하면 모든 설정, 허용된 도구, MCP 서버 구성, 세션 기록이 제거됩니다.

## 성능 및 안정성

### 높은 CPU 또는 메모리 사용량

- 컨텍스트 크기를 줄이기 위해 `/compact`를 정기적으로 사용하세요
- 주요 작업 사이에 Claude Code를 종료하고 다시 시작하세요
- 큰 빌드 디렉토리를 `.gitignore` 파일에 추가하는 것을 고려하세요

### 명령어 멈춤 또는 정지

- Ctrl+C를 눌러 현재 작업 취소를 시도합니다
- 응답이 없으면 터미널을 닫고 다시 시작해야 할 수 있습니다

### 검색 및 탐색 문제

```
# macOS (Homebrew)
brew install ripgrep

# Windows (winget)
winget install BurntSushi.ripgrep.MSVC

# Ubuntu/Debian
sudo apt install ripgrep

# Alpine Linux
apk add ripgrep

# Arch Linux
pacman -S ripgrep
```

### WSL에서 느리거나 불완전한 검색 결과

> `/doctor`는 이 경우 Search를 OK로 표시합니다.

- **더 구체적인 검색 제출**: 디렉토리나 파일 유형을 지정하여 검색하는 파일 수를 줄이세요: "auth-service 패키지에서 JWT 유효성 검사 로직을 검색해줘" 또는 "JS 파일에서 md5 해시 사용을 찾아줘".
- **프로젝트를 Linux 파일 시스템으로 이동**: 가능하면 프로젝트가 Windows 파일 시스템(`/mnt/c/`)이 아닌 Linux 파일 시스템(`/home/`)에 있는지 확인하세요.
- **네이티브 Windows 대신 사용**: 더 나은 파일 시스템 성능을 위해 WSL 대신 Windows에서 네이티브로 Claude Code를 실행하는 것을 고려하세요.

## IDE 통합 문제

### WSL2에서 JetBrains IDE가 감지되지 않음

#### WSL2 네트워킹 모드

- WSL2 IP 주소 찾기:

```
wsl hostname -I
# Example output: 172.21.123.456
```

- 관리자로 PowerShell을 열고 방화벽 규칙 생성:

(1단계에서 확인한 WSL2 서브넷을 기준으로 IP 범위를 조정하세요)

```
New-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16
```

- IDE와 Claude Code를 모두 다시 시작

```
[wsl2]
networkingMode=mirrored
```

> 이러한 네트워킹 문제는 WSL2에만 영향을 미칩니다. WSL1은 호스트의 네트워크를 직접 사용하므로 이러한 구성이 필요하지 않습니다.

### Windows IDE 통합 문제 보고 (네이티브 및 WSL 모두)

- 환경 유형: 네이티브 Windows (Git Bash) 또는 WSL1/WSL2
- WSL 네트워킹 모드 (해당되는 경우): NAT 또는 mirrored
- IDE 이름 및 버전
- Claude Code 확장/플러그인 버전
- 쉘 유형: Bash, Zsh, PowerShell 등

### JetBrains (IntelliJ, PyCharm 등) 터미널에서 Escape 키가 작동하지 않음

- Settings → Tools → Terminal로 이동
- 다음 중 하나를 수행:

"Move focus to the editor with Escape" 체크 해제, 또는
"Configure terminal keybindings"를 클릭하고 "Switch focus to Editor" 단축키 삭제
- "Move focus to the editor with Escape" 체크 해제, 또는
- "Configure terminal keybindings"를 클릭하고 "Switch focus to Editor" 단축키 삭제
- 변경 사항 적용

## 마크다운 포맷팅 문제

### 코드 블록에 언어 태그 누락

```
```
function example() {
  return "hello";
}
```
```

```
```javascript
function example() {
  return "hello";
}
```
```

- **Claude에게 언어 태그 추가 요청**: "이 마크다운 파일의 모든 코드 블록에 적절한 언어 태그를 추가해줘"라고 요청하세요.
- **후처리 훅 사용**: 누락된 언어 태그를 감지하고 추가하는 자동 포맷팅 훅을 설정하세요. 구현 세부 사항은 [마크다운 포맷팅 훅 예제](/docs/en/hooks-guide#markdown-formatting-hook)를 참조하세요.
- **수동 검증**: 마크다운 파일을 생성한 후 적절한 코드 블록 포맷팅을 검토하고 필요한 경우 수정을 요청하세요.

### 일관성 없는 간격 및 포맷팅

- **포맷팅 수정 요청**: Claude에게 "이 마크다운 파일의 간격 및 포맷팅 문제를 수정해줘"라고 요청하세요.
- **포맷팅 도구 사용**: 생성된 마크다운 파일에 `prettier` 또는 커스텀 포맷팅 스크립트와 같은 마크다운 포매터를 실행하도록 훅을 설정하세요.
- **포맷팅 선호도 지정**: 프롬프트나 프로젝트 [메모리](/docs/en/memory) 파일에 포맷팅 요구 사항을 포함하세요.

### 마크다운 생성 모범 사례

- **요청에 명시적이 되세요**: "언어 태그가 있는 올바르게 포맷된 마크다운"을 요청하세요
- **프로젝트 규칙 사용**: `CLAUDE.md`에 선호하는 마크다운 스타일을 문서화하세요
- **유효성 검사 훅 설정**: 일반적인 포맷팅 문제를 자동으로 확인하고 수정하는 후처리 훅을 사용하세요

## 추가 도움 받기

- Claude Code 내에서 `/bug` 명령어를 사용하여 Anthropic에 문제를 직접 보고하세요
- 알려진 문제는 [GitHub 저장소](https://github.com/anthropics/claude-code)를 확인하세요
- `/doctor`를 실행하여 Claude Code 설치 상태를 확인하세요
- Claude에게 직접 기능과 특징에 대해 물어보세요 - Claude는 문서에 대한 내장 접근 권한이 있습니다

이 페이지가 도움이 되었나요?
