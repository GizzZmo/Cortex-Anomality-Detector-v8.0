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
        console.error('Error forwarding to AI service:', error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error || 'AI service error',
        });
    }
};

// Forward AI requests to the Python microservice
router.post('/ai/generate', forwardToAIService);

// Get all known faces
router.get('/faces', async (req, res) => {
    const faces = await prisma.knownFace.findMany();
    res.json(faces);
});

// Add a new known face
router.post('/faces', async (req, res) => {
    try {
        const { label, descriptor } = req.body;
        const newFace = await prisma.knownFace.create({
            data: {
                label,
                descriptor: JSON.stringify(descriptor),
            },
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
