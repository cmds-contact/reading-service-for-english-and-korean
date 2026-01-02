# 상태 표시줄 설정

한국어

# 상태 표시줄 설정

Claude Code에서 맥락 정보를 표시하는 사용자 정의 상태 표시줄을 만들어보세요.

## 사용자 정의 상태 표시줄 만들기

- `/statusline`을 실행하면 Claude Code가 사용자 정의 상태 표시줄 설정을 도와줍니다. 기본적으로 터미널 프롬프트를 재현하려고 하지만, `/statusline show the model name in orange`처럼 원하는 동작에 대한 추가 지침을 제공할 수 있습니다.
- `.claude/settings.json`에 직접 `statusLine` 명령을 추가합니다:

```
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 0 // 선택 사항: 0으로 설정하면 상태 표시줄이 가장자리까지 확장됩니다
  }
}
```

## 작동 방식

- 대화 메시지가 업데이트될 때 상태 표시줄이 갱신됩니다
- 업데이트는 최대 300ms마다 실행됩니다
- 명령의 stdout 첫 번째 줄이 상태 표시줄 텍스트가 됩니다
- ANSI 색상 코드를 사용하여 상태 표시줄 스타일을 지정할 수 있습니다
- Claude Code는 현재 세션에 대한 맥락 정보(모델, 디렉토리 등)를 JSON 형식으로 스크립트에 stdin을 통해 전달합니다

## JSON 입력 구조

```
{
  "hook_event_name": "Status",
  "session_id": "abc123...",
  "transcript_path": "/path/to/transcript.json",
  "cwd": "/current/working/directory",
  "model": {
    "id": "claude-opus-4-1",
    "display_name": "Opus"
  },
  "workspace": {
    "current_dir": "/current/working/directory",
    "project_dir": "/original/project/directory"
  },
  "version": "1.0.80",
  "output_style": {
    "name": "default"
  },
  "cost": {
    "total_cost_usd": 0.01234,
    "total_duration_ms": 45000,
    "total_api_duration_ms": 2300,
    "total_lines_added": 156,
    "total_lines_removed": 23
  },
  "context_window": {
    "total_input_tokens": 15234,
    "total_output_tokens": 4521,
    "context_window_size": 200000,
    "current_usage": {
      "input_tokens": 8500,
      "output_tokens": 1200,
      "cache_creation_input_tokens": 5000,
      "cache_read_input_tokens": 2000
    }
  }
}
```

## 예제 스크립트

### 간단한 상태 표시줄

```
#!/bin/bash
# stdin에서 JSON 입력 읽기
input=$(cat)

# jq를 사용하여 값 추출
MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name')
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

echo "[$MODEL_DISPLAY] 📁 ${CURRENT_DIR##*/}"
```

### Git 인식 상태 표시줄

```
#!/bin/bash
# stdin에서 JSON 입력 읽기
input=$(cat)

# jq를 사용하여 값 추출
MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name')
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

# git 저장소인 경우 브랜치 표시
GIT_BRANCH=""
if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null)
    if [ -n "$BRANCH" ]; then
        GIT_BRANCH=" | 🌿 $BRANCH"
    fi
fi

echo "[$MODEL_DISPLAY] 📁 ${CURRENT_DIR##*/}$GIT_BRANCH"
```

### Python 예제

```
#!/usr/bin/env python3
import json
import sys
import os

# stdin에서 JSON 읽기
data = json.load(sys.stdin)

# 값 추출
model = data['model']['display_name']
current_dir = os.path.basename(data['workspace']['current_dir'])

# git 브랜치 확인
git_branch = ""
if os.path.exists('.git'):
    try:
        with open('.git/HEAD', 'r') as f:
            ref = f.read().strip()
            if ref.startswith('ref: refs/heads/'):
                git_branch = f" | 🌿 {ref.replace('ref: refs/heads/', '')}"
    except:
        pass

print(f"[{model}] 📁 {current_dir}{git_branch}")
```

### Node.js 예제

