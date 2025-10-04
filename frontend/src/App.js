import React from 'react';
import AIProtocols from './components/AIProtocols';
import ChatAssistant from './components/ChatAssistant';
import FaceRecognition from './components/FaceRecognition';
import SystemLogs from './components/SystemLogs';
import ApiKeyInput from './components/ApiKeyInput';
import { useStore } from './lib/store';

function App() {
  const { isApiReady } = useStore();

  return (
    <div className="min-h-screen bg-background text-text p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 py-6">
          <h1 className="text-5xl font-bold cyber-shadow mb-2">
            CORTEX ANOMALY DETECTOR
          </h1>
          <p className="text-xl cyber-shadow-secondary">v8.0.0 - Multi-Paradigm Security Suite</p>
        </header>

        <div className="grid gap-6 mb-6">
          <ApiKeyInput />
        </div>

        {!isApiReady ? (
          <div className="text-center py-12">
            <p className="text-xl text-yellow-500">
              ⚠️ Please configure your Google AI Studio API Key to use AI features
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FaceRecognition />
            <div className="space-y-6">
              <AIProtocols />
              <ChatAssistant />
            </div>
            <div className="lg:col-span-2">
              <SystemLogs />
            </div>
          </div>
        )}

        <footer className="text-center mt-8 py-4 text-gray-500 text-sm">
          <p>Microservices Architecture: React + Node.js + Python + Docker</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
