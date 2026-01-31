---
sidebar_position: 1
sidebar_label: Intro
slug: /
---

<div style={{textAlign: 'center', marginBottom: '2rem'}}>
  <img src="/img/logo.svg" alt="JamboScript Logo" width="150" />
</div>

# Welcome to JamboScript!

**JamboScript** is a Swahili-based programming language that transpiles to JavaScript.

## Quick Example

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
```

## Installation

```bash
npm install -g jamboscript
```

## Your First Program

Create a file called `habari.jambo`:

```javascript
andika("Habari Dunia!")

acha jina = "Juma"
andika("Jina langu ni " + jina)
```

Run it:

```bash
jamboscript habari.jambo
```

## Why JamboScript?

- **Learn in Swahili** — Use familiar words like `kazi` (function), `kama` (if), `andika` (print)
- **Real JavaScript** — Transpiles to clean JS you can use anywhere
- **Full featured** — Variables, functions, loops, conditionals, and more