```
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// stdin에서 JSON 읽기
let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
    const data = JSON.parse(input);

    // 값 추출
    const model = data.model.display_name;
    const currentDir = path.basename(data.workspace.current_dir);

    // git 브랜치 확인
    let gitBranch = '';
    try {
        const headContent = fs.readFileSync('.git/HEAD', 'utf8').trim();
        if (headContent.startsWith('ref: refs/heads/')) {
            gitBranch = ` | 🌿 ${headContent.replace('ref: refs/heads/', '')}`;
        }
    } catch (e) {
        // git 저장소가 아니거나 HEAD를 읽을 수 없음
    }

    console.log(`[${model}] 📁 ${currentDir}${gitBranch}`);
});
```

### 헬퍼 함수 방식

```
#!/bin/bash
# JSON 입력을 한 번 읽기
input=$(cat)

# 일반적인 추출을 위한 헬퍼 함수
get_model_name() { echo "$input" | jq -r '.model.display_name'; }
get_current_dir() { echo "$input" | jq -r '.workspace.current_dir'; }
get_project_dir() { echo "$input" | jq -r '.workspace.project_dir'; }
get_version() { echo "$input" | jq -r '.version'; }
get_cost() { echo "$input" | jq -r '.cost.total_cost_usd'; }
get_duration() { echo "$input" | jq -r '.cost.total_duration_ms'; }
get_lines_added() { echo "$input" | jq -r '.cost.total_lines_added'; }
get_lines_removed() { echo "$input" | jq -r '.cost.total_lines_removed'; }
get_input_tokens() { echo "$input" | jq -r '.context_window.total_input_tokens'; }
get_output_tokens() { echo "$input" | jq -r '.context_window.total_output_tokens'; }
get_context_window_size() { echo "$input" | jq -r '.context_window.context_window_size'; }

# 헬퍼 사용
MODEL=$(get_model_name)
DIR=$(get_current_dir)
echo "[$MODEL] 📁 ${DIR##*/}"
```

### 컨텍스트 윈도우 사용량

- `total_input_tokens` / `total_output_tokens`: 전체 세션에 걸친 누적 총계
- `current_usage`: 마지막 API 호출의 현재 컨텍스트 윈도우 사용량 (아직 메시지가 없으면 `null`일 수 있음)

`input_tokens`: 현재 컨텍스트의 입력 토큰
`output_tokens`: 생성된 출력 토큰
`cache_creation_input_tokens`: 캐시에 기록된 토큰
`cache_read_input_tokens`: 캐시에서 읽은 토큰
- `input_tokens`: 현재 컨텍스트의 입력 토큰
- `output_tokens`: 생성된 출력 토큰
- `cache_creation_input_tokens`: 캐시에 기록된 토큰
- `cache_read_input_tokens`: 캐시에서 읽은 토큰

```
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

if [ "$USAGE" != "null" ]; then
    # current_usage 필드에서 현재 컨텍스트 계산
    CURRENT_TOKENS=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    PERCENT_USED=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))
    echo "[$MODEL] Context: ${PERCENT_USED}%"
else
    echo "[$MODEL] Context: 0%"
fi
```

## 팁

- 상태 표시줄은 간결하게 유지하세요 - 한 줄에 맞아야 합니다
- 이모지(터미널이 지원하는 경우)와 색상을 사용하여 정보를 쉽게 스캔할 수 있게 하세요
- Bash에서 JSON 파싱에는 `jq`를 사용하세요 (위 예제 참조)
- 모의 JSON 입력으로 스크립트를 수동으로 실행하여 테스트하세요: `echo '{"model":{"display_name":"Test"},"workspace":{"current_dir":"/test"}}' | ./statusline.sh`
- 필요한 경우 비용이 많이 드는 작업(git status 등)의 캐싱을 고려하세요

## 문제 해결

- 상태 표시줄이 나타나지 않으면 스크립트가 실행 가능한지 확인하세요 (`chmod +x`)
- 스크립트가 stdout(stderr가 아닌)으로 출력하는지 확인하세요

이 페이지가 도움이 되었나요?
