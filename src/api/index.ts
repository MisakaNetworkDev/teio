import { apiBaseUrl } from "../utils/url";
import SeiunClient from "./core/client";

// try to load url from localstorage
export const seiunClient = new SeiunClient({
    baseUrl: apiBaseUrl,
})

export * from './modules';