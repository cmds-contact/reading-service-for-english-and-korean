# 모니터링

한국어

# 모니터링

Claude Code에서 OpenTelemetry를 활성화하고 구성하는 방법을 알아보세요.

## 빠른 시작

```
# 1. 텔레메트리 활성화
export CLAUDE_CODE_ENABLE_TELEMETRY=1

# 2. 익스포터 선택 (둘 다 선택사항 - 필요한 것만 구성)
export OTEL_METRICS_EXPORTER=otlp       # 옵션: otlp, prometheus, console
export OTEL_LOGS_EXPORTER=otlp          # 옵션: otlp, console

# 3. OTLP 엔드포인트 구성 (OTLP 익스포터용)
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# 4. 인증 설정 (필요시)
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer your-token"

# 5. 디버깅용: 내보내기 간격 단축
export OTEL_METRIC_EXPORT_INTERVAL=10000  # 10초 (기본값: 60000ms)
export OTEL_LOGS_EXPORT_INTERVAL=5000     # 5초 (기본값: 5000ms)

# 6. Claude Code 실행
claude
```

> 기본 내보내기 간격은 메트릭의 경우 60초, 로그의 경우 5초입니다. 설정 중에는 디버깅 목적으로 더 짧은 간격을 사용하는 것이 좋습니다. 프로덕션에서는 이 값을 재설정하는 것을 잊지 마세요.

## 관리자 구성

```
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://collector.company.com:4317",
    "OTEL_EXPORTER_OTLP_HEADERS": "Authorization=Bearer company-token"
  }
}
```

> 관리 설정은 MDM(모바일 장치 관리) 또는 기타 장치 관리 솔루션을 통해 배포할 수 있습니다. 관리 설정 파일에 정의된 환경 변수는 높은 우선순위를 가지며 사용자가 재정의할 수 없습니다.

## 구성 세부사항

### 일반 구성 변수

### 메트릭 카디널리티 제어

### 동적 헤더

#### 설정 구성

```
{
  "otelHeadersHelper": "/bin/generate_opentelemetry_headers.sh"
}
```

#### 스크립트 요구사항

```
#!/bin/bash
# 예시: 여러 헤더
echo "{\"Authorization\": \"Bearer $(get-token.sh)\", \"X-API-Key\": \"$(get-api-key.sh)\"}"
```

#### 새로고침 동작

### 다중 팀 조직 지원

```
# 팀 식별을 위한 사용자 정의 속성 추가
export OTEL_RESOURCE_ATTRIBUTES="department=engineering,team.id=platform,cost_center=eng-123"
```

- 팀 또는 부서별 메트릭 필터링
- 비용 센터별 비용 추적
- 팀별 대시보드 생성
- 특정 팀에 대한 알림 설정

