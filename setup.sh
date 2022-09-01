# Alpine Linux

apk update
apk upgrade

apk add --no-cache --update curl

# Rust and Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# TODO: NVM (Node & NPM) support for Alpine is pending (https://github.com/nvm-sh/nvm/issues/1102)

# Bun
curl https://bun.sh/install | bash

# DevOps
apk add --update terraform docker openrc kubernetes k9s