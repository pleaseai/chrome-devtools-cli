# Contributing to Chrome DevTools CLI

Thank you for your interest in contributing to Chrome DevTools CLI!

## Development Setup

### Prerequisites

- Node.js 20.19+ or Bun
- Chrome (stable, canary, beta, or dev)
- Git

### Clone the Repository

```bash
git clone https://github.com/passionfactory/chrome-devtools-cli.git
cd chrome-devtools-cli
git submodule update --init --recursive
```

### Install Dependencies

```bash
bun install
# or
npm install
```

### Build

```bash
bun run build
# or
npm run build
```

### Development Mode

```bash
bun run dev
# or
npm run dev
```

## Project Structure

```
chrome-devtools-cli/
├── src/
│   ├── browser/         # Browser management
│   ├── commands/        # Command implementations
│   ├── cli.ts          # CLI entry point
│   ├── types.ts        # TypeScript types
│   └── index.ts        # Library exports
├── examples/           # Usage examples
├── docs/              # Documentation
├── references/
│   └── chrome-devtools-mcp/  # Submodule
└── package.json
```

## Making Changes

### Code Style

We use [@antfu/eslint-config](https://github.com/antfu/eslint-config) for linting.

```bash
bun run lint
bun run lint:fix
```

### Type Checking

```bash
bun run type-check
```

### Testing

```bash
bun test
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and type checking
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Adding New Commands

To add a new command:

1. Add the command implementation in `src/commands/`
2. Export it from `src/commands/index.ts`
3. Add the CLI command in `src/cli.ts`
4. Update the README.md
5. Add examples if appropriate

Example:

```typescript
// src/commands/myfeature.ts
export async function myNewCommand(options: MyOptions): Promise<void> {
  // Implementation
}

// src/cli.ts
const myCmd = program.command('my').description('My commands')

myCmd
  .command('new-command')
  .description('My new command')
  .action(async (options) => {
    await myNewCommand(options)
  })
```

## Documentation

- Update README.md for user-facing changes
- Update docs/API.md for API changes
- Add examples in examples/ for complex features

## Questions?

Feel free to open an issue for any questions or suggestions!
