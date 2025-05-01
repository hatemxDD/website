# Research Lab Full Stack Application

This project consists of two main parts:

- `backend` - Node.js/Express API server
- `searchLabFrontend-master` - React/Vite frontend

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm

### Starting the Development Environment

The easiest way to start both the backend and frontend is to use the included shell script:

```bash
# Make the script executable (first time only)
chmod +x dev.sh

# Run the development environment
./dev.sh
```

This will start:

- Backend server on http://localhost:3000
- Frontend on http://localhost:3002

### Manual Setup

If you prefer to run the applications separately:

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd searchLabFrontend-master
npm install
npm run dev
```

## Project Structure

### Backend

- Express.js API server
- RESTful endpoints at `/api/...`
- CORS enabled for frontend access

### Frontend

- React with TypeScript
- Vite for fast development
- Integrated with backend via API calls
- Debugging panel available (click "Show Debug" button)

## API Integration

The frontend connects to the backend via:

1. Proxy configuration in `vite.config.ts`
2. API service in `src/services/api.ts`
3. Specialized service modules (e.g., `usersService.ts`)

You can verify the connection using the debug panel in the app UI.

## Troubleshooting

If you encounter issues:

1. Ensure both servers are running
2. Check the debug panel for API status
3. Check browser console for errors
4. Verify the proxy settings in `vite.config.ts`
# website
