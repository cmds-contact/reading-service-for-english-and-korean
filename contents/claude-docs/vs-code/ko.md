# VS Code에서 Claude Code 사용하기

한국어

# VS Code에서 Claude Code 사용하기

VS Code용 Claude Code 확장 프로그램을 설치하고 구성하세요. 인라인 diff, @-멘션, 계획 검토 및 키보드 단축키로 AI 코딩 지원을 받으세요.

## 전제 조건

- VS Code 1.98.0 이상
- Anthropic 계정 (확장 프로그램을 처음 열 때 로그인). Amazon Bedrock 또는 Google Vertex AI와 같은 서드파티 제공업체를 사용하는 경우 [서드파티 제공업체 사용](#use-third-party-providers)을 참조하세요.

## 확장 프로그램 설치

- [VS Code용 설치](vscode:extension/anthropic.claude-code)
- [Cursor용 설치](cursor:extension/anthropic.claude-code)

> 설치 후 VS Code를 재시작하거나 명령 팔레트에서 "Developer: Reload Window"를 실행해야 할 수 있습니다.

## 시작하기

Claude Code 패널 열기

- **명령 팔레트**: `Cmd+Shift+P` (Mac) 또는 `Ctrl+Shift+P` (Windows/Linux), "Claude Code"를 입력하고 "Open in New Tab"과 같은 옵션을 선택
- **상태 표시줄**: 창 오른쪽 하단에 있는 **✱ Claude Code**를 클릭. 파일이 열려 있지 않아도 작동합니다.

프롬프트 보내기

> 편집기에서 텍스트를 선택하고 `Alt+K`를 눌러 파일 경로와 줄 번호가 포함된 @-멘션을 프롬프트에 직접 삽입하세요.

변경 사항 검토

## 워크플로우 사용자 정의

### 레이아웃 변경

- **보조 사이드바** (기본값): 창 오른쪽
- **기본 사이드바**: Explorer, Search 등의 아이콘이 있는 왼쪽 사이드바
- **편집기 영역**: 파일과 함께 탭으로 Claude 열기

> Spark 아이콘은 Claude 패널이 왼쪽에 도킹되어 있을 때만 Activity Bar(왼쪽 사이드바 아이콘)에 나타납니다. Claude는 기본적으로 오른쪽에 있으므로 Editor Toolbar 아이콘을 사용하여 Claude를 여세요.

### 터미널 모드로 전환

## VS Code 명령어 및 단축키

> 이것들은 확장 프로그램을 제어하기 위한 VS Code 명령어입니다. Claude Code 슬래시 명령어(`/help` 또는 `/compact` 등)의 경우 모든 CLI 명령어가 확장 프로그램에서 아직 사용 가능한 것은 아닙니다. 자세한 내용은 [VS Code 확장 프로그램 vs. Claude Code CLI](#vs-code-extension-vs-claude-code-cli)를 참조하세요.

## 설정 구성

- **확장 프로그램 설정**: `Cmd+,` (Mac) 또는 `Ctrl+,` (Windows/Linux)으로 열고 Extensions → Claude Code로 이동.
설정 | 설명
--- | ---
Selected Model | 새 대화의 기본 모델. `/model`로 세션별 변경.
Use Terminal | 그래픽 패널 대신 터미널 모드로 Claude 실행
Initial Permission Mode | 파일 편집 및 명령에 대한 승인 프롬프트 제어. 기본값은 `default` (각 작업 전에 확인).
Preferred Location | 기본 위치: 사이드바 (오른쪽) 또는 패널 (새 탭)
Autosave | Claude가 읽거나 쓰기 전에 파일 자동 저장
Use Ctrl+Enter to Send | Enter 대신 Ctrl/Cmd+Enter로 프롬프트 전송
Enable New Conversation Shortcut | Cmd/Ctrl+N으로 새 대화 시작 활성화
Respect Git Ignore | 파일 검색에서 .gitignore 패턴 제외
Environment Variables | Claude 프로세스에 환경 변수 설정. **권장하지 않음** - 확장 프로그램과 CLI 간에 설정이 공유되도록 [Claude Code 설정](/docs/en/settings)을 대신 사용하세요.
Disable Login Prompt | 인증 프롬프트 건너뛰기 (서드파티 제공업체 설정용)
Allow Dangerously Skip Permissions | 모든 권한 프롬프트 우회. **매우 주의하여 사용** - 인터넷 액세스가 없는 격리된 샌드박스에서만 권장.
Claude Process Wrapper | Claude 프로세스를 시작하는 데 사용되는 실행 파일 경로

- **Claude Code 설정** (`~/.claude/settings.json`): 이 설정은 VS Code 확장 프로그램과 CLI 간에 공유됩니다. 허용된 명령 및 디렉토리, 환경 변수, 훅 및 MCP 서버에 이 파일을 사용하세요. 자세한 내용은 [설정 문서](/docs/en/settings)를 참조하세요.

## 서드파티 제공업체 사용

로그인 프롬프트 비활성화

제공업체 구성

- [Amazon Bedrock의 Claude Code](/docs/en/amazon-bedrock)
- [Google Vertex AI의 Claude Code](/docs/en/google-vertex-ai)
- [Microsoft Foundry의 Claude Code](/docs/en/microsoft-foundry)

## VS Code 확장 프로그램 vs. Claude Code CLI

### VS Code에서 CLI 실행

### 확장 프로그램과 CLI 간 전환

## 보안 고려 사항

- 신뢰할 수 없는 워크스페이스에 대해 [VS Code Restricted Mode](https://code.visualstudio.com/docs/editor/workspace-trust#_restricted-mode) 활성화
- 편집에 대해 자동 수락 대신 수동 승인 모드 사용
- 수락하기 전에 변경 사항을 주의 깊게 검토

## 일반적인 문제 해결

### 확장 프로그램이 설치되지 않음

- 호환되는 VS Code 버전(1.98.0 이상)인지 확인
- VS Code에 확장 프로그램 설치 권한이 있는지 확인
- Marketplace 웹사이트에서 직접 설치 시도

### Spark 아이콘이 보이지 않음

- **파일 열기**: 아이콘이 표시되려면 파일이 열려 있어야 합니다 - 폴더만 열려 있는 것으로는 충분하지 않습니다
- **VS Code 버전 확인**: 1.98.0 이상 필요 (Help → About)
- **VS Code 재시작**: 명령 팔레트에서 "Developer: Reload Window" 실행
- **충돌하는 확장 프로그램 비활성화**: 다른 AI 확장 프로그램(Cline, Continue 등)을 일시적으로 비활성화
- **워크스페이스 신뢰 확인**: 확장 프로그램은 Restricted Mode에서 작동하지 않습니다

### Claude Code가 응답하지 않음

- **인터넷 연결 확인**: 안정적인 인터넷 연결이 있는지 확인
- **새 대화 시작**: 문제가 지속되는지 확인하기 위해 새 대화를 시작해 보세요
- **CLI 시도**: 터미널에서 `claude`를 실행하여 더 자세한 오류 메시지를 확인
- **버그 리포트 제출**: 문제가 계속되면 오류에 대한 세부 정보와 함께 [GitHub에서 이슈를 제출](https://github.com/anthropics/claude-code/issues)

### 독립형 CLI가 IDE에 연결되지 않음

- VS Code의 통합 터미널에서 Claude Code를 실행하고 있는지 확인(외부 터미널 아님)
- IDE 변형에 맞는 CLI가 설치되어 있는지 확인:

VS Code: `code` 명령을 사용할 수 있어야 함
Cursor: `cursor` 명령을 사용할 수 있어야 함
Windsurf: `windsurf` 명령을 사용할 수 있어야 함
VSCodium: `codium` 명령을 사용할 수 있어야 함
- VS Code: `code` 명령을 사용할 수 있어야 함
- Cursor: `cursor` 명령을 사용할 수 있어야 함
- Windsurf: `windsurf` 명령을 사용할 수 있어야 함
- VSCodium: `codium` 명령을 사용할 수 있어야 함
- 명령을 사용할 수 없는 경우 명령 팔레트 → "Shell Command: Install 'code' command in PATH"에서 설치

## 확장 프로그램 제거

- Extensions 보기 열기 (Mac: `Cmd+Shift+X` 또는 Windows/Linux: `Ctrl+Shift+X`)
- "Claude Code" 검색
- **Uninstall** 클릭

```
rm -rf ~/.vscode/globalStorage/anthropic.claude-code
```

## 다음 단계

- [일반적인 워크플로우 탐색](/docs/en/common-workflows)으로 Claude Code를 최대한 활용하세요
- [MCP 서버 설정](/docs/en/mcp)으로 외부 도구로 Claude의 기능을 확장하세요. CLI를 사용하여 서버를 구성한 다음 확장 프로그램에서 사용하세요.
- [Claude Code 설정 구성](/docs/en/settings)으로 허용된 명령, 훅 등을 사용자 정의하세요. 이 설정은 확장 프로그램과 CLI 간에 공유됩니다.

이 페이지가 도움이 되었나요?
