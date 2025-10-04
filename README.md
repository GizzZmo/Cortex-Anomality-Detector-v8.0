# Cortex-Anomality-Detector-v8.0

Multi paradigms and programming languages, suite of Cortex Anomality Detector v8.0, is all about security and proactive measurement, detecting dangerous situations before it happens. AI-Driven face recognition, behaviour analysis etc.

## Overview

This is a professional-grade, multi-paradigm implementation of the CORTEX Anomaly Detector. The project is structured as a modern, scalable web application using microservices architecture, demonstrating best practices in web development, API design, and system architecture.

## Architecture

The application follows a microservices-based approach with the following components:

### **Frontend (React.js)**
- Dynamic and responsive user interface built with React and Tailwind CSS
- Real-time face detection using face-api.js
- WebSocket integration for live system updates
- State management with Zustand
- Served via Nginx in production

### **Backend (Node.js & Express)**
- RESTful API gateway
- WebSocket server using Socket.io for real-time communication
- Database management with Prisma ORM and SQLite
- Proxy for AI service requests

### **AI Service (Python & Flask)**
- Dedicated microservice for AI processing
- Integration with Google's Generative AI (Gemini)
- Image analysis and natural language processing
- Isolated service for computational tasks

### **Database (SQLite with Prisma)**
- Persistent storage for known faces
- System logs tracking
- Automatic migrations

### **Containerization (Docker)**
- Each service runs in its own container
- Docker Compose for orchestration
- Isolated network for inter-service communication

## Project Structure

```
/cortex-anomaly-detector/
├── docker-compose.yml
├── /backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── /routes/
│   │   └── api.js
│   └── /db/
│       └── /prisma/
│           └── schema.prisma
├── /frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── /public/
│   │   ├── index.html
│   │   └── /models/ (face-api.js models)
│   └── /src/
│       ├── index.css
│       ├── index.js
│       ├── App.js
│       ├── /components/
│       │   ├── AIProtocols.js
│       │   ├── ChatAssistant.js
│       │   ├── FaceRecognition.js
│       │   ├── SystemLogs.js
│       │   └── ApiKeyInput.js
│       └── /lib/
│           └── store.js
└── /ai_service/
    ├── Dockerfile
    ├── requirements.txt
    └── app.py
```

## Prerequisites

- Docker and Docker Compose installed
- A Google AI Studio API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Face-api.js models (download and place in `frontend/public/models/`)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/GizzZmo/Cortex-Anomality-Detector-v8.0.git
cd Cortex-Anomality-Detector-v8.0
```

### 2. Download Face Recognition Models

Download the face-api.js models and place them in `frontend/public/models/`:

- ssd_mobilenetv1_model-weights_manifest.json
- ssd_mobilenetv1_model-shard1
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1

You can download these from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

### 3. Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will:
- Build all three services (frontend, backend, ai_service)
- Set up the database
- Start the application

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost
```

### 5. Configure API Key

In the application interface:
1. Enter your Google AI Studio API Key in the "API Configuration" section
2. Click "Save API Key"
3. The key is stored securely in your browser's localStorage

## Features

### 🎯 Face Recognition
- Real-time face detection using webcam
- Register known faces with labels
- Persistent face storage in database
- Visual detection overlay

### 🤖 AI Protocols
- Custom prompt analysis using Gemini AI
- Image analysis capabilities
- Context-aware responses

### 💬 Chat Assistant
- Interactive AI chat interface
- Conversational AI powered by Gemini
- Message history

### 📊 System Logs
- Real-time log streaming
- WebSocket-based updates
- Color-coded log levels (info, warning, danger, success)

## Development

### Running Services Individually

**Backend:**
```bash
cd backend
npm install
npx prisma db push
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**AI Service:**
```bash
cd ai_service
pip install -r requirements.txt
flask run
```

### Environment Variables

**Backend:**
- `PORT` - Server port (default: 3001)

**AI Service:**
- `FLASK_DEBUG` - Enable debug mode
- `GEMINI_API_KEY` - (Optional) Default API key

**Frontend:**
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:3001)

## API Documentation

### Backend API Endpoints

#### AI Generation
```
POST /api/ai/generate
Headers: X-API-Key: <your-api-key>
Body: { "prompt": "your prompt", "images": ["base64..."] }
```

#### Known Faces
```
GET /api/faces - Get all known faces
POST /api/faces - Add new face
Body: { "label": "name", "descriptor": [array] }
```

#### System Logs
```
GET /api/logs - Get recent logs (last 100)
```

### WebSocket Events

**Client → Server:**
```javascript
socket.emit('log', { message: 'Log message', type: 'info' });
```

**Server → Client:**
```javascript
socket.on('new_log', (log) => {
  // Handle new log entry
});
```

## Technology Stack

### Frontend
- React 18
- Tailwind CSS
- face-api.js
- Socket.io Client
- Zustand (State Management)
- Axios

### Backend
- Node.js 20
- Express.js
- Socket.io
- Prisma ORM
- SQLite

### AI Service
- Python 3.11
- Flask
- Google Generative AI SDK
- Pillow

### DevOps
- Docker
- Docker Compose
- Nginx

## Security Considerations

⚠️ **Important Security Notes:**

1. **API Keys**: Never commit API keys to the repository. Use environment variables.
2. **CORS**: The current setup allows all origins. Restrict this in production.
3. **Input Validation**: Implement proper input validation for all endpoints.
4. **Authentication**: Add user authentication for production use.
5. **HTTPS**: Use HTTPS in production environments.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Generative AI for the Gemini API
- face-api.js for face recognition capabilities
- The open-source community for various libraries and tools

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using modern web technologies and best practices** 
