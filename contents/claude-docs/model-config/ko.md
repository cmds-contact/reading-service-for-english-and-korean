# 모델 구성

한국어

# 모델 구성

`opusplan`과 같은 모델 별칭을 포함한 Claude Code 모델 구성에 대해 알아보세요.

## 사용 가능한 모델

- **모델 별칭**
- **모델 이름**

Anthropic API: 전체 **[모델 이름](https://docs.claude.com/en/docs/about-claude/models/overview#model-names)**
Bedrock: inference profile ARN
Foundry: deployment 이름
Vertex: version 이름
- Anthropic API: 전체 **[모델 이름](https://docs.claude.com/en/docs/about-claude/models/overview#model-names)**
- Bedrock: inference profile ARN
- Foundry: deployment 이름
- Vertex: version 이름

### 모델 별칭

### 모델 설정

- **세션 중** - `/model <alias|name>`을 사용하여 세션 중에 모델 전환
- **시작 시** - `claude --model <alias|name>`으로 실행
- **환경 변수** - `ANTHROPIC_MODEL=<alias|name>` 설정
- **설정** - `model` 필드를 사용하여 설정 파일에서 영구적으로 구성

```
# Opus로 시작
claude --model opus

# 세션 중 Sonnet으로 전환
/model sonnet
```

```
{
    "permissions": {
        ...
    },
    "model": "opus"
}
```

## 특수 모델 동작

### default 모델 설정

### opusplan 모델 설정

- **계획 모드에서** - 복잡한 추론 및 아키텍처 결정에 `opus` 사용
- **실행 모드에서** - 코드 생성 및 구현을 위해 자동으로 `sonnet`으로 전환

### [1m]을 사용한 확장 컨텍스트

```
# [1m] 접미사와 함께 전체 모델 이름 사용 예시
/model anthropic.claude-sonnet-4-5-20250929-v1:0[1m]
```

## 현재 모델 확인

- [상태 표시줄](/docs/en/statusline)에서 (구성된 경우)
- `/status`에서, 계정 정보도 표시됩니다.

## 환경 변수

### 프롬프트 캐싱 구성

이 페이지가 도움이 되었나요?
