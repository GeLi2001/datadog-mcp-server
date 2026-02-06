# Datadog MCP Server

[![CI](https://github.com/dreamiurg/datadog-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamiurg/datadog-mcp-server/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/dreamiurg/datadog-mcp-server/graph/badge.svg)](https://codecov.io/gh/dreamiurg/datadog-mcp-server)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dreamiurg/datadog-mcp-server/badge)](https://scorecard.dev/viewer/?uri=github.com/dreamiurg/datadog-mcp-server)

> **Query Datadog from AI assistants.** Access monitors, dashboards, logs, metrics, incidents, and APM traces directly from Claude, Cursor, VS Code, and other MCP-compatible clients.


---

## Why Use This?

| Without MCP | With Datadog MCP Server |
|-------------|------------------------|
| Switch to Datadog UI, search, copy-paste | Ask: *"Show me failing monitors"* |
| Navigate dashboards manually | Ask: *"What's on our API latency dashboard?"* |
| Write log queries, export results | Ask: *"Find errors in auth service last hour"* |
| Check multiple tabs during incidents | Ask: *"Summarize active incidents"* |

**Perfect for:** Debugging sessions, incident response, on-call rotations, and daily observability tasks.

---

## Quick Start

```bash
npx github:dreamiurg/datadog-mcp-server --help
```

**That's it.** No installation required. Works with Node.js 20+.

---

## Setup

### 1. Get Datadog Credentials

You need two keys from your [Datadog Organization Settings](https://app.datadoghq.com/organization-settings/):

| Credential | Where to Find |
|------------|---------------|
| **API Key** | Organization Settings → API Keys → New Key |
| **Application Key** | Organization Settings → Application Keys → New Key |

> **Tip:** For least-privilege access, [scope your Application Key](#application-key-scopes) to only the permissions you need.

### 2. Configure Your AI Tool

<details>
<summary><strong>Claude Code (CLI)</strong></summary>

```bash
claude mcp add datadog -- npx github:dreamiurg/datadog-mcp-server \
  --apiKey YOUR_API_KEY \
  --appKey YOUR_APP_KEY \
  --site datadoghq.com
```

Or add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["github:dreamiurg/datadog-mcp-server", "--apiKey", "YOUR_API_KEY", "--appKey", "YOUR_APP_KEY"]
    }
  }
}
```
</details>

<details>
<summary><strong>Claude Desktop</strong></summary>

Add to your config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["github:dreamiurg/datadog-mcp-server", "--apiKey", "YOUR_API_KEY", "--appKey", "YOUR_APP_KEY"]
    }
  }
}
```
</details>

<details>
<summary><strong>Cursor / VS Code / Windsurf</strong></summary>

| Tool | Config File |
|------|-------------|
| Cursor | `~/.cursor/mcp.json` or `.cursor/mcp.json` (project) |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |
| VS Code | User Settings JSON (`Ctrl+Shift+P` → "Open User Settings (JSON)") |

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["github:dreamiurg/datadog-mcp-server", "--apiKey", "YOUR_API_KEY", "--appKey", "YOUR_APP_KEY"]
    }
  }
}
```
</details>

<details>
<summary><strong>Gemini CLI</strong></summary>

Add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["github:dreamiurg/datadog-mcp-server", "--apiKey", "YOUR_API_KEY", "--appKey", "YOUR_APP_KEY"]
    }
  }
}
```
</details>

