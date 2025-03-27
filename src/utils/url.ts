if (!localStorage.getItem('custom-server-url')) {
    localStorage.setItem('custom-server-url', import.meta.env.VITE_API_BASE_URL);
}

export const baseUrl = localStorage.getItem('custom-server-url');
export const apiBaseUrl = baseUrl + '/api';
export const resourceBaseUrl = baseUrl + '/resources';