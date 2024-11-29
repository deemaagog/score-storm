---
sidebar_position: 1
---

# Overview

There can be several ways to render Score Storm scores in React Native app. While this documentation is focused on native approaches ([React Native SVG](./react-native/react-native-svg) and [React Native SKIA](./react-native/react-native-skia)), you can also use web-based solutions like WebView or render scores as images.

## WebView

This approach covers almost all use cases. The only downside is that it's not the most performant way to render scores in native app. Also it's not fully cross-platform solution. If that's affordable for you, you can go with this approach.

```js
import React, { Component } from "react"
import { WebView } from "react-native-webview"

class ScoreStormWebView extends Component {
  render() {
    return <WebView source={{ uri: "https://ss-editor.netlify.app" }} /> //or your own hosted Score Storm
  }
}

export default ScoreStormWebView
```

## Render as image

As simple as that. You can generate score image (PNG or SVG) on you server using [Node Skia Renderer](./renderers/node-skia-renderer) and then display it in your app.

```js
import * as React from "react"
import { SvgXml } from "react-native-svg"

// your SVG generated on server
const xmlString = `
<?xml version="1.0" encoding="utf-8" ?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="113">
	<rect fill="white" width="600" height="113"/>
	<rect fill="#666" y="21.271999" width="300" height="2"/>
	<rect fill="#666" y="37.271999" width="300" height="2"/>
	<rect fill="#666" y="53.271999" width="300" height="2"/>
	<rect fill="#666" y="69.272003" width="300" height="2"/>
	<rect fill="#666" y="85.272003" width="300" height="2"/>
	<path d="M40.0625 43.941498Q40 43.363373 40.0625 43.175873Q40.1875 42.988373 40.453125 42.722748Q45.765625 37.863373 49.15625 31.785248Q52.484375 25.707123 52.609375 18.347748Q52.609375 14.113373 51.515625 10.222748Q50.4375 6.3789978 48.453125 3.4258728Q47.6875 2.2852478 46.71875 1.3164978Q45.703125 0.3008728 45.125 0.2383728Q44.421875 0.3008728 43.203125 1.2539978Q41.984375 2.2227478 40.953125 3.3008728Q37.4375 7.3321228 36.03125 12.707123Q34.625 18.082123 34.6875 23.207123Q34.6875 26.019623 34.9375 28.847748Q35.265625 31.660248 35.578125 33.707123Q35.71875 34.222748 35.640625 34.535248Q35.578125 34.785248 35.015625 35.238373Q27.78125 40.878998 22.078125 48.097748Q16.3125 55.332123 16 64.941498Q16 73.582123 21.765625 79.972748Q27.515625 86.316498 39.296875 86.628998Q40.453125 86.628998 41.59375 86.503998Q42.75 86.441498 43.71875 86.253998Q44.21875 86.113373 44.421875 86.191498Q44.609375 86.253998 44.671875 86.816498Q45.3125 90.144623 45.828125 93.738373Q46.34375 97.316498 46.40625 99.691498Q46.140625 106.53525 42.75 108.51962Q39.359375 110.504 36.21875 110.3165Q33.65625 110.254 32.390625 109.67587Q31.109375 109.09775 31.109375 108.45712Q31.109375 108.129 31.546875 107.879Q32.0625 107.6915 33.15625 107.36337Q34.75 106.98837 36.03125 105.51962Q37.375 104.09775 37.4375 101.34775Q37.4375 98.660248 35.84375 96.738373Q34.234375 94.894623 31.296875 94.816498Q28.03125 94.894623 26.234375 97.003998Q24.453125 99.113373 24.453125 102.1915Q24.3125 105.58212 26.875 108.97275Q29.5 112.36337 36.609375 112.61337Q40.1875 112.80087 44.546875 110.3165Q48.828125 107.754 49.21875 99.816498Q49.15625 96.941498 48.578125 93.097748Q47.9375 89.253998 47.359375 86.113373Q47.234375 85.613373 47.421875 85.410248Q47.546875 85.285248 48.1875 85.035248Q53.125 83.050873 56 79.144623Q58.875 75.238373 58.9375 69.800873Q58.875 63.457123 54.78125 58.988373Q50.6875 54.566498 43.515625 54.378998Q42.296875 54.441498 42.046875 54.253998Q41.734375 54.050873 41.65625 53.222748L40.0625 43.941498ZM46.078125 10.144623Q47.6875 10.144623 48.765625 11.425873Q49.859375 12.769623 49.921875 15.394623Q49.734375 20.707123 46.265625 25.066498Q42.8125 29.347748 38.78125 32.675873Q38.46875 33.003998 38.265625 32.878998Q38.015625 32.800873 37.953125 32.175873Q37.765625 30.894623 37.703125 29.347748Q37.5625 27.816498 37.5625 26.285248Q37.765625 18.722748 40.390625 14.441498Q43.015625 10.222748 46.078125 10.144623ZM39.109375 53.738373Q39.296875 54.566498 39.109375 54.816498Q38.96875 55.019623 38.140625 55.269623Q33.859375 56.800873 31.421875 60.128998Q28.921875 63.535248 28.859375 67.691498Q28.921875 72.035248 30.90625 74.988373Q32.890625 77.863373 36.21875 79.019623Q36.609375 79.144623 37.125 79.269623Q37.5625 79.394623 37.953125 79.394623Q38.34375 79.394623 38.53125 79.207123Q38.71875 79.019623 38.71875 78.691498Q38.71875 78.378998 38.40625 78.191498Q38.140625 77.988373 37.765625 77.863373Q35.71875 76.972748 34.4375 75.113373Q33.21875 73.253998 33.15625 71.019623Q33.21875 68.269623 34.875 66.285248Q36.609375 64.363373 39.546875 63.535248Q40.3125 63.332123 40.515625 63.394623Q40.765625 63.535248 40.828125 64.035248L44.03125 83.113373Q44.15625 83.628998 43.96875 83.753998Q43.84375 83.878998 43.140625 84.003998Q42.375 84.128998 41.46875 84.269623Q40.515625 84.332123 39.546875 84.332123Q31.046875 84.207123 26.109375 80.097748Q21.25 76.003998 21.125 69.222748Q20.984375 66.410248 22.078125 62.628998Q23.234375 58.925873 27.078125 54.378998Q29.953125 51.238373 32.25 49.128998Q34.625 47.082123 36.859375 45.285248Q37.3125 44.910248 37.5 44.972748Q37.703125 45.035248 37.765625 45.550873L39.109375 53.738373ZM43.515625 63.910248Q43.390625 63.332123 43.515625 63.144623Q43.640625 62.957123 44.21875 63.019623Q48.1875 63.457123 50.875 66.285248Q53.5625 69.160248 53.703125 73.441498Q53.625 76.519623 52.03125 78.816498Q50.4375 81.191498 47.6875 82.535248Q47.109375 82.863373 46.90625 82.785248Q46.71875 82.722748 46.65625 82.144623L43.515625 63.910248Z"/>
	<path d="M96.835876 43.238373L96.835876 29.550873Q96.835876 29.160248 96.710876 28.769623Q96.570251 28.457123 96.070251 28.457123Q95.617126 28.457123 95.367126 28.582123Q95.039001 28.707123 94.789001 29.035248L88.710876 36.394623Q88.507751 36.644623 88.320251 36.972748Q88.132751 37.285248 88.132751 37.863373L88.132751 43.238373L79.492126 43.238373Q83.773376 39.207123 89.085876 32.035248Q94.398376 24.941498 95.039001 23.597748L95.101501 23.394623Q95.101501 22.957123 94.851501 22.691498Q94.523376 22.441498 94.148376 22.441498Q93.632751 22.441498 92.164001 22.503998Q90.757751 22.566498 89.789001 22.566498Q88.835876 22.566498 87.289001 22.503998Q85.757751 22.441498 85.242126 22.441498Q84.804626 22.441498 84.289001 22.628998Q83.835876 22.894623 83.773376 23.660248Q83.460876 29.800873 80.382751 35.363373Q77.382751 40.941498 75.585876 43.175873L75.195251 43.691498Q75.195251 43.691498 75.195251 43.753998L75.132751 43.816498Q74.945251 44.269623 74.945251 44.582123Q74.945251 45.097748 75.320251 45.347748Q75.648376 45.675873 76.226501 45.675873L88.132751 45.675873L88.132751 49.707123Q88.070251 50.988373 87.289001 51.488373Q86.460876 51.941498 85.570251 51.941498Q84.804626 51.941498 84.476501 52.332123Q84.101501 52.644623 84.101501 53.160248Q84.101501 53.675873 84.351501 54.050873Q84.601501 54.503998 85.304626 54.503998L98.945251 54.503998Q99.460876 54.503998 99.835876 54.191498Q100.2265 53.800873 100.2265 53.160248Q100.2265 52.519623 99.773376 52.207123Q99.320251 51.878998 98.820251 51.878998Q98.304626 51.941498 97.601501 51.425873Q96.898376 50.925873 96.835876 49.441498L96.835876 45.675873L101.50775 45.675873Q102.46088 45.613373 102.46088 44.457123Q102.46088 43.878998 102.27338 43.566498Q102.02338 43.238373 101.50775 43.238373L96.835876 43.238373Z"/>
	<path d="M96.835876 75.238373L96.835876 61.550873Q96.835876 61.160248 96.710876 60.769623Q96.570251 60.457123 96.070251 60.457123Q95.617126 60.457123 95.367126 60.582123Q95.039001 60.707123 94.789001 61.035248L88.710876 68.394623Q88.507751 68.644623 88.320251 68.972748Q88.132751 69.285248 88.132751 69.863373L88.132751 75.238373L79.492126 75.238373Q83.773376 71.207123 89.085876 64.035248Q94.398376 56.941498 95.039001 55.597748L95.101501 55.394623Q95.101501 54.957123 94.851501 54.691498Q94.523376 54.441498 94.148376 54.441498Q93.632751 54.441498 92.164001 54.503998Q90.757751 54.566498 89.789001 54.566498Q88.835876 54.566498 87.289001 54.503998Q85.757751 54.441498 85.242126 54.441498Q84.804626 54.441498 84.289001 54.628998Q83.835876 54.894623 83.773376 55.660248Q83.460876 61.800873 80.382751 67.363373Q77.382751 72.941498 75.585876 75.175873L75.195251 75.691498Q75.195251 75.691498 75.195251 75.753998L75.132751 75.816498Q74.945251 76.269623 74.945251 76.582123Q74.945251 77.097748 75.320251 77.347748Q75.648376 77.675873 76.226501 77.675873L88.132751 77.675873L88.132751 81.707123Q88.070251 82.988373 87.289001 83.488373Q86.460876 83.941498 85.570251 83.941498Q84.804626 83.941498 84.476501 84.332123Q84.101501 84.644623 84.101501 85.160248Q84.101501 85.675873 84.351501 86.050873Q84.601501 86.503998 85.304626 86.503998L98.945251 86.503998Q99.460876 86.503998 99.835876 86.191498Q100.2265 85.800873 100.2265 85.160248Q100.2265 84.519623 99.773376 84.207123Q99.320251 83.878998 98.820251 83.878998Q98.304626 83.941498 97.601501 83.425873Q96.898376 82.925873 96.835876 81.441498L96.835876 77.675873L101.50775 77.675873Q102.46088 77.613373 102.46088 76.457123Q102.46088 75.878998 102.27338 75.566498Q102.02338 75.238373 101.50775 75.238373L96.835876 75.238373Z"/>
	<path d="M139.38437 56.941498Q140.16562 57.894623 140.86874 58.863373Q141.50937 59.753998 142.14999 60.769623Q142.27499 60.972748 142.39999 61.285248Q142.52499 61.550873 142.52499 61.675873Q142.52499 61.738373 142.52499 61.800873Q142.52499 61.863373 142.46249 61.925873Q142.33749 62.113373 142.21249 62.191498Q142.00937 62.253998 141.75937 62.253998Q141.57187 62.253998 141.24374 62.191498Q140.93124 62.113373 140.74374 62.050873Q140.60312 62.050873 140.47812 62.050873L139.96249 61.863373Q137.47812 61.925873 135.99374 63.785248Q134.52499 65.582123 134.46249 68.003998Q134.46249 70.378998 136.44687 72.800873Q138.36874 75.238373 141.88437 77.925873Q142.27499 78.191498 142.71249 78.378998Q143.16562 78.503998 143.55624 78.503998Q143.86874 78.503998 144.19687 78.378998Q144.44687 78.316498 144.50937 78.113373Q144.63437 77.863373 144.63437 77.675873Q144.63437 77.222748 144.32187 76.847748Q143.99374 76.457123 143.61874 76.128998Q142.97812 76.066498 142.52499 75.175873Q142.08749 74.347748 141.94687 73.832123Q141.69687 73.066498 141.69687 72.160248Q141.69687 70.191498 142.71249 68.847748Q143.74374 67.566498 145.72812 67.488373Q147.13437 67.488373 148.54062 67.878998Q149.94687 68.269623 150.79062 68.582123L150.85312 68.644623Q151.04062 68.707123 151.16562 68.707123Q151.29062 68.707123 151.35312 68.707123Q151.68124 68.707123 151.68124 68.457123Q151.61874 67.816498 150.79062 66.597748Q149.94687 65.441498 149.30624 64.800873Q147.46249 62.628998 146.18124 60.582123Q144.96249 58.535248 144.89999 55.910248Q144.89999 55.785248 144.89999 55.722748L144.96249 55.269623Q144.96249 55.144623 144.96249 55.082123Q145.21249 52.332123 146.55624 49.957123Q147.83749 47.660248 149.18124 45.675873Q149.44687 45.160248 149.44687 44.707123Q149.44687 44.207123 149.30624 43.878998Q149.18124 43.488373 149.18124 43.488373Q148.60312 42.863373 144.32187 37.738373Q139.96249 32.613373 138.61874 31.144623Q138.36874 30.894623 138.04062 30.753998Q137.79062 30.628998 137.47812 30.628998Q136.96249 30.628998 136.57187 30.957123Q136.19687 31.269623 136.19687 31.972748Q136.19687 32.425873 136.44687 33.003998Q136.83749 33.582123 138.49374 35.816498Q140.16562 38.050873 140.35312 41.582123Q140.35312 43.363373 139.52499 45.410248Q138.61874 47.457123 136.50937 49.707123Q136.05624 50.222748 135.80624 50.660248Q135.61874 51.175873 135.61874 51.566498Q135.68124 52.269623 135.93124 52.644623Q136.19687 53.097748 136.25937 53.097748L139.38437 56.941498Z"/>
	<path d="M180.76837 56.941498Q181.54962 57.894623 182.25275 58.863373Q182.89337 59.753998 183.534 60.769623Q183.659 60.972748 183.784 61.285248Q183.909 61.550873 183.909 61.675873Q183.909 61.738373 183.909 61.800873Q183.909 61.863373 183.8465 61.925873Q183.7215 62.113373 183.5965 62.191498Q183.39337 62.253998 183.14337 62.253998Q182.95587 62.253998 182.62775 62.191498Q182.31525 62.113373 182.12775 62.050873Q181.98712 62.050873 181.86212 62.050873L181.3465 61.863373Q178.86212 61.925873 177.37775 63.785248Q175.909 65.582123 175.8465 68.003998Q175.8465 70.378998 177.83087 72.800873Q179.75275 75.238373 183.26837 77.925873Q183.659 78.191498 184.0965 78.378998Q184.54962 78.503998 184.94025 78.503998Q185.25275 78.503998 185.58087 78.378998Q185.83087 78.316498 185.89337 78.113373Q186.01837 77.863373 186.01837 77.675873Q186.01837 77.222748 185.70587 76.847748Q185.37775 76.457123 185.00275 76.128998Q184.36212 76.066498 183.909 75.175873Q183.4715 74.347748 183.33087 73.832123Q183.08087 73.066498 183.08087 72.160248Q183.08087 70.191498 184.0965 68.847748Q185.12775 67.566498 187.11212 67.488373Q188.51837 67.488373 189.92462 67.878998Q191.33087 68.269623 192.17462 68.582123L192.23712 68.644623Q192.42462 68.707123 192.54962 68.707123Q192.67462 68.707123 192.73712 68.707123Q193.06525 68.707123 193.06525 68.457123Q193.00275 67.816498 192.17462 66.597748Q191.33087 65.441498 190.69025 64.800873Q188.8465 62.628998 187.56525 60.582123Q186.3465 58.535248 186.284 55.910248Q186.284 55.785248 186.284 55.722748L186.3465 55.269623Q186.3465 55.144623 186.3465 55.082123Q186.5965 52.332123 187.94025 49.957123Q189.2215 47.660248 190.56525 45.675873Q190.83087 45.160248 190.83087 44.707123Q190.83087 44.207123 190.69025 43.878998Q190.56525 43.488373 190.56525 43.488373Q189.98712 42.863373 185.70587 37.738373Q181.3465 32.613373 180.00275 31.144623Q179.75275 30.894623 179.42462 30.753998Q179.17462 30.628998 178.86212 30.628998Q178.3465 30.628998 177.95587 30.957123Q177.58087 31.269623 177.58087 31.972748Q177.58087 32.425873 177.83087 33.003998Q178.2215 33.582123 179.87775 35.816498Q181.54962 38.050873 181.73712 41.582123Q181.73712 43.363373 180.909 45.410248Q180.00275 47.457123 177.89337 49.707123Q177.44025 50.222748 177.19025 50.660248Q177.00275 51.175873 177.00275 51.566498Q177.06525 52.269623 177.31525 52.644623Q177.58087 53.097748 177.64337 53.097748L180.76837 56.941498Z"/>
	<path d="M222.15237 56.941498Q222.93362 57.894623 223.63675 58.863373Q224.27737 59.753998 224.918 60.769623Q225.043 60.972748 225.168 61.285248Q225.293 61.550873 225.293 61.675873Q225.293 61.738373 225.293 61.800873Q225.293 61.863373 225.2305 61.925873Q225.1055 62.113373 224.9805 62.191498Q224.77737 62.253998 224.52737 62.253998Q224.33987 62.253998 224.01175 62.191498Q223.69925 62.113373 223.51175 62.050873Q223.37112 62.050873 223.24612 62.050873L222.7305 61.863373Q220.24612 61.925873 218.76175 63.785248Q217.293 65.582123 217.2305 68.003998Q217.2305 70.378998 219.21487 72.800873Q221.13675 75.238373 224.65237 77.925873Q225.043 78.191498 225.4805 78.378998Q225.93362 78.503998 226.32425 78.503998Q226.63675 78.503998 226.96487 78.378998Q227.21487 78.316498 227.27737 78.113373Q227.40237 77.863373 227.40237 77.675873Q227.40237 77.222748 227.08987 76.847748Q226.76175 76.457123 226.38675 76.128998Q225.74612 76.066498 225.293 75.175873Q224.8555 74.347748 224.71487 73.832123Q224.46487 73.066498 224.46487 72.160248Q224.46487 70.191498 225.4805 68.847748Q226.51175 67.566498 228.49612 67.488373Q229.90237 67.488373 231.30862 67.878998Q232.71487 68.269623 233.55862 68.582123L233.62112 68.644623Q233.80862 68.707123 233.93362 68.707123Q234.05862 68.707123 234.12112 68.707123Q234.44925 68.707123 234.44925 68.457123Q234.38675 67.816498 233.55862 66.597748Q232.71487 65.441498 232.07425 64.800873Q230.2305 62.628998 228.94925 60.582123Q227.7305 58.535248 227.668 55.910248Q227.668 55.785248 227.668 55.722748L227.7305 55.269623Q227.7305 55.144623 227.7305 55.082123Q227.9805 52.332123 229.32425 49.957123Q230.6055 47.660248 231.94925 45.675873Q232.21487 45.160248 232.21487 44.707123Q232.21487 44.207123 232.07425 43.878998Q231.94925 43.488373 231.94925 43.488373Q231.37112 42.863373 227.08987 37.738373Q222.7305 32.613373 221.38675 31.144623Q221.13675 30.894623 220.80862 30.753998Q220.55862 30.628998 220.24612 30.628998Q219.7305 30.628998 219.33987 30.957123Q218.96487 31.269623 218.96487 31.972748Q218.96487 32.425873 219.21487 33.003998Q219.6055 33.582123 221.26175 35.816498Q222.93362 38.050873 223.12112 41.582123Q223.12112 43.363373 222.293 45.410248Q221.38675 47.457123 219.27737 49.707123Q218.82425 50.222748 218.57425 50.660248Q218.38675 51.175873 218.38675 51.566498Q218.44925 52.269623 218.69925 52.644623Q218.96487 53.097748 219.02737 53.097748L222.15237 56.941498Z"/>
	<path d="M263.53638 56.941498Q264.31763 57.894623 265.02075 58.863373Q265.66138 59.753998 266.302 60.769623Q266.427 60.972748 266.552 61.285248Q266.677 61.550873 266.677 61.675873Q266.677 61.738373 266.677 61.800873Q266.677 61.863373 266.6145 61.925873Q266.4895 62.113373 266.3645 62.191498Q266.16138 62.253998 265.91138 62.253998Q265.72388 62.253998 265.39575 62.191498Q265.08325 62.113373 264.89575 62.050873Q264.75513 62.050873 264.63013 62.050873L264.1145 61.863373Q261.63013 61.925873 260.14575 63.785248Q258.677 65.582123 258.6145 68.003998Q258.6145 70.378998 260.59888 72.800873Q262.52075 75.238373 266.03638 77.925873Q266.427 78.191498 266.8645 78.378998Q267.31763 78.503998 267.70825 78.503998Q268.02075 78.503998 268.34888 78.378998Q268.59888 78.316498 268.66138 78.113373Q268.78638 77.863373 268.78638 77.675873Q268.78638 77.222748 268.47388 76.847748Q268.14575 76.457123 267.77075 76.128998Q267.13013 76.066498 266.677 75.175873Q266.2395 74.347748 266.09888 73.832123Q265.84888 73.066498 265.84888 72.160248Q265.84888 70.191498 266.8645 68.847748Q267.89575 67.566498 269.88013 67.488373Q271.28638 67.488373 272.69263 67.878998Q274.09888 68.269623 274.94263 68.582123L275.00513 68.644623Q275.19263 68.707123 275.31763 68.707123Q275.44263 68.707123 275.50513 68.707123Q275.83325 68.707123 275.83325 68.457123Q275.77075 67.816498 274.94263 66.597748Q274.09888 65.441498 273.45825 64.800873Q271.6145 62.628998 270.33325 60.582123Q269.1145 58.535248 269.052 55.910248Q269.052 55.785248 269.052 55.722748L269.1145 55.269623Q269.1145 55.144623 269.1145 55.082123Q269.3645 52.332123 270.70825 49.957123Q271.9895 47.660248 273.33325 45.675873Q273.59888 45.160248 273.59888 44.707123Q273.59888 44.207123 273.45825 43.878998Q273.33325 43.488373 273.33325 43.488373Q272.75513 42.863373 268.47388 37.738373Q264.1145 32.613373 262.77075 31.144623Q262.52075 30.894623 262.19263 30.753998Q261.94263 30.628998 261.63013 30.628998Q261.1145 30.628998 260.72388 30.957123Q260.34888 31.269623 260.34888 31.972748Q260.34888 32.425873 260.59888 33.003998Q260.9895 33.582123 262.64575 35.816498Q264.31763 38.050873 264.50513 41.582123Q264.50513 43.363373 263.677 45.410248Q262.77075 47.457123 260.66138 49.707123Q260.20825 50.222748 259.95825 50.660248Q259.77075 51.175873 259.77075 51.566498Q259.83325 52.269623 260.08325 52.644623Q260.34888 53.097748 260.41138 53.097748L263.53638 56.941498Z"/>
	<rect x="284" y="21.271999" width="2.3999939" height="66"/>
	<rect x="290.88" y="21.271999" width="9.1199951" height="66"/>
</svg>
`

export default () => <SvgXml xml={xmlString} width="100%" height="100%" />
```

This option will fit you if you don't need to interact with score in any way.