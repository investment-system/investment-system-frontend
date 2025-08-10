export default defineNuxtConfig({
    modules: ['@nuxt/ui'],

    runtimeConfig: {
        public: {
            apiBase: process.env.API_BASE_URL || 'http://localhost:8000/api',
            mediaBase: process.env.MEDIA_BASE_URL || 'http://localhost:8000' // no /api here

        }
    },

    app: {
        baseURL: process.env.NODE_ENV === 'production' ? '/investment-system-frontend/' : '/',
    },

    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
})
