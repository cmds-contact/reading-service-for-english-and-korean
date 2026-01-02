# 웹에서 사용하는 Claude Code

***업데이트:** 웹에서 사용하는 Claude Code가 이제 Pro 및 Max 사용자 외에도 프리미엄 시트를 보유한 Team 및 Enterprise 사용자를 위한 리서치 프리뷰로 제공됩니다. 이 사용자들에게는 웹에서 사용하는 Claude Code가 기본적으로 활성화되어 있으며, 계정 관리자는 Claude 설정에서 접근 권한을 전환할 수 있습니다. 2025년 11월 12일*

오늘, 브라우저에서 직접 코딩 작업을 위임할 수 있는 새로운 방법인 웹에서 사용하는 Claude Code를 소개합니다.

현재 리서치 프리뷰로 베타 서비스 중이며, Anthropic이 관리하는 클라우드 인프라에서 실행되는 여러 코딩 작업을 Claude에게 할당할 수 있습니다. 버그 백로그 처리, 일상적인 수정 작업, 또는 병렬 개발 작업에 완벽합니다.

## 코딩 작업을 병렬로 실행하기

웹에서 사용하는 Claude Code를 통해 터미널을 열지 않고도 코딩 세션을 시작할 수 있습니다. GitHub 저장소를 연결하고, 필요한 것을 설명하면, Claude가 구현을 처리합니다.

각 세션은 실시간 진행 상황 추적이 가능한 자체 격리된 환경에서 실행되며, Claude가 작업을 수행하는 동안 적극적으로 방향을 조정할 수 있습니다.

<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/s-avRazvmLg?autoplay=0&mute=1&controls=1&origin=https%3A%2F%2Fwww.staging.ant.dev&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Fwww.staging.ant.dev%2Fnews%2Fclaude-code-on-the-web&aoriginsup=1&gporigin=https%3A%2F%2Fwww.staging.ant.dev%2Fantaccess%2Fstructure%2Fposts%3Bnews%3Bbf9ddf12-70b1-493c-b667-b2c908f0bcb7%252Cview%253Dpreview&vf=1" frameborder="0" allowfullscreen></iframe>

클라우드에서 Claude Code를 실행하면 이제 단일 인터페이스에서 여러 저장소에 걸쳐 **여러 작업을 병렬로 실행**할 수 있으며, 자동 PR 생성과 명확한 변경 요약으로 **더 빠르게 배포**할 수 있습니다.

## 모든 워크플로우에 유연하게 대응

웹 인터페이스는 기존 Claude Code 워크플로우를 보완합니다. 클라우드에서 작업을 실행하는 것은 특히 다음과 같은 경우에 효과적입니다:

- 프로젝트 작동 방식과 저장소 매핑에 대한 질문에 답변하기
- 버그 수정 및 잘 정의된 일상적인 작업
- Claude Code가 테스트 주도 개발을 사용하여 변경 사항을 검증할 수 있는 백엔드 변경

모바일에서도 Claude Code를 사용할 수 있습니다. 이 리서치 프리뷰의 일환으로, 개발자들이 이동 중에도 Claude와 함께 코딩을 탐색할 수 있도록 iOS 앱에서 Claude Code를 제공하고 있습니다. 초기 프리뷰이며, 여러분의 피드백을 바탕으로 모바일 경험을 빠르게 개선하고자 합니다.

## 보안 우선 클라우드 실행

모든 Claude Code 작업은 네트워크 및 파일 시스템 제한이 있는 격리된 샌드박스 환경에서 실행됩니다. Git 상호 작용은 Claude가 승인된 저장소에만 접근할 수 있도록 보장하는 보안 프록시 서비스를 통해 처리되어, 전체 워크플로우 동안 코드와 자격 증명을 보호합니다.

샌드박스에서 Claude Code가 연결할 수 있는 도메인을 선택하기 위해 사용자 지정 네트워크 구성을 추가할 수도 있습니다. 예를 들어, Claude가 테스트를 실행하고 변경 사항을 검증할 수 있도록 인터넷을 통해 npm 패키지를 다운로드할 수 있게 허용할 수 있습니다.

Claude Code의 샌드박싱 접근 방식에 대한 심층 분석은 [엔지니어링 블로그](https://www.anthropic.com/engineering/claude-code-sandboxing)와 [문서](https://docs.claude.com/en/docs/claude-code/sandboxing)를 참조하세요.

## 시작하기

웹에서 사용하는 Claude Code는 현재 Pro 및 Max 사용자를 위한 리서치 프리뷰로 제공됩니다. [claude.com/code](http://claude.com/code)를 방문하여 첫 번째 저장소를 연결하고 작업 위임을 시작하세요.

클라우드 기반 세션은 다른 모든 Claude Code 사용량과 요금 한도를 공유합니다. 자세한 내용은 [문서를 참조](https://docs.claude.com/en/docs/claude-code/claude-code-on-the-web)하세요.
