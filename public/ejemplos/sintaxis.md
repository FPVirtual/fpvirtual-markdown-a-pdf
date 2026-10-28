---
title: "Ejemplo de sintaxis Markdown"
subtitle: "Plantilla corporativa FPVirtual"
author: "FPVirtual"
date: "28 de octubre de 2026"
lang: es
mainfont: Carlito
sansfont: Carlito
keywords: [markdown, pandoc, fpvirtual]
colorlinks: true
titlepage: true
titlepage-logo: "fpvirtual/logo-cdfp.png"
page-background: "fpvirtual/portada-fondo.png"
page-background-opacity: "1"
header-left: ""
header-right: ""
footer-left: "FPVirtual"
footer-right: '\thepage'
---

# Encabezado de nivel 1

## Encabezado de nivel 2

### Encabezado de nivel 3

Los párrafos se separan con una línea en blanco. Este es un párrafo con
**texto en negrita**, *texto en cursiva*, ***negrita y cursiva***,
~~texto tachado~~, `código en línea` y un [enlace a FPVirtual](https://fpvirtual.aragon.es).

También puedes escribir superíndices (p. ej. m^2^, x^10^) y subíndices
(p. ej. H~2~O, CO~2~).

## Listas

### Lista desordenada

- Primer elemento
- Segundo elemento
  - Elemento anidado
  - Otro elemento anidado
- Tercer elemento

### Lista ordenada

1. Primer paso
2. Segundo paso
   1. Subpaso
   2. Otro subpaso
3. Tercer paso

### Lista de tareas

- [x] Revisar el documento
- [x] Subir las imágenes
- [ ] Generar el PDF

## Citas

> Esta es una cita en bloque.
>
> Puede ocupar varios párrafos y contener **formato** interno.

## Línea horizontal

---

## Bloques de código

```python
def saludar(nombre: str) -> str:
    return f"Hola, {nombre}!"

print(saludar("mundo"))
```

```js
const doble = n => n * 2;
console.log(doble(21));
```

## Tablas

| Nombre   | Módulo                       | Horas |
|----------|------------------------------|-------|
| María    | Desarrollo Web en Entorno Servidor | 120   |
| Jorge    | Despliegue de Aplicaciones Web | 75    |
| Lucía    | Diseño de Interfaces Web     | 100   |

: Tabla de ejemplo con los módulos del ciclo.

## Notas al pie

La plantilla FPVirtual genera los PDF con pandoc.[^pandoc] Las notas al pie
ayudan a incluir referencias sin interrumpir la lectura.[^nota]

[^pandoc]: Pandoc es un conversor universal de documentos: <https://pandoc.org>.
[^nota]: Las notas pueden ser tan largas como sea necesario y pueden incluir
    formato *Markdown*.
