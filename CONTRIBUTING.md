# Contributing to The Garden of the Forgotten Prompt Extension

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Branching Strategy

We follow a feature-branch workflow.

*   **`main`**: The main branch contains the latest production-ready code. All Pull Requests should target this branch.
*   **`feature/<name>`**: Use for new features (e.g., `feature/add-game-loop`).
*   **`bugfix/<name>`**: Use for bug fixes (e.g., `bugfix/fix-parser-error`).
*   **`docs/<name>`**: Use for documentation updates (e.g., `docs/update-readme`).
*   **`chore/<name>`**: Use for maintenance tasks (e.g., `chore/update-dependencies`).

### Workflow

1.  **Create a Branch**: Create a new branch from `main` using one of the prefixes above.
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Commit Changes**: Make your changes and commit them with clear, descriptive messages.
3.  **Push**: Push your branch to the repository.
4.  **Open a Pull Request**: Open a PR against the `main` branch. Describe your changes and link to any relevant issues.
