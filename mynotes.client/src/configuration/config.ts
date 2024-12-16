//config.ts
const API_URLS = {
    development: "https://localhost:5001/api", // Local development API URL
    production: "https://footballersnotes.click/api", // Production API URL
};

// Dynamically select the API URL based on the `NODE_ENV`
export const API_BASE_URL = API_URLS[process.env.NODE_ENV as keyof typeof API_URLS] || API_URLS.development;
