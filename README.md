# fpvirtual-markdown-a-pdf

Aplicación web (Nuxt 4 + shadcn-vue) que permite subir un documento Markdown
junto con las imágenes que referencia y descargarlo como PDF con la plantilla
corporativa FPVirtual, generado mediante la imagen pandoc del proyecto
[FPVirtual/fpvirtual-pandoc-theme](https://github.com/FPVirtual/fpvirtual-pandoc-theme).

## Requisitos

- Docker con el plugin Compose.
- La imagen pandoc FPVirtual disponible en el daemon de Docker. **Se construye
  en el proyecto `fpvirtual-pandoc-theme`**, no en este repositorio. Por
  defecto este proyecto espera el nombre `fpvirtualaragon/pandoc:latest`
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
    $PANDOC_IMAGE /data/<documento>.md -o /data/document.pdf \
    --from markdown --template=eisvogel --pdf-engine=xelatex \
    --resource-path=/data --syntax-highlighting=idiomatic
  ```

- Si el documento no trae bloque YAML de metadatos, se le antepone uno por
  defecto (`title`, `lang: es`, `mainfont: Carlito`, `sansfont: Carlito`).
- `GET /api/download/<jobId>`: sirve el PDF y limpia el directorio temporal.

## Variables de entorno

| Variable           | Por defecto                  | Descripción                                  |
| ------------------ | ---------------------------- | -------------------------------------------- |
| `PANDOC_IMAGE`     | `fpvirtualaragon/pandoc:latest` | Imagen pandoc con la plantilla FPVirtual  |
| `PORT`             | `3000`                       | Puerto publicado en el host                  |
| `NUXT_MAX_UPLOAD_MB` | `50`                       | Tamaño máximo total de subida (MB)           |

## Notas

- El servicio `app` monta `/var/run/docker.sock` para lanzar los contenedores
  efímeros de pandoc. El workspace usa la **misma ruta absoluta dentro del
  contenedor y en el host** (por defecto `<proyecto>/data`, configurable con
  `WORKSPACE_DIR`), porque el `docker run -v` se resuelve en el host. Funciona
  en Linux con Docker local; con Docker Desktop o un daemon remoto habría que
  revisar la estrategia de rutas.
- La imagen debe exponer pandoc como entrypoint con trabajo en `/data` e
  incluir la plantilla con nombre `eisvogel` y las fuentes Carlito, tal como
  documenta el README de `fpvirtual-pandoc-theme`.

## Desarrollo local sin Docker

```bash
npm install
npm run dev
```

Requiere el CLI de Docker disponible en el PATH (la app lanza los contenedores
pandoc de la misma forma) y la imagen pandoc FPVirtual presente en el daemon.
