# CORTEX Anomaly Detector v8.0 - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- [Google AI Studio API Key](https://aistudio.google.com/app/apikey)

### Step 1: Clone the Repository
```bash
git clone https://github.com/GizzZmo/Cortex-Anomality-Detector-v8.0.git
cd Cortex-Anomality-Detector-v8.0
```

### Step 2: Download Face Recognition Models

The application requires face-api.js model files. Download them from:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Place these 6 files in `frontend/public/models/`:
- `ssd_mobilenetv1_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`

### Step 3: Start the Application
```bash
docker-compose up --build
```

Wait for all services to start (this may take a few minutes on first run).

### Step 4: Open Your Browser
Navigate to: **http://localhost**

### Step 5: Configure API Key
1. In the application, find the "API Configuration" section
2. Paste your Google AI Studio API Key
3. Click "Save API Key"

### 🎉 You're Ready!

Now you can:
- ✅ Use **Face Recognition** to detect and register faces
- ✅ Use **AI Protocols** for custom AI analysis
- ✅ Use **Chat Assistant** for interactive AI conversations
- ✅ Monitor **System Logs** in real-time

## 🔧 Troubleshooting

### Services won't start?
```bash
# Stop all services
docker-compose down

# Remove volumes and rebuild
docker-compose down -v
docker-compose up --build
```

### Can't access the application?
- Make sure port 80 is not in use by another application
- Try: `docker-compose ps` to check service status
- Check logs: `docker-compose logs [service_name]`

### Face detection not working?
- Ensure you downloaded all 6 model files
- Check browser console for errors
- Allow camera permissions in your browser

## 📚 Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│ AI Service  │
│   (React)   │◀────│  (Node.js)  │◀────│  (Python)   │
│   Port 80   │     │  Port 3001  │     │  Port 5001  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │
       │                    ▼
       │            ┌──────────────┐
       │            │   Database   │
       └───────────▶│   (SQLite)   │
        WebSocket   └──────────────┘
```

## 🛠️ Development Mode

Run services individually for development:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npx prisma db push
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Terminal 3 - AI Service:**
```bash
cd ai_service
pip install -r requirements.txt
flask run
```

Frontend will be available at: http://localhost:3000
Backend API at: http://localhost:3001
AI Service at: http://localhost:5001

## 📖 Full Documentation

See [README.md](README.md) for complete documentation.

## 🆘 Support

Having issues? Check:
1. Docker is running: `docker --version`
2. Services are up: `docker-compose ps`
3. Logs: `docker-compose logs -f`

For more help, open an issue on GitHub.
