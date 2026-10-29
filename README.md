# fpvirtual-markdown-a-pdf

Aplicación web (Nuxt 4 + shadcn-vue) que permite subir un documento Markdown
junto con las imágenes que referencia y descargarlo como PDF con la plantilla
corporativa FPVirtual, generado mediante la imagen pandoc del proyecto
[FPVirtual/fpvirtual-pandoc-theme](https://github.com/FPVirtual/fpvirtual-pandoc-theme).

## Requisitos

- Docker con el plugin Compose.
- La imagen pandoc FPVirtual disponible en el daemon de Docker. **Se construye
  en el proyecto `fpvirtual-pandoc-theme`**, no en este repositorio. Por
  defecto este proyecto espera el nombre `fpvirtual-pandoc:latest`
  (configurable con la variable `PANDOC_IMAGE`).

## Puesta en marcha

```bash
cp .env.example .env   # ajusta PANDOC_IMAGE si tu imagen tiene otro nombre/tag
docker compose up --build
```

Abre http://localhost:3000, arrastra el `.md` y sus imágenes (referenciadas con
rutas relativas, p. ej. `![captura](imagen.png)`) y pulsa **Generar PDF**.

## Cómo funciona

- `POST /api/convert` (multipart): guarda el Markdown y las imágenes en un
  directorio de trabajo temporal (`data/uploads/<jobId>`), lanza un contenedor
  efímero de la imagen pandoc a través del socket de Docker:

  ```bash
  docker run --rm --network none \
    --mount type=bind,src=<workspace>,dst=/data \
    --mount type=bind,src=<fpvirtual-theme>,dst=/theme \
    --env TEXINPUTS=/theme: \
    $PANDOC_IMAGE /data/<documento>.md -o /data/document.pdf \
    --from markdown --template=/theme/fpvirtual.latex --pdf-engine=xelatex \
    --resource-path=/data --syntax-highlighting=default \
    --filter pandoc-latex-environment \
    --metadata-file=/theme/content-boxes.yaml \
    -H /theme/content-boxes.tex
  ```

  La plantilla corporativa FPVirtual (`fpvirtual-theme/`, fork de Eisvogel con
  portada corporativa) se monta en `/theme` junto con el logo y el fondo de
  portada; `TEXINPUTS` permite que LaTeX los resuelva sin subirlos con el
  documento. Si el directorio no existe, se usa la plantilla `eisvogel` que
  incluya la imagen.
- Si el documento no trae bloque YAML de metadatos, se le antepone uno por
  defecto (`title`, `lang: es`, `mainfont: Carlito`, `sansfont: Carlito`,
  `colorlinks: true`).
- `GET /api/download/<jobId>`: sirve el PDF y limpia el directorio temporal.
- Los PDF de ejemplo de la página de ayuda (`public/ejemplos/`) se regeneran
  con `scripts/generar-ejemplos.sh`.

## Cajas de contenido

La conversión incluye el filtro `pandoc-latex-environment` y define las
cajas corporativas `nota`, `aviso` e `importante` (tcolorbox, en
`fpvirtual-theme/content-boxes.tex`), por lo que puedes destacar contenido
sin configurar nada en tu documento:

````markdown
::: nota
Información complementaria. Admite *Markdown* interno.
:::

::: aviso
Algo que conviene tener en cuenta antes de continuar.
:::

::: importante
Advertencia grave o acción irreversible.
:::
````

Si generas el PDF fuera de la aplicación, necesitas el filtro y el mapeo
clase → entorno (ver `fpvirtual-theme/content-boxes.yaml`), como en el
ejemplo del proyecto
[fpvirtual-pandoc-theme](https://github.com/FPVirtual/fpvirtual-pandoc-theme).

## Variables de entorno

| Variable           | Por defecto                  | Descripción                                  |
| ------------------ | ---------------------------- | -------------------------------------------- |
| `PANDOC_IMAGE`     | `fpvirtual-pandoc:latest` | Imagen pandoc con la plantilla FPVirtual  |
| `PORT`             | `3000`                       | Puerto publicado en el host                  |
| `NUXT_MAX_UPLOAD_MB` | `50`                       | Tamaño máximo total de subida (MB)           |
| `WORKSPACE_DIR`    | `<proyecto>/data`            | Workspace de conversiones (misma ruta en host y contenedor) |
| `THEME_DIR`        | `<proyecto>/fpvirtual-theme` | Plantilla FPVirtual (misma ruta en host y contenedor) |

## Notas

- El servicio `app` monta `/var/run/docker.sock` para lanzar los contenedores
  efímeros de pandoc. El workspace y la plantilla FPVirtual usan la **misma
  ruta absoluta dentro del contenedor y en el host** (por defecto
  `<proyecto>/data` y `<proyecto>/fpvirtual-theme`, configurables con
  `WORKSPACE_DIR` y `THEME_DIR`), porque el `docker run -v` se resuelve en el
  host. Funciona en Linux con Docker local; con Docker Desktop o un daemon
  remoto habría que revisar la estrategia de rutas.
- La imagen debe exponer pandoc como entrypoint con trabajo en `/data`, las
  fuentes Carlito y el filtro `pandoc-latex-environment` (para las cajas de
  contenido). Lo recomendado es la imagen del proyecto
  [`fpvirtual-pandoc-theme`](https://github.com/FPVirtual/fpvirtual-pandoc-theme)
  (`docker build -t fpvirtual-pandoc:latest .`), que además incluye la
  plantilla `fpvirtual` y los recursos corporativos para uso standalone; la
  app, en cualquier caso, monta su propia copia de la plantilla desde
  `fpvirtual-theme/`.

## Desarrollo local sin Docker

```bash
npm install
npm run dev
```

Requiere el CLI de Docker disponible en el PATH (la app lanza los contenedores
pandoc de la misma forma) y la imagen pandoc FPVirtual presente en el daemon.
