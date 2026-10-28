---
title: "Ejemplo de enlaces e imágenes"
author: "FPVirtual"
lang: es
---

# Enlaces

Puedes añadir enlaces de dos formas:

- En línea: visita la [web de FPVirtual](https://fpvirtual.aragon.es).
- Como referencia: consulta la [documentación de pandoc][pandoc] o el
  [repositorio de la plantilla][eisvogel].

[pandoc]: https://pandoc.org
[eisvogel]: https://github.com/Wandmalfarbe/pandoc-latex-template

Los enlaces se muestran en color y son pulsables en el PDF resultante.

# Imágenes

Las imágenes se referencian con **rutas relativas** al documento Markdown.
Sube el `.md` junto con las imágenes en el formulario de la aplicación y
pandoc las incorporará al PDF.

![Ejemplo de imagen incluida en el documento](captura-ejemplo.png)

También puedes usar imágenes dentro de un párrafo:
![icono](captura-ejemplo.png){width=1.5cm}.

Formatos admitidos: **PNG, JPG, GIF, WebP, SVG y BMP**.

## Consejos

- Usa nombres de archivo sin espacios ni tildes (`captura-ejemplo.png` en
  lugar de `mi captura (1).png`).
- Mantén las imágenes en la misma carpeta que el `.md` o en subcarpetas
  referenciadas con rutas relativas (`img/diagrama.png`).
