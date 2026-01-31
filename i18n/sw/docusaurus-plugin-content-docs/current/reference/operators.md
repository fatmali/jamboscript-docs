---
sidebar_position: 2
---

# Viendeshaji (Operators)

JamboScript inasaidia maneno ya Kiswahili kwa viendeshaji, na kufanya msimbo wako kusomeka vizuri kwa Kiswahili!

## Viendeshaji vya Kulinganisha

| Kiswahili | Ishara | Maana |
|-----------|--------|-------|
| `ni` | `==` | sawa na |
| `chini` | `<` | chini ya |
| `zaidi` | `>` | zaidi ya |
| `mpaka` | `<=` | hadi / chini au sawa |
| `angalau` | `>=` | angalau / zaidi au sawa |

## Viendeshaji vya Mantiki

| Kiswahili | Ishara | Maana |
|-----------|--------|-------|
| `na` | `&&` | na |
| `au` | `\|\|` | au |
| `si` | `!` | si |

## Mfano Kamili

```javascript
# Mfano wa Viendeshaji vya Kiswahili
# Kupima: ni (==), na (&&), au (||), si (!)
# Kupima: chini (<), zaidi (>), mpaka (<=), angalau (>=)

acha umri = 18
acha ana_kitambulisho = kweli

# Kutumia "ni" badala ya "=="
kama (umri ni 18) {
  andika("Umri ni 18!")
}

# Kutumia "na" badala ya "&&"
kama (umri ni 18 na ana_kitambulisho) {
  andika("Unaweza kupiga kura! 🗳️")
}

# Kutumia "au" badala ya "||"
acha ni_mwanafunzi = sivyo
acha ana_kazi = kweli

kama (ni_mwanafunzi au ana_kazi) {
  andika("Una shughuli!")
}

# Kutumia "si" badala ya "!"
kama (si ni_mwanafunzi) {
  andika("Wewe si mwanafunzi")
}
```

## Viendeshaji vya Kulinganisha - Mtindo wa Kiswahili

```javascript
acha alama = 75

# chini = < (chini ya)
kama (alama chini 50) {
  andika("Umefeli 😢")
}

# zaidi = > (zaidi ya)
kama (alama zaidi 70) {
  andika("Umefaulu vizuri! 🎉")
}

# mpaka = <= (hadi)
kama (alama mpaka 100) {
  andika("Alama ni halali (mpaka 100)")
}

# angalau = >= (angalau)
kama (alama angalau 70) {
  andika("Umepita! Angalau 70 🏆")
}
```

## Viendeshaji Vilivyochanganywa

Unaweza kuchanganya viendeshaji vya kulinganisha na vya mantiki kwa masharti magumu:

```javascript
# Mchanganyiko kamili - Mfano wa Kiswahili kikamilifu!
acha umri_mwanafunzi = 16
kama (umri_mwanafunzi angalau 6 na umri_mwanafunzi mpaka 18) {
  andika("Anaweza kwenda shule! 📚")
}
```

## Kuchanganya Sintaksia

Unaweza kuchanganya viendeshaji vya Kiswahili na ishara za kawaida - zote zinafanya kazi pamoja!

```javascript
acha umri = 18
acha ana_kitambulisho = kweli

# Mchanganyiko - kuchanganya sintaksia ya zamani na mpya kunafanya kazi pia!
kama (umri >= 18 na ana_kitambulisho ni kweli) {
  andika("Mchanganyiko unafanya kazi! ✅")
}
```

## Rejea ya Haraka

| Operesheni | Kiswahili | Ishara | Mfano |
|------------|-----------|--------|-------|
| Sawa na | `ni` | `==` | `umri ni 18` |
| Chini ya | `chini` | `<` | `alama chini 50` |
| Zaidi ya | `zaidi` | `>` | `alama zaidi 70` |
| Chini au sawa | `mpaka` | `<=` | `alama mpaka 100` |
| Zaidi au sawa | `angalau` | `>=` | `alama angalau 70` |
| Na | `na` | `&&` | `a na b` |
| Au | `au` | `\|\|` | `a au b` |
| Si | `si` | `!` | `si a` |
