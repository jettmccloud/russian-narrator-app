# CLAUDE.md - Russian Narrator App

This file provides guidance for AI assistants working on this codebase.

## Project Overview

**Russian Narrator App** is a newly initialized project intended for creating an application with Russian-language narration features. This repository is in its initial state and awaiting development.

## Repository Status

- **Current State**: Empty repository (newly initialized)
- **Main Branch**: Not yet established
- **Development Branch**: `claude/claude-md-mkpr6t6xuhup0475-QxWOy`

## Project Structure (Planned)

When the project is initialized, follow this recommended structure:

```
russian-narrator-app/
├── src/                    # Source code
│   ├── components/         # UI components
│   ├── services/           # Business logic and API services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── index.ts            # Main entry point
├── tests/                  # Test files
├── public/                 # Static assets
├── docs/                   # Documentation
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── README.md               # Project documentation
└── CLAUDE.md               # AI assistant guidelines (this file)
```

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Write self-documenting code with minimal comments
- Prefer functional programming patterns where appropriate

### Git Workflow

1. **Branch Naming**: Use descriptive branch names
   - Feature branches: `feature/<description>`
   - Bug fixes: `fix/<description>`
   - Claude branches: `claude/<session-id>`

2. **Commit Messages**: Write clear, concise commit messages
   - Use imperative mood ("Add feature" not "Added feature")
   - Keep first line under 72 characters
   - Reference issues when applicable

3. **Pull Requests**:
   - Provide clear descriptions of changes
   - Include test plan when applicable
   - Request reviews before merging

### Testing

- Write unit tests for all business logic
- Aim for meaningful test coverage
- Tests should be co-located with source files or in a dedicated `tests/` directory
- Use descriptive test names that explain expected behavior

### Dependencies

- Keep dependencies minimal and well-justified
- Prefer well-maintained, popular packages
- Document why non-obvious dependencies are needed
- Regularly update dependencies for security patches

## Commands (To Be Configured)

Once the project is set up, expect these common commands:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## AI Assistant Instructions

### Before Making Changes

1. Read relevant existing code before modifying
2. Understand the project structure and conventions
3. Check for existing patterns and follow them
4. Review test files to understand expected behavior

### When Implementing Features

1. Start with the simplest solution that works
2. Avoid over-engineering or premature optimization
3. Write tests alongside implementation
4. Keep changes focused and atomic
5. Don't add features beyond what was requested

### Code Quality

- Never introduce security vulnerabilities (XSS, injection, etc.)
- Handle errors appropriately at system boundaries
- Validate user input and external API responses
- Use type safety to catch errors at compile time

### Communication

- Explain decisions when making non-obvious choices
- Ask for clarification when requirements are ambiguous
- Provide context when changes affect multiple files
- Summarize what was done after completing tasks

## Key Conventions

### Naming Conventions

- **Files**: Use kebab-case for files (`my-component.ts`)
- **Components**: Use PascalCase (`MyComponent`)
- **Functions**: Use camelCase (`myFunction`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: Use PascalCase (`UserData`)

### File Organization

- One component/module per file
- Group related functionality together
- Keep files focused and manageable in size
- Use index files for clean exports from directories

## Notes

This CLAUDE.md will be updated as the project evolves. Check this file for the latest guidelines and conventions before starting work on the codebase.

---

*Last updated: 2026-01-22*
