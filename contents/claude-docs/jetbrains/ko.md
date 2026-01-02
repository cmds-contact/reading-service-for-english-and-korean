# JetBrains IDE

한국어

# JetBrains IDE

IntelliJ, PyCharm, WebStorm 등 JetBrains IDE에서 Claude Code 사용하기

## 지원되는 IDE

- IntelliJ IDEA
- PyCharm
- Android Studio
- WebStorm
- PhpStorm
- GoLand

## 기능

- **빠른 실행**: `Cmd+Esc` (Mac) 또는 `Ctrl+Esc` (Windows/Linux)로 편집기에서 Claude Code를 직접 열거나 UI의 Claude Code 버튼을 클릭
- **Diff 보기**: 코드 변경 사항을 터미널 대신 IDE의 diff 뷰어에서 직접 표시 가능
- **선택 컨텍스트**: IDE의 현재 선택/탭이 Claude Code와 자동으로 공유됨
- **파일 참조 단축키**: `Cmd+Option+K` (Mac) 또는 `Alt+Ctrl+K` (Linux/Windows)로 파일 참조 삽입 (예: @File#L1-99)
- **진단 공유**: IDE의 진단 오류(린트, 구문 등)가 작업 중 Claude와 자동으로 공유됨

## 설치

### Marketplace 설치

> 플러그인 설치 후 적용되려면 IDE를 완전히 재시작해야 할 수 있습니다.

## 사용법

### IDE에서

### 외부 터미널에서

```
claude
> /ide
```

## 구성

### Claude Code 설정

- `claude` 실행
- `/config` 명령 입력
- 자동 IDE 감지를 위해 diff 도구를 `auto`로 설정

### 플러그인 설정

#### 일반 설정

- **Claude command**: Claude를 실행할 사용자 정의 명령 지정 (예: `claude`, `/usr/local/bin/claude` 또는 `npx @anthropic/claude`)
- **Suppress notification for Claude command not found**: Claude 명령을 찾지 못했다는 알림 건너뛰기
- **Enable using Option+Enter for multi-line prompts** (macOS 전용): 활성화하면 Option+Enter가 Claude Code 프롬프트에 새 줄을 삽입합니다. Option 키가 예기치 않게 캡처되는 문제가 발생하면 비활성화하세요 (터미널 재시작 필요)
- **Enable automatic updates**: 자동으로 플러그인 업데이트 확인 및 설치 (재시작 시 적용)

> WSL 사용자의 경우: Claude 명령으로 `wsl -d Ubuntu -- bash -lic "claude"`를 설정하세요 (`Ubuntu`를 WSL 배포판 이름으로 교체)

#### ESC 키 구성

- **Settings → Tools → Terminal**로 이동
- 다음 중 하나:

"Move focus to the editor with Escape" 체크 해제, 또는
"Configure terminal keybindings"를 클릭하고 "Switch focus to Editor" 단축키 삭제
- "Move focus to the editor with Escape" 체크 해제, 또는
- "Configure terminal keybindings"를 클릭하고 "Switch focus to Editor" 단축키 삭제
- 변경 사항 적용

## 특수 구성

### 원격 개발

> JetBrains Remote Development를 사용할 때는 **Settings → Plugin (Host)**를 통해 원격 호스트에 플러그인을 설치해야 합니다.

### WSL 구성

> WSL 사용자는 IDE 감지가 제대로 작동하려면 추가 구성이 필요할 수 있습니다. 자세한 설정 지침은 [WSL 문제 해결 가이드](/docs/en/troubleshooting#jetbrains-ide-not-detected-on-wsl2)를 참조하세요.

- 적절한 터미널 구성
- 네트워킹 모드 조정
- 방화벽 설정 업데이트

## 문제 해결

### 플러그인이 작동하지 않음

- 프로젝트 루트 디렉토리에서 Claude Code를 실행하고 있는지 확인
- JetBrains 플러그인이 IDE 설정에서 활성화되어 있는지 확인
- IDE를 완전히 재시작 (여러 번 해야 할 수 있음)
- Remote Development의 경우 원격 호스트에 플러그인이 설치되어 있는지 확인

### IDE가 감지되지 않음

- 플러그인이 설치되고 활성화되어 있는지 확인
- IDE를 완전히 재시작
- 통합 터미널에서 Claude Code를 실행하고 있는지 확인
- WSL 사용자는 [WSL 문제 해결 가이드](/docs/en/troubleshooting#jetbrains-ide-not-detected-on-wsl2)를 참조

### 명령을 찾을 수 없음

- Claude Code가 설치되어 있는지 확인: `npm list -g @anthropic-ai/claude-code`
- 플러그인 설정에서 Claude 명령 경로 구성
- WSL 사용자는 구성 섹션에서 언급된 WSL 명령 형식 사용

## 보안 고려 사항

- 편집에 수동 승인 모드 사용
- 신뢰할 수 있는 프롬프트에만 Claude가 사용되도록 각별히 주의
- Claude Code가 수정할 수 있는 파일을 파악

이 페이지가 도움이 되었나요?