<details>
<summary><strong>Codex CLI (OpenAI)</strong></summary>

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.datadog]
command = "npx"
args = ["github:dreamiurg/datadog-mcp-server", "--apiKey", "YOUR_API_KEY", "--appKey", "YOUR_APP_KEY"]
```
</details>

---

## Available Tools

| Tool | Description | Example Prompt |
|------|-------------|----------------|
| `get-monitors` | List monitors (filter by state, tags) | *"Show all alerting monitors"* |
| `get-monitor` | Get monitor details by ID | *"Get details for monitor 12345"* |
| `get-dashboards` | List all dashboards | *"What dashboards do we have?"* |
| `get-dashboard` | Get dashboard by ID | *"Show the API metrics dashboard"* |
| `get-metrics` | List available metrics | *"What metrics are available?"* |
| `get-metric-metadata` | Get metric metadata | *"Describe the cpu.user metric"* |
| `get-events` | Fetch events in time range | *"What events happened today?"* |
| `get-incidents` | List incidents | *"Show active incidents"* |
| `search-logs` | Search logs with queries | *"Find errors in prod last hour"* |
| `aggregate-logs` | Analytics on log data | *"Count errors by service"* |
| `get-hosts` | List infrastructure hosts | *"Show all production hosts"* |
| `get-downtimes` | List scheduled maintenance windows | *"Are there any active downtimes?"* |
| `get-slos` | List Service Level Objectives | *"Which SLOs are breaching?"* |
| `get-slo` | Get SLO details by ID | *"Show error budget for SLO xyz"* |
| `search-spans` | Search APM spans/traces | *"Find slow requests in payment service"* |
| `aggregate-spans` | Compute APM statistics | *"Show p99 latency by service"* |
| `get-services` | List APM-instrumented services | *"What services are being traced?"* |
| `get-trace` | Get full trace by ID | *"Show all spans for trace abc123"* |
| `search-security-findings` | List/search Cloud Security findings | *"Find high-severity cloud security findings"* |
| `get-security-finding` | Get legacy CSPM/CIEM finding by ID | *"Get finding abc123"* |
| `list-posture-findings` | List legacy CSPM/CIEM posture findings | *"List compliance findings that failed"* |

---

## Configuration Reference

### Regional Endpoints

Set `--site` for your Datadog region:

| Region | Site Value |
|--------|------------|
| US (default) | `datadoghq.com` |
| EU | `datadoghq.eu` |
| US3 (GovCloud) | `ddog-gov.com` |
| US5 | `us5.datadoghq.com` |
| AP1 | `ap1.datadoghq.com` |

### Environment Variables

Alternative to command-line arguments:

```bash
DD_API_KEY=your_api_key
DD_APP_KEY=your_app_key
DD_SITE=datadoghq.com          # Optional, defaults to datadoghq.com
DD_LOGS_SITE=logs.datadoghq.com # Optional, override for logs API
DD_METRICS_SITE=api.datadoghq.com # Optional, override for metrics API
```

### Logging

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `LOG_LEVEL` | `debug`, `info`, `warn`, `error` | `info` | Minimum log level |
| `LOG_FORMAT` | `json`, `pretty` | `json` | Output format (`pretty` for local dev) |

```bash
# Pretty logs for development
LOG_FORMAT=pretty npx github:dreamiurg/datadog-mcp-server --apiKey ... --appKey ...
```

---

## Application Key Scopes

For least-privilege security, create an Application Key with only required scopes:

| Tools | Required Scope |
|-------|----------------|
| `get-monitors`, `get-monitor` | `monitors_read` |
| `get-dashboards`, `get-dashboard` | `dashboards_read` |
| `get-metrics`, `get-metric-metadata` | `metrics_read` |
| `get-events` | `events_read` |
| `search-logs`, `aggregate-logs` | `logs_read_data` |
| `get-incidents` | `incident_read` |
| `get-hosts` | `hosts_read` |
| `get-downtimes` | `monitors_downtime` |
| `get-slos`, `get-slo` | `slos_read` |
| `search-spans`, `aggregate-spans`, `get-trace` | `apm_read` |
| `get-services` | `apm_service_catalog_read` |
| `search-security-findings` | `security_monitoring_findings_read` (or `appsec_vm_read`; OAuth apps still require `security_monitoring_findings_read`) |
| `get-security-finding`, `list-posture-findings` | `security_monitoring_findings_read` |

**Create a scoped key:** Organization Settings → Application Keys → New Key → Select scopes

---

## Troubleshooting

<details>
<summary><strong>403 Forbidden</strong></summary>

1. Verify API key and Application key are correct
2. Check your Application Key has required [scopes](#application-key-scopes)
3. Confirm you're using the correct [regional endpoint](#regional-endpoints)
</details>

<details>
<summary><strong>Connection Issues</strong></summary>

```bash
# Check MCP server status
claude mcp list

# View logs (Claude Desktop - macOS)
tail -f ~/Library/Logs/Claude/mcp*.log

# View logs (Claude Desktop - Windows)
Get-Content "$env:APPDATA\Claude\Logs\mcp*.log" -Tail 20 -Wait
```
</details>

<details>
<summary><strong>Debug Mode</strong></summary>

```bash
LOG_LEVEL=debug LOG_FORMAT=pretty npx github:dreamiurg/datadog-mcp-server --apiKey ... --appKey ...
```
</details>

---

## Development

```bash
git clone https://github.com/dreamiurg/datadog-mcp-server.git
cd datadog-mcp-server
npm install
npm run build
npm test
```

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run linter |
| `npm run typecheck` | Type check |

### Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js \
  --apiKey=YOUR_API_KEY \
  --appKey=YOUR_APP_KEY
```

---

## License

[MIT](LICENSE) - Use freely in personal and commercial projects.
