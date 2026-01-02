# 웹에서 Claude Code 사용

한국어

# 웹에서 Claude Code 사용

안전한 클라우드 인프라에서 Claude Code 작업을 비동기적으로 실행하세요

> 웹에서의 Claude Code는 현재 리서치 프리뷰 중입니다.

## 웹에서의 Claude Code란?

- **질문에 답변**: 코드 아키텍처와 기능 구현 방식에 대해 질문하세요
- **버그 수정 및 일상 작업**: 빈번한 조정이 필요하지 않은 잘 정의된 작업
- **병렬 작업**: 여러 버그 수정을 병렬로 처리
- **로컬 머신에 없는 저장소**: 로컬에 체크아웃하지 않은 코드로 작업
- **백엔드 변경**: Claude Code가 테스트를 작성한 다음 해당 테스트를 통과하는 코드를 작성할 수 있는 경우
- **이동 중**: 통근 중이거나 노트북에서 떨어져 있을 때 작업 시작
- **모니터링**: 에이전트 작업의 진행 상황을 보고 조정

## 누가 웹에서 Claude Code를 사용할 수 있나요?

- **Pro 사용자**
- **Max 사용자**
- **Team 프리미엄 시트 사용자**
- **Enterprise 프리미엄 시트 사용자**

## 시작하기