> **OTEL_RESOURCE_ATTRIBUTES의 중요한 형식 요구사항:** `OTEL_RESOURCE_ATTRIBUTES` 환경 변수는 엄격한 형식 요구사항이 있는 [W3C Baggage 명세](https://www.w3.org/TR/baggage/)를 따릅니다:
> **공백 허용 안 됨**: 값에 공백이 포함될 수 없습니다. 예를 들어, `user.organizationName=My Company`는 유효하지 않습니다
> **형식**: 쉼표로 구분된 key=value 쌍이어야 합니다: `key1=value1,key2=value2`
> **허용되는 문자**: 제어 문자, 공백, 큰따옴표, 쉼표, 세미콜론, 백슬래시를 제외한 US-ASCII 문자만 가능
> **특수 문자**: 허용 범위를 벗어난 문자는 퍼센트 인코딩해야 합니다
> **예시:**CopyAsk AI# ❌ 유효하지 않음 - 공백 포함
> export OTEL_RESOURCE_ATTRIBUTES="org.name=John's Organization"
>
> # ✅ 유효함 - 밑줄 또는 camelCase 사용
> export OTEL_RESOURCE_ATTRIBUTES="org.name=Johns_Organization"
> export OTEL_RESOURCE_ATTRIBUTES="org.name=JohnsOrganization"
>
> # ✅ 유효함 - 필요시 특수 문자 퍼센트 인코딩
> export OTEL_RESOURCE_ATTRIBUTES="org.name=John%27s%20Organization"
> 참고: 값을 따옴표로 감싸도 공백이 이스케이프되지 않습니다. 예를 들어, `org.name="My Company"`는 `My Company`가 아닌 `"My Company"`(따옴표 포함) 리터럴 값이 됩니다.

- **공백 허용 안 됨**: 값에 공백이 포함될 수 없습니다. 예를 들어, `user.organizationName=My Company`는 유효하지 않습니다
- **형식**: 쉼표로 구분된 key=value 쌍이어야 합니다: `key1=value1,key2=value2`
- **허용되는 문자**: 제어 문자, 공백, 큰따옴표, 쉼표, 세미콜론, 백슬래시를 제외한 US-ASCII 문자만 가능
- **특수 문자**: 허용 범위를 벗어난 문자는 퍼센트 인코딩해야 합니다

```
# ❌ 유효하지 않음 - 공백 포함
export OTEL_RESOURCE_ATTRIBUTES="org.name=John's Organization"

# ✅ 유효함 - 밑줄 또는 camelCase 사용
export OTEL_RESOURCE_ATTRIBUTES="org.name=Johns_Organization"
export OTEL_RESOURCE_ATTRIBUTES="org.name=JohnsOrganization"

# ✅ 유효함 - 필요시 특수 문자 퍼센트 인코딩
export OTEL_RESOURCE_ATTRIBUTES="org.name=John%27s%20Organization"
```

### 구성 예시

```
# 콘솔 디버깅 (1초 간격)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console
export OTEL_METRIC_EXPORT_INTERVAL=1000

# OTLP/gRPC
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Prometheus
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=prometheus

# 여러 익스포터
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console,otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json

# 메트릭과 로그에 다른 엔드포인트/백엔드 사용
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_METRICS_PROTOCOL=http/protobuf
export OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://metrics.company.com:4318
export OTEL_EXPORTER_OTLP_LOGS_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://logs.company.com:4317

# 메트릭만 (이벤트/로그 없음)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# 이벤트/로그만 (메트릭 없음)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

## 사용 가능한 메트릭 및 이벤트

### 표준 속성

### 메트릭

### 메트릭 상세 정보

#### 세션 카운터

- 모든 [표준 속성](#표준-속성)

#### 코드 라인 카운터

- `type`: (`"added"`, `"removed"`)

#### 풀 리퀘스트 카운터

#### 커밋 카운터

#### 비용 카운터

- `model`: 모델 식별자 (예: "claude-sonnet-4-5-20250929")

#### 토큰 카운터

- `type`: (`"input"`, `"output"`, `"cacheRead"`, `"cacheCreation"`)

#### 코드 편집 도구 결정 카운터

- `tool`: 도구 이름 (`"Edit"`, `"Write"`, `"NotebookEdit"`)
- `decision`: 사용자 결정 (`"accept"`, `"reject"`)
- `language`: 편집된 파일의 프로그래밍 언어 (예: `"TypeScript"`, `"Python"`, `"JavaScript"`, `"Markdown"`). 인식되지 않는 파일 확장자의 경우 `"unknown"`을 반환합니다.

#### 활성 시간 카운터

### 이벤트

#### 사용자 프롬프트 이벤트

- `event.name`: `"user_prompt"`
- `event.timestamp`: ISO 8601 타임스탬프
- `prompt_length`: 프롬프트 길이
- `prompt`: 프롬프트 내용 (기본적으로 수정됨, `OTEL_LOG_USER_PROMPTS=1`로 활성화)

#### 도구 결과 이벤트

- `event.name`: `"tool_result"`
- `tool_name`: 도구 이름
- `success`: `"true"` 또는 `"false"`
- `duration_ms`: 실행 시간(밀리초)
- `error`: 오류 메시지 (실패 시)
- `decision`: `"accept"` 또는 `"reject"`
- `source`: 결정 소스 - `"config"`, `"user_permanent"`, `"user_temporary"`, `"user_abort"`, 또는 `"user_reject"`
- `tool_parameters`: 도구별 매개변수를 포함하는 JSON 문자열 (사용 가능한 경우)

Bash 도구의 경우: `bash_command`, `full_command`, `timeout`, `description`, `sandbox` 포함
- Bash 도구의 경우: `bash_command`, `full_command`, `timeout`, `description`, `sandbox` 포함

#### API 요청 이벤트

- `event.name`: `"api_request"`
- `model`: 사용된 모델 (예: "claude-sonnet-4-5-20250929")
- `cost_usd`: USD 기준 예상 비용
- `duration_ms`: 요청 소요 시간(밀리초)
- `input_tokens`: 입력 토큰 수
- `output_tokens`: 출력 토큰 수
- `cache_read_tokens`: 캐시에서 읽은 토큰 수
- `cache_creation_tokens`: 캐시 생성에 사용된 토큰 수

#### API 오류 이벤트

- `event.name`: `"api_error"`
- `error`: 오류 메시지
- `status_code`: HTTP 상태 코드 (해당되는 경우)
- `attempt`: 시도 횟수 (재시도된 요청의 경우)

#### 도구 결정 이벤트

- `event.name`: `"tool_decision"`
- `tool_name`: 도구 이름 (예: "Read", "Edit", "Write", "NotebookEdit")

## 메트릭 및 이벤트 데이터 해석

### 사용량 모니터링

### 비용 모니터링

- 팀 또는 개인별 사용량 추세 추적
- 최적화를 위한 고사용량 세션 식별

> 비용 메트릭은 근사치입니다. 공식 청구 데이터는 API 제공업체(Claude Console, AWS Bedrock 또는 Google Cloud Vertex)를 참조하세요.

### 알림 및 세분화

- 비용 급증
- 비정상적인 토큰 소비
- 특정 사용자의 높은 세션 볼륨

### 이벤트 분석

- 가장 자주 사용되는 도구
- 도구 성공률
- 평균 도구 실행 시간
- 도구 유형별 오류 패턴

## 백엔드 고려사항

### 메트릭용

- **시계열 데이터베이스 (예: Prometheus)**: 비율 계산, 집계된 메트릭
- **컬럼형 저장소 (예: ClickHouse)**: 복잡한 쿼리, 고유 사용자 분석
- **완전한 기능의 관찰 플랫폼 (예: Honeycomb, Datadog)**: 고급 쿼리, 시각화, 알림

### 이벤트/로그용

- **로그 집계 시스템 (예: Elasticsearch, Loki)**: 전문 검색, 로그 분석
- **컬럼형 저장소 (예: ClickHouse)**: 구조화된 이벤트 분석
- **완전한 기능의 관찰 플랫폼 (예: Honeycomb, Datadog)**: 메트릭과 이벤트 간의 상관관계

## 서비스 정보

- `service.name`: `claude-code`
- `service.version`: 현재 Claude Code 버전
- `os.type`: 운영 체제 유형 (예: `linux`, `darwin`, `windows`)
- `os.version`: 운영 체제 버전 문자열
- `host.arch`: 호스트 아키텍처 (예: `amd64`, `arm64`)
- `wsl.version`: WSL 버전 번호 (Windows Subsystem for Linux에서 실행 시에만 존재)
- Meter Name: `com.anthropic.claude_code`

## ROI 측정 리소스

## 보안/개인정보 고려사항

- 텔레메트리는 옵트인 방식이며 명시적 구성이 필요합니다
- API 키나 파일 내용과 같은 민감한 정보는 메트릭이나 이벤트에 포함되지 않습니다
- 사용자 프롬프트 내용은 기본적으로 수정됩니다 - 프롬프트 길이만 기록됩니다. 사용자 프롬프트 로깅을 활성화하려면 `OTEL_LOG_USER_PROMPTS=1`을 설정하세요

## Amazon Bedrock에서 Claude Code 모니터링

이 페이지가 도움이 되었나요?
