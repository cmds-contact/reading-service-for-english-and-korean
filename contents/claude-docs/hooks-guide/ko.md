# Claude Code 훅 시작하기

한국어

# Claude Code 훅 시작하기

쉘 명령어를 등록하여 Claude Code의 동작을 커스터마이징하고 확장하는 방법을 알아봅니다

> 훅에 대한 레퍼런스 문서는 [훅 레퍼런스](/docs/en/hooks)를 참조하세요.

- **알림**: Claude Code가 사용자의 입력이나 실행 권한을 기다릴 때 알림을 받는 방식을 커스터마이징합니다.
- **자동 포맷팅**: 파일 편집 후 .ts 파일에는 `prettier`를, .go 파일에는 `gofmt`를 실행하는 등의 작업을 수행합니다.
- **로깅**: 규정 준수나 디버깅을 위해 실행된 모든 명령어를 추적하고 카운트합니다.
- **피드백**: Claude Code가 코드베이스 규칙을 따르지 않는 코드를 생성할 때 자동화된 피드백을 제공합니다.
- **커스텀 권한**: 프로덕션 파일이나 민감한 디렉토리에 대한 수정을 차단합니다.

> 훅을 추가할 때는 보안적인 영향을 고려해야 합니다. 훅은 현재 환경의 자격 증명으로 에이전트 루프 중에 자동으로 실행되기 때문입니다.
> 예를 들어, 악성 훅 코드가 데이터를 유출할 수 있습니다. 등록하기 전에 항상 훅 구현을 검토하세요. 전체 보안 모범 사례는 훅 레퍼런스 문서의 [보안 고려사항](/docs/en/hooks#security-considerations)을 참조하세요.

## 훅 이벤트 개요

- **PreToolUse**: 도구 호출 전에 실행됩니다 (차단 가능)
- **PermissionRequest**: 권한 대화상자가 표시될 때 실행됩니다 (허용 또는 거부 가능)
- **PostToolUse**: 도구 호출 완료 후 실행됩니다
- **UserPromptSubmit**: 사용자가 프롬프트를 제출할 때, Claude가 처리하기 전에 실행됩니다
- **Notification**: Claude Code가 알림을 보낼 때 실행됩니다
- **Stop**: Claude Code가 응답을 완료할 때 실행됩니다
- **SubagentStop**: 서브에이전트 작업이 완료될 때 실행됩니다
- **PreCompact**: Claude Code가 압축 작업을 실행하기 직전에 실행됩니다
- **SessionStart**: Claude Code가 새 세션을 시작하거나 기존 세션을 재개할 때 실행됩니다
- **SessionEnd**: Claude Code 세션이 종료될 때 실행됩니다

## 빠른 시작

### 사전 요구사항

### 1단계: 훅 설정 열기

### 2단계: 매처 추가하기

> `*`를 사용하면 모든 도구와 매칭됩니다.

### 3단계: 훅 추가하기

```
jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt
```

### 4단계: 설정 저장하기

### 5단계: 훅 확인하기

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"\\(.tool_input.command) - \\(.tool_input.description // \"No description\")\"' >> ~/.claude/bash-command-log.txt"
          }
        ]
      }
    ]
  }
}
```

### 6단계: 훅 테스트하기

```
cat ~/.claude/bash-command-log.txt
```

```
ls - Lists files and directories
```

## 추가 예제

> 전체 예제 구현은 공개 코드베이스의 [bash 명령어 유효성 검사기 예제](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py)를 참조하세요.

### 코드 포맷팅 훅

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -q '\\.ts$'; then npx prettier --write \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

### 마크다운 포맷팅 훅

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/markdown_formatter.py"
          }
        ]
      }
    ]
  }
}
```

```
#!/usr/bin/env python3
"""
Markdown formatter for Claude Code output.
Fixes missing language tags and spacing issues while preserving code content.
"""
import json
import sys
import re
import os

def detect_language(code):
    """Best-effort language detection from code content."""
    s = code.strip()

    # JSON detection
    if re.search(r'^\s*[{\[]', s):
        try:
            json.loads(s)
            return 'json'
        except:
            pass

    # Python detection
    if re.search(r'^\s*def\s+\w+\s*\(', s, re.M) or \
       re.search(r'^\s*(import|from)\s+\w+', s, re.M):
        return 'python'

    # JavaScript detection
    if re.search(r'\b(function\s+\w+\s*\(|const\s+\w+\s*=)', s) or \
       re.search(r'=>|console\.(log|error)', s):
        return 'javascript'

    # Bash detection
    if re.search(r'^#!.*\b(bash|sh)\b', s, re.M) or \
       re.search(r'\b(if|then|fi|for|in|do|done)\b', s):
        return 'bash'

    # SQL detection
    if re.search(r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE)\s+', s, re.I):
        return 'sql'

    return 'text'

def format_markdown(content):
    """Format markdown content with language detection."""
    # Fix unlabeled code fences
    def add_lang_to_fence(match):
        indent, info, body, closing = match.groups()
        if not info.strip():
            lang = detect_language(body)
            return f"{indent}```{lang}\n{body}{closing}\n"
        return match.group(0)

    fence_pattern = r'(?ms)^([ \t]{0,3})```([^\n]*)\n(.*?)(\n\1```)\s*$'
    content = re.sub(fence_pattern, add_lang_to_fence, content)

    # Fix excessive blank lines (only outside code fences)
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content.rstrip() + '\n'

# Main execution
try:
    input_data = json.load(sys.stdin)
    file_path = input_data.get('tool_input', {}).get('file_path', '')

    if not file_path.endswith(('.md', '.mdx')):
        sys.exit(0)  # Not a markdown file

    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        formatted = format_markdown(content)

        if formatted != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(formatted)
            print(f"✓ Fixed markdown formatting in {file_path}")

except Exception as e:
    print(f"Error formatting markdown: {e}", file=sys.stderr)
    sys.exit(1)
```

```
chmod +x .claude/hooks/markdown_formatter.py
```

- 레이블이 없는 코드 블록에서 프로그래밍 언어를 감지합니다
- 구문 강조를 위한 적절한 언어 태그를 추가합니다
- 코드 내용을 유지하면서 과도한 빈 줄을 수정합니다
- 마크다운 파일(`.md`, `.mdx`)만 처리합니다

### 커스텀 알림 훅

```
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Awaiting your input'"
          }
        ]
      }
    ]
  }
}
```

### 파일 보호 훅

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; data=json.load(sys.stdin); path=data.get('tool_input',{}).get('file_path',''); sys.exit(2 if any(p in path for p in ['.env', 'package-lock.json', '.git/']) else 0)\""
          }
        ]
      }
    ]
  }
}
```

## 더 알아보기

- 포괄적인 보안 모범 사례와 안전 가이드라인은 훅 레퍼런스 문서의 [보안 고려사항](/docs/en/hooks#security-considerations)을 참조하세요.
- 문제 해결 단계와 디버깅 기법은 훅 레퍼런스 문서의 [디버깅](/docs/en/hooks#debugging)을 참조하세요.

이 페이지가 도움이 되었나요?
