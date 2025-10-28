# Mintlify Parser

A Node.js tool to parse Mintlify's `llms-full.txt` files and extract English-only documentation by filtering out non-English content.

## Features

- Fetches `llms-full.txt` files from any Mintlify documentation site
- Automatically filters out non-English content (removes URLs with language codes like `/es/`, `/fr/`, etc.)
- Outputs clean markdown file named after the source domain
- Shows detailed statistics about parsed and filtered content

## Installation

### Global Installation

```bash
npm install -g mintlify-parser
```

### Local Usage

```bash
npm install
```

## Usage

### As a Global Command

```bash
mintlify-parser https://docs.firecrawl.dev/llms-full.txt
```

### With Node

```bash
node mintlify-parser.js https://docs.firecrawl.dev/llms-full.txt
```

### With npm script

```bash
npm start https://docs.firecrawl.dev/llms-full.txt
```

## Output

The script will:
1. Fetch the content from the provided URL
2. Parse and filter out non-English sections
3. Save the result as `{domain}.md` (e.g., `docs.firecrawl.dev.md`)
4. Display statistics about the parsing process

Example output:
```
⬇️  Fetching data from: https://docs.firecrawl.dev/llms-full.txt
⚙️  Parsing content...
🗑️  Removed: https://docs.firecrawl.dev/es/guide/intro

✅ Success!
📊 Total sections found: 45
🗑️  Non-English sections removed: 12
📝 English sections kept: 33
💾 Output saved to: docs.firecrawl.dev.md
```

## Requirements

- Node.js >= 18.0.0 (for native fetch API support)

## License

MIT
