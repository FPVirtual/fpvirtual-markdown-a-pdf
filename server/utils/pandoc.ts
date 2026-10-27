import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import type { Workspace } from './workspace'

const PANDOC_TIMEOUT_MS = 120_000

const YAML_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n/

async function ensureDefaultMetadata(workspace: Workspace): Promise<void> {
  const content = await readFile(workspace.documentPath, 'utf8')
  if (YAML_BLOCK_RE.test(content)) return

  const title = basename(workspace.documentPath).replace(/\.(md|markdown)$/i, '')
  const frontMatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    'lang: es',
    'mainfont: Carlito',
    'sansfont: Carlito',
    '---',
    ''
  ].join('\n')

  await writeFile(workspace.documentPath, frontMatter + content, 'utf8')
}

export async function convertToPdf(workspace: Workspace): Promise<void> {
  await ensureDefaultMetadata(workspace)

  const config = useRuntimeConfig()
  const image = config.pandocImage
  const inputName = basename(workspace.documentPath)

  const args = [
    'run', '--rm',
    '--network', 'none',
    '--mount', `type=bind,src=${workspace.dir},dst=/data`,
    ...(typeof process.getuid === 'function'
      ? ['--user', `${process.getuid()}:${process.getgid!()}`]
      : [])
  ]

  args.push(
    image,
    `/data/${inputName}`,
    '-o', '/data/document.pdf',
    '--from', 'markdown',
    '--template=eisvogel',
    '--pdf-engine=xelatex',
    '--resource-path=/data',
    '--syntax-highlighting=idiomatic'
  )

  await new Promise<void>((resolvePromise, rejectPromise) => {
    const child = execFile('docker', args, {
      timeout: PANDOC_TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024
    }, (error, _stdout, stderr) => {
      if (error) {
        const timedOut = (error as NodeJS.ErrnoException & { killed?: boolean }).killed
        rejectPromise(new Error(
          timedOut
            ? 'La conversión superó el tiempo máximo permitido (120 s).'
            : `pandoc falló: ${stderr || error.message}`
        ))
        return
      }
      resolvePromise()
    })
    child.on('error', rejectPromise)
  })
}
