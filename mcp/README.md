# Soldgraph MCP server

Connect Claude, Cursor, VS Code or any MCP client to Soldgraph. Your assistant can then search sold and active listings and check card prices, with no code.

- **URL:** `https://api.soldgraph.com/mcp`
- **Auth:** `Authorization: Bearer <your API key>`
- **Transport:** Streamable HTTP

## Claude Code

```bash
claude mcp add --transport http soldgraph https://api.soldgraph.com/mcp \
  --header "Authorization: Bearer $SOLDGRAPH_KEY"
```

## Cursor

`~/.cursor/mcp.json`, or `.cursor/mcp.json` for one project:

```json
{
  "mcpServers": {
    "soldgraph": {
      "url": "https://api.soldgraph.com/mcp",
      "headers": { "Authorization": "Bearer ${env:SOLDGRAPH_KEY}" }
    }
  }
}
```

## VS Code

`.vscode/mcp.json`:

```json
{
  "inputs": [
    { "type": "promptString", "id": "soldgraph-key", "description": "Soldgraph API key", "password": true }
  ],
  "servers": {
    "soldgraph": {
      "type": "http",
      "url": "https://api.soldgraph.com/mcp",
      "headers": { "Authorization": "Bearer ${input:soldgraph-key}" }
    }
  }
}
```

Other clients: [soldgraph.com/docs/guides/mcp](https://soldgraph.com/docs/guides/mcp?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples).
