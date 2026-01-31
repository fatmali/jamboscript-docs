---
sidebar_position: 3
---

# Masharti

## Kama / La Sivyo

Tumia `kama` kwa if na `la sivyo` kwa else:

```javascript
acha niKweli = kweli

kama (niKweli) {
  andika("Hii ni kweli!")
}

kama (sivyo) {
  andika("Haitaonekana")
} la sivyo {
  andika("Hii inaonekana badala yake")
}
```

## Opereta za Kulinganisha

JamboScript inakubali opereta za Kiswahili na alama:

| Kiswahili | Alama | Maana |
|-----------|-------|-------|
| `ni` | `==` | sawa na |
| `chini` | `<` | chini ya |
| `zaidi` | `>` | zaidi ya |
| `mpaka` | `<=` | mpaka (chini au sawa) |
| `angalau` | `>=` | angalau (zaidi au sawa) |
| — | `===` | sawa kabisa |

### Mifano

```javascript
acha umri = 18

# Kutumia opereta ya Kiswahili
kama (umri ni 18) {
  andika("Umri ni 18!")
}

acha alama = 75

kama (alama chini 50) {
  andika("Umefeli")
}

kama (alama zaidi 70) {
  andika("Umefaulu!")
}

kama (alama mpaka 100) {
  andika("Alama halali")
}

kama (alama angalau 70) {
  andika("Angalau 70!")
}
```

## Opereta za Mantiki

| Kiswahili | Alama | Maana |
|-----------|-------|-------|
| `na` | `&&` | na |
| `au` | `\|\|` | au |
| `si` | `!` | si |

### Mifano

```javascript
acha umri = 18
acha ana_kitambulisho = kweli

# Kutumia "na"
kama (umri ni 18 na ana_kitambulisho) {
  andika("Unaweza kupiga kura!")
}

# Kutumia "au"
acha ni_mwanafunzi = sivyo
acha ana_kazi = kweli

kama (ni_mwanafunzi au ana_kazi) {
  andika("Una shughuli!")
}

# Kutumia "si"
kama (si ni_mwanafunzi) {
  andika("Wewe si mwanafunzi")
}
```

### Mfano wa Pamoja

```javascript
acha umri = 16

kama (umri angalau 6 na umri mpaka 18) {
  andika("Anaweza kwenda shule!")
}
```

## Opereta ya Ternary

```javascript
acha umri = 20
acha hadhi = umri >= 18 ? "mtu mzima" : "mtoto"
andika("Hadhi: " + hadhi)
```

## Kauli ya Chagua

Tumia `chagua`, `hali`, `kawaida`, na `vunja`:

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

## Rejea ya Maneno

| JamboScript | JavaScript | Maana |
|-------------|------------|-------|
| `kama` | `if` | kama |
| `la sivyo` | `else` | la sivyo |
| `chagua` | `switch` | chagua |
| `hali` | `case` | hali |
| `kawaida` | `default` | kawaida |
| `vunja` | `break` | vunja |
