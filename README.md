# Datadog MCP Server

A Model Context Protocol (MCP) server for interacting with the Datadog API.

<a href="https://glama.ai/mcp/servers/@GeLi2001/datadog-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@GeLi2001/datadog-mcp-server/badge" alt="Datadog MCP server" />
</a>

## Features

- **Monitoring**: Access monitor data and configurations
- **Dashboards**: Retrieve and view dashboard definitions
- **Metrics**: Query available metrics and their metadata
- **Events**: Search and retrieve events within timeframes
- **Logs**: Search logs with advanced filtering and sorting options
- **Incidents**: Access incident management data
- **API Integration**: Direct integration with Datadog's v1 and v2 APIs
- **Comprehensive Error Handling**: Clear error messages for API and authentication issues
- **Service-Specific Endpoints**: Support for different endpoints for logs and metrics

## Prerequisites

1. Node.js (version 16 or higher)
2. Datadog account with:
   - API key - Found in Organization Settings > API Keys
   - Application key - Found in Organization Settings > Application Keys

## Application Key Scopes

For improved security, you can scope your Application Key to grant only the minimum permissions required by this MCP server. By default, Application Keys inherit all permissions from the user who created them, but [scoped Application Keys](https://docs.datadoghq.com/account_management/api-app-keys/#scopes) allow you to follow the principle of least privilege.

### Required Scopes

The following scopes are required for the corresponding features:

| Tool(s) | Required Scope | Description |
|---------|----------------|-------------|
| `get-monitors`, `get-monitor` | `monitors_read` | Read access to monitor configurations and states |
| `get-dashboards`, `get-dashboard` | `dashboards_read` | Read access to dashboard definitions |
| `get-metrics`, `get-metric-metadata` | `metrics_read` | Read access to metrics list and metadata |
| `get-events` | `events_read` | Read access to events from the event stream |
| `search-logs`, `aggregate-logs` | `logs_read_data` | Read access to log data for search and aggregation |
| `get-incidents` | `incident_read` | Read access to incident management data |

### Creating a Scoped Application Key

1. Go to **Organization Settings** > **Application Keys**
2. Click **New Key**
3. Enter a name (e.g., "MCP Server - Read Only")
4. Under **Scopes**, select only the permissions you need:
   - For full functionality: `monitors_read`, `dashboards_read`, `metrics_read`, `events_read`, `logs_read_data`, `incident_read`
   - For logs only: `logs_read_data`
   - For monitoring only: `monitors_read`, `dashboards_read`, `metrics_read`
5. Click **Create Key**

> **Note**: If you don't specify any scopes when creating an Application Key, it will have full access with all permissions of the creating user. For production use, we recommend always specifying explicit scopes.

## Installation

### Via npm (recommended)

```bash
npm install -g datadog-mcp-server
```

### From Source

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

You can configure the Datadog MCP server using either environment variables or command-line arguments.

### Environment Variables

Create a `.env` file with your Datadog credentials:

```
DD_API_KEY=your_api_key_here
DD_APP_KEY=your_app_key_here
DD_SITE=datadoghq.com
DD_LOGS_SITE=datadoghq.com
DD_METRICS_SITE=datadoghq.com
```

**Note**: `DD_LOGS_SITE` and `DD_METRICS_SITE` are optional and will default to the value of `DD_SITE` if not specified.

### Command-line Arguments

Basic usage with global site setting:

```bash
datadog-mcp-server --apiKey=your_api_key --appKey=your_app_key --site=datadoghq.eu
```

Advanced usage with service-specific endpoints:

```bash
datadog-mcp-server --apiKey=your_api_key --appKey=your_app_key --site=datadoghq.com --logsSite=logs.datadoghq.com --metricsSite=metrics.datadoghq.com
```

Note: Site arguments don't need `https://` - it will be added automatically.

### Regional Endpoints

Different Datadog regions have different endpoints:

- US (Default): `datadoghq.com`
- EU: `datadoghq.eu`
- US3 (GovCloud): `ddog-gov.com`
- US5: `us5.datadoghq.com`
- AP1: `ap1.datadoghq.com`

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": [
        "datadog-mcp-server",
        "--apiKey",
        "<YOUR_API_KEY>",
        "--appKey",
        "<YOUR_APP_KEY>",
        "--site",
        "<YOUR_DD_SITE>(e.g us5.datadoghq.com)"
      ]
    }
  }
}
```

For more advanced configurations with separate endpoints for logs and metrics:

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": [
        "datadog-mcp-server",
        "--apiKey",
        "<YOUR_API_KEY>",
        "--appKey",
        "<YOUR_APP_KEY>",
        "--site",
        "<YOUR_DD_SITE>",
        "--logsSite",
        "<YOUR_LOGS_SITE>",
        "--metricsSite",
        "<YOUR_METRICS_SITE>"
      ]
    }
  }
}
```

