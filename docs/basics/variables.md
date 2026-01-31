---
sidebar_position: 1
---

# Variables

## Declaring Variables

### `acha` — let (mutable)

```javascript
acha jina = "Amina"
acha umri = 25

jina = "Fatma"  # Can be changed
```

### `thabiti` — const (constant)

```javascript
thabiti PI = 3.14159
thabiti KIWANGO = 100

# PI = 3.14  ← Error! Cannot reassign
```

## Data Types

| Type | Example | Keyword |
|------|---------|---------|
| Number | `42`, `3.14` | — |
| String | `"Jambo"` | — |
| Boolean | `kweli`, `sivyo` | true/false |
| Null | `tupu` | null |

### Numbers

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
  andika("This is true!")
}
```

### Null

- `tupu` = null

```javascript
acha hakuna = tupu

kama (hakuna ni tupu) {
  andika("Value is null")
}
```

## Compound Assignment

```javascript
acha jumla = 0
jumla += 5
jumla += 10

acha x = 10
x -= 3   # x = 7
x *= 2   # x = 14
x /= 2   # x = 7
```

## Increment / Decrement

```javascript
acha i = 1
i++      # i = 2
i--      # i = 1
```
