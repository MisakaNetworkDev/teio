import SeiunClient from "./core/client";

export const seiunClient = new SeiunClient({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
})

export * from './modules';