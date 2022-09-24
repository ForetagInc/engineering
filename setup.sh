# Alpine Linux
apk update
apk upgrade

apk add --no-cache --update fish curl

# Rust and Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup install nightly
rustup component add rustfmt
rustup component add rustfmt --toolchain nightly
rustup component add clippy 
rustup component add clippy --toolchain nightly

cargo install cargo-expand

# TODO: NVM (Node & NPM) support for Alpine is pending (https://github.com/nvm-sh/nvm/issues/1102)

# Bun
curl https://bun.sh/install | bash
bun upgrade --canary

# Bun global packages
bun install husky -g

# DevOps
apk add --no-cache --update terraform docker openrc kubernetes k9s

# Setup configurations
cp -R .config ~/.config