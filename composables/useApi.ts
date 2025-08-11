// ~/composables/useApi.ts
import axios from 'axios'

export const useApi = () => {
    const api = axios.create({
        baseURL: 'http://localhost:8000/api', // ✅ Your Django backend base URL
        withCredentials: true, // If using cookies for auth
    })

    return api
}
