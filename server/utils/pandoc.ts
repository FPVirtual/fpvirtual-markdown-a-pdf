import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, join, resolve as resolvePath } from 'node:path'
import type { Workspace } from './workspace'

const PANDOC_TIMEOUT_MS = 120_000

const YAML_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n/

// Plantilla corporativa FPVirtual (fork de Eisvogel) que se monta en el
// contenedor efímero junto con el logo y el fondo de portada, para no
// depender de que la imagen pandoc la incluya.
function resolveThemeDir(themeDirFromConfig: string): string | null {
  const dir = themeDirFromConfig
    ? resolvePath(themeDirFromConfig)
    : resolvePath(process.cwd(), 'fpvirtual-theme')
  return existsSync(join(dir, 'fpvirtual.latex')) ? dir : null
}

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
    'colorlinks: true',
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
  const themeDir = resolveThemeDir(config.themeDir)

  const args = [
    'run', '--rm',
    '--network', 'none',
    '--mount', `type=bind,src=${workspace.dir},dst=/data`,
    // La plantilla y los recursos corporativos se montan en /theme;
    // TEXINPUTS permite que LaTeX resuelva fpvirtual/logo-cdfp.png y
    // fpvirtual/portada-fondo.png desde ahí.
    ...(themeDir
      ? [
          '--mount', `type=bind,src=${themeDir},dst=/theme`,
          '--env', 'TEXINPUTS=/theme:'
        ]
      : []),
    ...(typeof process.getuid === 'function'
      ? ['--user', `${process.getuid()}:${process.getgid!()}`]
      : [])
  ]

  args.push(
    image,
    `/data/${inputName}`,
    '-o', '/data/document.pdf',
    '--from', 'markdown',
    ...(themeDir ? ['--template=/theme/fpvirtual.latex'] : ['--template=eisvogel']),
    '--pdf-engine=xelatex',
    '--resource-path=/data',
    '--syntax-highlighting=default'
  )

  // Cajas de contenido (nota/aviso/importante): el filtro
  // pandoc-latex-environment convierte divs con clase en entornos LaTeX y
  // content-boxes.tex define esos entornos con tcolorbox. Solo con la
  // plantilla corporativa montada; la imagen debe incluir el filtro (la de
  // fpvirtual-pandoc-theme lo hace, al basarse en pandoc/extra).
  if (themeDir) {
    args.push(
      '--filter', 'pandoc-latex-environment',
      '--metadata-file=/theme/content-boxes.yaml',
      '-H', '/theme/content-boxes.tex'
    )
  }

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
