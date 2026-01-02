# Claude Code on the web

***Update:** Claude Code on the web is now available in research preview for Team and Enterprise users with premium seats, in addition to Pro and Max users. Claude Code on the web is on by default for these users, and account admins can toggle access in the Claude settings. November 12, 2025*

Today, we're introducing Claude Code on the web, a new way to delegate coding tasks directly from your browser.

Now in beta as a research preview, you can assign multiple coding tasks to Claude that run on Anthropic-managed cloud infrastructure, perfect for tackling bug backlogs, routine fixes, or parallel development work.

## Run coding tasks in parallel

Claude Code on the web lets you kick off coding sessions without opening your terminal. Connect your GitHub repositories, describe what you need, and Claude handles the implementation.

Each session runs in its own isolated environment with real-time progress tracking, and you can actively steer Claude to adjust course as it's working through tasks.

<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/s-avRazvmLg?autoplay=0&mute=1&controls=1&origin=https%3A%2F%2Fwww.staging.ant.dev&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Fwww.staging.ant.dev%2Fnews%2Fclaude-code-on-the-web&aoriginsup=1&gporigin=https%3A%2F%2Fwww.staging.ant.dev%2Fantaccess%2Fstructure%2Fposts%3Bnews%3Bbf9ddf12-70b1-493c-b667-b2c908f0bcb7%252Cview%253Dpreview&vf=1" frameborder="0" allowfullscreen></iframe>

With Claude Code running in the cloud, you can now **run multiple tasks in parallel** across different repositories from a single interface and **ship faster** with automatic PR creation and clear change summaries.

## Flexible for every workflow

The web interface complements your existing Claude Code workflow. Running tasks in the cloud is especially effective for:

- Answering questions about how projects work and how repositories are mapped
- Bugfixes and routine, well-defined tasks
- Backend changes, where Claude Code can use test-driven development to verify changes

You can also use Claude Code on mobile. As part of this research preview, we're making Claude Code available on our iOS app so developers can explore coding with Claude on the go. It's an early preview, and we hope to quickly refine the mobile experience based on your feedback.

## Security-first cloud execution

Every Claude Code task runs in an isolated sandbox environment with network and filesystem restrictions. Git interactions are handled through a secure proxy service that ensures Claude can only access authorized repositories—helping keep your code and credentials protected throughout the entire workflow.

You can also add custom network configuration to choose what domains Claude Code can connect to from its sandbox. For example, you can allow Claude to download npm packages over the internet so that it can run tests and validate changes.

Read our [engineering blog](https://www.anthropic.com/engineering/claude-code-sandboxing) and [documentation](https://docs.claude.com/en/docs/claude-code/sandboxing) for a deep dive on Claude Code's sandboxing approach.

## Getting started

Claude Code on the web is available now in research preview for Pro and Max users. Visit [claude.com/code](http://claude.com/code) to connect your first repository and start delegating tasks.

Cloud-based sessions share rate limits with all other Claude Code usage. [Explore our documentation](https://docs.claude.com/en/docs/claude-code/claude-code-on-the-web) to learn more.
