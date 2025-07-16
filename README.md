# Promptify

A Figma plugin that lets you chat with an AI (Gemini model) and instantly turn its special markup replies into design elements inside Figma using TypeScript and the Figma Plugin API.

## 🚀 Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Running](#running)
- [How It Works](#how-it-works)
- [Usage](#usage)
## Features

- Seamless chat interface inside Figma
- AI (Gemini) responds with a special markup language
- TypeScript logic parses the markup and generates real design nodes
- Uses the Figma Plugin API to create frames, shapes, text, and more
- Clean, minimal UI


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Xenomimi/promptify.git
   cd promptify
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running

To build the plugin:

```bash
npm run build
```

Load the plugin into Figma by selecting `manifest.json` in the Figma desktop app → Plugins → Development → Import Plugin from Manifest.

## How It Works

1. You type your prompt in the chat window.
2. The Gemini model replies with special markup syntax describing UI elements.
3. The plugin parses the markup and uses the Figma Plugin API to create the described elements directly on the canvas.

## Usage

- Open Figma → Run the Promptify plugin.
- Use the chat to describe what you want (e.g., "Create a button with text and an icon").
- The AI generates markup → the plugin builds it instantly in your design.

