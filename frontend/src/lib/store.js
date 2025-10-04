import { create } from 'zustand';

export const useStore = create((set) => ({
    apiKey: localStorage.getItem('cortex_api_key') || '',
    isApiReady: false,
    isAppReady: false,
    appStatus: 'Initializing...',
    setApiKey: (key) => {
        localStorage.setItem('cortex_api_key', key);
        set({ apiKey: key });
    },
    setIsApiReady: (isReady) => set({ isApiReady: isReady }),
    setAppStatus: (status) => set({ appStatus: status }),
    startApp: () => set({ isAppReady: true }),
}));
