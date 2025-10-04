import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function FaceRecognition() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [detectionActive, setDetectionActive] = useState(false);
    const [knownFaces, setKnownFaces] = useState([]);
    const [newFaceLabel, setNewFaceLabel] = useState('');

    useEffect(() => {
        loadModels();
        loadKnownFaces();
    }, []);

    const loadModels = async () => {
        try {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            setIsModelLoaded(true);
        } catch (error) {
            console.error('Error loading models:', error);
        }
    };

    const loadKnownFaces = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/faces`);
            setKnownFaces(res.data);
        } catch (error) {
            console.error('Error loading known faces:', error);
        }
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(err => console.error('Error accessing camera:', err));
    };

    const startDetection = async () => {
        if (!isModelLoaded) return;
        
        setDetectionActive(true);
        startVideo();

        const detectFaces = async () => {
            if (!detectionActive || !videoRef.current) return;

            const detections = await faceapi
                .detectAllFaces(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (canvasRef.current) {
                const displaySize = { 
                    width: videoRef.current.videoWidth, 
                    height: videoRef.current.videoHeight 
                };
                faceapi.matchDimensions(canvasRef.current, displaySize);
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            }

            requestAnimationFrame(detectFaces);
        };

        detectFaces();
    };

    const stopDetection = () => {
        setDetectionActive(false);
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const captureAndSaveFace = async () => {
        if (!newFaceLabel.trim() || !videoRef.current) return;

        const detection = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (detection) {
            try {
                await axios.post(`${API_URL}/api/faces`, {
                    label: newFaceLabel,
                    descriptor: Array.from(detection.descriptor)
                });
                setNewFaceLabel('');
                loadKnownFaces();
                alert('Face saved successfully!');
            } catch (error) {
                alert('Error saving face: ' + (error.response?.data?.error || error.message));
            }
        } else {
            alert('No face detected. Please position your face clearly in the frame.');
        }
    };

    return (
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-primary">
            <h2 className="text-2xl font-bold mb-4 cyber-shadow">Face Recognition</h2>
            
            {!isModelLoaded ? (
                <div className="text-center py-8">
                    <div className="spinner mx-auto"></div>
                    <p className="mt-4">Loading face detection models...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            muted 
                            className="w-full rounded border border-gray-600"
                            style={{ transform: 'scaleX(-1)' }}
                        />
                        <canvas 
                            ref={canvasRef} 
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ transform: 'scaleX(-1)' }}
                        />
                    </div>

                    <div className="flex gap-2">
                        {!detectionActive ? (
                            <button
                                onClick={startDetection}
                                className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-opacity-80"
                            >
                                Start Detection
                            </button>
                        ) : (
                            <button
                                onClick={stopDetection}
                                className="px-4 py-2 bg-danger text-white font-bold rounded hover:bg-opacity-80"
                            >
                                Stop Detection
                            </button>
                        )}
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                        <h3 className="font-bold mb-2">Add Known Face</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-text"
                                placeholder="Enter person's name..."
                                value={newFaceLabel}
                                onChange={(e) => setNewFaceLabel(e.target.value)}
                            />
                            <button
                                onClick={captureAndSaveFace}
                                className="px-4 py-2 bg-secondary text-white font-bold rounded hover:bg-opacity-80"
                            >
                                Capture & Save
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                        <h3 className="font-bold mb-2">Known Faces ({knownFaces.length})</h3>
                        <div className="max-h-32 overflow-y-auto">
                            {knownFaces.map(face => (
                                <div key={face.id} className="px-3 py-1 bg-gray-800 rounded mb-1">
                                    {face.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
