class ChromeDevtoolsCli < Formula
  desc "CLI wrapper for Chrome DevTools MCP - Control and inspect Chrome"
  homepage "https://github.com/pleaseai/chrome-devtools-cli"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-darwin-arm64.tar.gz"
      sha256 "PLACEHOLDER_ARM64_SHA256"
    else
      url "https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-darwin-x64.tar.gz"
      sha256 "PLACEHOLDER_X64_SHA256"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-linux-arm64.tar.gz"
      sha256 "PLACEHOLDER_LINUX_ARM64_SHA256"
    else
      url "https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-linux-x64.tar.gz"
      sha256 "PLACEHOLDER_LINUX_X64_SHA256"
    end
  end

  def install
    bin.install "chrome-devtools"
  end

  test do
    system "#{bin}/chrome-devtools", "--version"
  end
end
