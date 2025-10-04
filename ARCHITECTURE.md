# CORTEX Anomaly Detector v8.0 - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CORTEX ANOMALY DETECTOR                  │
│                              v8.0.0                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                          │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │    Face     │  │     AI      │  │   Chat Assistant        │ │
│  │ Recognition │  │  Protocols  │  │   (Conversational AI)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              System Logs (Real-time WebSocket)            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND SERVICE                            │
│                     React.js + Nginx                             │
│                        Port 80                                   │
│                                                                   │
│  • React 18 with Hooks                                           │
│  • Tailwind CSS for styling                                      │
│  • face-api.js for face detection                                │
│  • Socket.io client for WebSocket                                │
│  • Zustand for state management                                  │
│  • Nginx for production serving                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐  ┌───────────────────────────────┐
│    BACKEND SERVICE        │  │       AI SERVICE              │
│   Node.js + Express       │  │     Python + Flask            │
│      Port 3001            │  │        Port 5001              │
│                           │  │                               │
│  • RESTful API Gateway    │  │  • Google Gemini AI           │
│  • WebSocket Server       │◀─┤  • Image Analysis             │
│  • Prisma ORM             │  │  • Natural Language Processing│
│  • SQLite Database        │  │  • Content Generation         │
│  • Real-time logging      │  │                               │
└───────────────────────────┘  └───────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATABASE                                │
│                      SQLite + Prisma                             │
│                                                                   │
│  ┌──────────────┐              ┌──────────────┐                │
│  │  KnownFace   │              │  SystemLog   │                │
│  ├──────────────┤              ├──────────────┤                │
│  │ id           │              │ id           │                │
│  │ label        │              │ message      │                │
│  │ descriptor   │              │ type         │                │
│  │ createdAt    │              │ timestamp    │                │
│  └──────────────┘              └──────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Face Recognition Flow

```
User Webcam
    │
    ▼
face-api.js (Frontend)
    │
    ├─► Detect Face
    │       │
    │       ▼
    │   Extract Descriptor
    │       │
    │       ▼
    └─► POST /api/faces ──► Backend ──► SQLite Database
                                │
                                ▼
                            WebSocket Broadcast
                                │
                                ▼
                            All Connected Clients
```

### 2. AI Content Generation Flow

```
User Input (Prompt + Images)
            │
            ▼
    Frontend Component
            │
            ▼
    POST /api/ai/generate (with API Key)
            │
            ▼
    Backend API Gateway
            │
            ▼
    Forward to AI Service
            │
            ▼
    Python Flask Server
            │
            ▼
    Google Gemini AI API
            │
            ▼
    Response (Generated Content)
            │
            ▼
    Backend ──► Frontend ──► User Interface
```

### 3. Real-time Logging Flow

```
System Event
      │
      ▼
Backend/Frontend emits 'log' event
      │
      ▼
Socket.io Server (Backend)
      │
      ▼
Save to SQLite Database
      │
      ▼
Broadcast 'new_log' to all clients
      │
      ▼
Frontend updates UI in real-time
```

## Technology Stack

### Frontend Layer
```
┌─────────────────────────────────────┐
│ React 18                            │
│ ├── Components                      │
│ ├── Hooks (useState, useEffect)     │
│ └── Zustand (State Management)      │
│                                     │
│ Styling                             │
│ ├── Tailwind CSS                    │
│ └── Custom CSS (Cyber theme)        │
│                                     │
│ Libraries                           │
│ ├── face-api.js (Face Detection)    │
│ ├── Socket.io-client (WebSocket)    │
│ └── Axios (HTTP Client)             │
└─────────────────────────────────────┘
```

### Backend Layer
```
┌─────────────────────────────────────┐
│ Node.js 20                          │
│ ├── Express.js (Web Framework)      │
│ ├── Socket.io (WebSocket)           │
│ └── Prisma (ORM)                    │
│                                     │
│ Database                            │
│ └── SQLite                          │
│                                     │
│ Communication                       │
│ ├── REST API                        │
│ ├── WebSocket                       │
│ └── Internal HTTP (to AI Service)   │
└─────────────────────────────────────┘
```

