# 터미널 설정 최적화

한국어

# 터미널 설정 최적화

Claude Code는 터미널이 적절하게 구성되어 있을 때 가장 잘 작동합니다. 다음 가이드라인을 따라 경험을 최적화하세요.

### 테마 및 외관

### 줄 바꿈

- **빠른 이스케이프**: `\`를 입력한 후 Enter를 눌러 줄 바꿈 생성
- **키보드 단축키**: 줄 바꿈을 삽입하는 키 바인딩 설정

#### Shift+Enter 설정 (VS Code 또는 iTerm2):

#### Option+Enter 설정 (VS Code, iTerm2 또는 macOS Terminal.app):

- 설정 → 프로필 → 키보드 열기
- "Use Option as Meta Key" 체크
- 설정 → 프로필 → 키 열기
- 일반에서 왼쪽/오른쪽 Option 키를 "Esc+"로 설정

### 알림 설정

#### iTerm 2 시스템 알림

- iTerm 2 환경설정 열기
- 프로필 → 터미널로 이동
- "Silence bell" 활성화 및 필터 알림 → "Send escape sequence-generated alerts"
- 원하는 알림 지연 시간 설정

#### 사용자 정의 알림 훅

### 대용량 입력 처리

- **직접 붙여넣기 피하기**: Claude Code는 매우 긴 붙여넣기 내용을 처리하는 데 어려움을 겪을 수 있습니다
- **파일 기반 워크플로우 사용**: 내용을 파일에 작성하고 Claude에게 읽도록 요청
- **VS Code 제한 사항 인지**: VS Code 터미널은 특히 긴 붙여넣기가 잘리는 경향이 있습니다

### Vim 모드

- 모드 전환: `Esc` (NORMAL로), `i`/`I`, `a`/`A`, `o`/`O` (INSERT로)
- 탐색: `h`/`j`/`k`/`l`, `w`/`e`/`b`, `0`/`$`/`^`, `gg`/`G`
- 편집: `x`, `dw`/`de`/`db`/`dd`/`D`, `cw`/`ce`/`cb`/`cc`/`C`, `.` (반복)

이 페이지가 도움이 되었나요?
