# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0](https://github.com/pleaseai/chrome-devtools-cli/compare/v0.1.0...v0.2.0) (2025-11-02)


### 🎉 Features

* add release-please automation ([1975ad0](https://github.com/pleaseai/chrome-devtools-cli/commit/1975ad03c6fb372f3384bb3b8498edfa3af08774))
* initial release of Chrome DevTools CLI ([813ecb6](https://github.com/pleaseai/chrome-devtools-cli/commit/813ecb6edc13491cbe2ffc91ddd706a4e34d4ceb))


### 🛠️ Fixes

* resolve TypeScript type errors and simplify lint-staged ([c376441](https://github.com/pleaseai/chrome-devtools-cli/commit/c376441404c437c90c7ea35d325eb9ad30c7bfba))
* resolve TypeScript type errors in commands and exports ([2dd5f98](https://github.com/pleaseai/chrome-devtools-cli/commit/2dd5f986dbff2f87a4e6510e054aacccd8046490))


### 📄 Documentation

* add badges to README ([e307dd6](https://github.com/pleaseai/chrome-devtools-cli/commit/e307dd65303b05be419daaada9d34e7825aa1f04))
* clarify project is inspired by MCP, not a wrapper ([5736032](https://github.com/pleaseai/chrome-devtools-cli/commit/5736032658b6695c13773e998b85a92d1c516078))

## [0.1.0] - 2025-11-02

### Added

- Initial release
- Input automation commands (click, hover, fill, drag, press-key, upload-file, handle-dialog)
- Navigation commands (list-pages, select-page, close-page, new-page, navigate, wait-for)
- Emulation commands (device emulation, viewport resizing)
- Performance commands (trace recording, performance analysis)
- Network commands (request monitoring and inspection)
- Debugging commands (console monitoring, script evaluation, screenshots, snapshots)
- Multiple output formats (JSON, TOON, text)
- Support for connecting to existing Chrome instances
- Headless mode support
- Device emulation support
- Chrome DevTools MCP integration via submodule

[0.1.0]: https://github.com/passionfactory/chrome-devtools-cli/releases/tag/v0.1.0
