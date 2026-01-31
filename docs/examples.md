---
sidebar_position: 5
---

# Examples

Complete code examples showing JamboScript features.

## Hello World

```javascript
andika("Habari Dunia!")
```

## Greeting Function

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

## Variables and Math

```javascript
acha nambari = 10
thabiti KIWANGO = 100
acha matokeo = nambari * 2

andika("Nambari: " + nambari)
andika("Matokeo: " + matokeo)
```

## Compound Assignment

```javascript
acha jumla = 0
jumla += 5
jumla += 10
andika("Jumla: " + jumla)
```

## While Loop

```javascript
acha i = 1

wakati (i <= 5) {
  andika("Hesabu: " + i)
  i++
}
```

## For Loop

```javascript
rudia (acha j = 1; j <= 3; j++) {
  andika("Rudia: " + j)
}
```

## Functions with Return

```javascript
kazi ongeza(a, b) {
  rudisha a + b
}

acha total = ongeza(5, 3)
andika("Jumla: " + total)
```

## Booleans

```javascript
acha niKweli = kweli
acha niSivyo = sivyo

kama (niKweli) {
  andika("Hii ni kweli!")
}

kama (niSivyo) {
  andika("Won't show")
} la sivyo {
  andika("This shows instead")
}
```

## Null Check

```javascript
acha hakuna = tupu

kama (hakuna ni tupu) {
  andika("Value is null")
}
```

## Ternary Operator

```javascript
acha umri = 20
acha hadhi = umri >= 18 ? "mtu mzima" : "mtoto"
andika("Hadhi: " + hadhi)
```

## Switch Statement

```javascript
acha siku = 3

chagua (siku) {
  hali 1:
    andika("Jumatatu")
    vunja
  hali 2:
    andika("Jumanne")
    vunja
  hali 3:
    andika("Jumatano")
    vunja
  hali 4:
    andika("Alhamisi")
    vunja
  hali 5:
    andika("Ijumaa")
    vunja
  kawaida:
    andika("Wikendi!")
}
```

## Swahili Comparison Operators

```javascript
acha umri = 18
acha ana_kitambulisho = kweli

# ni = equals
kama (umri ni 18) {
  andika("Umri ni 18!")
}

# na = and
kama (umri ni 18 na ana_kitambulisho) {
  andika("Unaweza kupiga kura!")
}

# au = or
acha ni_mwanafunzi = sivyo
acha ana_kazi = kweli

kama (ni_mwanafunzi au ana_kazi) {
  andika("Una shughuli!")
}

# si = not
kama (si ni_mwanafunzi) {
  andika("Wewe si mwanafunzi")
}
```

## Range Comparisons

```javascript
acha alama = 75

# chini = less than
kama (alama chini 50) {
  andika("Failed")
}

# zaidi = greater than
kama (alama zaidi 70) {
  andika("Passed!")
}

# mpaka = less or equal (up to)
kama (alama mpaka 100) {
  andika("Valid score")
}

# angalau = greater or equal (at least)
kama (alama angalau 70) {
  andika("At least 70!")
}
```

## Combined Conditions

```javascript
acha umri = 16

kama (umri angalau 6 na umri mpaka 18) {
  andika("Can go to school!")
}
```

## Continue Statement

```javascript
andika("Odd numbers:")

rudia (acha k = 1; k <= 10; k++) {
  kama (k % 2 == 0) {
    endelea
  }
  andika(k)
}
```
