<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Ayuda · Markdown a PDF</CardTitle>
        <CardDescription>
          Guía de la sintaxis Markdown soportada por la aplicación. La
          conversión se realiza con
          <strong>pandoc</strong> y la plantilla
          <strong>Eisvogel</strong>, por lo que se admite toda la sintaxis de
          <em>pandoc Markdown</em>. Cada sección incluye el código fuente, el
          PDF de resultado y los ficheros de ejemplo descargables.
        </CardDescription>
      </CardHeader>
    </Card>

    <!-- Índice de la ayuda -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">Contenidos de la ayuda</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="grid gap-1 text-sm sm:grid-cols-2">
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`" class="text-primary hover:underline">
              {{ section.title }}
            </a>
          </li>
        </ul>
      </CardContent>
    </Card>

    <!-- Cómo usar la aplicación -->
    <Card :id="sections[0].id" class="scroll-mt-6">
      <CardHeader>
        <CardTitle>{{ sections[0].title }}</CardTitle>
        <CardDescription>
          Flujo de trabajo para generar un PDF.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4 text-sm leading-relaxed">
        <ol class="list-decimal space-y-2 pl-5">
          <li>
            Prepara un documento Markdown (<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">.md</code>)
            y, si lo usas, las imágenes que referencia con rutas relativas.
          </li>
          <li>
            Arrastra el <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">.md</code>
            junto con las imágenes a la zona de subida de la página de inicio.
          </li>
          <li>Pulsa <strong>Generar PDF</strong> y descarga el documento.</li>
        </ol>
        <Alert>
          <CircleAlert class="h-4 w-4" />
          <AlertTitle>Cabecera YAML</AlertTitle>
          <AlertDescription>
            Si el documento no incluye un bloque de metadatos
            <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">---</code>,
            la aplicación añade uno por defecto con el nombre del fichero como
            título y la fuente corporativa Carlito. Para personalizar la
            portada, añade tu propia cabecera (ver la sección
            <a href="#portada" class="text-primary hover:underline">Cabecera y portada</a>).
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>

    <!-- Sintaxis básica -->
    <Card :id="sections[1].id" class="scroll-mt-6">
      <CardHeader>
        <CardTitle>{{ sections[1].title }}</CardTitle>
        <CardDescription>
          Encabezados, énfasis, listas, citas, código y tablas.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <CodeBlock :code="basico" />
        <ResultPreview file="sintaxis" />
      </CardContent>
    </Card>

    <!-- Enlaces e imágenes -->
    <Card :id="sections[2].id" class="scroll-mt-6">
      <CardHeader>
        <CardTitle>{{ sections[2].title }}</CardTitle>
        <CardDescription>
          Enlaces internos y externos, e imágenes con rutas relativas.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4 text-sm leading-relaxed">
        <p>
          Las imágenes se referencian con rutas relativas al documento y se
          suben junto con el <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">.md</code>.
          Formatos admitidos: <strong>PNG, JPG, GIF, WebP, SVG y BMP</strong>.
          También puedes controlar el tamaño con
          <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">{width=5cm}</code>.
        </p>
        <CodeBlock :code="imagenes" />
        <ResultPreview file="enlaces-imagenes" />
      </CardContent>
    </Card>

    <!-- Notas al pie -->
    <Card :id="sections[3].id" class="scroll-mt-6">
      <CardHeader>
        <CardTitle>{{ sections[3].title }}</CardTitle>
        <CardDescription>
          Referencias con <code class="font-mono text-xs">[^etiqueta]</code>.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <p class="text-sm leading-relaxed">
          Marca la referencia en el texto con
          <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">[^etiqueta]</code>
          y define el contenido al final del documento. Las notas aparecen
          numeradas al pie de la página correspondiente.
        </p>
        <CodeBlock :code="notasAlPie" />
        <p class="text-sm text-muted-foreground">
          Ver el resultado en el
          <a href="/ejemplos/sintaxis.pdf" target="_blank" class="text-primary hover:underline">
            PDF de sintaxis
          </a>
          (sección «Notas al pie»).
        </p>
      </CardContent>
    </Card>

    <!-- Índice -->
    <Card :id="sections[4].id" class="scroll-mt-6">
      <CardHeader>
        <CardTitle>{{ sections[4].title }}</CardTitle>
        <CardDescription>
          Tabla de contenidos generada automáticamente desde los encabezados.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <p class="text-sm leading-relaxed">
          Activa el índice en la cabecera YAML con
          <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">toc: true</code>.
          Con <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">toc-depth</code>
          controlas hasta qué nivel de encabezado se incluye y con
          <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">toc-title</code>
          cambias su título. Combínalo con
          <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">numbersections: true</code>
          para numerar las secciones.
        </p>
        <CodeBlock :code="indiceYaml" />
        <ResultPreview file="indice" />
      </CardContent>
    </Card>

    <!-- Cabecera y portada -->
    <Card :id="sections[5].id" class="scroll-mt-6">
      <CardHeader>
        <CardTitle>{{ sections[5].title }}</CardTitle>
        <CardDescription>
          Metadatos YAML para la portada con la plantilla Eisvogel.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <p class="text-sm leading-relaxed">
          El bloque YAML al inicio del documento controla la portada, el
          resumen, el índice y otros aspectos del PDF. Copia esta plantilla y
          adapta los valores:
        </p>
        <CodeBlock :code="portadaYaml" />
        <ResultPreview file="portada" />
        <div>
          <h3 class="mb-2 text-sm font-semibold">Campos disponibles</h3>
          <div class="overflow-x-auto rounded-lg border">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b bg-muted/50 text-left">
                  <th class="px-3 py-2 font-medium">Campo</th>
                  <th class="px-3 py-2 font-medium">Descripción</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="field in yamlFields" :key="field.name">
                  <td class="px-3 py-2 font-mono text-xs whitespace-nowrap">{{ field.name }}</td>
                  <td class="px-3 py-2 text-muted-foreground">{{ field.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert } from 'lucide-vue-next'

const sections = [
  { id: 'uso', title: 'Cómo usar la aplicación' },
  { id: 'sintaxis-basica', title: 'Sintaxis básica' },
  { id: 'enlaces-imagenes', title: 'Enlaces e imágenes' },
  { id: 'notas-al-pie', title: 'Notas al pie' },
  { id: 'indice', title: 'Índice de contenidos' },
  { id: 'portada', title: 'Cabecera y portada' }
]

const basico = `# Encabezado 1
## Encabezado 2

