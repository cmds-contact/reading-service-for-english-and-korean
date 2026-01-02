# 엔터프라이즈 네트워크 구성

Korean

# 엔터프라이즈 네트워크 구성

프록시 서버, 사용자 정의 인증 기관(CA), 상호 전송 계층 보안(mTLS) 인증을 사용하는 엔터프라이즈 환경에서 Claude Code를 구성하는 방법을 알아봅니다.

> 이 페이지에 표시된 모든 환경 변수는 `settings.json`에서도 구성할 수 있습니다.

## 프록시 구성

### 환경 변수

```
# HTTPS 프록시 (권장)
export HTTPS_PROXY=https://proxy.example.com:8080

# HTTP 프록시 (HTTPS를 사용할 수 없는 경우)
export HTTP_PROXY=http://proxy.example.com:8080

# 특정 요청에 대해 프록시 우회 - 공백으로 구분된 형식
export NO_PROXY="localhost 192.168.1.1 example.com .example.com"
# 특정 요청에 대해 프록시 우회 - 쉼표로 구분된 형식
export NO_PROXY="localhost,192.168.1.1,example.com,.example.com"
# 모든 요청에 대해 프록시 우회
export NO_PROXY="*"
```

> Claude Code는 SOCKS 프록시를 지원하지 않습니다.

### 기본 인증

```
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

> 스크립트에 비밀번호를 하드코딩하지 마세요. 대신 환경 변수 또는 안전한 자격 증명 저장소를 사용하세요.

> 고급 인증(NTLM, Kerberos 등)이 필요한 프록시의 경우, 해당 인증 방식을 지원하는 LLM Gateway 서비스 사용을 고려하세요.

## 사용자 정의 CA 인증서

```
export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
```

## mTLS 인증

```
# 인증용 클라이언트 인증서
export CLAUDE_CODE_CLIENT_CERT=/path/to/client-cert.pem

# 클라이언트 개인 키
export CLAUDE_CODE_CLIENT_KEY=/path/to/client-key.pem

# 선택 사항: 암호화된 개인 키의 암호 구문
export CLAUDE_CODE_CLIENT_KEY_PASSPHRASE="your-passphrase"
```

## 네트워크 액세스 요구 사항

- `api.anthropic.com` - Claude API 엔드포인트
- `claude.ai` - WebFetch 보안 장치
- `statsig.anthropic.com` - 원격 측정 및 메트릭
- `sentry.io` - 오류 보고

## 추가 리소스

- [Claude Code 설정](/docs/en/settings)
- [환경 변수 참조](/docs/en/settings#environment-variables)
- [문제 해결 가이드](/docs/en/troubleshooting)

이 페이지가 도움이 되었나요?
