// src/config.ts

// Import env variables from .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY || 'dummy-key';

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required in .env file');
}

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    apiKey: API_KEY,
  },
  models: [
    'claude-3.5-sonnet',
    'claude-3.5-haiku',
    'claude-3-opus',
    'llama-3.1-405b-instruct',
    'mistral-large'
  ],
  defaultModel: 'claude-3.5-sonnet'
} as const;
