# Sandboxing

English

# Sandboxing

Learn how Claude Code’s sandboxed bash tool provides filesystem and network isolation for safer, more autonomous agent execution.

## Overview

## Why sandboxing matters

- **Approval fatigue**: Repeatedly clicking “approve” can cause users to pay less attention to what they’re approving
- **Reduced productivity**: Constant interruptions slow down development workflows
- **Limited autonomy**: Claude Code cannot work as efficiently when waiting for approvals
- **Defining clear boundaries**: Specify exactly which directories and network hosts Claude Code can access
- **Reducing permission prompts**: Safe commands within the sandbox don’t require approval
- **Maintaining security**: Attempts to access resources outside the sandbox trigger immediate notifications
- **Enabling autonomy**: Claude Code can run more independently within defined limits

> Effective sandboxing requires **both** filesystem and network isolation. Without network isolation, a compromised agent could exfiltrate sensitive files like SSH keys. Without filesystem isolation, a compromised agent could backdoor system resources to gain network access. When configuring sandboxing it is important to ensure that your configured settings do not create bypasses in these systems.

## How it works

### Filesystem isolation

- **Default writes behavior**: Read and write access to the current working directory and its subdirectories
- **Default read behavior**: Read access to the entire computer, except certain denied directories
- **Blocked access**: Cannot modify files outside the current working directory without explicit permission
- **Configurable**: Define custom allowed and denied paths through settings

### Network isolation

- **Domain restrictions**: Only approved domains can be accessed
- **User confirmation**: New domain requests trigger permission prompts
- **Custom proxy support**: Advanced users can implement custom rules on outgoing traffic
- **Comprehensive coverage**: Restrictions apply to all scripts, programs, and subprocesses spawned by commands

### OS-level enforcement

