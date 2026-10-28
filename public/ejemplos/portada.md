---
title: "Ejemplo de portada"
subtitle: "Cabecera YAML con la plantilla FPVirtual"
author: [Nombre del autor, Segundo autor]
date: "28 de octubre de 2026"
abstract: |
  Este documento muestra cómo generar la portada corporativa FPVirtual
  con la plantilla Eisvogel personalizada. El resumen (abstract) aparece
  en la página siguiente a la portada y sirve para describir brevemente
  el contenido del documento.
keywords: [markdown, pandoc, fpvirtual, PDF]
lang: es
mainfont: Carlito
sansfont: Carlito
colorlinks: true
# Portada corporativa FPVirtual
titlepage: true
titlepage-logo: "fpvirtual/logo-cdfp.png"
page-background: "fpvirtual/portada-fondo.png"
page-background-opacity: "1"
# Cabeceras y pies de página
header-left: ""
header-right: ""
footer-left: "FPVirtual"
footer-right: '\thepage'
# Índice
toc: true
toc-title: "Índice de contenidos"
toc-depth: 2
# Numeración de secciones
numbersections: true
---

# Introducción

Este ejemplo muestra una cabecera YAML completa para generar la portada
corporativa, el índice y las cabeceras. Solo tienes que copiar el bloque
`---` del fichero de ejemplo y adaptar los valores.

La aplicación resuelve los recursos de la portada
(`fpvirtual/logo-cdfp.png` y `fpvirtual/portada-fondo.png`) de forma
automática, sin necesidad de subirlos con el `.md`.

# Contenido de ejemplo

## Primera sección

Texto de la primera sección.

## Segunda sección

Texto de la segunda sección.
