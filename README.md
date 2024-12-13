# LLM Frontend

A modern chat interface built with SolidJS, TypeScript, and Tailwind CSS for interacting with various language models through the OpenAI API format.

## Features

- 💬 Real-time streaming chat interface
- 🎨 Clean, responsive design with Tailwind CSS
- ⚙️ Configurable model parameters
  - Temperature
  - Max tokens
  - Top P
  - Model selection
- 📝 Message management
  - Edit messages
  - Copy message content
  - Clear conversation
- 🎯 Support for multiple models:
  - Claude 3.5 Sonnet
  - Claude 3.5 Haiku
  - Claude 3 Opus
  - Llama 3.1 405B Instruct
  - Mistral Large
- 📱 Mobile-responsive layout

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm, yarn, or pnpm

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd llm-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=your_api_base_url
VITE_API_KEY=your_api_key
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory.

Preview the production build:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Chat.tsx        # Main chat interface
│   ├── ConfigPanel.tsx # Model configuration panel
│   └── ModelSelector.tsx
├── service/
│   └── api.ts          # API integration
├── types.ts            # TypeScript type definitions
└── config.ts           # Application configuration
```

## Technical Stack

- [SolidJS](https://solidjs.com) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [OpenAI API](https://platform.openai.com/docs/api-reference) - API format

## Security Notes

- The application currently uses `dangerouslyAllowBrowser: true` in the OpenAI client configuration. For production use, consider moving API calls to a backend server.
- Ensure your `.env` file is added to `.gitignore` to prevent exposing sensitive credentials.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)
