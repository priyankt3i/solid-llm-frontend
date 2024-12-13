# Solid LLM Frontend

A simple chat interface built with SolidJS and Tailwind CSS that uses LiteLLM as a proxy to support multiple LLM backends. This allows you to use various AI models through a unified OpenAI-like interface.

## Features

- Chat interface with streaming responses
- Support for any LLM provider through LiteLLM proxy
- Message management (edit, copy, clear conversation)
- Basic model configuration panel
  - Temperature
  - Max tokens
  - Top P
  - Model selection

## Prerequisites

- [Bun](https://bun.sh)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/AdjectiveAllison/solid-llm-frontend
cd solid-llm-frontend
```

2. Install dependencies:
```bash
bun install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

Edit `.env` to add your:
- `VITE_API_BASE_URL`: Your LiteLLM proxy URL
- `VITE_API_KEY`: Your API key (if required by your proxy)

## Development

Run the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:5173`.

## Note on Production Use

This project is primarily designed for development and testing purposes. The current configuration uses `dangerouslyAllowBrowser: true` in the OpenAI client setup, which is not recommended for production environments. A backend proxy would be needed for secure production deployment.

## LiteLLM Integration

This frontend is designed to work with a LiteLLM proxy, which allows you to use any [supported LLM provider](https://docs.litellm.ai/docs/providers) including:
- OpenAI
- Anthropic
- AWS Bedrock
- Azure OpenAI
- Google Vertex AI
- And many more

For setting up the LiteLLM proxy, refer to the [LiteLLM proxy documentation](https://docs.litellm.ai/docs/simple_proxy).

## License

[MIT License](LICENSE)
