# Claude Code on the web

English

# Claude Code on the web

Run Claude Code tasks asynchronously on secure cloud infrastructure

> Claude Code on the web is currently in research preview.

## What is Claude Code on the web?

- **Answering questions**: Ask about code architecture and how features are implemented
- **Bug fixes and routine tasks**: Well-defined tasks that don’t require frequent steering
- **Parallel work**: Tackle multiple bug fixes in parallel
- **Repositories not on your local machine**: Work on code you don’t have checked out locally
- **Backend changes**: Where Claude Code can write tests and then write code to pass those tests
- **On the go**: Kick off tasks while commuting or away from laptop
- **Monitoring**: Watch the trajectory and steer the agent’s work

## Who can use Claude Code on the web?

- **Pro users**
- **Max users**
- **Team premium seat users**
- **Enterprise premium seat users**

## Getting started

- Visit [claude.ai/code](https://claude.ai/code)
- Connect your GitHub account
- Install the Claude GitHub app in your repositories
- Select your default environment
- Submit your coding task
- Review changes and create a pull request in GitHub

## How it works

- **Repository cloning**: Your repository is cloned to an Anthropic-managed virtual machine
- **Environment setup**: Claude prepares a secure cloud environment with your code
- **Network configuration**: Internet access is configured based on your settings
- **Task execution**: Claude analyzes code, makes changes, runs tests, and checks its work
- **Completion**: You’re notified when finished and can create a PR with the changes
- **Results**: Changes are pushed to a branch, ready for pull request creation

## Moving tasks between web and terminal

### From web to terminal

- Click the “Open in CLI” button
- Paste and run the command in your terminal in a checkout of the repo
- Any existing local changes will be stashed, and the remote session will be loaded
- Continue working locally

## Cloud environment

### Default image

- Popular programming languages and runtimes
- Common build tools and package managers
- Testing frameworks and linters

#### Checking available tools

```
check-tools
```

- Programming languages and their versions
- Available package managers
- Installed development tools

#### Language-specific setups

- **Python**: Python 3.x with pip, poetry, and common scientific libraries
- **Node.js**: Latest LTS versions with npm, yarn, pnpm, and bun
- **Ruby**: Versions 3.1.6, 3.2.6, 3.3.6 (default: 3.3.6) with gem, bundler, and rbenv for version management
- **PHP**: Version 8.4.14
- **Java**: OpenJDK with Maven and Gradle
- **Go**: Latest stable version with module support
- **Rust**: Rust toolchain with cargo
- **C++**: GCC and Clang compilers

#### Databases

- **PostgreSQL**: Version 16
- **Redis**: Version 7.0

### Environment configuration

- **Environment preparation**: We clone your repository and run any configured Claude hooks for initialization. The repo will be cloned with the default branch on your GitHub repo. If you would like to check out a specific branch, you can specify that in the prompt.
- **Network configuration**: We configure internet access for the agent. Internet access is limited by default, but you can configure the environment to have no internet or full internet access based on your needs.
- **Claude Code execution**: Claude Code runs to complete your task, writing code, running tests, and checking its work. You can guide and steer Claude throughout the session via the web interface. Claude respects context you’ve defined in your `CLAUDE.md`.
- **Outcome**: When Claude completes its work, it will push the branch to remote. You will be able to create a PR for the branch.

> Claude operates entirely through the terminal and CLI tools available in the environment. It uses the pre-installed tools in the universal image and any additional tools you install through hooks or dependency management.

> Environment variables must be specified as key-value pairs, in `.env` format. For example:CopyAsk AIAPI_KEY=your_api_key
> DEBUG=true

```
API_KEY=your_api_key
DEBUG=true
```

### Dependency management

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

#### Local vs remote execution

```
#!/bin/bash

# Example: Only run in remote environments
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

npm install
pip install -r requirements.txt
```

#### Persisting environment variables

## Network access and security

### Network policy

#### GitHub proxy

- Manages GitHub authentication securely - the git client uses a scoped credential inside the sandbox, which the proxy verifies and translates to your actual GitHub authentication token
- Restricts git push operations to the current working branch for safety
- Enables seamless cloning, fetching, and PR operations while maintaining security boundaries

#### Security proxy

- Protection against malicious requests
- Rate limiting and abuse prevention
- Content filtering for enhanced security

### Access levels

### Default allowed domains

#### Anthropic Services

- api.anthropic.com
- statsig.anthropic.com
- claude.ai

#### Version Control

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

#### Container Registries

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

#### Cloud Platforms

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

#### Package Managers - JavaScript/Node

- registry.npmjs.org
- [www.npmjs.com](http://www.npmjs.com)
- [www.npmjs.org](http://www.npmjs.org)
- npmjs.com
- npmjs.org
- yarnpkg.com
- registry.yarnpkg.com

#### Package Managers - Python

- pypi.org
- [www.pypi.org](http://www.pypi.org)
- files.pythonhosted.org
- pythonhosted.org
- test.pypi.org
- pypi.python.org
- pypa.io
- [www.pypa.io](http://www.pypa.io)

#### Package Managers - Ruby

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

#### Package Managers - Rust

- crates.io
- [www.crates.io](http://www.crates.io)
- static.crates.io
- rustup.rs
- static.rust-lang.org
- [www.rust-lang.org](http://www.rust-lang.org)

#### Package Managers - Go

- proxy.golang.org
- sum.golang.org
- index.golang.org
- golang.org
- [www.golang.org](http://www.golang.org)
- goproxy.io
- pkg.go.dev

#### Package Managers - JVM

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

#### Package Managers - Other Languages

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

#### Linux Distributions

- archive.ubuntu.com
- security.ubuntu.com
- ubuntu.com
- [www.ubuntu.com](http://www.ubuntu.com)
- *.ubuntu.com
- ppa.launchpad.net
- launchpad.net
- [www.launchpad.net](http://www.launchpad.net)

#### Development Tools & Platforms

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

#### Cloud Services & Monitoring

- statsig.com
- [www.statsig.com](http://www.statsig.com)
- api.statsig.com
- *.sentry.io

#### Content Delivery & Mirrors

- *.sourceforge.net
- packagecloud.io
- *.packagecloud.io

#### Schema & Configuration

- json-schema.org
- [www.json-schema.org](http://www.json-schema.org)
- json.schemastore.org
- [www.schemastore.org](http://www.schemastore.org)

> Domains marked with `*` indicate wildcard subdomain matching. For example, `*.gcr.io` allows access to any subdomain of `gcr.io`.

### Security best practices for customized network access

- **Principle of least privilege**: Only enable the minimum network access required
- **Audit regularly**: Review allowed domains periodically
- **Use HTTPS**: Always prefer HTTPS endpoints over HTTP

## Security and isolation

- **Isolated virtual machines**: Each session runs in an isolated, Anthropic-managed VM
- **Network access controls**: Network access is limited by default, and can be disabled

> When running with network access disabled, Claude Code is allowed to communicate with the Anthropic API which may still allow data to exit the isolated Claude Code VM.

- **Credential protection**: Sensitive credentials (such as git credentials or signing keys) are never inside the sandbox with Claude Code. Authentication is handled through a secure proxy using scoped credentials
- **Secure analysis**: Code is analyzed and modified within isolated VMs before creating PRs

## Pricing and rate limits

## Limitations

- **Repository authentication**: You can only move sessions from web to local when you are authenticated to the same account
- **Platform restrictions**: Claude Code on the web only works with code hosted in GitHub. GitLab and other non-GitHub repositories cannot be used with cloud sessions

## Best practices

- **Use Claude Code hooks**: Configure [SessionStart hooks](/docs/en/hooks#sessionstart) to automate environment setup and dependency installation.
- **Document requirements**: Clearly specify dependencies and commands in your `CLAUDE.md` file. If you have an `AGENTS.md` file, you can source it in your `CLAUDE.md` using `@AGENTS.md` to maintain a single source of truth.

## Related resources

- [Hooks configuration](/docs/en/hooks)
- [Settings reference](/docs/en/settings)
- [Security](/docs/en/security)
- [Data usage](/docs/en/data-usage)

Was this page helpful?
