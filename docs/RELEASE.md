# Release Guide

This project uses [release-please](https://github.com/googleapis/release-please) for automated releases.

## How It Works

1. **Commit with Conventional Commits**: All commits should follow [Conventional Commits](https://www.conventionalcommits.org/)
2. **Automatic PR Creation**: release-please creates a release PR when changes are pushed to `main`
3. **Merge to Release**: Merging the release PR triggers:
   - Binary builds for all platforms
   - GitHub release creation
   - npm publishing
   - Homebrew formula update

## Conventional Commits

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature (triggers minor version bump)
- `fix`: Bug fix (triggers patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

### Breaking Changes

Add `BREAKING CHANGE:` in the footer or `!` after type to trigger a major version bump:

```bash
feat!: remove deprecated API

BREAKING CHANGE: The old API has been removed. Use the new API instead.
```

### Examples

```bash
# Feature (0.1.0 -> 0.2.0)
git commit -m "feat(input): add keyboard shortcut support"

# Bug fix (0.1.0 -> 0.1.1)
git commit -m "fix(nav): handle navigation timeouts correctly"

# Breaking change (0.1.0 -> 1.0.0)
git commit -m "feat!: redesign CLI command structure

BREAKING CHANGE: All commands have been reorganized. See migration guide."

# Multiple commits
git commit -m "feat(perf): add performance profiling"
git commit -m "docs: update API documentation"
git commit -m "fix(debug): correct screenshot path handling"
```

## Release Process

### 1. Make Changes

```bash
# Make your changes
vim src/commands/input.ts

# Commit with conventional commits
git add .
git commit -m "feat(input): add drag-and-drop support"
git push origin main
```

### 2. Release PR Created

release-please will automatically:
- Create a PR titled "chore(main): release X.X.X"
- Update version in `package.json`
- Update `CHANGELOG.md`
- Update `.release-please-manifest.json`

### 3. Review and Merge

Review the release PR:
- Check version number is correct
- Review CHANGELOG.md entries
- Verify all commits are included

Merge the PR to trigger the release.

### 4. Automated Release

When the release PR is merged, the workflow automatically:

1. **Build Binaries** (parallel)
   - macOS ARM64
   - macOS x64
   - Linux ARM64
   - Linux x64

2. **Create GitHub Release**
   - Upload binaries
   - Upload checksums
   - Include changelog

3. **Publish to npm**
   - Build package
   - Generate types
   - Publish with provenance

4. **Update Homebrew**
   - Download checksums
   - Update formula in homebrew-tap
   - Commit and push

## Version Bumping

release-please automatically determines the version based on commits since the last release:

- `fix:` commits bump patch version (0.1.0 -> 0.1.1)
- `feat:` commits bump minor version (0.1.0 -> 0.2.0)
- `BREAKING CHANGE:` or `!` bumps major version (0.1.0 -> 1.0.0)

### Manual Version Override

To release a specific version, edit `.release-please-manifest.json`:

```json
{
  ".": "1.0.0"
}
```

Commit and push to create a release PR for that version.

## Secrets Configuration

The release workflow requires the following GitHub secrets:

### Required Secrets

1. **APP_ID**: GitHub App ID
   - Create GitHub App at https://github.com/organizations/pleaseai/settings/apps
   - Copy the App ID
   - Add to GitHub repository secrets

2. **PRIVATE_KEY**: GitHub App Private Key
   - In GitHub App settings, generate a private key
   - Download the `.pem` file
   - Add the entire contents to GitHub repository secrets

3. **NPM_TOKEN**: npm authentication token
   - Get from https://www.npmjs.com/settings/tokens
   - Create "Automation" token with "Publish" permission
   - Add to GitHub repository secrets

### GitHub App Setup

1. **Create GitHub App**
   - Go to https://github.com/organizations/pleaseai/settings/apps
   - Click "New GitHub App"
   - Name: "release-please-bot" (or similar)
   - Homepage URL: https://github.com/pleaseai
   - Uncheck "Webhook" > "Active"

2. **Set Permissions**
   - Repository permissions:
     - Contents: Read and write
     - Pull requests: Read and write
     - Metadata: Read-only

3. **Install App**
   - Install on repositories:
     - chrome-devtools-cli
     - homebrew-tap

4. **Get Credentials**
   - App ID: On app page
   - Private Key: Generate and download

### Setting Secrets

```bash
# In GitHub repository settings
Settings > Secrets and variables > Actions > New repository secret

# Add:
# - APP_ID: (your GitHub App ID)
# - PRIVATE_KEY: (paste entire .pem file contents)
# - NPM_TOKEN: (your npm token)
```

## Homebrew Tap Setup

### 1. Create Homebrew Tap Repository

```bash
# Create new repository: pleaseai/homebrew-tap
# Initialize with README
```

### 2. Formula Will Be Auto-Created

The release workflow automatically:
- Creates `chrome-devtools-cli.rb` in the tap
- Updates checksums
- Commits and pushes

No manual setup needed!

## Testing the Release

### Test Locally Before Release

```bash
# Build binaries locally
bun install
bun build src/cli.ts --compile --target=bun-darwin-arm64 --outfile chrome-devtools
chmod +x chrome-devtools

# Test binary
./chrome-devtools --version
./chrome-devtools nav new-page --url https://example.com
```

### Test Release PR

1. Create a release PR manually to test the workflow
2. Check that all jobs run successfully
3. Don't merge if just testing - close the PR

## Troubleshooting

### Release PR Not Created

- Check commit messages follow Conventional Commits format
- Ensure commits are on `main` branch
- Check GitHub Actions logs for errors

### Build Fails

- Check Bun version compatibility
- Verify all dependencies are in `package.json`
- Check build logs in GitHub Actions

### npm Publish Fails

- Verify `NPM_TOKEN` is set correctly
- Check npm package name is available
- Ensure version doesn't already exist

### Homebrew Update Fails

- Verify `GH_PAT` has correct permissions
- Check homebrew-tap repository exists
- Verify PAT has access to homebrew-tap

## Manual Release (Emergency)

If automated release fails, you can release manually:

### 1. Build Binaries

```bash
./scripts/build-release.sh
```

### 2. Create GitHub Release

```bash
VERSION="0.1.0"
gh release create "v${VERSION}" \
  --title "v${VERSION}" \
  --notes "See CHANGELOG.md" \
  dist/release/*
```

### 3. Publish to npm

```bash
npm publish
```

### 4. Update Homebrew

```bash
./scripts/update-formula.sh
```

## Release Checklist

Before merging release PR:

- [ ] Version number is correct
- [ ] CHANGELOG.md is complete and accurate
- [ ] All CI checks pass
- [ ] Breaking changes are documented
- [ ] Migration guide exists (if breaking changes)
- [ ] Dependencies are up to date
- [ ] Documentation is updated

After release:

- [ ] Verify GitHub release created
- [ ] Verify binaries uploaded
- [ ] Verify npm package published
- [ ] Verify Homebrew formula updated
- [ ] Test installation methods:
  - [ ] Homebrew
  - [ ] Binary download
  - [ ] npm
- [ ] Announce release
- [ ] Update documentation site (if applicable)

## Support

For release issues:
- [GitHub Issues](https://github.com/pleaseai/chrome-devtools-cli/issues)
- [release-please Documentation](https://github.com/googleapis/release-please)