- **Linux**: Uses [bubblewrap](https://github.com/containers/bubblewrap) for isolation
- **macOS**: Uses Seatbelt for sandbox enforcement

## Getting started

### Enable sandboxing

```
> /sandbox
```

### Sandbox modes

> Auto-allow mode works independently of your permission mode setting. Even if you’re not in “accept edits” mode, sandboxed bash commands will run automatically when auto-allow is enabled. This means bash commands that modify files within the sandbox boundaries will execute without prompting, even when file edit tools would normally require approval.

### Configure sandboxing

> Not all commands are compatible with sandboxing out of the box. Some notes that may help you make the most out of the sandbox:
> Many CLI tools require accessing certain hosts. As you use these tools, they will request permission to access certain hosts. Granting permission will allow them to access these hosts now and in the future, enabling them to safely execute inside the sandbox.
> `watchman` is incompatible with running in the sandbox. If you’re running `jest`, consider using `jest --no-watchman`
> `docker` is incompatible with running in the sandbox. Consider specifying `docker` in `excludedCommands` to force it to run outside of the sandbox.

- Many CLI tools require accessing certain hosts. As you use these tools, they will request permission to access certain hosts. Granting permission will allow them to access these hosts now and in the future, enabling them to safely execute inside the sandbox.
- `watchman` is incompatible with running in the sandbox. If you’re running `jest`, consider using `jest --no-watchman`
- `docker` is incompatible with running in the sandbox. Consider specifying `docker` in `excludedCommands` to force it to run outside of the sandbox.

> Claude Code includes an intentional escape hatch mechanism that allows commands to run outside the sandbox when necessary. When a command fails due to sandbox restrictions (such as network connectivity issues or incompatible tools), Claude is prompted to analyze the failure and may retry the command with the `dangerouslyDisableSandbox` parameter. Commands that use this parameter go through the normal Claude Code permissions flow requiring user permission to execute. This allows Claude Code to handle edge cases where certain tools or network operations cannot function within sandbox constraints.You can disable this escape hatch by setting `"allowUnsandboxedCommands": false` in your [sandbox settings](/docs/en/settings#sandbox-settings). When disabled, the `dangerouslyDisableSandbox` parameter is completely ignored and all commands must run sandboxed or be explicitly listed in `excludedCommands`.

## Security benefits

### Protection against prompt injection

- Cannot modify critical config files such as `~/.bashrc`
- Cannot modify system-level files in `/bin/`
- Cannot read files that are denied in your [Claude permission settings](/docs/en/iam#configuring-permissions)
- Cannot exfiltrate data to attacker-controlled servers
- Cannot download malicious scripts from unauthorized domains
- Cannot make unexpected API calls to unapproved services
- Cannot contact any domains not explicitly allowed
- All access attempts outside the sandbox are blocked at the OS level
- You receive immediate notifications when boundaries are tested
- You can choose to deny, allow once, or permanently update your configuration

### Reduced attack surface

- **Malicious dependencies**: NPM packages or other dependencies with harmful code
- **Compromised scripts**: Build scripts or tools with security vulnerabilities
- **Social engineering**: Attacks that trick users into running dangerous commands
- **Prompt injection**: Attacks that trick Claude into running dangerous commands

### Transparent operation

- The operation is blocked at the OS level
- You receive an immediate notification
- You can choose to:

Deny the request
Allow it once
Update your sandbox configuration to permanently allow it
- Deny the request
- Allow it once
- Update your sandbox configuration to permanently allow it

## Security Limitations

- Network Sandboxing Limitations: The network filtering system operates by restricting the domains that processes are allowed to connect to. It does not otherwise inspect the traffic passing through the proxy and users are responsible for ensuring they only allow trusted domains in their policy.

> Users should be aware of potential risks that come from allowing broad domains like `github.com` that may allow for data exfiltration. Also, in some cases it may be possible to bypass the network filtering through [domain fronting](https://en.wikipedia.org/wiki/Domain_fronting).

- Privilege Escalation via Unix Sockets: The `allowUnixSockets` configuration can inadvertently grant access to powerful system services that could lead to sandbox bypasses. For example, if it is used to allow access to `/var/run/docker.sock` this would effectively grant access to the host system through exploiting the docker socket. Users are encouraged to carefully consider any unix sockets that they allow through the sandbox.
- Filesystem Permission Escalation: Overly broad filesystem write permissions can enable privilege escalation attacks. Allowing writes to directories containing executables in `$PATH`, system configuration directories, or user shell configuration files (`.bashrc`, `.zshrc`) can lead to code execution in different security contexts when other users or system processes access these files.
- Linux Sandbox Strength: The Linux implementation provides strong filesystem and network isolation but includes an `enableWeakerNestedSandbox` mode that enables it to work inside of Docker environments without privileged namespaces. This option considerably weakens security and should only be used in cases where additional isolation is otherwise enforced.

## Advanced usage

### Custom proxy configuration

- Decrypt and inspect HTTPS traffic
- Apply custom filtering rules
- Log all network requests
- Integrate with existing security infrastructure

```
{
  "sandbox": {
    "network": {
      "httpProxyPort": 8080,
      "socksProxyPort": 8081
    }
  }
}
```

### Integration with existing security tools

- **IAM policies**: Combine with [permission settings](/docs/en/iam) for defense-in-depth
- **Development containers**: Use with [devcontainers](/docs/en/devcontainer) for additional isolation
- **Enterprise policies**: Enforce sandbox configurations through [managed settings](/docs/en/settings#settings-precedence)

## Best practices

- **Start restrictive**: Begin with minimal permissions and expand as needed
- **Monitor logs**: Review sandbox violation attempts to understand Claude Code’s needs
- **Use environment-specific configs**: Different sandbox rules for development vs. production contexts
- **Combine with permissions**: Use sandboxing alongside IAM policies for comprehensive security
- **Test configurations**: Verify your sandbox settings don’t block legitimate workflows

## Open source

```
npx @anthropic-ai/sandbox-runtime <command-to-sandbox>
```

## Limitations

- **Performance overhead**: Minimal, but some filesystem operations may be slightly slower
- **Compatibility**: Some tools that require specific system access patterns may need configuration adjustments, or may even need to be run outside of the sandbox
- **Platform support**: Currently supports Linux and macOS; Windows support planned

## See also

- [Security](/docs/en/security) - Comprehensive security features and best practices
- [IAM](/docs/en/iam) - Permission configuration and access control
- [Settings](/docs/en/settings) - Complete configuration reference
- [CLI reference](/docs/en/cli-reference) - Command-line options including `-sb`

Was this page helpful?
