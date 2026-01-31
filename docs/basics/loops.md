---
sidebar_position: 4
---

# Loops

## While Loop

Use `wakati` for while loops:

```javascript
acha i = 1

wakati (i <= 5) {
  andika("Count: " + i)
  i++
}
```

## For Loop

Use `rudia` for for loops:

```javascript
rudia (acha j = 1; j <= 3; j++) {
  andika("Repeat: " + j)
}
```

## Break

Use `vunja` to exit a loop:

```javascript
rudia (acha i = 1; i <= 10; i++) {
  kama (i ni 5) {
    vunja
  }
  andika(i)
}
# Output: 1, 2, 3, 4
```

## Continue

Use `endelea` to skip to the next iteration:

```javascript
andika("Odd numbers:")

rudia (acha k = 1; k <= 10; k++) {
  kama (k % 2 == 0) {
    endelea
  }
  andika(k)
}
# Output: 1, 3, 5, 7, 9
```

## Keyword Reference

| JamboScript | JavaScript | Meaning |
|-------------|------------|---------|
| `wakati` | `while` | while |
| `rudia` | `for` | for/repeat |
| `vunja` | `break` | break |
| `endelea` | `continue` | continue |