Locations for the Claude Desktop config file:

- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

## Usage with MCP Inspector

To use with the MCP Inspector tool:

```bash
npx @modelcontextprotocol/inspector datadog-mcp-server --apiKey=your_api_key --appKey=your_app_key
```

## Available Tools

The server provides these MCP tools:

- **get-monitors**: Fetch monitors with optional filtering
- **get-monitor**: Get details of a specific monitor by ID
- **get-dashboards**: List all dashboards
- **get-dashboard**: Get a specific dashboard by ID
- **get-metrics**: List available metrics
- **get-metric-metadata**: Get metadata for a specific metric
- **get-events**: Fetch events within a time range
- **get-incidents**: List incidents with optional filtering
- **search-logs**: Search logs with advanced query filtering
- **aggregate-logs**: Perform analytics and aggregations on log data

## Examples

### Example: Get Monitors

```javascript
{
  "method": "tools/call",
  "params": {
    "name": "get-monitors",
    "arguments": {
      "groupStates": ["alert", "warn"],
      "limit": 5
    }
  }
}
```

### Example: Get a Dashboard

```javascript
{
  "method": "tools/call",
  "params": {
    "name": "get-dashboard",
    "arguments": {
      "dashboardId": "abc-def-123"
    }
  }
}
```

### Example: Search Logs

```javascript
{
  "method": "tools/call",
  "params": {
    "name": "search-logs",
    "arguments": {
      "filter": {
        "query": "service:web-app status:error",
        "from": "now-15m",
        "to": "now"
      },
      "sort": "-timestamp",
      "limit": 20
    }
  }
}
```

### Example: Aggregate Logs

```javascript
{
  "method": "tools/call",
  "params": {
    "name": "aggregate-logs",
    "arguments": {
      "filter": {
        "query": "service:web-app",
        "from": "now-1h",
        "to": "now"
      },
      "compute": [
        {
          "aggregation": "count"
        }
      ],
      "groupBy": [
        {
          "facet": "status",
          "limit": 10,
          "sort": {
            "aggregation": "count",
            "order": "desc"
          }
        }
      ]
    }
  }
}
```

### Example: Get Incidents

```javascript
{
  "method": "tools/call",
  "params": {
    "name": "get-incidents",
    "arguments": {
      "includeArchived": false,
      "query": "state:active",
      "pageSize": 10
    }
  }
}
```

## Troubleshooting

If you encounter a 403 Forbidden error, verify that:

1. Your API key and Application key are correct
2. The keys have the necessary permissions to access the requested resources
3. Your account has access to the requested data
4. You're using the correct endpoint for your region (e.g., `datadoghq.eu` for EU customers)

## Debugging

If you encounter issues, check Claude Desktop's MCP logs:

```bash
# On macOS
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log

# On Windows
Get-Content -Path "$env:APPDATA\Claude\Logs\mcp*.log" -Tail 20 -Wait
```

Common issues:

- 403 Forbidden: Authentication issue with Datadog API keys
- API key or App key format invalid: Ensure you're using the full key strings
- Site configuration errors: Make sure you're using the correct Datadog domain
- Endpoint mismatches: Verify that service-specific endpoints are correctly set if you're using separate domains for logs and metrics

## License

MIT
