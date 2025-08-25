import axios from 'axios'
import { useCookie } from '#app'

export const useApi = () => {
    const tokenCookie = useCookie('token')

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
    })

    api.interceptors.request.use(config => {
        let accessToken = null;

        try {
            const tokenValue = tokenCookie.value;
            if (tokenValue) {
                // Try parsing JSON (in case cookie stores both tokens)
                const tokenObj = typeof tokenValue === 'string' ? JSON.parse(tokenValue) : tokenValue;
                accessToken = tokenObj.access || tokenValue; // fallback to tokenValue if no access field
            }
        } catch (e) {
            // tokenCookie.value is probably just a raw string token
            accessToken = tokenCookie.value;
        }

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });


    return api
}
