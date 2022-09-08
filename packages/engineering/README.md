# Foretag Engineering Style Guide

## Getting started

**Install dependencies**

```
# Globals
npm install -g @commitlint/cli

npm install --save-dev @foretag/engineering
```

**Configure commitlint to use Foretag commit messages style config**
```yaml
# .commitlintrc.yml
plugins:
    - @foretag/commitlint-rules
extends:
    - @foretag/commitlint
```	