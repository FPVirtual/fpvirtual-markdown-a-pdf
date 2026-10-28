<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Editor Markdown</CardTitle>
        <CardDescription>
          Edita el documento (la cabecera YAML configura la portada, el índice
          y las cabeceras). Inserta imágenes con el botón de imagen del editor
          o pegándolas directamente; se adjuntan solas a la conversión.
          Pulsa «Generar PDF» para compilar con la plantilla FPVirtual.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex justify-end">
          <Button :disabled="!canConvert" @click="convert">
            <Loader2 v-if="converting" class="mr-2 h-4 w-4 animate-spin" />
            <FileDown v-else class="mr-2 h-4 w-4" />
            {{ converting ? 'Generando…' : 'Generar PDF' }}
          </Button>
        </div>

        <ul v-if="images.length" class="flex flex-wrap gap-2">
          <li
            v-for="image in images"
            :key="image.name"
            class="flex items-center gap-2 rounded-full border bg-muted/50 py-1 pl-3 pr-1 text-xs"
          >
            <FileImage class="h-3.5 w-3.5 text-muted-foreground" />
            <span class="max-w-48 truncate">{{ image.name }}</span>
            <Button variant="ghost" size="icon" class="h-5 w-5" @click="removeImage(image.name)">
              <X class="h-3 w-3" />
            </Button>
          </li>
        </ul>

        <ClientOnly>
          <MdEditor
            v-model="content"
            language="es-ES"
            theme="light"
            :preview="true"
            :toolbars="toolbars"
            :onUploadImg="onUploadImg"
            style="height: 65vh"
          />
          <template #fallback>
            <div class="flex h-[65vh] items-center justify-center rounded-lg border text-sm text-muted-foreground">
              Cargando el editor…
            </div>
          </template>
        </ClientOnly>
      </CardContent>
    </Card>

    <ConvertResult :converting="converting" :error="error" :result="result" />
  </div>
</template>

<script setup lang="ts">
import { FileDown, FileImage, Loader2, X } from 'lucide-vue-next'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { ConvertResult } from '~/types/convert'

definePageMeta({ fullWidth: true })

const EXAMPLE_URL = '/ejemplos/completo.md'

// Sin zoom, imprimir ni fullscreen: la conversión real se hace en el
// servidor y el resultado se descarga como PDF.
const toolbars = [
  'bold', 'underline', 'italic', '-', 'title', 'strikeThrough', 'sub', 'sup',
  'quote', 'unorderedList', 'orderedList', 'task', '-', 'codeRow', 'code',
  'link', 'image', 'table', 'mermaid', 'katex', '-', 'revoke', 'next', '=',
  'pageFullscreen', 'preview', 'htmlPreview'
]

const content = ref('')
const loading = ref(true)
const converting = ref(false)
const error = ref<string | null>(null)
const result = ref<ConvertResult | null>(null)
// Imágenes subidas desde el editor, por nombre de fichero. Viajan junto al
// Markdown en el multipart y se resuelven por ruta relativa en pandoc.
const images = ref<File[]>([])

const canConvert = computed(() => !loading.value && content.value.trim().length > 0 && !converting.value)

onMounted(async () => {
  try {
    content.value = await $fetch<string>(EXAMPLE_URL, { responseType: 'text' })
  } catch {
    error.value = 'No se pudo cargar el documento de ejemplo.'
  } finally {
    loading.value = false
  }
})

function onUploadImg(files: File[], insert: (urls: string[]) => void) {
  const urls: string[] = []
  for (const file of files) {
    if (!images.value.some(i => i.name === file.name)) {
      images.value.push(file)
    }
    urls.push(file.name)
  }
  insert(urls)
}

function removeImage(name: string) {
  images.value = images.value.filter(i => i.name !== name)
}

async function convert() {
  converting.value = true
  error.value = null
  result.value = null

  try {
    const formData = new FormData()
    formData.append('files', new File([content.value], 'documento.md', { type: 'text/markdown' }))
    for (const image of images.value) {
      formData.append('files', image, image.name)
    }

    result.value = await $fetch<ConvertResult>('/api/convert', {
      method: 'POST',
      body: formData
    })
  } catch (e) {
    const fetchError = e as { data?: { statusMessage?: string }, message?: string }
    error.value = fetchError.data?.statusMessage || fetchError.message || 'Error inesperado.'
  } finally {
    converting.value = false
  }
}
</script>
