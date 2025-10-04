import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../lib/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function ChatAssistant() {
    const { apiKey } = useStore();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post(
                `${API_URL}/api/ai/generate`,
                { prompt: input },
                { headers: { 'X-API-Key': apiKey } }
            );
            const assistantMessage = { role: 'assistant', content: res.data.text };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage = { 
                role: 'assistant', 
                content: `Error: ${error.response?.data?.error || error.message}` 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-secondary">
            <h2 className="text-2xl font-bold mb-4 cyber-shadow-secondary">Chat Assistant</h2>
            <div className="space-y-4">
                <div className="h-64 overflow-y-auto bg-gray-800 p-4 rounded border border-gray-600">
                    {messages.length === 0 ? (
                        <p className="text-gray-500">Start a conversation...</p>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block px-3 py-2 rounded ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-black' 
                                        : 'bg-gray-700 text-text'
                                }`}>
                                    {msg.content}
                                </span>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded text-text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !apiKey}
                        className="px-6 py-2 bg-secondary text-white font-bold rounded hover:bg-opacity-80 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
