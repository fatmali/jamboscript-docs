---
sidebar_position: 2
---

# Operators

JamboScript supports Swahili keywords for operators, making your code more readable in Swahili!

## Comparison Operators

| Swahili | Symbol | Meaning |
|---------|--------|---------|
| `ni` | `==` | equals |
| `chini` | `<` | less than (chini ya) |
| `zaidi` | `>` | greater than (zaidi ya) |
| `mpaka` | `<=` | up to / less or equal |
| `angalau` | `>=` | at least / greater or equal |

## Logical Operators

| Swahili | Symbol | Meaning |
|---------|--------|---------|
| `na` | `&&` | and |
| `au` | `\|\|` | or |
| `si` | `!` | not |

## Full Example

```javascript
# Mfano wa Swahili Operators
# Testing: ni (==), na (&&), au (||), si (!)
# Testing: chini (<), zaidi (>), mpaka (<=), angalau (>=)

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

## Comparison Operators - Swahili Style

```javascript
acha alama = 75

# chini = < (less than / chini ya)
kama (alama chini 50) {
  andika("Umefeli 😢")
}

# zaidi = > (greater than / zaidi ya)
kama (alama zaidi 70) {
  andika("Umefaulu vizuri! 🎉")
}

# mpaka = <= (up to / mpaka)
kama (alama mpaka 100) {
  andika("Alama ni halali (mpaka 100)")
}

# angalau = >= (at least / angalau)
kama (alama angalau 70) {
  andika("Umepita! Angalau 70 🏆")
}
```

## Combined Operators

You can combine comparison and logical operators for complex conditions:

```javascript
# Mchanganyiko kamili - Full Swahili example!
acha umri_mwanafunzi = 16
kama (umri_mwanafunzi angalau 6 na umri_mwanafunzi mpaka 18) {
  andika("Anaweza kwenda shule! 📚")
}
```

## Mixing Syntax

You can mix Swahili operators with traditional symbols - both work together!

```javascript
acha umri = 18
acha ana_kitambulisho = kweli

# Mchanganyiko - mixing old and new syntax works too!
kama (umri >= 18 na ana_kitambulisho ni kweli) {
  andika("Mchanganyiko unafanya kazi! ✅")
}
```

## Quick Reference

| Operation | Swahili | Symbol | Example |
|-----------|---------|--------|---------|
| Equals | `ni` | `==` | `umri ni 18` |
| Less than | `chini` | `<` | `alama chini 50` |
| Greater than | `zaidi` | `>` | `alama zaidi 70` |
| Less or equal | `mpaka` | `<=` | `alama mpaka 100` |
| Greater or equal | `angalau` | `>=` | `alama angalau 70` |
| And | `na` | `&&` | `a na b` |
| Or | `au` | `\|\|` | `a au b` |
| Not | `si` | `!` | `si a` |
