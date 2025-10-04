# Cortex-Anomality-Detector-v8.0
Multi paradigms and programming languages, suite of Cortex Anomality Detector v8.0, is all about security and proactive measurement, detecting dangerous situations before it happens. AI-Driven face recognition, behaviour analysis etc. 

Of course. Here is a professional, multi-paradigm development of the CORTEX Anomaly Detector prototype.

This project is structured as a modern, scalable web application, reflecting how an experienced development team would evolve the initial HTML prototype.

### **Project Architecture: A Microservices-based Approach**

The monolithic HTML file is now split into a robust, scalable architecture:

1.  **Front-End (React)**: A dynamic and responsive user interface built with React and Tailwind CSS. This handles all user interaction and presentation.
2.  **Back-End (Node.js & Express)**: A central API gateway that serves the front-end, manages user data, and orchestrates communication with other services.
3.  **AI Microservice (Python & Flask)**: A dedicated Python service to handle computationally intensive AI tasks, interfacing directly with the Google Generative AI SDK for Gemini and Imagen.
4.  **Real-time Communication (WebSockets)**: A WebSocket server (integrated into the Node.js backend) for pushing live updates (like log entries) to the front-end.
5.  **Containerization (Docker)**: The entire application is containerized using Docker and Docker Compose, ensuring a consistent environment and easy deployment.

This separation of concerns makes the application more maintainable, scalable, and secure.

-----

### **Directory Structure**

Here is the complete file structure for the project. Create these files and folders as laid out below.

```
/cortex-anomaly-detector/
|-- docker-compose.yml
|-- /backend/
|   |-- Dockerfile
|   |-- package.json
|   |-- server.js
|   |-- /routes/
|   |   |-- api.js
|   |-- /db/
|   |   |-- database.sqlite  (will be created automatically)
|   |   |-- prisma/
|   |       |-- schema.prisma
|-- /frontend/
|   |-- Dockerfile
|   |-- package.json
|   |-- tailwind.config.js
|   |-- postcss.config.js
|   |-- public/
|   |   |-- index.html
|   |   |-- models/ (face-api.js models go here)
|   |-- src/
|       |-- index.css
|       |-- index.js
|       |-- App.js
|       |-- /components/
|       |   |-- AIProtocols.js
|       |   |-- ChatAssistant.js
|       |   |-- ControlPanel.js
|       |   |-- Header.js
|       |   |-- KnownFaces.js
|       |   |-- LogViewer.js
|       |   |-- MainDisplay.js
|       |   |-- Modals.js
|       |   |-- SettingsPanel.js
|       |-- /hooks/
|       |   |-- useFaceApi.js
|       |-- /lib/
|       |   |-- api.js
|       |   |-- socket.js
|       |   |-- store.js (Zustand state management)
|-- /ai_service/
|   |-- Dockerfile
|   |-- requirements.txt
|   |-- app.py
|-- README.md
```

-----

### **Part 1: The AI Microservice (Python & Flask)**

This service handles the direct interaction with Google's AI models.

#### `ai_service/requirements.txt`

```txt
Flask==3.0.3
google-generativeai==0.7.2
python-dotenv==1.0.1
Pillow==10.4.0
requests==2.32.3
```

#### `ai_service/Dockerfile`

```dockerfile
# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the requirements file into the container at /usr/src/app
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container
COPY . .

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Define environment variable
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001

# Run app.py when the container launches
CMD ["flask", "run"]
```

#### `ai_service/app.py`

