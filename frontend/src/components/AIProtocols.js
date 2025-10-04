import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../lib/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function AIProtocols() {
    const { apiKey } = useStore();
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        setIsLoading(true);
        try {
            const res = await axios.post(
                `${API_URL}/api/ai/generate`,
                { prompt },
                { headers: { 'X-API-Key': apiKey } }
            );
            setResponse(res.data.text);
        } catch (error) {
            setResponse(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-primary">
            <h2 className="text-2xl font-bold mb-4 cyber-shadow">AI Protocols</h2>
            <div className="space-y-4">
                <textarea
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-text resize-none"
                    rows="4"
                    placeholder="Enter your prompt for AI analysis..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !apiKey}
                    className="px-6 py-2 bg-primary text-black font-bold rounded hover:bg-opacity-80 disabled:opacity-50"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
                {response && (
                    <div className="p-4 bg-gray-800 rounded border border-gray-600">
                        <p className="whitespace-pre-wrap">{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
