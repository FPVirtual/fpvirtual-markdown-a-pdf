#!/usr/bin/env bash
# Regenera los PDF de ejemplo de public/ejemplos/ con la plantilla FPVirtual.
# Requiere la imagen pandoc (PANDOC_IMAGE) y Docker.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${PANDOC_IMAGE:-fpvirtualaragon/pandoc:latest}"

for f in sintaxis enlaces-imagenes portada indice; do
  docker run --rm --network none --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$DIR/public/ejemplos,dst=/data" \
    --mount "type=bind,src=$DIR/scripts/fpvirtual-theme,dst=/theme" \
    "$IMAGE" "/data/$f.md" -o "/data/$f.pdf" \
    --from markdown --template=/theme/fpvirtual.latex --pdf-engine=xelatex \
    --resource-path=/data --syntax-highlighting=idiomatic
  echo "Generado public/ejemplos/$f.pdf"
done
