# Development Guide

## Project Structure

### Microservices Architecture

This project consists of three main services:

1. **Frontend** (React + Nginx)
2. **Backend** (Node.js + Express)
3. **AI Service** (Python + Flask)

## Development Setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- Git

### Local Development

#### 1. Backend Development

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Run in development mode
npm run dev
```

**Backend runs on:** http://localhost:3001

**Key Files:**
- `server.js` - Main server file with WebSocket setup
- `routes/api.js` - API endpoints
- `db/prisma/schema.prisma` - Database schema

#### 2. Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs on:** http://localhost:3000

**Key Files:**
- `src/App.js` - Main application component
- `src/components/` - React components
- `src/lib/store.js` - Zustand state management
- `tailwind.config.js` - Tailwind CSS configuration

#### 3. AI Service Development

```bash
cd ai_service

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
flask run
```

**AI Service runs on:** http://localhost:5001

**Key Files:**
- `app.py` - Flask application with AI endpoints

## Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio

# Create a migration
npx prisma migrate dev --name migration_name
```

### Database Schema

Located at `backend/db/prisma/schema.prisma`:

```prisma
model KnownFace {
  id         Int      @id @default(autoincrement())
  label      String   @unique
  descriptor String   // JSON string
  createdAt  DateTime @default(now())
}

model SystemLog {
  id        Int      @id @default(autoincrement())
  message   String
  type      String   // "info", "warning", "danger", "success"
  timestamp DateTime @default(now())
}
```

## API Documentation

### Backend API Endpoints

#### POST /api/ai/generate
Forwards request to AI service for content generation.

**Headers:**
- `X-API-Key`: Your Google AI Studio API key

**Body:**
```json
{
  "prompt": "Analyze this situation...",
  "images": ["base64_encoded_image"]  // optional
}
```

#### GET /api/faces
Get all known faces.

#### POST /api/faces
Add a new known face.

**Body:**
```json
{
  "label": "John Doe",
  "descriptor": [0.123, 0.456, ...]  // face descriptor array
}
```

#### GET /api/logs
Get recent system logs (last 100).

### AI Service API

#### POST /api/ai/generate
Generate content using Google's Gemini AI.

**Headers:**
- `X-API-Key`: Your Google AI Studio API key

**Body:**
```json
{
  "prompt": "Your prompt here",
  "images": ["base64_image1", "base64_image2"]  // optional
}
```

## WebSocket Events

### Client → Server

```javascript
socket.emit('log', {
  message: 'User action performed',
  type: 'info'  // 'info', 'warning', 'danger', 'success'
});
```

### Server → Client

```javascript
socket.on('new_log', (log) => {
  console.log(log);
  // { id, message, type, timestamp }
});
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Python Tests
```bash
cd ai_service
pytest
```

## Docker Development

### Build Individual Services

```bash
# Backend
docker build -t cortex-backend ./backend

# Frontend
docker build -t cortex-frontend ./frontend

# AI Service
docker build -t cortex-ai ./ai_service
```

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Stop services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

## Code Style & Linting

### JavaScript/React

ESLint is configured in the frontend:
```bash
cd frontend
npm run lint
```

### Python

Use flake8 or black:
```bash
cd ai_service
pip install flake8 black
flake8 .
black .
```

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)

### Frontend
- `REACT_APP_API_URL` - Backend URL (default: http://localhost:3001)

### AI Service
- `FLASK_DEBUG` - Debug mode (0 or 1)
- `GEMINI_API_KEY` - Default API key (optional)

## Adding New Features

### 1. Adding a New API Endpoint

**Backend (`backend/routes/api.js`):**
```javascript
router.get('/my-endpoint', async (req, res) => {
  // Your logic here
  res.json({ message: 'Success' });
});
```

### 2. Adding a New React Component

**Create file in `frontend/src/components/MyComponent.js`:**
```javascript
import React from 'react';

export default function MyComponent() {
  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold">My Component</h2>
    </div>
  );
}
```

**Import in `App.js`:**
```javascript
import MyComponent from './components/MyComponent';
```

### 3. Adding a Database Model

**Update `backend/db/prisma/schema.prisma`:**
```prisma
model MyModel {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
}
```

**Then run:**
```bash
npx prisma db push
```

## Debugging

### Backend Debugging
```bash
# With Chrome DevTools
node --inspect server.js

# With VS Code, add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/server.js"
}
```

### Frontend Debugging
Use React Developer Tools browser extension.

### AI Service Debugging
```bash
# Flask debug mode
FLASK_DEBUG=1 flask run
```

## Common Issues

### Port Already in Use
```bash
# Find process using port
lsof -ti:3001
# Kill it
kill -9 <PID>
```

### Prisma Issues
```bash
# Reset Prisma
npx prisma migrate reset
npx prisma db push
```

### Docker Issues
```bash
# Clean up everything
docker-compose down -v
docker system prune -a
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -am 'Add my feature'`
6. Push: `git push origin feature/my-feature`
7. Create a Pull Request

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Docker Compose](https://docs.docker.com/compose)
- [Tailwind CSS](https://tailwindcss.com/docs)
