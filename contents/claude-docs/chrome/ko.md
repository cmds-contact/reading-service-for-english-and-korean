# Chrome에서 Claude Code 사용하기 (베타)

한국어

# Chrome에서 Claude Code 사용하기 (베타)

Claude Code를 브라우저에 연결하여 웹 앱을 테스트하고, 콘솔 로그로 디버깅하고, 브라우저 작업을 자동화하세요.

> Chrome 통합은 베타 버전이며 현재 Google Chrome에서만 작동합니다. Brave, Arc 또는 기타 Chromium 기반 브라우저에서는 아직 지원되지 않습니다. WSL(Windows Subsystem for Linux)도 지원되지 않습니다.

## 통합이 가능하게 하는 것

- **실시간 디버깅**: Claude가 콘솔 오류와 DOM 상태를 직접 읽은 다음 이를 유발한 코드를 수정합니다
- **디자인 검증**: Figma 목업에서 UI를 빌드한 다음 Claude가 브라우저에서 열어 일치하는지 확인합니다
- **웹 앱 테스팅**: 폼 유효성 검사 테스트, 시각적 회귀 확인 또는 사용자 흐름이 올바르게 작동하는지 확인
- **인증된 웹 앱**: API 커넥터 없이도 로그인된 Google Docs, Gmail, Notion 또는 다른 앱과 상호작용
- **데이터 추출**: 웹 페이지에서 구조화된 정보를 추출하고 로컬에 저장
- **작업 자동화**: 데이터 입력, 폼 작성 또는 다중 사이트 워크플로우와 같은 반복적인 브라우저 작업 자동화
- **세션 녹화**: 발생한 일을 문서화하거나 공유하기 위해 브라우저 상호작용을 GIF로 녹화

## 전제 조건

- [Google Chrome](https://www.google.com/chrome/) 브라우저
- [Claude in Chrome 확장 프로그램](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) 버전 1.0.36 이상
- [Claude Code CLI](/docs/en/quickstart#step-1:-install-claude-code) 버전 2.0.73 이상
- 유료 Claude 플랜 (Pro, Team 또는 Enterprise)

## 통합 작동 방식

> Chrome 통합은 표시되는 브라우저 창이 필요합니다. Claude가 브라우저 작업을 수행할 때 Chrome이 열리고 실시간으로 탐색하는 것을 볼 수 있습니다. 통합이 로그인 상태가 있는 실제 브라우저 세션에 의존하기 때문에 헤드리스 모드가 없습니다.

## 통합 설정

Claude Code 업데이트

```
claude update
```

Chrome이 활성화된 Claude Code 시작

```
claude --chrome
```

연결 확인

## 사용해 보기

```
Go to code.claude.com/docs, click on the search box,
type "hooks", and tell me what results appear
```

## 예제 워크플로우

### 로컬 웹 애플리케이션 테스트

```
I just updated the login form validation. Can you open localhost:3000,
try submitting the form with invalid data, and check if the error
messages appear correctly?
```

### 콘솔 로그로 디버깅

```
Open the dashboard page and check the console for any errors when
the page loads.
```

### 폼 작성 자동화

```
I have a spreadsheet of customer contacts in contacts.csv. For each row,
go to our CRM at crm.example.com, click "Add Contact", and fill in the
name, email, and phone fields.
```

### Google Docs에서 콘텐츠 작성

```
Draft a project update based on our recent commits and add it to my
Google Doc at docs.google.com/document/d/abc123
```

### 웹 페이지에서 데이터 추출

```
Go to the product listings page and extract the name, price, and
availability for each item. Save the results as a CSV file.
```

### 다중 사이트 워크플로우 실행

```
Check my calendar for meetings tomorrow, then for each meeting with
an external attendee, look up their company on LinkedIn and add a
note about what they do.
```

### 데모 GIF 녹화

```
Record a GIF showing how to complete the checkout flow, from adding
an item to the cart through to the confirmation page.
```

## 모범 사례

- **모달 대화상자가 흐름을 방해할 수 있음**: JavaScript alert, confirm 및 prompt는 브라우저 이벤트를 차단하고 Claude가 명령을 받지 못하게 합니다. 대화상자가 나타나면 수동으로 닫고 Claude에게 계속하라고 말하세요.
- **새 탭 사용**: Claude는 각 세션에 대해 새 탭을 생성합니다. 탭이 응답하지 않으면 Claude에게 새 탭을 만들어 달라고 요청하세요.
- **콘솔 출력 필터링**: 콘솔 로그는 장황할 수 있습니다. 디버깅할 때 모든 콘솔 출력을 요청하는 대신 어떤 패턴을 찾아야 하는지 Claude에게 알려주세요.

## 문제 해결

### 확장 프로그램이 감지되지 않음

- Chrome 확장 프로그램(버전 1.0.36 이상)이 설치되어 있는지 확인
- `claude --version`을 실행하여 Claude Code가 버전 2.0.73 이상인지 확인
- Chrome이 실행 중인지 확인
- `/chrome`을 실행하고 "Reconnect extension"을 선택하여 연결 재설정
- 문제가 지속되면 Claude Code와 Chrome을 모두 재시작

### 브라우저가 응답하지 않음

- 모달 대화상자(alert, confirm, prompt)가 페이지를 차단하고 있는지 확인
- Claude에게 새 탭을 만들어 다시 시도하도록 요청
- Chrome 확장 프로그램을 비활성화했다가 다시 활성화하여 재시작

### 처음 설정

## 기본값으로 활성화

> Chrome을 기본값으로 활성화하면 브라우저 도구가 항상 로드되므로 컨텍스트 사용량이 증가합니다. 컨텍스트 소비가 증가한 것을 발견하면 이 설정을 비활성화하고 필요할 때만 `--chrome`을 사용하세요.

## 참고 자료

- [CLI 레퍼런스](/docs/en/cli-reference) - `--chrome`을 포함한 명령줄 플래그
- [일반적인 워크플로우](/docs/en/common-workflows) - Claude Code를 사용하는 더 많은 방법
- [Chrome용 Claude 시작하기](https://support.anthropic.com/en/articles/12012173-getting-started-with-claude-for-chrome) - 단축키, 스케줄링 및 권한을 포함한 Chrome 확장 프로그램 전체 문서

이 페이지가 도움이 되었나요?
