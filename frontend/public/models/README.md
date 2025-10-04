# Face-api.js Models

This directory should contain the face-api.js model files required for face detection and recognition.

## Required Files

Download the following files from the [face-api.js repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them in this directory:

### SSD MobileNet V1 (Face Detection)
- `ssd_mobilenetv1_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`

### Face Landmark 68 Point Model
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`

### Face Recognition Model
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`

## Download Instructions

1. Visit: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Download the 6 files listed above
3. Place them in this `frontend/public/models/` directory
4. The application will automatically load these models on startup

## File Structure

After downloading, this directory should look like:

```
frontend/public/models/
├── ssd_mobilenetv1_model-weights_manifest.json
├── ssd_mobilenetv1_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── face_landmark_68_model-shard1
├── face_recognition_model-weights_manifest.json
└── face_recognition_model-shard1
```

⚠️ **Note**: These model files are not included in the repository due to their size. You must download them separately.
