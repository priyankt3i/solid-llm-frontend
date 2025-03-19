// src/config.ts

// Import env variables from .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required in .env file');
}

export const config = {
  api: {
    useGemini: true,
    geminiApiKey: GEMINI_API_KEY,
    baseUrl: API_BASE_URL,
  },
  models: [
    'gemini-1.0-pro',
    'gemini-2.0-flash-001',
  ],
  defaultModel: 'gemini-2.0-flash-001'
} as const;
