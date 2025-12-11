/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const API_BASE_URL = 'https://adventure.wietsevenema.eu/game';

const server = new McpServer({
  name: 'forgotten-prompt',
  version: '1.0.0',
});

function getApiKey() {
  const apiKey = process.env.FORGOTTEN_PROMPT_API_KEY;
  if (!apiKey) {
    throw new Error('FORGOTTEN_PROMPT_API_KEY environment variable is not set.');
  }
  return apiKey;
}

async function makeApiCall(
  endpoint: string,
  method: string,
  body: any = null,
  sessionId?: string,
) {
  const headers: Record<string, string> = {
    'Authorization': getApiKey(),
    'Content-Type': 'application/json',
  };

  if (sessionId) {
    headers['Cookie'] = `session=${sessionId}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`Making API call:
  URL: ${API_BASE_URL}${endpoint}
  Method: ${method}
  Headers: ${JSON.stringify({ ...headers, 'Authorization': '[REDACTED]' })}
  Body: ${options.body || 'N/A'}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

server.registerTool(
  'startGame',
  {
    description: 'Start a new game session for a specific level.',
    inputSchema: z.object({
      level_id: z.string().describe('The ID of the level to start'),
    }).shape,
  },
  async ({ level_id }) => {
    try {
      const data = await makeApiCall('/start', 'POST', { level_id });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error starting game: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.registerTool(
  'listLevels',
  {
    description: 'List available levels.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const data = await makeApiCall('/levels', 'GET');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing levels: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.registerTool(
  'performAction',
  {
    description: 'Perform an in-game action.',
    inputSchema: z.object({
      session_id: z.string().describe('The current game session ID'),
      action: z.enum(['move', 'take', 'drop', 'use', 'examine', 'look', 'inventory']).describe('The action to perform'),
      target: z.string().optional().describe('The target of the action (e.g., item name, exit name)'),
      indirect_target: z.string().optional().describe('The second target for "use" action (optional)'),
    }).shape,
  },
  async ({ session_id, action, target, indirect_target }) => {
    try {
      let endpoint = '';
      let method = 'POST';
      let body: any = null;

      switch (action) {
        case 'move':
          endpoint = '/move';
          if (!target) throw new Error('Target (exit name) is required for move action.');
          body = { exit_name: target };
          break;
        case 'take':
          endpoint = '/take';
          if (!target) throw new Error('Target (item name) is required for take action.');
          body = { item_name: target };
          break;
        case 'drop':
          endpoint = '/drop';
          if (!target) throw new Error('Target (item name) is required for drop action.');
          body = { item_name: target };
          break;
        case 'use':
          endpoint = '/use';
          if (!target) throw new Error('Target (direct object) is required for use action.');
          body = { direct_object: target, indirect_object: indirect_target };
          break;
        case 'examine':
          endpoint = '/examine';
          if (!target) throw new Error('Target (item/exit name) is required for examine action.');
          body = { target: target };
          break;
        case 'look':
          endpoint = '/look';
          method = 'GET';
          break;
        case 'inventory':
          endpoint = '/inventory';
          method = 'GET';
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      const data = await makeApiCall(endpoint, method, body, session_id);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error performing action: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
