---
title: "Cajas de contenido"
subtitle: "Nota, aviso e importante"
author: "FPVirtual"
date: "28 de octubre de 2026"
abstract: |
  La plantilla corporativa FPVirtual incluye tres cajas destacadas para
  enriquecer la documentación: nota, aviso e importante.
lang: es
mainfont: Carlito
sansfont: Carlito
keywords: [markdown, pandoc, fpvirtual, cajas]
colorlinks: true
titlepage: true
titlepage-logo: "fpvirtual/logo-cdfp.png"
page-background: "fpvirtual/portada-fondo.png"
page-background-opacity: "1"
header-left: ""
header-right: ""
footer-left: "FPVirtual"
footer-right: '\thepage'
toc: true
toc-title: "Índice de contenidos"
toc-depth: 2
numbersections: true
---

# Uso de las cajas

Cada caja se define con un div de pandoc: una línea con `::: nombre`, el
contenido y una línea de cierre con `:::`. Las cajas admiten formato
*Markdown* interno: listas, **negritas**, `código`, enlaces…

## Nota

::: nota
Información complementaria que ayuda a entender el contenido principal
sin ser imprescindible.
:::

## Aviso

::: aviso
Algo que conviene tener en cuenta antes de continuar, como requisitos
previos o comportamientos inesperados:

- Comprueba que las imágenes usan rutas relativas.
- Sube todos los ficheros junto al `.md`.
:::

## Importante

::: importante
Advertencia grave o acción irreversible. Léela antes de actuar: al
**eliminar un curso** se borran también sus matriculaciones y sus
copias de seguridad.
:::

# Personalización avanzada

Si generas el PDF fuera de la aplicación, el mapeo clase → entorno
LaTeX se declara en el YAML y la conversión requiere el filtro
`pandoc-latex-environment`:

```yaml
pandoc-latex-environment:
  nota: [nota]
  aviso: [aviso]
  importante: [importante]
```

```shell
pandoc documento.md -o documento.pdf --template=fpvirtual.latex \
  --filter pandoc-latex-environment --toc
```

::: nota
En la aplicación no hace falta ninguna de estas dos cosas: la conversión
ya aplica el filtro y las definiciones de las cajas automáticamente.
:::
