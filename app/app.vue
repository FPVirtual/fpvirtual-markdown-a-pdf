<template>
  <div class="flex min-h-screen flex-col bg-muted/30">
    <header class="border-b bg-background">
      <div class="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
        <NuxtLink to="/" class="flex items-center gap-2">
          <FileText class="h-5 w-5 text-primary" />
          <span class="font-semibold">FPVirtual · Markdown a PDF</span>
        </NuxtLink>
        <nav class="ml-auto flex items-center gap-1">
          <NuxtLink
            to="/"
            class="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            active-class="bg-accent font-medium text-foreground"
            exact-active-class="bg-accent font-medium text-foreground"
          >
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/ayuda"
            class="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            active-class="bg-accent font-medium text-foreground"
          >
            Ayuda
          </NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <NuxtPage />
    </main>
    <footer class="border-t bg-background py-4 text-center text-sm text-muted-foreground">
      Generación de documentación corporativa con la plantilla FPVirtual (pandoc + Eisvogel)
    </footer>
  </div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
</script>
