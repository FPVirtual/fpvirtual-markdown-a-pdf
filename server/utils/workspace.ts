import { randomBytes } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { resolve as resolvePath } from 'node:path'

export interface Workspace {
  id: string
  dir: string
  documentPath: string
  pdfPath: string
}

export function resolveWorkspaceRoot(): string {
  const root = useRuntimeConfig().workspaceRoot
  return resolvePath(root)
}

export function sanitizeFilename(name: string): string {
  const safe = basename(name).replace(/[^\w.\-() áéíóúÁÉÍÓÚñÑ]/g, '_')
  return safe || 'archivo'
}

export async function createWorkspace(documentName: string): Promise<Workspace> {
  const id = randomBytes(8).toString('hex')
  const dir = resolvePath(resolveWorkspaceRoot(), id)
  await mkdir(dir, { recursive: true })
  const documentPath = resolvePath(dir, sanitizeFilename(documentName))
  return {
    id,
    dir,
    documentPath,
    pdfPath: resolvePath(dir, 'document.pdf')
  }
}

export async function saveFile(workspace: Workspace, name: string, data: Buffer): Promise<string> {
  const path = resolvePath(workspace.dir, sanitizeFilename(name))
  await writeFile(path, data)
  return path
}

export async function cleanupWorkspace(workspace: Workspace): Promise<void> {
  await rm(workspace.dir, { recursive: true, force: true })
}

export function isSafeJobId(jobId: string): boolean {
  return /^[a-f0-9]{16}$/.test(jobId)
}

export function workspaceForJobId(jobId: string): Workspace {
  const dir = resolvePath(resolveWorkspaceRoot(), jobId)
  return {
    id: jobId,
    dir,
    documentPath: resolvePath(dir, 'document.md'),
    pdfPath: resolvePath(dir, 'document.pdf')
  }
}
