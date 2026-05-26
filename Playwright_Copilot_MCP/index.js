// index.js
import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

// Load manifest
const manifest = JSON.parse(fs.readFileSync('./mcp.json', 'utf-8'));

// Endpoint to list tools
app.get('/tools', (req, res) => {
  res.json(manifest.tools);
});

// Endpoint to run a tool dynamically
app.post('/run', (req, res) => {
  const { toolName } = req.body;
  const tool = manifest.tools.find(t => t.name === toolName);

  if (!tool) {
    return res.status(404).json({ error: `Tool ${toolName} not found` });
  }

  exec(tool.command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ output: stdout, errors: stderr });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MCP server running on http://localhost:${PORT}`);
});