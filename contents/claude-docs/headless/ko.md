# Claude Code를 프로그래밍 방식으로 실행하기

한국어

# Claude Code를 프로그래밍 방식으로 실행하기

Agent SDK를 사용하여 CLI, Python 또는 TypeScript에서 Claude Code를 프로그래밍 방식으로 실행합니다.

> CLI는 이전에 "headless 모드"라고 불렸습니다. `-p` 플래그와 모든 CLI 옵션은 동일하게 작동합니다.

```
claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
```

## 기본 사용법

- `--continue`로 [대화 이어가기](#continue-conversations)
- `--allowedTools`로 [도구 자동 승인](#auto-approve-tools)
- `--output-format`으로 [구조화된 출력 얻기](#get-structured-output)

```
claude -p "What does the auth module do?"
```

## 예제

### 구조화된 출력 얻기

- `text` (기본값): 일반 텍스트 출력
- `json`: 결과, 세션 ID, 메타데이터가 포함된 구조화된 JSON
- `stream-json`: 실시간 스트리밍을 위한 개행으로 구분된 JSON

```
claude -p "Summarize this project" --output-format json
```

```
claude -p "Extract the main function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

> [jq](https://jqlang.github.io/jq/)와 같은 도구를 사용하여 응답을 파싱하고 특정 필드를 추출할 수 있습니다:
> # 텍스트 결과 추출
> claude -p "Summarize this project" --output-format json | jq -r '.result'
>
> # 구조화된 출력 추출
> claude -p "Extract function names from auth.py" \
>   --output-format json \
>   --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}' \
>   | jq '.structured_output'

```
# Extract the text result
claude -p "Summarize this project" --output-format json | jq -r '.result'

# Extract structured output
claude -p "Extract function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}' \
  | jq '.structured_output'
```

### 도구 자동 승인

```
claude -p "Run the test suite and fix any failures" \
  --allowedTools "Bash,Read,Edit"
```

### 커밋 생성하기

```
claude -p "Look at my staged changes and create an appropriate commit" \
  --allowedTools "Bash(git diff:*),Bash(git log:*),Bash(git status:*),Bash(git commit:*)"
```

> `/commit`과 같은 [슬래시 명령어](/docs/en/slash-commands)는 인터랙티브 모드에서만 사용할 수 있습니다. `-p` 모드에서는 수행하고자 하는 작업을 설명하세요.

### 시스템 프롬프트 커스터마이징

```
gh pr diff "$1" | claude -p \
  --append-system-prompt "You are a security engineer. Review for vulnerabilities." \
  --output-format json
```

### 대화 이어가기

```
# First request
claude -p "Review this codebase for performance issues"

# Continue the most recent conversation
claude -p "Now focus on the database queries" --continue
claude -p "Generate a summary of all issues found" --continue
```

```
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

## 다음 단계

## Agent SDK 빠른 시작

## CLI 레퍼런스

## GitHub Actions

## GitLab CI/CD

이 페이지가 도움이 되었나요?
