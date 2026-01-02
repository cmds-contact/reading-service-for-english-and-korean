# Claude Code 개요

한국어

# Claude Code 개요

터미널에서 작동하며 아이디어를 그 어느 때보다 빠르게 코드로 변환하는 Anthropic의 에이전트형 코딩 도구인 Claude Code에 대해 알아보세요.

## 30초 만에 시작하기

- [Claude.ai](https://claude.ai) (권장) 또는 [Claude Console](https://console.anthropic.com/) 계정
- 기본 설치 (권장)
- Homebrew
- NPM

```
curl -fsSL https://claude.ai/install.sh | bash
```

```
irm https://claude.ai/install.ps1 | iex
```

```
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

```
brew install --cask claude-code
```

```
npm install -g @anthropic-ai/claude-code
```

```
cd your-project
claude
```

> Claude Code는 자동으로 최신 버전을 유지합니다. 설치 옵션, 수동 업데이트 또는 제거 방법은 [고급 설정](/docs/en/setup)을 참조하세요. 문제가 발생하면 [문제 해결](/docs/en/troubleshooting)을 방문하세요.

## Claude Code가 할 수 있는 것

- **설명만으로 기능 구현**: 자연스러운 언어로 원하는 것을 설명하면 Claude가 계획을 세우고, 코드를 작성하며, 정상 작동을 확인합니다.
- **버그 디버깅 및 수정**: 버그를 설명하거나 오류 메시지를 붙여넣으세요. Claude Code가 코드베이스를 분석하고 문제를 파악하여 수정을 구현합니다.
- **모든 코드베이스 탐색**: 팀의 코드베이스에 대해 무엇이든 물어보면 신중하게 답변해 드립니다. Claude Code는 전체 프로젝트 구조를 파악하고, 웹에서 최신 정보를 찾으며, [MCP](/docs/en/mcp)를 통해 Google Drive, Figma, Slack과 같은 외부 데이터 소스에서도 정보를 가져올 수 있습니다.
- **지루한 작업 자동화**: 까다로운 린트 문제 수정, 병합 충돌 해결, 릴리스 노트 작성 등을 하나의 명령어로 처리할 수 있습니다. 개발 머신에서 직접 또는 CI에서 자동으로 실행할 수 있습니다.

## 개발자들이 Claude Code를 좋아하는 이유

- **터미널에서 작동**: 또 다른 채팅 창도 아니고, 또 다른 IDE도 아닙니다. Claude Code는 이미 여러분이 작업하는 곳에서, 이미 사용하는 도구와 함께 작동합니다.
- **직접 실행**: Claude Code는 파일 편집, 명령 실행, 커밋 생성을 직접 수행할 수 있습니다. 더 필요하신가요? [MCP](/docs/en/mcp)를 사용하면 Claude가 Google Drive에서 디자인 문서를 읽고, Jira에서 티켓을 업데이트하거나, *여러분의* 맞춤형 개발 도구를 사용할 수 있습니다.
- **Unix 철학**: Claude Code는 조합과 스크립팅이 가능합니다. `tail -f app.log | claude -p "Slack me if you see any anomalies appear in this log stream"`이 *작동합니다*. CI에서 `claude -p "If there are new text strings, translate them into French and raise a PR for @lang-fr-team to review"`를 실행할 수 있습니다.
- **엔터프라이즈 지원**: Claude API를 사용하거나 AWS 또는 GCP에서 호스팅할 수 있습니다. 엔터프라이즈급 [보안](/docs/en/security), [개인정보 보호](/docs/en/data-usage), [컴플라이언스](https://trust.anthropic.com/)가 기본 제공됩니다.

## 다음 단계

## 빠른 시작

## 일반적인 워크플로우

## 문제 해결

## IDE 설정

## 추가 자료

## Claude Code 소개

## Agent SDK로 구축하기

## AWS 또는 GCP에서 호스팅

## 설정

## 명령어

## 레퍼런스 구현

## 보안

## 개인정보 보호 및 데이터 사용

이 페이지가 도움이 되었나요?
