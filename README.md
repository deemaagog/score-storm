# score-storm

A javascript package for rendering and editing music scores

## Motivation

Create a Music sheet renderer with first class support of editing

Should work in Browser, Node.js and React Native

Should be unopinionated as possible, allow customizations

Should be fast, even for rendering/editing large scores

Should be lightweight

Should support import/export from popular formats ( Music XML, MNX e.t.c)

## Testing

Make sure browsers are installed

```
pnpm run e2e:install
```

Run tests:

```
pnpm run e2e
```

Run tests and update snapshots:

```
pnpm run e2e -- --update-snapshots
```
