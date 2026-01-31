---
sidebar_position: 3
---

# Conditionals

## If / Else

Use `kama` for if and `la sivyo` for else:

```javascript
acha niKweli = kweli

kama (niKweli) {
  andika("This is true!")
}

kama (sivyo) {
  andika("Won't show")
} la sivyo {
  andika("This shows instead")
}
```

## Comparison Operators

JamboScript supports both symbol and Swahili operators:

| Swahili | Symbol | Meaning |
|---------|--------|---------|
| `ni` | `==` | equals |
| `chini` | `<` | less than |
| `zaidi` | `>` | greater than |
| `mpaka` | `<=` | less or equal |
| `angalau` | `>=` | greater or equal |
| — | `===` | strict equals |

### Examples

```javascript
acha umri = 18

# Using Swahili operator
kama (umri ni 18) {
  andika("Age is 18!")
}

acha alama = 75

kama (alama chini 50) {
  andika("Failed")
}

kama (alama zaidi 70) {
  andika("Passed!")
}

kama (alama mpaka 100) {
  andika("Valid score")
}

kama (alama angalau 70) {
  andika("At least 70!")
}
```

### Strict Equality

```javascript
acha nambari = 5
acha neno = "5"

kama (nambari === 5) {
  andika("Strictly equal")
}
```

## Logical Operators

| Swahili | Symbol | Meaning |
|---------|--------|---------|
| `na` | `&&` | and |
| `au` | `\|\|` | or |
| `si` | `!` | not |

### Examples

```javascript
acha umri = 18
acha ana_kitambulisho = kweli

# Using "na" (and)
kama (umri ni 18 na ana_kitambulisho) {
  andika("Can vote!")
}

# Using "au" (or)
acha ni_mwanafunzi = sivyo
acha ana_kazi = kweli

kama (ni_mwanafunzi au ana_kazi) {
  andika("Is busy!")
}

# Using "si" (not)
kama (si ni_mwanafunzi) {
  andika("Not a student")
}
```

### Combined Example

```javascript
acha umri = 16

kama (umri angalau 6 na umri mpaka 18) {
  andika("Can go to school!")
}
```

## Ternary Operator

```javascript
acha umri = 20
acha hadhi = umri >= 18 ? "adult" : "child"
andika("Status: " + hadhi)
```

## Switch Statement

Use `chagua`, `hali`, `kawaida`, and `vunja`:

```javascript
acha siku = 3

chagua (siku) {
  hali 1:
    andika("Monday")
    vunja
  hali 2:
    andika("Tuesday")
    vunja
  hali 3:
    andika("Wednesday")
    vunja
  hali 4:
    andika("Thursday")
    vunja
  hali 5:
    andika("Friday")
    vunja
  kawaida:
    andika("Weekend!")
}
```

## Keyword Reference

| JamboScript | JavaScript | Meaning |
|-------------|------------|---------|
| `kama` | `if` | if |
| `la sivyo` | `else` | else |
| `chagua` | `switch` | switch |
| `hali` | `case` | case |
| `kawaida` | `default` | default |
| `vunja` | `break` | break |
