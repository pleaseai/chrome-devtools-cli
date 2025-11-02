# Development Guide

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Chrome](https://www.google.com/chrome/) (stable, canary, beta, or dev)
- [Git](https://git-scm.com/)

### Clone Repository

```bash
git clone https://github.com/pleaseai/chrome-devtools-cli.git
cd chrome-devtools-cli

# Initialize submodules
git submodule update --init --recursive
```

### Install Dependencies

```bash
bun install
```

## Development Workflow

### Running in Development Mode

```bash
# Run CLI directly from source
bun run dev nav new-page --url https://example.com

# With arguments
bun run src/cli.ts nav list-pages --format json
```

### Building

```bash
# Build for development
bun run build

# Build with types
bun run build:types

# Build production binary
bun run build:prod
```

### Type Checking

```bash
# Run type checker
bun run type-check
```

### Linting

```bash
# Check for linting errors
bun run lint

# Auto-fix linting errors
bun run lint:fix
```

### Testing

```bash
# Run tests
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

## Project Structure

```
chrome-devtools-cli/
├── src/
│   ├── browser/           # Browser management
│   │   └── index.ts       # getBrowser, getPage, etc.
│   ├── commands/          # Command implementations
│   │   ├── input.ts       # Input automation (click, fill, etc.)
│   │   ├── navigation.ts  # Navigation (navigate, wait, etc.)
│   │   ├── emulation.ts   # Device emulation
│   │   ├── performance.ts # Performance analysis
│   │   ├── network.ts     # Network monitoring
│   │   ├── debugging.ts   # Debugging tools
│   │   └── index.ts       # Command exports
│   ├── cli.ts            # CLI entry point (Commander setup)
│   ├── types.ts          # TypeScript type definitions
│   └── index.ts          # Library exports
├── scripts/
│   ├── build-release.sh  # Build release binaries
│   └── update-formula.sh # Update Homebrew formula
├── examples/             # Usage examples
├── docs/                 # Documentation
├── Formula/              # Homebrew formula
└── references/
    └── chrome-devtools-mcp/  # Git submodule (reference)
```

## Adding New Commands

### 1. Implement Command Function

Create or update a file in `src/commands/`:

```typescript
// src/commands/myfeature.ts
import { getPage } from '../browser/index.js'

export async function myNewCommand(options: MyOptions): Promise<void> {
  const page = await getPage()
  // Implementation
}
```

### 2. Export from Command Index

```typescript
// src/commands/index.ts
export * from './myfeature.js'
```

### 3. Add CLI Command

```typescript
// src/cli.ts
import * as myfeature from './commands/myfeature.js'

const myCmd = program.command('my').description('My commands')

myCmd
  .command('new-command')
  .description('My new command')
  .requiredOption('--option <value>', 'Description')
  .action(async (options) => {
    try {
      await myfeature.myNewCommand(options)
      console.log('Success!')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })
```

### 4. Add Tests

```typescript
// test/commands/myfeature.test.ts
import { describe, expect, test } from 'bun:test'
import { myNewCommand } from '../../src/commands/myfeature'

describe('myNewCommand', () => {
  test('should work correctly', async () => {
    const result = await myNewCommand({ option: 'value' })
    expect(result).toBeDefined()
  })
})
```

### 5. Update Documentation

- Update `README.md` with command usage
- Update `docs/API.md` if adding programmatic API
- Update `docs/QUICK_REFERENCE.md`

## Build Process

### Development Build

```bash
bun run build
```

This:
1. Compiles TypeScript to JavaScript using Bun
2. Outputs to `dist/` directory
3. Creates separate bundles for cli, index, browser, and commands

### Production Build

```bash
bun run build:prod
```

This:
1. Compiles source to standalone executable
2. Minifies and optimizes code
3. Includes bytecode compilation
4. Creates `dist/chrome-devtools` binary

### Release Build

```bash
./scripts/build-release.sh [version]
```

This:
1. Builds binaries for all platforms:
   - macOS ARM64
   - macOS x64
   - Linux ARM64
   - Linux x64
2. Creates tar.gz archives
3. Generates checksums
4. Outputs to `dist/release/`

## Testing Locally

### Test Built Binary

```bash
# Build
bun run build:prod

# Test
./dist/chrome-devtools nav new-page --url https://example.com
```

### Test Installation

```bash
# Link locally
npm link
# or
bun link

# Test global command
chrome-devtools --version
```

## Code Style

We use [@antfu/eslint-config](https://github.com/antfu/eslint-config):

- 2 spaces indentation
- Single quotes
- No semicolons
- Trailing commas

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```bash
git commit -m "feat(nav): add wait-for-selector command"
git commit -m "fix(input): handle missing elements gracefully"
git commit -m "docs: update API reference"
```

## Debugging

### Enable Debug Logs

```bash
# Set DEBUG environment variable
DEBUG=* bun run src/cli.ts nav new-page --url https://example.com

# Or for puppeteer only
DEBUG=puppeteer:* bun run src/cli.ts ...
```

### VS Code Debugging

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CLI",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "bun",
      "runtimeArgs": ["run", "src/cli.ts"],
      "args": ["nav", "new-page", "--url", "https://example.com"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Chrome DevTools

```bash
# Run Chrome with remote debugging
bun run src/cli.ts --browser-url http://127.0.0.1:9222 ...
```

## Performance Profiling

### Bun Profiler

```bash
bun --bun run --hot src/cli.ts ...
```

### Memory Profiling

```bash
bun --inspect src/cli.ts ...
```

## CI/CD

### GitHub Actions

We use GitHub Actions for:
- CI on every push/PR (`.github/workflows/ci.yml`)
- Release builds on tags (`.github/workflows/release.yml`)

### Local CI Simulation

```bash
# Run all checks
bun run type-check && bun run lint && bun test
```

## Common Issues

### Puppeteer Connection Issues

```bash
# Check Chrome is installed
chrome --version

# Use specific Chrome path
chrome-devtools --executable-path /path/to/chrome ...
```

### Module Resolution Errors

```bash
# Clean and reinstall
rm -rf node_modules bun.lockb
bun install
```

### Build Failures

```bash
# Clean build
rm -rf dist
bun run build
```

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [Puppeteer Documentation](https://pptr.dev/)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [@pleaseai/cli-toolkit](https://github.com/passionfactory/cli-toolkit)

## Getting Help

- [GitHub Issues](https://github.com/pleaseai/chrome-devtools-cli/issues)
- [Contributing Guide](./CONTRIBUTING.md)
- [API Reference](./API.md)
