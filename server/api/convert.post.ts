import { readMultipartFormData } from 'h3'
import { convertToPdf } from '../utils/pandoc'
import { createWorkspace, saveFile, cleanupWorkspace } from '../utils/workspace'

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp']

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const maxBytes = config.maxUploadMb * 1024 * 1024

  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No se envió ningún archivo.' })
  }

  const documentPart = parts.find(
    p => p.filename && /\.(md|markdown)$/i.test(p.filename)
  )
  if (!documentPart) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Debes adjuntar un documento Markdown (.md).'
    })
  }

  const imageParts = parts.filter(p => {
    if (!p.filename) return false
    const ext = p.filename.split('.').pop()?.toLowerCase() || ''
    return IMAGE_EXTENSIONS.includes(ext)
  })

  const totalBytes = parts.reduce((sum, p) => sum + (p.data?.length || 0), 0)
  if (totalBytes > maxBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: `El tamaño total supera el límite de ${config.maxUploadMb} MB.`
    })
  }

  const workspace = await createWorkspace(documentPart.filename!)
  try {
    await saveFile(workspace, documentPart.filename!, documentPart.data)

    for (const image of imageParts) {
      await saveFile(workspace, image.filename!, image.data)
    }

    await convertToPdf(workspace)

    return {
      jobId: workspace.id,
      filename: documentPart.filename!.replace(/\.(md|markdown)$/i, '.pdf')
    }
  } catch (error) {
    await cleanupWorkspace(workspace)
    const message = error instanceof Error ? error.message : 'Error desconocido en la conversión.'
    const isDockerError = /docker|ENOENT/i.test(message)
    throw createError({
      statusCode: 502,
      statusMessage: isDockerError
        ? `No se pudo ejecutar el contenedor pandoc (${config.pandocImage}). ¿Está disponible la imagen y el socket de Docker? ${message}`
        : message
    })
  }
})
