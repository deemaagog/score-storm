---
sidebar_position: 5
---

# Editor

TBD

# Full-featured music score app

import React from "react"
import Demo from "@site/src/components/Demo"
import FontLoader from "@site/src/components/FontLoader"

<FontLoader>
  <iframe width="100%"  height="700px" src={process.env.NODE_ENV === 'development'? "http://localhost:5173":"https://ss-editor.netlify.app"} />
</FontLoader>

Usage in code:

```html
<html>
  <body>
    <iframe src="https://ss-editor.netlify.app" />
  </body>
</html>
```
