import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useCookie } from '#app'

export function useProfile() {
    const profileData = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const api = useApi()
    const token = useCookie('token').value

    async function fetchProfile() {
        loading.value = true
        error.value = null
        console.log('Fetching profile with token:', token)

        if (!token) {
            error.value = 'No auth token found, please login again.'
            loading.value = false
            return
        }

        try {
            const response = await api.get('/administrators/profile/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            console.log('Profile fetched successfully:', response.data)
            profileData.value = response.data
        } catch (e) {
            console.error('Error fetching profile:', e)
            error.value = e.response?.data || e.message || 'Failed to load profile'
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchProfile()
    })

    return { profileData, loading, error }
}
