# JamboScript Documentation 🦁

The official documentation site for **JamboScript** - a Swahili-based programming language.

🌐 **Live Site:** [https://yourusername.github.io/jamboscript-docs/](https://yourusername.github.io/jamboscript-docs/)

## About JamboScript

JamboScript makes programming accessible to Swahili speakers by using familiar Swahili keywords. It transpiles to JavaScript, making it perfect for learning programming concepts.

```javascript
# Hello World in JamboScript
kazi salamu(jina) {
  andika("Jambo " + jina + "!")
}

salamu("Dunia")  // Output: Jambo Dunia!
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This starts a local development server at `http://localhost:3000/`.

### Build

```bash
npm run build
```

Generates static content into the `build` directory.

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Project Structure

```
jamboscript-docs/
├── docs/                 # Documentation pages
│   ├── intro.md         # Getting started
│   ├── basics/          # Language basics
│   │   ├── variables.md
│   │   ├── functions.md
│   │   ├── conditionals.md
│   │   └── loops.md
│   ├── reference/       # Language reference
│   │   └── keywords.md
│   └── examples.md      # Code examples
├── src/
│   ├── css/
│   │   └── custom.css   # Custom styling
│   └── pages/
│       └── index.tsx    # Homepage
├── static/              # Static assets
└── docusaurus.config.ts # Site configuration
```

## Customization

### Updating for Your GitHub Username

1. Edit `docusaurus.config.ts`:
   - Change `url` to your GitHub Pages URL
   - Change `organizationName` to your GitHub username
   - Update `editUrl` links to your repository

2. Deploy:
   ```bash
   GIT_USER=<your-github-username> npm run deploy
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

---

Built with ❤️ using [Docusaurus](https://docusaurus.io/).