<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Generar documento PDF</CardTitle>
        <CardDescription>
          Sube un documento Markdown junto con las imágenes que referencia
          (rutas relativas, p. ej. <code>![captura](imagen.png)</code>) y
          obtén un PDF con la plantilla corporativa FPVirtual.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <UploadZone v-model="files" />

        <ul v-if="files.length" class="flex flex-col divide-y rounded-lg border">
          <li
            v-for="(file, index) in files"
            :key="`${file.name}-${file.size}-${index}`"
            class="flex items-center justify-between gap-2 px-4 py-2 text-sm"
          >
            <span class="flex min-w-0 items-center gap-2">
              <FileImage v-if="isImage(file)" class="h-4 w-4 shrink-0 text-muted-foreground" />
              <FileText v-else class="h-4 w-4 shrink-0 text-primary" />
              <span class="truncate">{{ file.name }}</span>
              <span class="shrink-0 text-xs text-muted-foreground">
                {{ formatSize(file.size) }}
              </span>
            </span>
            <Button variant="ghost" size="icon" @click="files.splice(index, 1)">
              <X class="h-4 w-4" />
            </Button>
          </li>
        </ul>

        <div class="flex justify-end">
          <Button :disabled="!canConvert" @click="convert">
            <Loader2 v-if="converting" class="mr-2 h-4 w-4 animate-spin" />
            <FileDown v-else class="mr-2 h-4 w-4" />
            {{ converting ? 'Generando…' : 'Generar PDF' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <ConvertResult :converting="converting" :error="error" :result="result" />
  </div>
</template>

<script setup lang="ts">
import { FileDown, FileImage, FileText, Loader2, X } from 'lucide-vue-next'
import type { ConvertResult } from '~/types/convert'

const files = ref<File[]>([])
const converting = ref(false)
const error = ref<string | null>(null)
const result = ref<ConvertResult | null>(null)

const hasDocument = computed(() => files.value.some(f => /\.(md|markdown)$/i.test(f.name)))
const canConvert = computed(() => hasDocument.value && !converting.value)

function isImage(file: File) {
  return file.type.startsWith('image/')
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function convert() {
  converting.value = true
  error.value = null
  result.value = null

  try {
    const formData = new FormData()
    for (const file of files.value) {
      formData.append('files', file)
    }

    const response = await $fetch<ConvertResult>('/api/convert', {
      method: 'POST',
      body: formData
    })

    result.value = response
  } catch (e) {
    const fetchError = e as { data?: { statusMessage?: string }, message?: string }
    error.value = fetchError.data?.statusMessage || fetchError.message || 'Error inesperado.'
  } finally {
    converting.value = false
  }
}
</script>
