# Setup Checklist

Use this checklist to ensure you have everything configured correctly.

## Prerequisites ✓

- [ ] Docker Desktop installed and running
- [ ] Docker Compose installed (usually comes with Docker Desktop)
- [ ] Git installed
- [ ] Web browser (Chrome, Firefox, or Safari recommended)
- [ ] Google AI Studio API Key ([Get one here](https://aistudio.google.com/app/apikey))

## Step 1: Clone Repository ✓

```bash
git clone https://github.com/GizzZmo/Cortex-Anomality-Detector-v8.0.git
cd Cortex-Anomality-Detector-v8.0
```

- [ ] Repository cloned successfully
- [ ] Changed to project directory

## Step 2: Download Face Recognition Models 📥

Face-api.js models are required for face detection. Download from:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

### Required Files:
- [ ] `ssd_mobilenetv1_model-weights_manifest.json`
- [ ] `ssd_mobilenetv1_model-shard1`
- [ ] `face_landmark_68_model-weights_manifest.json`
- [ ] `face_landmark_68_model-shard1`
- [ ] `face_recognition_model-weights_manifest.json`
- [ ] `face_recognition_model-shard1`

### Place files in:
```
frontend/public/models/
```

- [ ] All 6 model files downloaded
- [ ] Files placed in correct directory
- [ ] Verified files are in `frontend/public/models/`

## Step 3: Get API Key 🔑

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Create new API key
4. Copy the key (you'll enter it in the app)

- [ ] API key obtained
- [ ] API key copied and saved securely

## Step 4: Build and Run 🚀

```bash
docker-compose up --build
```

**First-time build may take 5-10 minutes.**

### Expected Output:
```
✓ frontend container started
✓ backend container started
✓ ai_service container started
✓ Database initialized
✓ All services running
```

- [ ] Docker Compose started successfully
- [ ] No error messages in terminal
- [ ] All three services are running

### Verify Services:
```bash
docker-compose ps
```

Should show:
- frontend (port 80)
- backend (port 3001)
- ai_service (port 5001)

- [ ] All services show "Up" status

## Step 5: Access Application 🌐

Open browser and navigate to:
```
http://localhost
```

- [ ] Application loads successfully
- [ ] No console errors (F12 to check)
- [ ] Interface displays correctly

## Step 6: Configure API Key 🔧

In the application:
1. Find "API Configuration" section
2. Paste your Google AI Studio API Key
3. Click "Save API Key"
4. Verify "✓ API Key configured" message appears

- [ ] API key entered
- [ ] API key saved
- [ ] Success message displayed

## Step 7: Test Features 🧪

### Face Recognition
- [ ] Click "Start Detection"
- [ ] Camera permission granted
- [ ] Video feed appears
- [ ] Face detection boxes appear

### AI Protocols
- [ ] Enter a prompt
- [ ] Click "Generate"
- [ ] Response appears

### Chat Assistant
- [ ] Type a message
- [ ] Click "Send" or press Enter
- [ ] Chat response appears

### System Logs
- [ ] Logs section shows activity
- [ ] Real-time updates working

## Troubleshooting 🔧

### Services Won't Start
```bash
docker-compose down
docker-compose up --build
```
- [ ] Tried restart

### Port 80 In Use
Change frontend port in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Use port 8080 instead
```
Then access: http://localhost:8080
- [ ] Port changed if needed

### Face Detection Not Working
- [ ] Verified all 6 model files are present
- [ ] Checked browser console for errors
- [ ] Camera permissions granted
- [ ] Tried different browser

### AI Not Responding
- [ ] API key is correct
- [ ] API key has been activated in Google AI Studio
- [ ] No quota/limit issues
- [ ] Backend service is running

### Database Errors
```bash
docker-compose down -v  # Remove volumes
docker-compose up --build
```
- [ ] Database reset if needed

## Development Mode (Optional) 💻

For local development without Docker:

### Backend
```bash
cd backend
npm install
npx prisma db push
npm start
```
- [ ] Backend running on port 3001

### Frontend
```bash
cd frontend
npm install
npm start
```
- [ ] Frontend running on port 3000

### AI Service
```bash
cd ai_service
pip install -r requirements.txt
flask run
```
- [ ] AI Service running on port 5001

## Verification Checklist ✅

- [ ] All Docker services running
- [ ] Application accessible at http://localhost
- [ ] API key configured
- [ ] Face detection working
- [ ] AI generation working
- [ ] Chat assistant working
- [ ] System logs updating in real-time
- [ ] No console errors
- [ ] No terminal errors

## Next Steps 🎯

- [ ] Read [README.md](README.md) for full documentation
- [ ] Review [DEVELOPMENT.md](DEVELOPMENT.md) for development guide
- [ ] Check [ARCHITECTURE.md](ARCHITECTURE.md) for system details
- [ ] Review [SECURITY.md](SECURITY.md) for security considerations

## Support 💬

If you encounter issues:

1. Check Docker logs: `docker-compose logs [service_name]`
2. Check browser console (F12)
3. Review [Troubleshooting](#troubleshooting) section
4. Open an issue on GitHub with:
   - Error messages
   - Docker logs
   - Browser console output
   - Steps to reproduce

---

**Congratulations! 🎉 Your CORTEX Anomaly Detector is ready!**
