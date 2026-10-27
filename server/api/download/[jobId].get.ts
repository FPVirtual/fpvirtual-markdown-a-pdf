import { access, readFile } from 'node:fs/promises'
import { cleanupWorkspace, isSafeJobId, workspaceForJobId } from '../../utils/workspace'

export default defineEventHandler(async (event) => {
  const jobId = getRouterParam(event, 'jobId') || ''
  if (!isSafeJobId(jobId)) {
    throw createError({ statusCode: 400, statusMessage: 'Identificador de trabajo no válido.' })
  }

  const workspace = workspaceForJobId(jobId)

  try {
    await access(workspace.pdfPath)
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'El documento generado no existe o ya ha sido descargado.'
    })
  }

  const pdf = await readFile(workspace.pdfPath)

  event.node.res.on('close', () => {
    cleanupWorkspace(workspace).catch(() => {})
  })

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="documento.pdf"`)
  setHeader(event, 'Content-Length', String(pdf.length))

  await send(event, pdf)
})
