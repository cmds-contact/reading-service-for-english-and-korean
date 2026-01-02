# Monitoring

English

# Monitoring

Learn how to enable and configure OpenTelemetry for Claude Code.

## Quick start

```
# 1. Enable telemetry
export CLAUDE_CODE_ENABLE_TELEMETRY=1

# 2. Choose exporters (both are optional - configure only what you need)
export OTEL_METRICS_EXPORTER=otlp       # Options: otlp, prometheus, console
export OTEL_LOGS_EXPORTER=otlp          # Options: otlp, console

# 3. Configure OTLP endpoint (for OTLP exporter)
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# 4. Set authentication (if required)
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer your-token"

# 5. For debugging: reduce export intervals
export OTEL_METRIC_EXPORT_INTERVAL=10000  # 10 seconds (default: 60000ms)
export OTEL_LOGS_EXPORT_INTERVAL=5000     # 5 seconds (default: 5000ms)

# 6. Run Claude Code
claude
```

> The default export intervals are 60 seconds for metrics and 5 seconds for logs. During setup, you may want to use shorter intervals for debugging purposes. Remember to reset these for production use.

## Administrator configuration

```
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://collector.company.com:4317",
    "OTEL_EXPORTER_OTLP_HEADERS": "Authorization=Bearer company-token"
  }
}
```

> Managed settings can be distributed via MDM (Mobile Device Management) or other device management solutions. Environment variables defined in the managed settings file have high precedence and cannot be overridden by users.

## Configuration details

### Common configuration variables

### Metrics cardinality control

### Dynamic headers

#### Settings configuration

```
{
  "otelHeadersHelper": "/bin/generate_opentelemetry_headers.sh"
}
```

#### Script requirements

```
#!/bin/bash
# Example: Multiple headers
echo "{\"Authorization\": \"Bearer $(get-token.sh)\", \"X-API-Key\": \"$(get-api-key.sh)\"}"
```

#### Refresh behavior

### Multi-team organization support

```
# Add custom attributes for team identification
export OTEL_RESOURCE_ATTRIBUTES="department=engineering,team.id=platform,cost_center=eng-123"
```

- Filter metrics by team or department
- Track costs per cost center
- Create team-specific dashboards
- Set up alerts for specific teams

