---
sidebar_position: 1
---

# Vibadilika

## Kutangaza Vibadilika

### `acha` — let (inaweza kubadilishwa)

```javascript
acha jina = "Amina"
acha umri = 25

jina = "Fatma"  # Inaweza kubadilishwa
```

### `thabiti` — const (haibadilike)

```javascript
thabiti PI = 3.14159
thabiti KIWANGO = 100

# PI = 3.14  ← Kosa! Haiwezi kubadilishwa
```

## Aina za Data

| Aina | Mfano | Neno |
|------|-------|------|
| Nambari | `42`, `3.14` | — |
| Maneno | `"Jambo"` | — |
| Boolean | `kweli`, `sivyo` | kweli/sivyo |
| Tupu | `tupu` | tupu |

### Nambari

```javascript
acha nambari = 10
thabiti KIWANGO = 100
acha matokeo = nambari * 2

andika("Nambari: " + nambari)
andika("Matokeo: " + matokeo)
```

### Booleans

- `kweli` = true
- `sivyo` = false

```javascript
acha niKweli = kweli
acha niSivyo = sivyo

kama (niKweli) {
  andika("Hii ni kweli!")
}
```

### Tupu

- `tupu` = null

```javascript
acha hakuna = tupu

kama (hakuna ni tupu) {
  andika("Thamani ni tupu")
}
```

## Opereta za Kiwango

```javascript
acha jumla = 0
jumla += 5
jumla += 10

acha x = 10
x -= 3   # x = 7
x *= 2   # x = 14
x /= 2   # x = 7
```

## Kuongeza / Kupunguza

```javascript
acha i = 1
i++      # i = 2
i--      # i = 1
```
