# Glish - AI Language Coach

**Glish** is a modern, AI-powered language learning platform built with React and Vite. It connects to the Zoro AI backend to provide interactive conversation practice, vocabulary training, and real-time progress tracking.

## Features

- 🌐 **Modern UI**: Clean, responsive design with TypeScript and Tailwind CSS.
- 💬 **AI Chat**: Real-time conversation practice with AI language partners.
- 🎯 **Gamified Learning**: Earn points, unlock achievements, and track your progress.
- 💾 **Persistence**: Save your conversations and vocabulary for review.
- 🚀 **Real-time Sync**: Instant updates to your profile and stats.

## Prerequisites

- Node.js (v18+ recommended)
- npm
- Backend running at `http://localhost:3000`

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd glish-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

2.  Edit `.env` to match your backend URL (if different):
    ```env
    VITE_API_URL=http://localhost:3000
    ```

## Usage

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Build the production bundle:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

### Test

Run unit tests:

```bash
npm run test
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |
| `npm run format` | Format code with Prettier |

## Project Structure

```
glish-frontend/
├── public/              # Static assets
├── src/
│   ├── api/             # API service layer
│   ├── components/      # UI components
│   ├── hooks/           # React hooks (useAuth, useChat, etc.)
│   ├── pages/           # Page components (Login, Dashboard, etc.)
│   ├── stores/          # Pinia stores (authStore, chatStore, etc.)
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application component
├── .env                 # Environment variables
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on the repository.

---

Made with ❤️ by the Glish Team
