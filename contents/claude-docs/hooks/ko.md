# Hooks 참조

한국어

# Hooks 참조

이 페이지는 Claude Code에서 hooks를 구현하기 위한 참조 문서를 제공합니다.

> 예제가 포함된 빠른 시작 가이드는 [Claude Code hooks 시작하기](/docs/en/hooks-guide)를 참조하세요.

## 설정

- `~/.claude/settings.json` - 사용자 설정
- `.claude/settings.json` - 프로젝트 설정
- `.claude/settings.local.json` - 로컬 프로젝트 설정 (커밋하지 않음)
- 엔터프라이즈 관리 정책 설정

> 엔터프라이즈 관리자는 `allowManagedHooksOnly`를 사용하여 사용자, 프로젝트 및 플러그인 hooks를 차단할 수 있습니다. [Hook 설정](/docs/en/settings#hook-configuration)을 참조하세요.

### 구조

```
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

- **matcher**: 도구 이름과 일치시킬 패턴, 대소문자 구분 (`PreToolUse`, `PermissionRequest`, `PostToolUse`에만 적용)

단순 문자열은 정확히 일치: `Write`는 Write 도구만 일치
정규식 지원: `Edit|Write` 또는 `Notebook.*`
모든 도구와 일치하려면 `*`를 사용합니다. 빈 문자열(`""`)을 사용하거나 `matcher`를 비워둘 수도 있습니다.
- 단순 문자열은 정확히 일치: `Write`는 Write 도구만 일치
- 정규식 지원: `Edit|Write` 또는 `Notebook.*`
- 모든 도구와 일치하려면 `*`를 사용합니다. 빈 문자열(`""`)을 사용하거나 `matcher`를 비워둘 수도 있습니다.
- **hooks**: 패턴이 일치할 때 실행할 hooks 배열

`type`: Hook 실행 유형 - bash 명령어의 경우 `"command"`, LLM 기반 평가의 경우 `"prompt"`
`command`: (`type: "command"`의 경우) 실행할 bash 명령어 (`$CLAUDE_PROJECT_DIR` 환경 변수 사용 가능)
`prompt`: (`type: "prompt"`의 경우) 평가를 위해 LLM에 보낼 프롬프트
`timeout`: (선택 사항) 특정 hook가 취소되기 전까지 실행되어야 하는 시간 (초)
- `type`: Hook 실행 유형 - bash 명령어의 경우 `"command"`, LLM 기반 평가의 경우 `"prompt"`
- `command`: (`type: "command"`의 경우) 실행할 bash 명령어 (`$CLAUDE_PROJECT_DIR` 환경 변수 사용 가능)
- `prompt`: (`type: "prompt"`의 경우) 평가를 위해 LLM에 보낼 프롬프트
- `timeout`: (선택 사항) 특정 hook가 취소되기 전까지 실행되어야 하는 시간 (초)

```
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/prompt-validator.py"
          }
        ]
      }
    ]
  }
}
```

### 프로젝트별 Hook 스크립트

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

### 플러그인 hooks

- 플러그인 hooks는 플러그인의 `hooks/hooks.json` 파일 또는 `hooks` 필드에 제공된 사용자 정의 경로의 파일에 정의됩니다.
- 플러그인이 활성화되면 해당 hooks가 사용자 및 프로젝트 hooks와 병합됩니다
- 다른 소스의 여러 hooks가 동일한 이벤트에 응답할 수 있습니다
- 플러그인 hooks는 `${CLAUDE_PLUGIN_ROOT}` 환경 변수를 사용하여 플러그인 파일을 참조합니다

```
{
  "description": "Automatic code formatting",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

> 플러그인 hooks는 hook의 목적을 설명하는 선택적 `description` 필드가 있는 일반 hooks와 동일한 형식을 사용합니다.

> 플러그인 hooks는 사용자 정의 hooks와 함께 실행됩니다. 여러 hooks가 이벤트와 일치하면 모두 병렬로 실행됩니다.

- `${CLAUDE_PLUGIN_ROOT}`: 플러그인 디렉토리의 절대 경로
- `${CLAUDE_PROJECT_DIR}`: 프로젝트 루트 디렉토리 (프로젝트 hooks와 동일)
- 모든 표준 환경 변수를 사용할 수 있음

## 프롬프트 기반 Hooks

### 프롬프트 기반 hooks 작동 방식

- hook 입력과 프롬프트를 빠른 LLM(Haiku)에 전송
- LLM이 결정을 포함하는 구조화된 JSON으로 응답
- Claude Code가 자동으로 결정을 처리

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if Claude should stop: $ARGUMENTS. Check if all tasks are complete."
          }
        ]
      }
    ]
  }
}
```

- `type`: `"prompt"`여야 함
- `prompt`: LLM에 보낼 프롬프트 텍스트

hook 입력 JSON의 플레이스홀더로 `$ARGUMENTS` 사용
`$ARGUMENTS`가 없으면 입력 JSON이 프롬프트에 추가됨
- hook 입력 JSON의 플레이스홀더로 `$ARGUMENTS` 사용
- `$ARGUMENTS`가 없으면 입력 JSON이 프롬프트에 추가됨
- `timeout`: (선택 사항) 초 단위 타임아웃 (기본값: 30초)

### 응답 스키마

```
{
  "decision": "approve" | "block",
  "reason": "Explanation for the decision",
  "continue": false,  // 선택 사항: Claude를 완전히 중지
  "stopReason": "Message shown to user",  // 선택 사항: 사용자 정의 중지 메시지
  "systemMessage": "Warning or context"  // 선택 사항: 사용자에게 표시
}
```

- `decision`: `"approve"`는 작업을 허용, `"block"`은 방지
- `reason`: 결정이 `"block"`일 때 Claude에게 표시되는 설명
- `continue`: (선택 사항) `false`이면 Claude의 실행을 완전히 중지
- `stopReason`: (선택 사항) `continue`가 false일 때 표시되는 메시지
- `systemMessage`: (선택 사항) 사용자에게 표시되는 추가 메시지

### 지원되는 hook 이벤트

- **Stop**: Claude가 계속 작업해야 하는지 지능적으로 결정
- **SubagentStop**: 하위 에이전트가 작업을 완료했는지 평가
- **UserPromptSubmit**: LLM 지원으로 사용자 프롬프트 유효성 검사
- **PreToolUse**: 컨텍스트 인식 권한 결정
- **PermissionRequest**: 권한 대화 상자를 지능적으로 허용 또는 거부

### 예제: 지능형 Stop hook

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are evaluating whether Claude should stop working. Context: $ARGUMENTS\n\nAnalyze the conversation and determine if:\n1. All user-requested tasks are complete\n2. Any errors need to be addressed\n3. Follow-up work is needed\n\nRespond with JSON: {\"decision\": \"approve\" or \"block\", \"reason\": \"your explanation\"}",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 예제: 사용자 정의 로직이 있는 SubagentStop

```
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if this subagent should stop. Input: $ARGUMENTS\n\nCheck if:\n- The subagent completed its assigned task\n- Any errors occurred that need fixing\n- Additional context gathering is needed\n\nReturn: {\"decision\": \"approve\" or \"block\", \"reason\": \"explanation\"}"
          }
        ]
      }
    ]
  }
}
```

### bash 명령어 hooks와 비교

### 모범 사례

- **프롬프트를 구체적으로 작성**: LLM이 평가할 내용을 명확히 기술
- **결정 기준 포함**: LLM이 고려해야 할 요소 나열
- **프롬프트 테스트**: LLM이 사용 사례에 맞는 올바른 결정을 내리는지 확인
- **적절한 타임아웃 설정**: 기본값은 30초, 필요에 따라 조정
- **복잡한 결정에 사용**: 간단하고 결정론적인 규칙에는 Bash hooks가 더 적합

## Hook 이벤트

### PreToolUse

- `Task` - 하위 에이전트 작업 ([하위 에이전트 문서](/docs/en/sub-agents) 참조)
- `Bash` - 셸 명령어
- `Glob` - 파일 패턴 매칭
- `Grep` - 콘텐츠 검색
- `Read` - 파일 읽기
- `Edit` - 파일 편집
- `Write` - 파일 쓰기
- `WebFetch`, `WebSearch` - 웹 작업

### PermissionRequest

### PostToolUse

### Notification

- `permission_prompt` - Claude Code의 권한 요청
- `idle_prompt` - Claude가 사용자 입력을 기다릴 때 (60초 이상 유휴 시간 후)
- `auth_success` - 인증 성공 알림
- `elicitation_dialog` - Claude Code가 MCP 도구 유도를 위한 입력이 필요할 때

```
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/permission-alert.sh"
          }
        ]
      },
      {
        "matcher": "idle_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/idle-notification.sh"
          }
        ]
      }
    ]
  }
}
```

### UserPromptSubmit

### Stop

### SubagentStop

### PreCompact

- `manual` - `/compact`에서 호출됨
- `auto` - 자동 압축에서 호출됨 (컨텍스트 윈도우가 가득 찼을 때)

### SessionStart

- `startup` - 시작 시 호출됨
- `resume` - `--resume`, `--continue`, 또는 `/resume`에서 호출됨
- `clear` - `/clear`에서 호출됨
- `compact` - 자동 또는 수동 압축에서 호출됨

#### 환경 변수 유지

```
#!/bin/bash