Texto con **negrita**, *cursiva*, ~~tachado~~ y \`código en línea\`.
Superíndice m^2^ y subíndice H~2~O.

- Lista desordenada
- Con elementos anidados
  - Elemento anidado

1. Lista ordenada
2. Segundo elemento

- [x] Tarea completada
- [ ] Tarea pendiente

> Cita en bloque.

\`\`\`python
def saludar(nombre):
    return f"Hola, {nombre}!"
\`\`\`

| Nombre | Nota |
|--------|------|
| Ana    | 8,5  |
| Luis   | 9,0  |`

const imagenes = `# Enlaces
En línea: [FPVirtual](https://fpvirtual.aragon.es)
Por referencia: [documentación de pandoc][pandoc]

[pandoc]: https://pandoc.org

# Imágenes
Sube la imagen junto al .md y referénciala
con ruta relativa:

![Pie de imagen](captura-ejemplo.png)

Con tamaño controlado:
![icono](captura-ejemplo.png){width=5cm}`

const notasAlPie = `La plantilla Eisvogel genera los PDF con pandoc.[^pandoc]

[^pandoc]: Pandoc es un conversor universal
    de documentos: <https://pandoc.org>.`

const indiceYaml = `---
title: "Título del documento"
toc: true
toc-title: "Índice"
toc-depth: 3
numbersections: true
---`

const portadaYaml = `---
title: "Título del documento"
subtitle: "Subtítulo opcional"
author: [Nombre del autor, Segundo autor]
date: "28 de octubre de 2026"
abstract: |
  Resumen del documento que aparece tras
  la portada.
keywords: [markdown, pandoc, eisvogel]
lang: es
# Portada (opciones Eisvogel)
titlepage: true
titlepage-color: "00539F"
titlepage-text-color: "FFFFFF"
titlepage-rule-color: "FFFFFF"
titlepage-rule-height: 2
# Índice
toc: true
toc-title: "Índice de contenidos"
toc-depth: 2
numbersections: true
---`

const yamlFields: { name: string, description: string }[] = [
  { name: 'title', description: 'Título del documento (obligatorio para la portada).' },
  { name: 'subtitle', description: 'Subtítulo que aparece bajo el título.' },
  { name: 'author', description: 'Autor o lista de autores: [Autor 1, Autor 2].' },
  { name: 'date', description: 'Fecha que se muestra en la portada.' },
  { name: 'abstract', description: 'Resumen que aparece tras la portada (usa | para varias líneas).' },
  { name: 'keywords', description: 'Palabras clave: [una, dos, tres].' },
  { name: 'lang', description: 'Idioma del documento (es, en, fr…). Afecta a separación silábica y tipografía.' },
  { name: 'titlepage', description: 'Genera portada con la plantilla Eisvogel (true/false).' },
  { name: 'titlepage-color', description: 'Color de fondo de la portada, en hexadecimal sin #: "00539F".' },
  { name: 'titlepage-text-color', description: 'Color del texto de la portada: "FFFFFF".' },
  { name: 'titlepage-rule-color', description: 'Color de la línea decorativa bajo el título.' },
  { name: 'titlepage-rule-height', description: 'Grosor de esa línea, en puntos.' },
  { name: 'toc', description: 'Incluye el índice de contenidos (true/false).' },
  { name: 'toc-title', description: 'Título del índice («Índice», «Contenidos»…).' },
  { name: 'toc-depth', description: 'Nivel máximo de encabezado incluido en el índice (1–5).' },
  { name: 'numbersections', description: 'Numera automáticamente las secciones (true/false).' },
  { name: 'fontsize', description: 'Tamaño base de fuente: 10pt, 11pt o 12pt.' },
  { name: 'colorlinks', description: 'Muestra los enlaces en color en lugar de recuadros.' },
  { name: 'linkcolor / urlcolor / toccolor', description: 'Colores de enlaces internos, externos y del índice.' },
  { name: 'page-break', description: 'Fuerza salto de página antes de cada encabezado de nivel 1 (true/false).' }
]
</script>
