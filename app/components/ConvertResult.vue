<template>
  <Alert v-if="error" variant="destructive">
    <AlertCircle class="h-4 w-4" />
    <AlertTitle>Error en la conversión</AlertTitle>
    <AlertDescription class="whitespace-pre-wrap">{{ error }}</AlertDescription>
  </Alert>

  <div v-else-if="result" class="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center">
    <CheckCircle2 class="h-10 w-10 text-green-600" />
    <div>
      <p class="font-medium">Documento generado correctamente</p>
      <p class="text-sm text-muted-foreground">{{ result.filename }}</p>
    </div>
    <Button as-child>
      <a :href="`/api/download/${result.jobId}`">
        <Download class="mr-2 h-4 w-4" />
        Descargar PDF
      </a>
    </Button>
  </div>

  <div v-else-if="converting" class="flex flex-col items-center gap-4 rounded-lg border bg-card p-8">
    <Loader2 class="h-10 w-10 animate-spin text-primary" />
    <p class="text-sm text-muted-foreground">
      Compilando el documento con pandoc y la plantilla FPVirtual…
    </p>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-vue-next'

defineProps<{
  converting: boolean
  error: string | null
  result: ConvertResult | null
}>()
</script>