if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
  echo 'export API_KEY=your-api-key' >> "$CLAUDE_ENV_FILE"
  echo 'export PATH="$PATH:./node_modules/.bin"' >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

```
#!/bin/bash

ENV_BEFORE=$(export -p | sort)

# 환경을 수정하는 설정 명령어 실행
source ~/.nvm/nvm.sh
nvm use 20

if [ -n "$CLAUDE_ENV_FILE" ]; then
  ENV_AFTER=$(export -p | sort)
  comm -13 <(echo "$ENV_BEFORE") <(echo "$ENV_AFTER") >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

> `CLAUDE_ENV_FILE`은 SessionStart hooks에서만 사용 가능합니다. 다른 hook 유형은 이 변수에 접근할 수 없습니다.

### SessionEnd

- `clear` - /clear 명령어로 세션 지워짐
- `logout` - 사용자 로그아웃
- `prompt_input_exit` - 프롬프트 입력이 표시된 상태에서 사용자가 종료
- `other` - 기타 종료 사유

## Hook 입력

```
{
  // 공통 필드
  session_id: string
  transcript_path: string  // 대화 JSON 경로
  cwd: string              // hook 호출 시 현재 작업 디렉토리
  permission_mode: string  // 현재 권한 모드: "default", "plan", "acceptEdits", 또는 "bypassPermissions"

  // 이벤트별 필드
  hook_event_name: string
  ...
}
```

### PreToolUse 입력

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

### PostToolUse 입력

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

### Notification 입력

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Notification",
  "message": "Claude needs your permission to use Bash",
  "notification_type": "permission_prompt"
}
```

