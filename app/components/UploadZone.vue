<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors"
    :class="isDragging
      ? 'border-primary bg-primary/5'
      : 'border-muted-foreground/25 hover:border-muted-foreground/50'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <UploadCloud class="h-10 w-10 text-muted-foreground" />
    <div class="text-sm">
      <p class="font-medium">Arrastra aquí tus archivos</p>
      <p class="text-muted-foreground">
        El documento Markdown y las imágenes que referencia
      </p>
    </div>
    <Button variant="outline" size="sm" @click="fileInput?.click()">
      Seleccionar archivos
    </Button>
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      multiple
      accept=".md,.markdown,image/*"
      @change="onPick"
    >
  </div>
</template>

<script setup lang="ts">
import { UploadCloud } from 'lucide-vue-next'

const model = defineModel<File[]>({ required: true })

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function addFiles(list: FileList | File[] | null) {
  if (!list) return
  const accepted = Array.from(list).filter(f =>
    /\.(md|markdown)$/i.test(f.name) || f.type.startsWith('image/')
  )
  model.value = [...model.value, ...accepted]
}

function onPick(event: Event) {
  addFiles((event.target as HTMLInputElement).files)
  ;(event.target as HTMLInputElement).value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  addFiles(event.dataTransfer?.files)
}
</script>
