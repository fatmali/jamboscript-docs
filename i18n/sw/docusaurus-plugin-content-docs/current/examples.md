---
sidebar_position: 5
---

# Mifano

Mifano kamili ya msimbo inayoonyesha vipengele vya JamboScript.

## Habari Dunia

```javascript
andika("Habari Dunia!")
```

## Kazi ya Salamu

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

## Vibadilika na Hesabu

```javascript
acha nambari = 10
thabiti KIWANGO = 100
acha matokeo = nambari * 2

andika("Nambari: " + nambari)
andika("Matokeo: " + matokeo)
```

## Upaji wa Kiwango

```javascript
acha jumla = 0
jumla += 5
jumla += 10
andika("Jumla: " + jumla)
```

## Mzunguko wa Wakati

```javascript
acha i = 1

wakati (i <= 5) {
  andika("Hesabu: " + i)
  i++
}
```

## Mzunguko wa Rudia

```javascript
rudia (acha j = 1; j <= 3; j++) {
  andika("Rudia: " + j)
}
```

## Kazi na Kurudisha

```javascript
kazi ongeza(a, b) {
  rudisha a + b
}

acha jumla = ongeza(5, 3)
andika("Jumla: " + jumla)
```

## Booleans

```javascript
acha niKweli = kweli
acha niSivyo = sivyo

kama (niKweli) {
  andika("Hii ni kweli!")
}

kama (niSivyo) {
  andika("Haitaonekana")
} la sivyo {
  andika("Hii inaonekana badala yake")
}
```

## Kuangalia Tupu

```javascript
acha hakuna = tupu

kama (hakuna ni tupu) {
  andika("Thamani ni tupu")
}
```

## Opereta ya Ternary

```javascript
acha umri = 20
acha hadhi = umri >= 18 ? "mtu mzima" : "mtoto"
andika("Hadhi: " + hadhi)
```

## Kauli ya Chagua

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

## Opereta za Kulinganisha za Kiswahili

```javascript
acha umri = 18
acha ana_kitambulisho = kweli

# ni = sawa na
kama (umri ni 18) {
  andika("Umri ni 18!")
}

# na = na
kama (umri ni 18 na ana_kitambulisho) {
  andika("Unaweza kupiga kura!")
}

# au = au
acha ni_mwanafunzi = sivyo
acha ana_kazi = kweli

kama (ni_mwanafunzi au ana_kazi) {
  andika("Una shughuli!")
}

# si = si
kama (si ni_mwanafunzi) {
  andika("Wewe si mwanafunzi")
}
```

## Kulinganisha kwa Kiwango

```javascript
acha alama = 75

# chini = chini ya
kama (alama chini 50) {
  andika("Umefeli")
}

# zaidi = zaidi ya
kama (alama zaidi 70) {
  andika("Umefaulu!")
}

# mpaka = mpaka (chini au sawa)
kama (alama mpaka 100) {
  andika("Alama halali")
}

# angalau = angalau (zaidi au sawa)
kama (alama angalau 70) {
  andika("Angalau 70!")
}
```

## Masharti ya Pamoja

```javascript
acha umri = 16

kama (umri angalau 6 na umri mpaka 18) {
  andika("Anaweza kwenda shule!")
}
```

## Kauli ya Endelea

```javascript
andika("Nambari za peke:")

rudia (acha k = 1; k <= 10; k++) {
  kama (k % 2 == 0) {
    endelea
  }
  andika(k)
}
```
