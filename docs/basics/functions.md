---
sidebar_position: 2
---

# Functions

Use `kazi` to define functions and `rudisha` to return values.

## Basic Function

```javascript
kazi salamu(jina) {
  kama (jina ni "Fatma") {
    andika("Jambo boss 👑")
  } la sivyo {
    andika("Jambo " + jina)
  }
}

salamu("Fatma")
salamu("Juma")
salamu("Amina")
```

## Return Values

Use `rudisha` to return a value:

```javascript
kazi ongeza(a, b) {
  rudisha a + b
}

acha total = ongeza(5, 3)
andika("Total: " + total)
```

## Multiple Parameters

```javascript
kazi hesabu_eneo(urefu, upana) {
  rudisha urefu * upana
}

acha eneo = hesabu_eneo(10, 5)
andika("Area: " + eneo)
```

## Printing Output

Use `andika` to print to console:

```javascript
andika("Hello World!")
andika("Number: " + 42)
```

## Keyword Reference

| JamboScript | JavaScript | Meaning |
|-------------|------------|---------|
| `kazi` | `function` | function |
| `rudisha` | `return` | return |
| `andika` | `console.log` | print |
