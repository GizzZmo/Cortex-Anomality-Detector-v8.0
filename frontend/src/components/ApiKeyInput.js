import React, { useState } from 'react';
import { useStore } from '../lib/store';

export default function ApiKeyInput() {
    const { apiKey, setApiKey, setIsApiReady } = useStore();
    const [input, setInput] = useState(apiKey);

    const handleSave = () => {
        setApiKey(input);
        setIsApiReady(input.trim().length > 0);
    };

    return (
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-secondary">
            <h2 className="text-2xl font-bold mb-4 cyber-shadow-secondary">API Configuration</h2>
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm">Google AI Studio API Key</label>
                    <input
                        type="password"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-text"
                        placeholder="Enter your API key..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-secondary text-white font-bold rounded hover:bg-opacity-80"
                >
                    Save API Key
                </button>
                {apiKey && (
                    <p className="text-green-500 text-sm">✓ API Key configured</p>
                )}
            </div>
        </div>
    );
}
