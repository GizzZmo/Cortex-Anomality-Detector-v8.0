import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function SystemLogs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Fetch initial logs
        fetch(`${API_URL}/api/logs`)
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error('Error fetching logs:', err));

        // Connect to WebSocket for real-time updates
        const socket = io(API_URL);

        socket.on('new_log', (log) => {
            setLogs(prev => [log, ...prev].slice(0, 100));
        });

        return () => socket.disconnect();
    }, []);

    const getLogColor = (type) => {
        switch (type) {
            case 'danger': return 'text-danger';
            case 'warning': return 'text-yellow-500';
            case 'success': return 'text-green-500';
            default: return 'text-primary';
        }
    };

    return (
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-primary">
            <h2 className="text-2xl font-bold mb-4 cyber-shadow">System Logs</h2>
            <div className="h-64 overflow-y-auto bg-gray-800 p-4 rounded border border-gray-600">
                {logs.length === 0 ? (
                    <p className="text-gray-500">No logs yet...</p>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="mb-2 font-mono text-sm">
                            <span className="text-gray-500">
                                [{new Date(log.timestamp).toLocaleTimeString()}]
                            </span>{' '}
                            <span className={getLogColor(log.type)}>
                                {log.message}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
