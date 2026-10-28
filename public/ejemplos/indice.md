---
title: "Ejemplo de índice"
author: "FPVirtual"
lang: es
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
