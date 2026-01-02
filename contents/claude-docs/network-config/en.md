# Enterprise network configuration

English

# Enterprise network configuration

Configure Claude Code for enterprise environments with proxy servers, custom Certificate Authorities (CA), and mutual Transport Layer Security (mTLS) authentication.

> All environment variables shown on this page can also be configured in `settings.json`.

## Proxy configuration

### Environment variables

```
# HTTPS proxy (recommended)
export HTTPS_PROXY=https://proxy.example.com:8080

# HTTP proxy (if HTTPS not available)
export HTTP_PROXY=http://proxy.example.com:8080

# Bypass proxy for specific requests - space-separated format
export NO_PROXY="localhost 192.168.1.1 example.com .example.com"
# Bypass proxy for specific requests - comma-separated format
export NO_PROXY="localhost,192.168.1.1,example.com,.example.com"
# Bypass proxy for all requests
export NO_PROXY="*"
```

> Claude Code does not support SOCKS proxies.

### Basic authentication

```
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

> Avoid hardcoding passwords in scripts. Use environment variables or secure credential storage instead.

> For proxies requiring advanced authentication (NTLM, Kerberos, etc.), consider using an LLM Gateway service that supports your authentication method.

## Custom CA certificates

```
export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
```

## mTLS authentication

```
# Client certificate for authentication
export CLAUDE_CODE_CLIENT_CERT=/path/to/client-cert.pem

# Client private key
export CLAUDE_CODE_CLIENT_KEY=/path/to/client-key.pem

# Optional: Passphrase for encrypted private key
export CLAUDE_CODE_CLIENT_KEY_PASSPHRASE="your-passphrase"
```

## Network access requirements

- `api.anthropic.com` - Claude API endpoints
- `claude.ai` - WebFetch safeguards
- `statsig.anthropic.com` - Telemetry and metrics
- `sentry.io` - Error reporting

## Additional resources

- [Claude Code settings](/docs/en/settings)
- [Environment variables reference](/docs/en/settings#environment-variables)
- [Troubleshooting guide](/docs/en/troubleshooting)

Was this page helpful?
