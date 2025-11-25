// src/configuration/config.ts (або де в≥н у тебе лежить)

const getBaseApiUrl = () => {
    // якщо в env €вний base url Ч використовуЇмо його (опц≥йно)
    const envBase = import.meta.env.VITE_API_BASE_URL;
    if (envBase) {
        return envBase.replace(/\/$/, ''); // прибираЇмо / в к≥нц≥
    }

    // ” продакшен≥ йдемо на той самий origin, але через /api
    if (import.meta.env.PROD) {
        return '/api';
    }

    // ” розробц≥ Ч €к ≥ ран≥ше, на локальний бек
    return 'http://localhost:8083/api';
};

export const API_BASE_URL = getBaseApiUrl();