> **Important formatting requirements for OTEL_RESOURCE_ATTRIBUTES:**The `OTEL_RESOURCE_ATTRIBUTES` environment variable follows the [W3C Baggage specification](https://www.w3.org/TR/baggage/), which has strict formatting requirements:
> **No spaces allowed**: Values cannot contain spaces. For example, `user.organizationName=My Company` is invalid
> **Format**: Must be comma-separated key=value pairs: `key1=value1,key2=value2`
> **Allowed characters**: Only US-ASCII characters excluding control characters, whitespace, double quotes, commas, semicolons, and backslashes
> **Special characters**: Characters outside the allowed range must be percent-encoded
> **Examples:**CopyAsk AI# ❌ Invalid - contains spaces
> export OTEL_RESOURCE_ATTRIBUTES="org.name=John's Organization"
> 
> # ✅ Valid - use underscores or camelCase instead
> export OTEL_RESOURCE_ATTRIBUTES="org.name=Johns_Organization"
> export OTEL_RESOURCE_ATTRIBUTES="org.name=JohnsOrganization"
> 
> # ✅ Valid - percent-encode special characters if needed
> export OTEL_RESOURCE_ATTRIBUTES="org.name=John%27s%20Organization"
> Note: wrapping values in quotes doesn’t escape spaces. For example, `org.name="My Company"` results in the literal value `"My Company"` (with quotes included), not `My Company`.

- **No spaces allowed**: Values cannot contain spaces. For example, `user.organizationName=My Company` is invalid
- **Format**: Must be comma-separated key=value pairs: `key1=value1,key2=value2`
- **Allowed characters**: Only US-ASCII characters excluding control characters, whitespace, double quotes, commas, semicolons, and backslashes
- **Special characters**: Characters outside the allowed range must be percent-encoded

```
# ❌ Invalid - contains spaces
export OTEL_RESOURCE_ATTRIBUTES="org.name=John's Organization"

# ✅ Valid - use underscores or camelCase instead
export OTEL_RESOURCE_ATTRIBUTES="org.name=Johns_Organization"
export OTEL_RESOURCE_ATTRIBUTES="org.name=JohnsOrganization"

# ✅ Valid - percent-encode special characters if needed
export OTEL_RESOURCE_ATTRIBUTES="org.name=John%27s%20Organization"
```

### Example configurations

```
# Console debugging (1-second intervals)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console
export OTEL_METRIC_EXPORT_INTERVAL=1000

# OTLP/gRPC
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Prometheus
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=prometheus

# Multiple exporters
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console,otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json

# Different endpoints/backends for metrics and logs
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_METRICS_PROTOCOL=http/protobuf
export OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://metrics.company.com:4318
export OTEL_EXPORTER_OTLP_LOGS_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://logs.company.com:4317

# Metrics only (no events/logs)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Events/logs only (no metrics)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

## Available metrics and events

### Standard attributes

### Metrics

### Metric details

#### Session counter

- All [standard attributes](#standard-attributes)

#### Lines of code counter

- `type`: (`"added"`, `"removed"`)

#### Pull request counter

#### Commit counter

#### Cost counter

- `model`: Model identifier (for example, “claude-sonnet-4-5-20250929”)

#### Token counter

- `type`: (`"input"`, `"output"`, `"cacheRead"`, `"cacheCreation"`)

#### Code edit tool decision counter

- `tool`: Tool name (`"Edit"`, `"Write"`, `"NotebookEdit"`)
- `decision`: User decision (`"accept"`, `"reject"`)
- `language`: Programming language of the edited file (for example, `"TypeScript"`, `"Python"`, `"JavaScript"`, `"Markdown"`). Returns `"unknown"` for unrecognized file extensions.

#### Active time counter

### Events

#### User prompt event

- `event.name`: `"user_prompt"`
- `event.timestamp`: ISO 8601 timestamp
- `prompt_length`: Length of the prompt
- `prompt`: Prompt content (redacted by default, enable with `OTEL_LOG_USER_PROMPTS=1`)

#### Tool result event

- `event.name`: `"tool_result"`
- `tool_name`: Name of the tool
- `success`: `"true"` or `"false"`
- `duration_ms`: Execution time in milliseconds
- `error`: Error message (if failed)
- `decision`: Either `"accept"` or `"reject"`
- `source`: Decision source - `"config"`, `"user_permanent"`, `"user_temporary"`, `"user_abort"`, or `"user_reject"`
- `tool_parameters`: JSON string containing tool-specific parameters (when available)

For Bash tool: includes `bash_command`, `full_command`, `timeout`, `description`, `sandbox`
- For Bash tool: includes `bash_command`, `full_command`, `timeout`, `description`, `sandbox`

#### API request event

- `event.name`: `"api_request"`
- `model`: Model used (for example, “claude-sonnet-4-5-20250929”)
- `cost_usd`: Estimated cost in USD
- `duration_ms`: Request duration in milliseconds
- `input_tokens`: Number of input tokens
- `output_tokens`: Number of output tokens
- `cache_read_tokens`: Number of tokens read from cache
- `cache_creation_tokens`: Number of tokens used for cache creation

#### API error event

- `event.name`: `"api_error"`
- `error`: Error message
- `status_code`: HTTP status code (if applicable)
- `attempt`: Attempt number (for retried requests)

#### Tool decision event

- `event.name`: `"tool_decision"`
- `tool_name`: Name of the tool (for example, “Read”, “Edit”, “Write”, “NotebookEdit”)

## Interpreting metrics and events data

### Usage monitoring

### Cost monitoring

- Tracking usage trends across teams or individuals
- Identifying high-usage sessions for optimization

> Cost metrics are approximations. For official billing data, refer to your API provider (Claude Console, AWS Bedrock, or Google Cloud Vertex).

### Alerting and segmentation

- Cost spikes
- Unusual token consumption
- High session volume from specific users

### Event analysis

- Most frequently used tools
- Tool success rates
- Average tool execution times
- Error patterns by tool type

## Backend considerations

### For metrics

- **Time series databases (for example, Prometheus)**: Rate calculations, aggregated metrics
- **Columnar stores (for example, ClickHouse)**: Complex queries, unique user analysis
- **Full-featured observability platforms (for example, Honeycomb, Datadog)**: Advanced querying, visualization, alerting

### For events/logs

- **Log aggregation systems (for example, Elasticsearch, Loki)**: Full-text search, log analysis
- **Columnar stores (for example, ClickHouse)**: Structured event analysis
- **Full-featured observability platforms (for example, Honeycomb, Datadog)**: Correlation between metrics and events

## Service information

- `service.name`: `claude-code`
- `service.version`: Current Claude Code version
- `os.type`: Operating system type (for example, `linux`, `darwin`, `windows`)
- `os.version`: Operating system version string
- `host.arch`: Host architecture (for example, `amd64`, `arm64`)
- `wsl.version`: WSL version number (only present when running on Windows Subsystem for Linux)
- Meter Name: `com.anthropic.claude_code`

## ROI measurement resources

## Security/privacy considerations

- Telemetry is opt-in and requires explicit configuration
- Sensitive information like API keys or file contents are never included in metrics or events
- User prompt content is redacted by default - only prompt length is recorded. To enable user prompt logging, set `OTEL_LOG_USER_PROMPTS=1`

## Monitoring Claude Code on Amazon Bedrock

Was this page helpful?
