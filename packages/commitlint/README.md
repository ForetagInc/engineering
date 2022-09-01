# Commitlint for Foretag

## Getting started

**Install dependencies**

```
npm install --save-dev @commitlint/cli @foretag/{commitlint,commitlint-rules}
```

**Configure commitlint to use Foretag commit messages style config**
```yaml
# .commitlintrc.yml
plugins:
    - @foretag/commitlint-rules
extends:
    - @foretag/commitlint
```