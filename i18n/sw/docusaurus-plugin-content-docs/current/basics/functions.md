---
sidebar_position: 2
---

# Kazi

Tumia `kazi` kutengeneza kazi na `rudisha` kurudisha thamani.

## Kazi ya Msingi

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

## Kurudisha Thamani

Tumia `rudisha` kurudisha thamani:

```javascript
kazi ongeza(a, b) {
  rudisha a + b
}

acha jumla = ongeza(5, 3)
andika("Jumla: " + jumla)
```

## Vigezo Vingi

```javascript
kazi hesabu_eneo(urefu, upana) {
  rudisha urefu * upana
}

acha eneo = hesabu_eneo(10, 5)
andika("Eneo: " + eneo)
```

## Kuchapisha

Tumia `andika` kuchapisha:

```javascript
andika("Habari Dunia!")
andika("Nambari: " + 42)
```

## Rejea ya Maneno

| JamboScript | JavaScript | Maana |
|-------------|------------|-------|
| `kazi` | `function` | kazi |
| `rudisha` | `return` | rudisha |
| `andika` | `console.log` | chapisha |
