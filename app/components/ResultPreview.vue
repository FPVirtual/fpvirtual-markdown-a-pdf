<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm font-medium">Resultado</span>
      <div class="ml-auto flex gap-2">
        <Button variant="outline" size="sm" as-child>
          <a :href="pdfUrl" target="_blank" rel="noopener">
            <ExternalLink class="mr-1.5 h-3.5 w-3.5" />
            Abrir
          </a>
        </Button>
        <Button variant="outline" size="sm" as-child>
          <a :href="mdUrl" :download="`${name}.md`">
            <FileCode class="mr-1.5 h-3.5 w-3.5" />
            .md de ejemplo
          </a>
        </Button>
        <Button variant="outline" size="sm" as-child>
          <a :href="pdfUrl" :download="`${name}.pdf`">
            <FileDown class="mr-1.5 h-3.5 w-3.5" />
            Descargar PDF
          </a>
        </Button>
      </div>
    </div>
    <iframe
      :src="pdfUrl"
      :title="`Vista previa del PDF de ${name}`"
      class="h-[420px] w-full rounded-lg border bg-white"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, FileCode, FileDown } from 'lucide-vue-next'

const props = defineProps<{
  file: string
}>()

const name = computed(() => props.file)
const pdfUrl = computed(() => `/ejemplos/${props.file}.pdf`)
const mdUrl = computed(() => `/ejemplos/${props.file}.md`)
</script>
