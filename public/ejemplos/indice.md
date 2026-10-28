---
title: "Ejemplo de índice"
subtitle: "Plantilla corporativa FPVirtual"
author: "FPVirtual"
date: "28 de octubre de 2026"
lang: es
mainfont: Carlito
sansfont: Carlito
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
toc-title: "Índice"
toc-depth: 3
numbersections: true
---

# Introducción

Al activar `toc: true` en la cabecera YAML, pandoc genera automáticamente un
índice con los encabezados del documento.

# Desarrollo

## Primer apartado

El índice se actualiza solo: no hace falta mantenerlo a mano.

## Segundo apartado

Con `toc-depth` controlas hasta qué nivel de encabezado aparece.

### Nivel 3

Este encabezado de nivel 3 sí aparece en el índice porque `toc-depth: 3`.

#### Nivel 4

Este nivel 4 no aparece: está por debajo de `toc-depth`.

# Conclusiones

Usa `toc-title` para personalizar el título del índice y
`numbersections: true` para numerar las secciones.