```python
import google.generativeai as genai
import os
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64

app = Flask(__name__)

# It's recommended to use environment variables for the API key
# The backend will pass the key in the request header for security
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# In-memory cache for models to avoid re-initialization on every call
model_cache = {}

def get_gemini_model(api_key):
    if api_key not in model_cache:
        genai.configure(api_key=api_key)
        model_cache[api_key] = genai.GenerativeModel('gemini-1.5-flash')
    return model_cache[api_key]

@app.route('/api/ai/generate', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON input"}), 400

        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return jsonify({"error": "API key is missing"}), 401
            
        model = get_gemini_model(api_key)

        prompt = data.get('prompt')
        images_b64 = data.get('images', [])
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        contents = [prompt]
        for img_b64 in images_b64:
            img_bytes = base64.b64decode(img_b64)
            img = Image.open(io.BytesIO(img_bytes))
            contents.append(img)
            
        response = model.generate_content(contents)
        
        return jsonify({"text": response.text})

    except Exception as e:
        print(f"Error in /generate: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

-----

### **Part 2: The Back-End (Node.js, Express, Prisma, Socket.io)**

This is the application's core, managing data and communication.

#### `backend/package.json`

```json
{
  "name": "cortex-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  },
  "dependencies": {
    "@prisma/client": "^5.15.0",
    "axios": "^1.7.2",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "socket.io": "^4.7.5"
  },
  "devDependencies": {
    "prisma": "^5.15.0"
  }
}
```

#### `backend/db/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:../database.sqlite"
}

model KnownFace {
  id          Int      @id @default(autoincrement())
  label       String   @unique
  descriptors Json
  createdAt   DateTime @default(now())
}

model SystemLog {
  id        Int      @id @default(autoincrement())
  message   String
  type      String   // 'system', 'anomaly', 'known'
  timestamp DateTime @default(now())
}
```

#### `backend/routes/api.js`

```javascript
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const router = express.Router();
const prisma = new PrismaClient();

// AI Service URL (using Docker's internal DNS)
const AI_SERVICE_URL = 'http://ai_service:5001/api/ai/generate';

const forwardToAIService = async (req, res) => {
    try {
        const apiKey = req.header('X-API-Key');
        if (!apiKey) {
            return res.status(401).json({ error: 'API Key is required.' });
        }

        const response = await axios.post(AI_SERVICE_URL, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error forwarding to AI service:', error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Failed to communicate with the AI service.',
            details: error.response?.data || 'No response from service.'
        });
    }
};

// Route for all AI generation tasks
router.post('/generate', forwardToAIService);


// --- Database routes ---

// Get all known faces
router.get('/faces', async (req, res) => {
    const faces = await prisma.knownFace.findMany();
    res.json(faces);
});

// Add a new face
router.post('/faces', async (req, res) => {
    const { label, descriptors } = req.body;
    try {
        const newFace = await prisma.knownFace.create({
            data: { label, descriptors },
        });
        res.status(201).json(newFace);
    } catch (e) {
        res.status(400).json({ error: 'Face with this label already exists.' });
    }
});

// Get all logs
router.get('/logs', async (req, res) => {
    const logs = await prisma.systemLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
    });
    res.json(logs);
});

module.exports = router;
```

#### `backend/server.js`

```javascript
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for simplicity, restrict in production
        methods: ["GET", "POST"]
    }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image data