### AI Service Layer
```
┌─────────────────────────────────────┐
│ Python 3.11                         │
│ ├── Flask (Web Framework)           │
│ ├── google-generativeai (Gemini)    │
│ └── Pillow (Image Processing)       │
│                                     │
│ AI Capabilities                     │
│ ├── Text Generation                 │
│ ├── Image Analysis                  │
│ ├── Multi-modal Input               │
│ └── Context Understanding           │
└─────────────────────────────────────┘
```

### Infrastructure Layer
```
┌─────────────────────────────────────┐
│ Docker Containers                   │
│ ├── Frontend (Nginx)                │
│ ├── Backend (Node.js)               │
│ └── AI Service (Python)             │
│                                     │
│ Orchestration                       │
│ └── Docker Compose                  │
│                                     │
│ Networking                          │
│ └── Internal Bridge Network         │
│     (cortex-net)                    │
└─────────────────────────────────────┘
```

## Security Architecture

### API Key Management
```
User enters API Key
        │
        ▼
Stored in Browser localStorage (Frontend)
        │
        ▼
Sent via X-API-Key header
        │
        ▼
Backend validates and forwards
        │
        ▼
AI Service uses for Google AI API
```

### Network Security
- All services isolated in Docker network
- External access only through Frontend (port 80)
- Internal service communication via Docker DNS
- No direct external access to Backend or AI Service

## Deployment Architecture

### Development
```
localhost:3000 (Frontend Dev Server)
     │
     ├── Connects to localhost:3001 (Backend)
     │                    │
     │                    └── Connects to localhost:5001 (AI Service)
     │
     └── Direct access to database file
```

### Production (Docker Compose)
```
Port 80 (Public)
     │
     ▼
Nginx (Frontend Container)
     │
     ├── Serves static React build
     │
     ├── Proxies /api to Backend
     │
     └── Proxies /socket.io to Backend
                  │
                  ▼
            Backend Container (Port 3001)
                  │
                  ├── API Endpoints
                  ├── WebSocket Server
                  ├── Database (Volume Mount)
                  │
                  └── Connects to AI Service
                              │
                              ▼
                        AI Service Container (Port 5001)
                              │
                              └── Google Gemini API (External)
```

## File Structure

```
/
├── docker-compose.yml          # Orchestration config
├── README.md                   # Main documentation
├── QUICKSTART.md              # Quick setup guide
├── DEVELOPMENT.md             # Developer guide
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── .gitignore                 # Git ignore rules
│
├── /frontend/                 # React frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── /src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── /components/       # React components
│   │   └── /lib/              # Utilities & state
│   └── /public/
│       ├── index.html
│       └── /models/           # face-api.js models
│
├── /backend/                  # Node.js backend
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── /routes/
│   │   └── api.js
│   └── /db/
│       └── /prisma/
│           └── schema.prisma
│
└── /ai_service/               # Python AI service
    ├── Dockerfile
    ├── requirements.txt
    └── app.py
```

## API Endpoints Summary

### Backend API (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/generate | Forward to AI service |
| GET | /api/faces | Get all known faces |
| POST | /api/faces | Add new known face |
| GET | /api/logs | Get system logs |

### AI Service API (Port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/generate | Generate AI content |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| log | Client → Server | Send log entry |
| new_log | Server → Client | Broadcast new log |

## Performance Considerations

- **Frontend**: 
  - Lazy loading for components
  - Optimized face detection (requestAnimationFrame)
  - WebSocket for efficient real-time updates

- **Backend**:
  - Async/await for non-blocking operations
  - Connection pooling for database
  - Efficient WebSocket broadcasts

- **AI Service**:
  - Model caching to avoid reinitialization
  - Async request handling
  - Image optimization with Pillow

## Scalability

The microservices architecture allows:
- Independent scaling of services
- Load balancing across multiple instances
- Horizontal scaling with container orchestration
- Service-specific resource allocation

---

**Built with modern web technologies and best practices for professional deployment.**
