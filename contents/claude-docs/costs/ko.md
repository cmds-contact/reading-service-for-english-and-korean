# 비용 효율적으로 관리하기

한국어

# 비용 효율적으로 관리하기

Claude Code 사용 시 토큰 사용량과 비용을 추적하고 최적화하는 방법을 알아보세요.

## 비용 추적하기

### /cost 명령어 사용하기

> `/cost` 명령어는 Claude Max 및 Pro 구독자를 위한 것이 아닙니다.

```
Total cost:            $0.55
Total duration (API):  6m 19.7s
Total duration (wall): 6h 33m 10.2s
Total code changes:    0 lines added, 0 lines removed
```

### 추가 추적 옵션

> Claude Console 계정으로 Claude Code를 처음 인증하면 "Claude Code"라는 워크스페이스가 자동으로 생성됩니다. 이 워크스페이스는 조직 내 모든 Claude Code 사용에 대한 중앙 집중식 비용 추적 및 관리를 제공합니다. 이 워크스페이스에 대한 API 키는 생성할 수 없습니다 - Claude Code 인증 및 사용 전용입니다.

## 팀 비용 관리

### 속도 제한 권장사항

> 비정상적으로 높은 동시 사용 시나리오(예: 대규모 그룹의 라이브 교육 세션)가 예상되는 경우 사용자당 더 높은 TPM 할당이 필요할 수 있습니다.

## 토큰 사용량 줄이기

- **대화 압축:**


Claude는 컨텍스트가 95% 용량을 초과하면 기본적으로 자동 압축을 사용합니다


자동 압축 전환: `/config`를 실행하고 "Auto-compact enabled"로 이동


컨텍스트가 커지면 수동으로 `/compact` 사용


사용자 지정 지침 추가: `/compact Focus on code samples and API usage`


CLAUDE.md에 추가하여 압축 사용자 지정:
CopyAsk AI# Summary instructions

When you are using compact, please focus on test output and code changes
- Claude는 컨텍스트가 95% 용량을 초과하면 기본적으로 자동 압축을 사용합니다
- 자동 압축 전환: `/config`를 실행하고 "Auto-compact enabled"로 이동
- 컨텍스트가 커지면 수동으로 `/compact` 사용
- 사용자 지정 지침 추가: `/compact Focus on code samples and API usage`
- CLAUDE.md에 추가하여 압축 사용자 지정:
CopyAsk AI# Summary instructions

When you are using compact, please focus on test output and code changes

```
# Summary instructions

When you are using compact, please focus on test output and code changes
```

- **구체적인 쿼리 작성:** 불필요한 스캔을 유발하는 모호한 요청 피하기
- **복잡한 작업 분할:** 큰 작업을 집중된 상호작용으로 분할
- **작업 간 기록 지우기:** `/clear`를 사용하여 컨텍스트 초기화
- 분석 중인 코드베이스 크기
- 쿼리의 복잡도
- 검색 또는 수정 중인 파일 수
- 대화 기록 길이
- 대화 압축 빈도

## 백그라운드 토큰 사용량

- **대화 요약**: `claude --resume` 기능을 위해 이전 대화를 요약하는 백그라운드 작업
- **명령어 처리**: `/cost`와 같은 일부 명령어는 상태 확인을 위해 요청을 생성할 수 있습니다

## 버전 변경 및 업데이트 추적

### 현재 버전 정보

```
claude doctor
```

### Claude Code 동작 변경 이해하기

- **버전 추적**: `claude doctor`를 사용하여 현재 버전 확인
- **동작 변경**: `/cost`와 같은 기능은 버전에 따라 정보를 다르게 표시할 수 있습니다
- **문서 접근**: Claude는 항상 최신 문서에 접근할 수 있어 현재 기능 동작을 설명하는 데 도움이 됩니다

### 비용 보고가 변경될 때

- **버전 확인**: `claude doctor`를 실행하여 현재 버전 확인
- **문서 참조**: Claude에게 현재 기능 동작에 대해 직접 물어보세요. 최신 문서에 접근할 수 있습니다
- **지원 문의**: 특정 청구 질문이 있으면 Console 계정을 통해 Anthropic 지원팀에 문의하세요

> 팀 배포의 경우 더 넓은 롤아웃 전에 사용 패턴을 파악하기 위해
> 소규모 파일럿 그룹으로 시작하는 것을 권장합니다.

이 페이지가 도움이 되었나요?
