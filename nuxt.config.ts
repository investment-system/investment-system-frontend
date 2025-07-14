export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/investment-system-frontend/' : '/',
  },

  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
})
