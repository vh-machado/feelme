// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', ['@nuxtjs/google-fonts', {
    families: {
      Montserrat: [300, 400, 500, 600, 700, 800, 900],
      K2D: [300, 400, 500, 600, 700, 800]
    },
    display: 'swap'
  }], '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      gatewayBaseUrl: '',
      tmdbApiBaseUrl: '',
      tmdbImageBaseUrl: '',
      tmdbApiKey: '',
    }
  }
})