- [claude.ai/code](https://claude.ai/code) 방문
- GitHub 계정 연결
- 저장소에 Claude GitHub 앱 설치
- 기본 환경 선택
- 코딩 작업 제출
- 변경 사항 검토 및 GitHub에서 Pull Request 생성

## 작동 방식

- **저장소 복제**: 저장소가 Anthropic 관리 가상 머신에 복제됩니다
- **환경 설정**: Claude가 코드로 안전한 클라우드 환경을 준비합니다
- **네트워크 구성**: 설정에 따라 인터넷 액세스가 구성됩니다
- **작업 실행**: Claude가 코드를 분석하고, 변경하고, 테스트를 실행하고, 작업을 확인합니다
- **완료**: 완료되면 알림을 받고 변경 사항으로 PR을 생성할 수 있습니다
- **결과**: 변경 사항이 브랜치로 푸시되어 Pull Request 생성 준비가 됩니다

## 웹과 터미널 간 작업 이동

### 웹에서 터미널로

- "Open in CLI" 버튼 클릭
- 저장소의 체크아웃에서 터미널에 명령 붙여넣기 및 실행
- 기존 로컬 변경 사항은 스태시되고 원격 세션이 로드됩니다
- 로컬에서 작업 계속하기

## 클라우드 환경

### 기본 이미지

- 인기 있는 프로그래밍 언어 및 런타임
- 일반적인 빌드 도구 및 패키지 관리자
- 테스팅 프레임워크 및 린터

#### 사용 가능한 도구 확인

```
check-tools
```

- 프로그래밍 언어 및 버전
- 사용 가능한 패키지 관리자
- 설치된 개발 도구

#### 언어별 설정

- **Python**: pip, poetry 및 일반적인 과학 라이브러리가 포함된 Python 3.x
- **Node.js**: npm, yarn, pnpm, bun이 포함된 최신 LTS 버전
- **Ruby**: 버전 3.1.6, 3.2.6, 3.3.6 (기본값: 3.3.6), gem, bundler 및 버전 관리를 위한 rbenv 포함
- **PHP**: 버전 8.4.14
- **Java**: Maven 및 Gradle이 포함된 OpenJDK
- **Go**: 모듈 지원이 포함된 최신 안정 버전
- **Rust**: cargo가 포함된 Rust 툴체인
- **C++**: GCC 및 Clang 컴파일러

#### 데이터베이스

- **PostgreSQL**: 버전 16
- **Redis**: 버전 7.0

### 환경 구성

- **환경 준비**: 저장소를 복제하고 초기화를 위해 구성된 Claude 훅을 실행합니다. 저장소는 GitHub 저장소의 기본 브랜치로 복제됩니다. 특정 브랜치를 체크아웃하려면 프롬프트에서 지정할 수 있습니다.
- **네트워크 구성**: 에이전트의 인터넷 액세스를 구성합니다. 인터넷 액세스는 기본적으로 제한되지만 필요에 따라 인터넷 없음 또는 전체 인터넷 액세스로 환경을 구성할 수 있습니다.
- **Claude Code 실행**: Claude Code가 작업을 완료하기 위해 실행되며, 코드를 작성하고, 테스트를 실행하고, 작업을 확인합니다. 웹 인터페이스를 통해 세션 전체에서 Claude를 안내하고 조정할 수 있습니다. Claude는 `CLAUDE.md`에 정의한 컨텍스트를 준수합니다.
- **결과**: Claude가 작업을 완료하면 브랜치를 원격으로 푸시합니다. 해당 브랜치에 대한 PR을 생성할 수 있습니다.

> Claude는 환경에서 사용 가능한 터미널 및 CLI 도구를 통해서만 작동합니다. 유니버설 이미지에 사전 설치된 도구와 훅 또는 의존성 관리를 통해 설치한 추가 도구를 사용합니다.

> 환경 변수는 `.env` 형식으로 키-값 쌍으로 지정해야 합니다. 예를 들어:

```
API_KEY=your_api_key
DEBUG=true
```

### 의존성 관리

```
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/install_pkgs.sh"
          }
        ]
      }
    ]
  }
}
```

```
#!/bin/bash
npm install
pip install -r requirements.txt
exit 0
```

#### 로컬 vs 원격 실행

```
#!/bin/bash

# 예제: 원격 환경에서만 실행
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

npm install
pip install -r requirements.txt
```

#### 환경 변수 유지

## 네트워크 액세스 및 보안

### 네트워크 정책

#### GitHub 프록시

- GitHub 인증을 안전하게 관리 - git 클라이언트는 샌드박스 내에서 범위가 지정된 자격 증명을 사용하며, 프록시가 이를 확인하고 실제 GitHub 인증 토큰으로 변환합니다
- 안전을 위해 현재 작업 브랜치로 git push 작업을 제한합니다
- 보안 경계를 유지하면서 원활한 복제, 페치 및 PR 작업을 가능하게 합니다

#### 보안 프록시

- 악의적인 요청에 대한 보호
- 속도 제한 및 남용 방지
- 향상된 보안을 위한 콘텐츠 필터링

### 액세스 수준

### 기본 허용 도메인

#### Anthropic 서비스

- api.anthropic.com
- statsig.anthropic.com
- claude.ai

#### 버전 관리

- github.com
- [www.github.com](http://www.github.com)
- api.github.com
- raw.githubusercontent.com
- objects.githubusercontent.com
- codeload.github.com
- avatars.githubusercontent.com
- camo.githubusercontent.com
- gist.github.com
- gitlab.com
- [www.gitlab.com](http://www.gitlab.com)
- registry.gitlab.com
- bitbucket.org
- [www.bitbucket.org](http://www.bitbucket.org)
- api.bitbucket.org

#### 컨테이너 레지스트리

- registry-1.docker.io
- auth.docker.io
- index.docker.io
- hub.docker.com
- [www.docker.com](http://www.docker.com)
- production.cloudflare.docker.com
- download.docker.com
- *.gcr.io
- ghcr.io
- mcr.microsoft.com
- *.data.mcr.microsoft.com

#### 클라우드 플랫폼

- cloud.google.com
- accounts.google.com
- gcloud.google.com
- *.googleapis.com
- storage.googleapis.com
- compute.googleapis.com
- container.googleapis.com
- azure.com
- portal.azure.com
- microsoft.com
- [www.microsoft.com](http://www.microsoft.com)
- *.microsoftonline.com
- packages.microsoft.com
- dotnet.microsoft.com
- dot.net
- visualstudio.com
- dev.azure.com
- oracle.com
- [www.oracle.com](http://www.oracle.com)
- java.com
- [www.java.com](http://www.java.com)
- java.net
- [www.java.net](http://www.java.net)
- download.oracle.com
- yum.oracle.com

#### 패키지 관리자 - JavaScript/Node

- registry.npmjs.org
- [www.npmjs.com](http://www.npmjs.com)
- [www.npmjs.org](http://www.npmjs.org)
- npmjs.com
- npmjs.org
- yarnpkg.com
- registry.yarnpkg.com

#### 패키지 관리자 - Python

- pypi.org
- [www.pypi.org](http://www.pypi.org)
- files.pythonhosted.org
- pythonhosted.org
- test.pypi.org
- pypi.python.org
- pypa.io
- [www.pypa.io](http://www.pypa.io)

#### 패키지 관리자 - Ruby

- rubygems.org
- [www.rubygems.org](http://www.rubygems.org)
- api.rubygems.org
- index.rubygems.org
- ruby-lang.org
- [www.ruby-lang.org](http://www.ruby-lang.org)
- rubyforge.org
- [www.rubyforge.org](http://www.rubyforge.org)
- rubyonrails.org
- [www.rubyonrails.org](http://www.rubyonrails.org)
- rvm.io
- get.rvm.io

#### 패키지 관리자 - Rust

- crates.io
- [www.crates.io](http://www.crates.io)
- static.crates.io
- rustup.rs
- static.rust-lang.org
- [www.rust-lang.org](http://www.rust-lang.org)

#### 패키지 관리자 - Go

- proxy.golang.org
- sum.golang.org
- index.golang.org
- golang.org
- [www.golang.org](http://www.golang.org)
- goproxy.io
- pkg.go.dev

#### 패키지 관리자 - JVM

- maven.org
- repo.maven.org
- central.maven.org
- repo1.maven.org
- jcenter.bintray.com
- gradle.org
- [www.gradle.org](http://www.gradle.org)
- services.gradle.org
- spring.io
- repo.spring.io

#### 패키지 관리자 - 기타 언어

- packagist.org (PHP Composer)
- [www.packagist.org](http://www.packagist.org)
- repo.packagist.org
- nuget.org (.NET NuGet)
- [www.nuget.org](http://www.nuget.org)
- api.nuget.org
- pub.dev (Dart/Flutter)
- api.pub.dev
- hex.pm (Elixir/Erlang)
- [www.hex.pm](http://www.hex.pm)
- cpan.org (Perl CPAN)
- [www.cpan.org](http://www.cpan.org)
- metacpan.org
- [www.metacpan.org](http://www.metacpan.org)
- api.metacpan.org
- cocoapods.org (iOS/macOS)
- [www.cocoapods.org](http://www.cocoapods.org)
- cdn.cocoapods.org
- haskell.org
- [www.haskell.org](http://www.haskell.org)
- hackage.haskell.org
- swift.org
- [www.swift.org](http://www.swift.org)

#### Linux 배포판

- archive.ubuntu.com
- security.ubuntu.com
- ubuntu.com
- [www.ubuntu.com](http://www.ubuntu.com)
- *.ubuntu.com
- ppa.launchpad.net
- launchpad.net
- [www.launchpad.net](http://www.launchpad.net)

#### 개발 도구 및 플랫폼

- dl.k8s.io (Kubernetes)
- pkgs.k8s.io
- k8s.io
- [www.k8s.io](http://www.k8s.io)
- releases.hashicorp.com (HashiCorp)
- apt.releases.hashicorp.com
- rpm.releases.hashicorp.com
- archive.releases.hashicorp.com
- hashicorp.com
- [www.hashicorp.com](http://www.hashicorp.com)
- repo.anaconda.com (Anaconda/Conda)
- conda.anaconda.org
- anaconda.org
- [www.anaconda.com](http://www.anaconda.com)
- anaconda.com
- continuum.io
- apache.org (Apache)
- [www.apache.org](http://www.apache.org)
- archive.apache.org
- downloads.apache.org
- eclipse.org (Eclipse)
- [www.eclipse.org](http://www.eclipse.org)
- download.eclipse.org
- nodejs.org (Node.js)
- [www.nodejs.org](http://www.nodejs.org)

#### 클라우드 서비스 및 모니터링

- statsig.com
- [www.statsig.com](http://www.statsig.com)
- api.statsig.com
- *.sentry.io

#### 콘텐츠 전송 및 미러

- *.sourceforge.net
- packagecloud.io
- *.packagecloud.io

#### 스키마 및 구성

- json-schema.org
- [www.json-schema.org](http://www.json-schema.org)
- json.schemastore.org
- [www.schemastore.org](http://www.schemastore.org)

> `*`로 표시된 도메인은 와일드카드 서브도메인 매칭을 나타냅니다. 예를 들어, `*.gcr.io`는 `gcr.io`의 모든 서브도메인에 대한 액세스를 허용합니다.

### 맞춤형 네트워크 액세스를 위한 보안 모범 사례

- **최소 권한 원칙**: 필요한 최소한의 네트워크 액세스만 활성화
- **정기적인 감사**: 허용된 도메인을 주기적으로 검토
- **HTTPS 사용**: 항상 HTTP보다 HTTPS 엔드포인트 선호

## 보안 및 격리

- **격리된 가상 머신**: 각 세션은 Anthropic 관리 VM에서 격리되어 실행됩니다
- **네트워크 액세스 제어**: 네트워크 액세스는 기본적으로 제한되며 비활성화할 수 있습니다

> 네트워크 액세스가 비활성화된 상태로 실행할 때 Claude Code는 Anthropic API와 통신할 수 있으며, 이는 여전히 격리된 Claude Code VM에서 데이터가 나갈 수 있게 합니다.

- **자격 증명 보호**: 민감한 자격 증명(git 자격 증명 또는 서명 키 등)은 Claude Code가 있는 샌드박스 내에 절대 없습니다. 인증은 범위가 지정된 자격 증명을 사용하는 보안 프록시를 통해 처리됩니다
- **안전한 분석**: PR을 생성하기 전에 격리된 VM 내에서 코드가 분석되고 수정됩니다

## 가격 및 속도 제한

## 제한 사항

- **저장소 인증**: 동일한 계정으로 인증된 경우에만 웹에서 로컬로 세션을 이동할 수 있습니다
- **플랫폼 제한**: 웹에서의 Claude Code는 GitHub에서 호스팅되는 코드에서만 작동합니다. GitLab 및 기타 비-GitHub 저장소는 클라우드 세션에서 사용할 수 없습니다

## 모범 사례

- **Claude Code 훅 사용**: 환경 설정 및 의존성 설치를 자동화하기 위해 [SessionStart 훅](/docs/en/hooks#sessionstart)을 구성하세요.
- **요구 사항 문서화**: `CLAUDE.md` 파일에 의존성과 명령을 명확하게 지정하세요. `AGENTS.md` 파일이 있는 경우 `CLAUDE.md`에서 `@AGENTS.md`를 사용하여 소스로 지정하여 단일 진실 소스를 유지할 수 있습니다.

## 관련 리소스

- [훅 구성](/docs/en/hooks)
- [설정 레퍼런스](/docs/en/settings)
- [보안](/docs/en/security)
- [데이터 사용](/docs/en/data-usage)

이 페이지가 도움이 되었나요?