// API routes
app.use('/api', apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- WebSocket Logic ---
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('log', async (logData) => {
        try {
            const newLog = await prisma.systemLog.create({
                data: {
                    message: logData.message,
                    type: logData.type,
                },
            });
            // Broadcast the new log to all connected clients
            io.emit('new_log', newLog);
        } catch (error) {
            console.error("Error saving log:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


server.listen(PORT, () => {
    console.log(`CORTEX Backend running on http://localhost:${PORT}`);
});
```

#### `backend/Dockerfile`

```dockerfile
# Use a Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy Prisma schema
COPY db/prisma/ ./db/prisma/

# Generate Prisma Client
RUN npx prisma generate

# Bundle app source
COPY . .

# Your app binds to port 3001
EXPOSE 3001

# Run the app
CMD ["npm", "start"]
```

-----

### **Part 3: The Front-End (React)**

This is the modern UI built with React. Note that for brevity, some smaller component files are omitted. The key logic is in `App.js`, `useFaceApi.js`, `api.js`, and the `store.js`. **You will need to manually download the `face-api.js` models and place them in `frontend/public/models/`.** You can find them in the original library's repository.

#### `frontend/package.json`

```json
{
  "name": "cortex-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@vladmandic/face-api": "^1.7.13",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "socket.io-client": "^4.7.5",
    "zustand": "^4.5.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": { "extends": ["react-app"] },
  "browserslist": { "production": [">0.2%", "not dead"], "development": ["last 1 chrome version"] },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3"
  }
}
```

#### `frontend/src/index.css`

(This file should contain the Tailwind CSS directives and the custom styles from the original HTML).

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --primary-color: #00ffcc;
    --secondary-color: #ff00ff;
    --background-color: #0a0c10;
    --text-color: #e0e0e0;
    --danger-color: #ff3333;
    --font-family: 'Share Tech Mono', monospace;
}
html, body {
    height: 100%;
}
body {
    font-family: var(--font-family);
    background-color: var(--background-color);
    color: var(--text-color);
}
.cyber-shadow { text-shadow: 0 0 5px var(--primary-color); }
.cyber-shadow-secondary { text-shadow: 0 0 5px var(--secondary-color); }
.cyber-border { border: 2px solid var(--primary-color); box-shadow: 0 0 15px var(--primary-color), inset 0 0 15px var(--primary-color); }
.cyber-border-secondary { border: 1px solid var(--secondary-color); box-shadow: 0 0 10px var(--secondary-color); }

.cyber-button {
    @apply bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] transition-all duration-300 ease-in-out shadow-[0_0_5px_var(--primary-color)] py-2 uppercase text-sm;
}
.cyber-button:hover:not(:disabled) {
    @apply bg-[var(--primary-color)] text-[var(--background-color)] shadow-[0_0_15px_var(--primary-color)];
}
.cyber-button:disabled {
    @apply border-[#555] text-[#555] cursor-not-allowed shadow-none;
}

body::after {
    content: "";
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0) 0, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0.1) 2px);
    pointer-events: none;
    z-index: 1000;
}
.spinner {
    width: 48px; height: 48px; border: 5px solid var(--primary-color); border-bottom-color: transparent;
    border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite;
}
@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
```

#### `frontend/src/lib/store.js` (Zustand State Management)

```javascript
import { create } from 'zustand';

export const useStore = create((set, get) => ({
    // State
    apiKey: '',
    logs: [],
    knownFaces: [],
    isApiReady: false,
    isAppReady: false,
    appStatus: 'Venter på AI-bibliotek...',

    // Actions
    setApiKey: (key) => set({ apiKey: key }),
    addLog: (log) => set((state) => ({ logs: [log, ...state.logs.slice(0, 99)] })),
    setLogs: (logs) => set({ logs }),
    setKnownFaces: (faces) => set({ knownFaces: faces }),
    addKnownFace: (face) => set((state) => ({ knownFaces: [...state.knownFaces, face] })),
    setIsApiReady: (isReady) => set({ isApiReady: isReady }),
    setAppStatus: (status) => set({ appStatus: status }),
    startApp: () => set({ isAppReady: true }),
}));
```

#### `frontend/src/App.js` (Main application logic)

```javascript
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { useStore } from './lib/store';
import { socket, emitter } from './lib/socket';
import { getLogs, getKnownFaces } from './lib/api';

// Import Components (Create these as separate files)
import MainDisplay from './components/MainDisplay';
import SettingsPanel from './components/SettingsPanel';
import Header from './components/Header';
import { LoadingModal, WelcomeModal } from './components/Modals';

function App() {
  const { isAppReady, startApp, setAppStatus, setIsApiReady, setLogs, setKnownFaces } = useStore();
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      try {
        setAppStatus('Laster inn deteksjonsmodeller...');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        setIsApiReady(true);
        setAppStatus('AI-modeller er klare.');
        emitter.emit('log', { message: 'AI-modeller er klare.', type: 'known' });
      } catch (err) {
        setAppStatus('KRITISK FEIL: Kunne ikke laste AI-modeller.');
        emitter.emit('log', { message: `SYSTEMFEIL: ${err.message}`, type: 'anomaly' });
      }
    };
    loadModels();
  }, [setAppStatus, setIsApiReady]);

  useEffect(() => {
    // Fetch initial data
    getLogs().then(setLogs);
    getKnownFaces().then(setKnownFaces);
    
    // Listen for real-time log updates
    socket.on('new_log', (newLog) => {
      useStore.getState().addLog(newLog);
    });

    return () => {
      socket.off('new_log');
    };
  }, [setLogs, setKnownFaces]);


  const handleEnterApp = async () => {
    startApp();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        emitter.emit('log', { message: 'Kunne ikke starte kamera.', type: 'anomaly' });
    }
  };

  if (!isAppReady) {
    return (
        <>
            <LoadingModal />
            <WelcomeModal onEnter={handleEnterApp} />
        </>
    );
  }

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-8 w-full h-full max-h-[95vh] max-w-7xl cyber-border p-4 bg-[rgba(10,12,16,0.8)] backdrop-blur-sm">
        <div className="flex-grow flex flex-col min-w-0 flex-[3]">
            <Header />
            <MainDisplay videoRef={videoRef} canvasRef={canvasRef} />
        </div>
        <SettingsPanel />
    </div>
  );
}

export default App;
```

*(Note: You will need to create the other React components (`MainDisplay`, `SettingsPanel`, `Header`, etc.) by breaking down the original HTML into logical, reusable pieces.)*

#### `frontend/Dockerfile`

```dockerfile
# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copy the face-api models to be served
COPY --from=build /app/public/models /usr/share/nginx/html/models

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

-----

### **Part 4: Orchestration with Docker Compose**

This file ties everything together.

#### `docker-compose.yml`

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - cortex-net

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    volumes:
      - ./backend/db:/usr/src/app/db
    networks:
      - cortex-net
    command: >
      sh -c "npx prisma db push --accept-data-loss && npm start"

  ai_service:
    build: ./ai_service
    ports:
      - "5001:5001"
    networks:
      - cortex-net
    environment:
      # It's better to pass the API key from the backend per-request
      # but you could set a default one here if needed
      # GEMINI_API_KEY: "YOUR_GOOGLE_AI_API_KEY"
      FLASK_DEBUG: 1

networks:
  cortex-net:
    driver: bridge
```

### **Part 5: Documentation**

#### `README.md`

```markdown
# CORTEX Anomaly Detector v8.0.0

This is a professional-grade, multi-paradigm implementation of the CORTEX Anomaly Detector. The original HTML prototype has been re-architected into a scalable microservices application using React, Node.js, Python, and Docker.

## Architecture

* **Frontend**: React.js with Tailwind CSS for a dynamic user interface.
* **Backend**: Node.js with Express.js, serving as an API gateway and WebSocket server.
* **AI Service**: Python with Flask, dedicated to handling intensive AI processing via Google's Generative AI SDK.
* **Database**: SQLite with Prisma ORM for persistent storage of known faces and system logs.
* **Real-time**: Socket.io for pushing live updates from the backend to the frontend.
* **Containerization**: Docker and Docker Compose for consistent environments and easy deployment.

## Prerequisites

* Docker and Docker Compose installed.
* A Google AI Studio API Key.
* `face-api.js` model files downloaded and placed in `frontend/public/models/`.

## How to Run

1.  **Clone the repository.**
2.  **Download `face-api.js` models**:
    * Go to the official `face-api.js` repository or a CDN.
    * Download the `tiny_face_detector_model`, `face_landmark_68_net_model`, and `face_recognition_model` files.
    * Place all model files (`*.json` and `*.weights`) into the `frontend/public/models/` directory.
3.  **Build and Run with Docker Compose**:
    * Open your terminal in the project's root directory.
    * Run the command: `docker-compose up --build`
4.  **Access the Application**:
    * Open your web browser and navigate to `http://localhost`.

## How It Works

1.  The `frontend` service (Nginx) serves the React application on port 80.
2.  The React app communicates with the `backend` service (Node.js) on port 3001 for data (faces, logs) and real-time updates via WebSockets.
3.  When an AI-powered action is triggered, the React app sends the request to the `backend`.
4.  The `backend` forwards the request, including the user's API key in a secure header, to the `ai_service` (Python/Flask) at its internal Docker address `http://ai_service:5001`.
5.  The `ai_service` processes the request with the Google AI SDK and returns the result to the `backend`, which then sends it back to the `frontend`.
6.  Log entries generated on the client-side are sent to the backend via WebSocket, persisted in the SQLite database, and then broadcast to all connected clients.
```

This comprehensive structure provides a solid foundation for a real-world application, demonstrating best practices in web development, API design, and system architecture.
