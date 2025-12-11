# The Garden of the Forgotten Prompt Gemini CLI Extension

This repository is dedicated to building a Gemini CLI extension for The Garden of the Forgotten Prompt (https://adventure.wietsevenema.eu). The project aims to showcase modern Software Development Life Cycle (SDLC) practices, including robust testing, CI/CD, and comprehensive documentation.

## Development

### Building the Extension

To build the extension locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Build the project:**
    ```bash
    npm run build
    ```
    This will compile the TypeScript code into the \`dist\` directory.

### Linking the Extension

To use this extension with your local Gemini CLI, you need to link it.

1.  **Navigate to the project root:**
    ```bash
    cd /path/to/google-sdlc-demo
    ```

2.  **Link the extension:**
    ```bash
    gemini extensions link .
    ```

Once linked, you can use the defined commands (e.g., `gemini start`, `gemini action`, `gemini list`) directly from your terminal.

