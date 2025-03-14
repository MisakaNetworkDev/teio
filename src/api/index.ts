import { apiBaseUrl } from "../utils/url";
import SeiunClient from "./core/client";

export const seiunClient = new SeiunClient({
    baseUrl: apiBaseUrl,
})

export * from './modules';