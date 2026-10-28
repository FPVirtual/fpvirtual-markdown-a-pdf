<template>
  <div class="relative overflow-hidden rounded-lg border bg-muted/50">
    <Button
      variant="ghost"
      size="icon"
      class="absolute top-2 right-2 h-7 w-7"
      :aria-label="copied ? 'Copiado' : 'Copiar código'"
      @click="copy"
    >
      <Check v-if="copied" class="h-4 w-4 text-green-600" />
      <Copy v-else class="h-4 w-4" />
    </Button>
    <pre class="overflow-x-auto p-4 text-sm"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

const props = defineProps<{
  code: string
}>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => { copied.value = false }, 2000)
}
</script>
