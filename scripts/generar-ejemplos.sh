#!/usr/bin/env bash
# Regenera los PDF de ejemplo de public/ejemplos/ con la plantilla FPVirtual,
# montándola igual que hace la app (ver server/utils/pandoc.ts).
# Requiere Docker y la imagen pandoc (PANDOC_IMAGE).
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${PANDOC_IMAGE:-fpvirtual-pandoc:latest}"

# Recursos corporativos descargables junto a los ejemplos.
mkdir -p "$DIR/public/ejemplos/fpvirtual"
cp "$DIR/fpvirtual-theme/fpvirtual/logo-cdfp.png" \
   "$DIR/fpvirtual-theme/fpvirtual/portada-fondo.png" \
   "$DIR/public/ejemplos/fpvirtual/"

for f in sintaxis enlaces-imagenes portada indice cajas; do
  docker run --rm --network none --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$DIR/public/ejemplos,dst=/data" \
    --mount "type=bind,src=$DIR/fpvirtual-theme,dst=/theme" \
    --env TEXINPUTS=/theme: \
    "$IMAGE" "/data/$f.md" -o "/data/$f.pdf" \
    --from markdown --template=/theme/fpvirtual.latex --pdf-engine=xelatex \
    --resource-path=/data --syntax-highlighting=default \
    --filter pandoc-latex-environment \
    --metadata-file=/theme/content-boxes.yaml \
    -H /theme/content-boxes.tex
  echo "Generado public/ejemplos/$f.pdf"
done
