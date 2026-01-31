---
sidebar_position: 4
---

# Mizunguko

## Mzunguko wa Wakati

Tumia `wakati` kwa mizunguko ya while:

```javascript
acha i = 1

wakati (i <= 5) {
  andika("Hesabu: " + i)
  i++
}
```

## Mzunguko wa Rudia

Tumia `rudia` kwa mizunguko ya for:

```javascript
rudia (acha j = 1; j <= 3; j++) {
  andika("Rudia: " + j)
}
```

## Vunja

Tumia `vunja` kutoka kwenye mzunguko:

```javascript
rudia (acha i = 1; i <= 10; i++) {
  kama (i ni 5) {
    vunja
  }
  andika(i)
}
# Matokeo: 1, 2, 3, 4
```

## Endelea

Tumia `endelea` kuruka hadi hatua inayofuata:

```javascript
andika("Nambari za peke:")

rudia (acha k = 1; k <= 10; k++) {
  kama (k % 2 == 0) {
    endelea
  }
  andika(k)
}
# Matokeo: 1, 3, 5, 7, 9
```

## Rejea ya Maneno

| JamboScript | JavaScript | Maana |
|-------------|------------|-------|
| `wakati` | `while` | wakati |
| `rudia` | `for` | rudia |
| `vunja` | `break` | vunja |
| `endelea` | `continue` | endelea |