### UserPromptSubmit 입력

```
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Write a function to calculate the factorial of a number"
}
```

### Stop 및 SubagentStop 입력

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": true
}
```

### PreCompact 입력

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

### SessionStart 입력

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "source": "startup"
}
```

### SessionEnd 입력

```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "exit"
}
```

## Hook 출력

### 간단한 방식: 종료 코드

- **종료 코드 0**: 성공. `stdout`은 자세한 모드에서 사용자에게 표시됩니다
(ctrl+o). `UserPromptSubmit` 및 `SessionStart`의 경우 stdout이
컨텍스트에 추가됩니다. `stdout`의 JSON 출력은 구조화된 제어를 위해 파싱됩니다
([고급: JSON 출력](#고급-json-출력) 참조).
- **종료 코드 2**: 차단 오류. `stderr`만 오류 메시지로 사용되고
Claude에게 피드백됩니다. 형식은 `[command]: {stderr}`입니다. 종료 코드 2의 경우
`stdout`의 JSON은 처리되지 **않습니다**. 아래 hook 이벤트별 동작을 참조하세요.
- **기타 종료 코드**: 비차단 오류. `stderr`는 자세한 모드(ctrl+o)에서
`Failed with non-blocking status code: {stderr}` 형식으로 사용자에게 표시됩니다. `stderr`가 비어 있으면
`No stderr output`을 표시합니다. 실행이 계속됩니다.

> 참고: 종료 코드가 0이면 Claude Code는 stdout을 보지 않습니다. 단,
> stdout이 컨텍스트로 주입되는 `UserPromptSubmit` hook은 예외입니다.

#### 종료 코드 2 동작

### 고급: JSON 출력

> JSON 출력은 hook가 종료 코드 0으로 종료할 때만 처리됩니다. hook가
> 종료 코드 2(차단 오류)로 종료하면 `stderr` 텍스트가 직접 사용됩니다. `stdout`의 JSON은
> 무시됩니다. 다른 0이 아닌 종료 코드의 경우 자세한 모드(ctrl+o)에서 `stderr`만 사용자에게 표시됩니다.

#### 공통 JSON 필드

```
{
  "continue": true, // hook 실행 후 Claude가 계속해야 하는지 (기본값: true)
  "stopReason": "string", // continue가 false일 때 표시되는 메시지

  "suppressOutput": true, // 전사 모드에서 stdout 숨기기 (기본값: false)
  "systemMessage": "string" // 사용자에게 표시되는 선택적 경고 메시지
}
```

- `PreToolUse`의 경우 이것은 특정 도구 호출만 차단하고 Claude에게 자동 피드백을 제공하는 `"permissionDecision": "deny"`와 다릅니다.
- `PostToolUse`의 경우 이것은 Claude에게 자동화된 피드백을 제공하는 `"decision": "block"`과 다릅니다.
- `UserPromptSubmit`의 경우 프롬프트 처리를 방지합니다.
- `Stop` 및 `SubagentStop`의 경우 모든 `"decision": "block"` 출력보다 우선합니다.
- 모든 경우 `"continue" = false`가 모든 `"decision": "block"` 출력보다 우선합니다.

#### PreToolUse 결정 제어

- `"allow"`는 권한 시스템을 우회합니다. `permissionDecisionReason`은 사용자에게 표시되지만 Claude에게는 표시되지 않습니다.
- `"deny"`는 도구 호출 실행을 방지합니다. `permissionDecisionReason`은 Claude에게 표시됩니다.
- `"ask"`는 UI에서 도구 호출을 확인하도록 사용자에게 요청합니다. `permissionDecisionReason`은 사용자에게 표시되지만 Claude에게는 표시되지 않습니다.
- `updatedInput`을 사용하면 도구가 실행되기 전에 도구의 입력 매개변수를 수정할 수 있습니다.
- 이것은 도구 호출을 수정하고 승인하기 위해 `"permissionDecision": "allow"`와 함께 사용하면 가장 유용합니다.

```
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
    "permissionDecisionReason": "My reason here",
    "updatedInput": {
      "field_to_modify": "new value"
    }
  }
}
```

> PreToolUse hooks의 경우 `decision` 및 `reason` 필드는 더 이상 사용되지 않습니다.
> 대신 `hookSpecificOutput.permissionDecision` 및
> `hookSpecificOutput.permissionDecisionReason`을 사용하세요. 더 이상 사용되지 않는 필드
> `"approve"` 및 `"block"`은 각각 `"allow"` 및 `"deny"`에 매핑됩니다.

#### PermissionRequest 결정 제어

- `"behavior": "allow"`의 경우 도구가 실행되기 전에 도구의 입력 매개변수를 수정하는 `"updatedInput"`을 선택적으로 전달할 수 있습니다.
- `"behavior": "deny"`의 경우 모델에게 권한이 거부된 이유를 알려주는 `"message"` 문자열과 Claude를 중지하는 부울 `"interrupt"`를 선택적으로 전달할 수 있습니다.

```
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {
        "command": "npm run lint"
      }
    }
  }
}
```

#### PostToolUse 결정 제어

- `"block"`은 자동으로 `reason`으로 Claude에게 프롬프트합니다.
- `undefined`는 아무것도 하지 않습니다. `reason`은 무시됩니다.
- `"hookSpecificOutput.additionalContext"`는 Claude가 고려할 컨텍스트를 추가합니다.

```
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Additional information for Claude"
  }
}
```

#### UserPromptSubmit 결정 제어

- **일반 텍스트 stdout** (더 간단함): stdout에 기록된 비JSON 텍스트는 컨텍스트로 추가됩니다. 정보를 주입하는 가장 쉬운 방법입니다.
- `additionalContext`가 있는 JSON (구조화된): 더 많은 제어를 위해 아래 JSON 형식을 사용합니다. `additionalContext` 필드가 컨텍스트로 추가됩니다.
- `"decision": "block"`은 프롬프트 처리를 방지합니다. 제출된 프롬프트는 컨텍스트에서 지워집니다. `"reason"`은 사용자에게 표시되지만 컨텍스트에 추가되지 않습니다.
- `"decision": undefined` (또는 생략)는 프롬프트가 정상적으로 진행되도록 허용합니다.

```
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "My additional context here"
  }
}
```

> 간단한 사용 사례에는 JSON 형식이 필요하지 않습니다. 컨텍스트를 추가하려면 종료 코드 0으로 일반 텍스트를 stdout에 출력할 수 있습니다. 프롬프트를 차단하거나 더 구조화된 제어가 필요할 때 JSON을 사용하세요.

#### Stop/SubagentStop 결정 제어

- `"block"`은 Claude가 중지하는 것을 방지합니다. Claude가 진행 방법을 알 수 있도록 `reason`을 채워야 합니다.
- `undefined`는 Claude가 중지하도록 허용합니다. `reason`은 무시됩니다.

```
{
  "decision": "block" | undefined,
  "reason": "Must be provided when Claude is blocked from stopping"
}
```

#### SessionStart 결정 제어

- `"hookSpecificOutput.additionalContext"`는 문자열을 컨텍스트에 추가합니다.
- 여러 hooks의 `additionalContext` 값이 연결됩니다.

```
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "My additional context here"
  }
}
```

#### SessionEnd 결정 제어

#### 종료 코드 예제: Bash 명령어 유효성 검사

```
#!/usr/bin/env python3
import json
import re
import sys

# 유효성 검사 규칙을 (정규식 패턴, 메시지) 튜플 목록으로 정의
VALIDATION_RULES = [
    (
        r"\bgrep\b(?!.*\|)",
        "Use 'rg' (ripgrep) instead of 'grep' for better performance and features",
    ),
    (
        r"\bfind\s+\S+\s+-name\b",
        "Use 'rg --files | rg pattern' or 'rg --files -g pattern' instead of 'find -name' for better performance",
    ),
]


def validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues


try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})
command = tool_input.get("command", "")

if tool_name != "Bash" or not command:
    sys.exit(1)

# 명령어 유효성 검사
issues = validate_command(command)

if issues:
    for message in issues:
        print(f"• {message}", file=sys.stderr)
    # 종료 코드 2는 도구 호출을 차단하고 stderr를 Claude에게 표시
    sys.exit(2)
```

#### JSON 출력 예제: 컨텍스트 추가 및 유효성 검사를 위한 UserPromptSubmit

> `UserPromptSubmit` hooks의 경우 두 가지 방법으로 컨텍스트를 주입할 수 있습니다:
> **종료 코드 0의 일반 텍스트 stdout**: 가장 간단한 접근 방식, 텍스트 출력
> **종료 코드 0의 JSON 출력**: 프롬프트를 거부하려면 `"decision": "block"` 사용,
> 또는 구조화된 컨텍스트 주입을 위해 `additionalContext` 사용
> 참고: 종료 코드 2는 오류 메시지에 `stderr`만 사용합니다. JSON을 사용하여 차단하려면
> (사용자 정의 이유로) 종료 코드 0과 함께 `"decision": "block"`을 사용하세요.

- **종료 코드 0의 일반 텍스트 stdout**: 가장 간단한 접근 방식, 텍스트 출력
- **종료 코드 0의 JSON 출력**: 프롬프트를 거부하려면 `"decision": "block"` 사용,
또는 구조화된 컨텍스트 주입을 위해 `additionalContext` 사용

```
#!/usr/bin/env python3
import json
import sys
import re
import datetime

# stdin에서 입력 로드
try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

prompt = input_data.get("prompt", "")

# 민감한 패턴 확인
sensitive_patterns = [
    (r"(?i)\b(password|secret|key|token)\s*[:=]", "Prompt contains potential secrets"),
]

for pattern, message in sensitive_patterns:
    if re.search(pattern, prompt):
        # JSON 출력을 사용하여 특정 이유로 차단
        output = {
            "decision": "block",
            "reason": f"Security policy violation: {message}. Please rephrase your request without sensitive information."
        }
        print(json.dumps(output))
        sys.exit(0)

# 컨텍스트에 현재 시간 추가
context = f"Current time: {datetime.datetime.now()}"
print(context)

"""
다음도 동등합니다:
print(json.dumps({
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": context,
  },
}))
"""

# 추가 컨텍스트와 함께 프롬프트가 진행되도록 허용
sys.exit(0)
```

#### JSON 출력 예제: 승인이 있는 PreToolUse

```
#!/usr/bin/env python3
import json
import sys

# stdin에서 입력 로드
try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# 예제: 문서 파일에 대한 파일 읽기 자동 승인
if tool_name == "Read":
    file_path = tool_input.get("file_path", "")
    if file_path.endswith((".md", ".mdx", ".txt", ".json")):
        # JSON 출력을 사용하여 도구 호출 자동 승인
        output = {
            "decision": "approve",
            "reason": "Documentation file auto-approved",
            "suppressOutput": True  # 자세한 모드에서 표시하지 않음
        }
        print(json.dumps(output))
        sys.exit(0)

# 다른 경우에는 정상적인 권한 흐름이 진행되도록 함
sys.exit(0)
```

## MCP 도구 작업

### MCP 도구 명명

- `mcp__memory__create_entities` - Memory 서버의 엔티티 생성 도구
- `mcp__filesystem__read_file` - Filesystem 서버의 파일 읽기 도구
- `mcp__github__search_repositories` - GitHub 서버의 검색 도구

### MCP 도구용 Hooks 구성

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

## 예제

> 코드 포매팅, 알림, 파일 보호를 포함한 실용적인 예제는 시작 가이드의 [더 많은 예제](/docs/en/hooks-guide#more-examples)를 참조하세요.

## 보안 고려 사항

### 면책 조항

- 구성하는 명령어에 대한 책임은 전적으로 사용자에게 있습니다
- Hooks는 사용자 계정이 접근할 수 있는 모든 파일을 수정, 삭제 또는 접근할 수 있습니다
- 악성 또는 잘못 작성된 hooks는 데이터 손실이나 시스템 손상을 유발할 수 있습니다
- Anthropic은 hook 사용으로 인한 어떠한 손해에 대해서도 보증이나 책임을 지지 않습니다
- 프로덕션 사용 전에 안전한 환경에서 hooks를 철저히 테스트해야 합니다

### 보안 모범 사례

- **입력 유효성 검사 및 새니타이즈** - 입력 데이터를 맹목적으로 신뢰하지 마세요
- **항상 셸 변수를 따옴표로 묶기** - `$VAR`가 아닌 `"$VAR"` 사용
- **경로 순회 차단** - 파일 경로에서 `..` 확인
- **절대 경로 사용** - 스크립트에 전체 경로 지정 (프로젝트 경로에는 "$CLAUDE_PROJECT_DIR" 사용)
- **민감한 파일 건너뛰기** - `.env`, `.git/`, 키 등 피하기

### 구성 안전성

- 시작 시 hooks의 스냅샷 캡처
- 세션 전체에서 이 스냅샷 사용
- hooks가 외부에서 수정되면 경고
- 변경 사항이 적용되려면 `/hooks` 메뉴에서 검토 필요

## Hook 실행 세부 정보

- **타임아웃**: 기본적으로 60초 실행 제한, 명령어별로 구성 가능.

개별 명령어의 타임아웃은 다른 명령어에 영향을 미치지 않습니다.
- 개별 명령어의 타임아웃은 다른 명령어에 영향을 미치지 않습니다.
- **병렬화**: 일치하는 모든 hooks가 병렬로 실행됩니다
- **중복 제거**: 여러 동일한 hook 명령어가 자동으로 중복 제거됩니다
- **환경**: Claude Code의 환경으로 현재 디렉토리에서 실행됩니다

`CLAUDE_PROJECT_DIR` 환경 변수는 사용 가능하며 프로젝트 루트 디렉토리(Claude Code가 시작된 위치)의 절대 경로를 포함합니다
`CLAUDE_CODE_REMOTE` 환경 변수는 hook가 원격(웹) 환경(`"true"`)에서 실행되는지 로컬 CLI 환경(설정되지 않거나 비어 있음)에서 실행되는지를 나타냅니다. 실행 컨텍스트에 따라 다른 로직을 실행하는 데 사용하세요.
- `CLAUDE_PROJECT_DIR` 환경 변수는 사용 가능하며 프로젝트 루트 디렉토리(Claude Code가 시작된 위치)의 절대 경로를 포함합니다
- `CLAUDE_CODE_REMOTE` 환경 변수는 hook가 원격(웹) 환경(`"true"`)에서 실행되는지 로컬 CLI 환경(설정되지 않거나 비어 있음)에서 실행되는지를 나타냅니다. 실행 컨텍스트에 따라 다른 로직을 실행하는 데 사용하세요.
- **입력**: stdin을 통한 JSON
- **출력**:

PreToolUse/PermissionRequest/PostToolUse/Stop/SubagentStop: 자세한 모드(ctrl+o)에서 진행 상황 표시
Notification/SessionEnd: 디버그에만 로깅됨 (`--debug`)
UserPromptSubmit/SessionStart: stdout이 Claude의 컨텍스트로 추가됨
- PreToolUse/PermissionRequest/PostToolUse/Stop/SubagentStop: 자세한 모드(ctrl+o)에서 진행 상황 표시
- Notification/SessionEnd: 디버그에만 로깅됨 (`--debug`)
- UserPromptSubmit/SessionStart: stdout이 Claude의 컨텍스트로 추가됨

## 디버깅

### 기본 문제 해결

- **구성 확인** - `/hooks`를 실행하여 hook가 등록되었는지 확인
- **구문 확인** - JSON 설정이 유효한지 확인
- **명령어 테스트** - hook 명령어를 먼저 수동으로 실행
- **권한 확인** - 스크립트가 실행 가능한지 확인
- **로그 검토** - `claude --debug`를 사용하여 hook 실행 세부 정보 확인
- **따옴표 이스케이프 안 됨** - JSON 문자열 내에서 `\"` 사용
- **잘못된 matcher** - 도구 이름이 정확히 일치하는지 확인 (대소문자 구분)
- **명령어를 찾을 수 없음** - 스크립트에 전체 경로 사용

### 고급 디버깅

- **hook 실행 검사** - `claude --debug`를 사용하여 자세한 hook 실행 확인
- **JSON 스키마 유효성 검사** - 외부 도구로 hook 입력/출력 테스트
- **환경 변수 확인** - Claude Code의 환경이 올바른지 확인
- **엣지 케이스 테스트** - 비정상적인 파일 경로나 입력으로 hooks 시도
- **시스템 리소스 모니터링** - hook 실행 중 리소스 고갈 확인
- **구조화된 로깅 사용** - hook 스크립트에 로깅 구현

### 디버그 출력 예제

```
[DEBUG] Executing hooks for PostToolUse:Write
[DEBUG] Getting matching hook commands for PostToolUse with query: Write
[DEBUG] Found 1 hook matchers in settings
[DEBUG] Matched 1 hooks for query "Write"
[DEBUG] Found 1 hook commands to execute
[DEBUG] Executing hook command: <Your command> with timeout 60000ms
[DEBUG] Hook command completed with status 0: <Your stdout>
```

- 실행 중인 hook
- 실행 중인 명령어
- 성공/실패 상태
- 출력 또는 오류 메시지

이 페이지가 도움이 되었나요?
