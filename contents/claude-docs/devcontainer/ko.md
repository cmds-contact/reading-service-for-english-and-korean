# 개발 컨테이너

Korean

# 개발 컨테이너

일관되고 안전한 환경이 필요한 팀을 위한 Claude Code 개발 컨테이너에 대해 알아봅니다.

> devcontainer는 상당한 보호를 제공하지만, 어떤 시스템도 모든 공격에 완전히 면역되지는 않습니다.
> `--dangerously-skip-permissions`로 실행할 때 devcontainer는 Claude Code 자격 증명을 포함하여 devcontainer에서 접근 가능한 모든 것을 악성 프로젝트가 유출하는 것을 방지하지 않습니다.
> 신뢰할 수 있는 저장소로 개발할 때만 devcontainer를 사용하는 것을 권장합니다.
> 항상 좋은 보안 관행을 유지하고 Claude의 활동을 모니터링하세요.

## 주요 기능

- **프로덕션용 Node.js**: 필수 개발 종속성이 포함된 Node.js 20 기반
- **보안 중심 설계**: 필요한 서비스만 접근할 수 있도록 네트워크 접근을 제한하는 사용자 정의 방화벽
- **개발자 친화적 도구**: git, 생산성 향상 기능이 포함된 ZSH, fzf 등 포함
- **원활한 VS Code 통합**: 사전 구성된 확장 프로그램 및 최적화된 설정
- **세션 지속성**: 컨테이너 재시작 간 명령 기록 및 구성 보존
- **어디서나 작동**: macOS, Windows, Linux 개발 환경과 호환

## 4단계로 시작하기

- VS Code와 Remote - Containers 확장 프로그램 설치
- [Claude Code 참조 구현](https://github.com/anthropics/claude-code/tree/main/.devcontainer) 저장소 복제
- VS Code에서 저장소 열기
- 메시지가 표시되면 "Reopen in Container" 클릭 (또는 명령 팔레트 사용: Cmd+Shift+P → "Remote-Containers: Reopen in Container")

## 구성 분석

- **devcontainer.json**: 컨테이너 설정, 확장 프로그램 및 볼륨 마운트 제어
- **Dockerfile**: 컨테이너 이미지 및 설치된 도구 정의
- **init-firewall.sh**: 네트워크 보안 규칙 설정

## 보안 기능

- **정밀한 접근 제어**: 화이트리스트에 등록된 도메인(npm 레지스트리, GitHub, Claude API 등)으로만 아웃바운드 연결 제한
- **허용된 아웃바운드 연결**: 방화벽은 아웃바운드 DNS 및 SSH 연결 허용
- **기본 거부 정책**: 다른 모든 외부 네트워크 접근 차단
- **시작 검증**: 컨테이너 초기화 시 방화벽 규칙 검증
- **격리**: 메인 시스템과 분리된 안전한 개발 환경 생성

## 사용자 정의 옵션

- 워크플로우에 따라 VS Code 확장 프로그램 추가 또는 제거
- 다양한 하드웨어 환경에 맞게 리소스 할당 수정
- 네트워크 접근 권한 조정
- 셸 구성 및 개발자 도구 사용자 정의

## 사용 사례 예시

### 안전한 클라이언트 작업

### 팀 온보딩

### 일관된 CI/CD 환경

## 관련 리소스

- [VS Code devcontainers 문서](https://code.visualstudio.com/docs/devcontainers/containers)
- [Claude Code 보안 모범 사례](/docs/en/security)
- [엔터프라이즈 네트워크 구성](/docs/en/network-config)

이 페이지가 도움이 되었나요?
