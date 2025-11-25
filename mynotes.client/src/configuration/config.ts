// src/configuration/config.ts 

const getBaseApiUrl = () => {
    const envBase = import.meta.env.VITE_API_BASE_URL;
    if (envBase) {
        return envBase.replace(/\/$/, '');
    }

    if (import.meta.env.PROD) {
        // у проді ходимо на той самий origin, але через /api
        return '/api';
    }

    // у деві як раніше
    return 'http://localhost:8083/api';
};

export const API_BASE_URL = getBaseApiUrl();

