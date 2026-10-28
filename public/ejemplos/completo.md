---
title: "Documento de ejemplo completo"
subtitle: "Editor online con la plantilla FPVirtual"
author: [Nombre del autor, Segundo autor]
date: "28 de octubre de 2026"
abstract: |
  Este documento se edita online y se compila a PDF con la plantilla
  corporativa FPVirtual (pandoc + Eisvogel). Modifica el contenido y
  pulsa «Generar PDF» para obtener el resultado.
keywords: [markdown, pandoc, fpvirtual, editor]
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

Escribe tu documentación en **Markdown** y obtén un PDF con la
identidad corporativa: portada con logo y fondo, índice de contenidos,
cabeceras y numeración de secciones.

La cabecera YAML de este documento configura la portada, el índice y
las cabeceras. Puedes editarla directamente en el editor: cualquier
metadato de [Eisvogel](https://github.com/Wandmalfbebe/pandoc-latex-template)
es válido.

# Sintaxis básica

## Texto y listas

Texto con *cursiva*, **negrita**, `código en línea` y
[enlaces](https://pandoc.org).

1. Primer elemento numerado.
2. Segundo elemento:
   - Sublista con viñetas.
   - Otro ítem.

> Una cita en bloque para destacar una frase relevante.

## Tabla

| Herramienta | Uso                     |
|-------------|-------------------------|
| pandoc      | Conversión Markdown → LaTeX → PDF |
| Eisvogel    | Plantilla LaTeX        |
| FPVirtual   | Adaptación corporativa |

## Código

```python
def saludar(nombre: str) -> str:
    return f"Hola, {nombre}"
```

# Cajas de contenido

Las cajas se definen con un div de pandoc: abre con `::: nombre`,
escribe el contenido y cierra con `:::`. Admiten formato *Markdown*
interno: listas, **negritas**, `código` y enlaces.

## Nota

::: nota
Información complementaria que ayuda a entender el contenido principal
sin ser imprescindible.
:::

## Aviso

::: aviso
Algo que conviene tener en cuenta antes de continuar:

- Comprueba los metadatos YAML antes de generar el PDF.
- Las imágenes deben referenciarse con rutas relativas.
:::

## Importante

::: importante
Advertencia grave o acción irreversible. Léela antes de actuar: al
**eliminar un curso** se borran también sus matriculaciones.
:::
