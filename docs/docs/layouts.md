---
sidebar_position: 11
---

# Layouts

Score Storm uses layouts to determine how to render the score.

There are two types of layouts:

- Flow layout ( aka single page continuous layout )
- Paged layout ( multi page layout )

## Flow layout (default)

Flow layout is a single page continuous layout. It is ideal for rendering scores that are not too long.

## Paged layout

Paged layout is a multi page layout. Typically used in musical notation editors.

Usage:

```ts
const scoreStorm = new ScoreStorm()
scoreStorm.setLayout(new PagedLayout())
```
