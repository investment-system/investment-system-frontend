// ~/composables/useApi.ts
import axios from 'axios'

export const useApi = () => {
    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true,
    })

    return api
}
