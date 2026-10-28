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
    pandocImage: process.env.PANDOC_IMAGE || 'fpvirtual-pandoc:latest',
    maxUploadMb: Number(process.env.NUXT_MAX_UPLOAD_MB) || 50,
    workspaceRoot: process.env.NUXT_WORKSPACE_ROOT || 'data/uploads',
    // Directorio con la plantilla FPVirtual. En producción debe ser una ruta
    // válida TAMBIÉN en el host, porque el contenedor efímero de pandoc la
    // monta vía socket y el daemon la resuelve en el host.
    themeDir: process.env.NUXT_THEME_DIR || ''
  }
})
