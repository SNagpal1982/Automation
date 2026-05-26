// index.js
import { exec } from 'child_process';
import fs from 'fs';

// Load manifest
const manifest = JSON.parse(fs.readFileSync('./mcp.json', 'utf-8'));

// Simple runner for tools
function runTool(toolName) {
  const tool = manifest.tools.find(t => t.name === toolName);
  if (!tool) {
    console.error(`Tool ${toolName} not found in manifest`);
    return;
  }

  console.log(`Running tool: ${tool.name}`);
  exec(tool.command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout:\n${stdout}`);
  });
  
}

// Example: run Playwright tests via manifest tool
runTool('runPlaywrightTests');
