# Datadog MCP Server

[![smithery badge](https://smithery.ai/badge/@GeLi2001/datadog-mcp-server)](https://smithery.ai/server/@GeLi2001/datadog-mcp-server)
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

## Prerequisites

1. Node.js (version 16 or higher)
2. Datadog account with:
   - API key - Found in Organization Settings > API Keys
   - Application key - Found in Organization Settings > Application Keys

## Installation

### Installing via Smithery

To install Datadog MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@GeLi2001/datadog-mcp-server):

```bash
npx -y @smithery/cli install @GeLi2001/datadog-mcp-server --client claude
```

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
```

### Command-line Arguments

```bash
datadog-mcp-server --apiKey=your_api_key --appKey=your_app_key --site=datadoghq.eu
```

Note: The site argument doesn't need `https://` - it will be added automatically.

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

## License

MIT
