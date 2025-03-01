---
sidebar_position: 5
---

# Score sources

The very first thing you need to do when using Score Storm is to provide an initial score instance. There are several ways to do that:

## createQuickScore utility

```js
import ScoreStorm, { createQuickScore } from "@score-storm/core"
const scoreStorm = new ScoreStorm()
scoreStorm.setScore(createQuickScore())

// by default, the score will contain a 4/4 time signature, a single measure with rests
```

It's possible to pass an object with options to the `createQuickScore` function. Below is an example of how to create a score with a different time signature and number of measures:

```js
import ScoreStorm, { createQuickScore, TimeSignature } from "@score-storm/core"
const scoreStorm = new ScoreStorm()
scoreStorm.setScore(createQuickScore({ numberOfMeasures: 8, timeSignature: new TimeSignature(3, 4) }))
```

## Music XML Importer

Alternatively, you can import a score from a MusicXML string. The library provides a utility function for that:

```js
import ScoreStorm from "@score-storm/core"
import { fromMusicXML } from "@score-storm/musicxml-importer"
const scoreStorm = new ScoreStorm()
scoreStorm.setScore(fromMusicXML(xmlString))
```
