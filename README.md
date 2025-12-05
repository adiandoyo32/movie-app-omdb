# Movie App - OMDB

A React application for searching and browsing movies using the OMDB API. Built with Vite, Redux Toolkit, React Router, and Tailwind CSS.

## Features

- Search movies with real-time results
- Infinite scroll pagination
- Movie detail pages
- Responsive design with Tailwind CSS
- State management with Redux Toolkit

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- OMDB API key ([Get one here](http://www.omdbapi.com/apikey.aspx))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-app-omdb
```

2. Install dependencies:
```bash
npm install
```

## Environment Setup

1. Create a `.env` file in the root directory:
```bash
touch .env
```

2. Add your OMDB API key to the `.env` file:
```env
VITE_OMDB_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual OMDB API key.

## Running the App

### Development Mode

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build for Production

Create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests with Vitest
- `npm run anagram` - Run anagram code

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vitest** - Testing framework

## React Compiler

The React Compiler is enabled in this project. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.