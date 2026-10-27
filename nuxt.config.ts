// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  shadcn: {
    prefix: '',
    componentDir: '~/components/ui'
  },
  runtimeConfig: {
    pandocImage: process.env.PANDOC_IMAGE || 'fpvirtualaragon/pandoc:latest',
    maxUploadMb: Number(process.env.NUXT_MAX_UPLOAD_MB) || 50,
    workspaceRoot: process.env.NUXT_WORKSPACE_ROOT || 'data/uploads'
  }
})
