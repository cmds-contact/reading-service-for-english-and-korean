Claude가 이제 Integrations를 통해 여러분의 앱과 도구에 연결할 수 있으며, 고급 Research는 웹, Google Workspace, 연결된 서비스 전반을 검색하여 포괄적인 보고서를 신속하게 제공합니다.

오늘 우리는 Integrations를 발표합니다. 이는 여러분의 앱과 도구를 Claude에 연결하는 새로운 방법입니다. 또한 Claude의 [Research](https://www.anthropic.com/news/research) 기능을 확장하여 웹, Google Workspace, 그리고 이제 Integrations까지 검색하는 고급 모드를 추가합니다. Claude는 최대 45분 동안 조사한 후 인용이 포함된 포괄적인 보고서를 제공할 수 있습니다. 이러한 업데이트와 함께, 유료 플랜의 모든 Claude 사용자에게 웹 검색을 전 세계적으로 제공합니다.

## Integrations

지난 11월, 우리는 AI 앱을 도구와 데이터에 연결하는 개방형 표준인 [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)(MCP)을 출시했습니다. 지금까지 MCP 지원은 로컬 서버를 통한 Claude Desktop으로 제한되었습니다. 오늘 우리는 Integrations를 도입하여 Claude가 웹과 데스크톱 앱 전반의 원격 MCP 서버와 원활하게 작동할 수 있게 합니다. 개발자는 Claude의 기능을 향상시키는 서버를 구축하고 호스팅할 수 있으며, 사용자는 이들 중 원하는 수만큼 발견하고 Claude에 연결할 수 있습니다.

도구를 Claude에 연결하면, Claude는 여러분의 작업에 대한 깊은 컨텍스트를 얻게 됩니다—프로젝트 이력, 작업 상태, 조직 지식을 이해하고—모든 영역에서 작업을 수행할 수 있습니다. Claude는 더욱 정보에 밝은 협력자가 되어, 모든 단계에서 전문가의 도움과 함께 복잡한 프로젝트를 한 곳에서 실행할 수 있도록 돕습니다.

<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/6IvP72wy4oE" frameborder="0" allowfullscreen></iframe>

시작하려면, [Atlassian의 Jira 및 Confluence](https://www.atlassian.com/platform/remote-mcp-server), [Zapier](https://zapier.com/mcp), [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare/tree/main), [Intercom](https://www.intercom.com/blog/introducing-model-context-protocol-fin), [Asana](https://developers.asana.com/docs/using-asanas-model-control-protocol-mcp-server), [Square](https://developer.squareup.com/docs/mcp), [Sentry](https://docs.sentry.io/product/sentry-mcp/), [PayPal](https://www.paypal.ai/), [Linear](https://linear.app/changelog/2025-05-01-mcp), [Plaid](https://api.dashboard.plaid.com/mcp/sse)를 포함한 10개의 인기 서비스를 위한 Integrations 중에서 선택할 수 있습니다—Stripe, GitLab, Box 같은 회사들로부터 더 많은 것이 곧 추가될 예정입니다. 개발자는 또한 우리의 문서나 내장 OAuth 인증, 전송 처리, 통합 배포를 제공하는 [Cloudflare](https://blog.cloudflare.com/remote-model-context-protocol-servers-mcp/) 같은 솔루션을 사용하여 최소 30분 만에 자체 Integrations를 만들 수 있습니다.

각 integration은 Claude가 할 수 있는 것을 획기적으로 확장합니다. 예를 들어 Zapier는 사전 구축된 워크플로우를 통해 수천 개의 앱을 연결하여 소프트웨어 스택 전반의 프로세스를 자동화합니다. [Zapier Integration](https://zapier.com/mcp)을 사용하면 Claude는 대화를 통해 이러한 앱과 사용자 정의 워크플로우에 접근할 수 있습니다—[HubSpot](https://developers.hubspot.com/mcp)에서 판매 데이터를 자동으로 가져와 캘린더 기반으로 회의 브리프를 준비하는 것까지.

<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/vMaqmfPo3j0" frameborder="0" allowfullscreen></iframe>

Atlassian의 Jira 및 Confluence에 접근하면, Claude는 새로운 제품 구축, 작업의 더 효과적인 관리, 여러 Confluence 페이지와 Jira 작업 항목을 한 번에 요약하고 생성하여 작업을 확장하는 것을 협력할 수 있습니다.

<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/c_9pLTnWIPg" frameborder="0" allowfullscreen></iframe>

Intercom을 연결하여 사용자 피드백에 더 빠르게 응답하세요. Intercom의 AI 에이전트 Fin은 이제 MCP 클라이언트로서, 사용자가 문제를 보고할 때 Linear에 버그를 등록하는 것과 같은 작업을 수행할 수 있습니다. Claude와 대화하여 Intercom의 대화 기록과 사용자 속성을 사용하여 패턴을 식별하고 디버그하세요—하나의 대화에서 사용자 피드백부터 버그 해결까지 전체 워크플로우를 관리합니다.

## 고급 Research

최근 출시된 [Research](https://www.anthropic.com/news/research) 기능을 기반으로 여러 가지 새로운 업데이트를 도입합니다. Claude는 이제 수백 개의 내부 및 외부 소스에 걸쳐 더 깊은 조사를 수행하여 5분에서 45분 사이에 더 포괄적인 보고서를 제공할 수 있습니다.

Research 버튼을 켜면 사용할 수 있는 더 복잡한 조사 수행 능력으로, Claude는 요청을 더 작은 부분으로 나누어 각각을 깊이 조사한 후 포괄적인 보고서를 작성합니다. 대부분의 보고서는 5분에서 15분 안에 완료되지만, Claude는 더 복잡한 조사의 경우 최대 45분이 걸릴 수 있습니다—일반적으로 수동 조사로 몇 시간이 걸릴 작업입니다.

<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/fuxdGCMF1Qg" frameborder="0" allowfullscreen></iframe>

Claude의 데이터 접근도 확장했습니다. 웹 검색과 Google Workspace 지원으로 Research를 출시했지만, 이제 Integrations를 통해 Claude는 연결한 모든 애플리케이션도 검색할 수 있습니다.

Claude가 소스의 정보를 포함할 때, 원본 자료로 직접 연결되는 명확한 인용을 제공합니다. 이러한 투명성은 각 인사이트가 어디에서 비롯되었는지 정확히 알면서 Claude의 조사 결과를 자신 있게 사용할 수 있도록 보장합니다.

## 시작하기

Integrations와 고급 Research는 현재 Max, Team, Enterprise 플랜에서 베타로 사용 가능하며, 곧 Pro에서도 사용 가능해질 예정입니다. 웹 검색은 이제 모든 [Claude.ai](http://claude.ai) 유료 플랜에서 전 세계적으로 사용 가능합니다. Integrations, MCP 서버, 데이터 소스를 Claude에 연결할 때의 보안 및 개인정보 보호 관행에 대한 자세한 내용은 [Help Center](https://support.anthropic.com/en/articles/11175166-about-integrations-using-remote-mcp)를 방문하세요.

***업데이트:*** *확장된 가용성. (2025년 6월 3일)*

Integrations와 Research는 이제 Pro, Max, Team, Enterprise 플랜에서 사용 가능합니다. 웹 검색은 모든 Claude 플랜에서 전 세계적으로 사용 가능합니다.
