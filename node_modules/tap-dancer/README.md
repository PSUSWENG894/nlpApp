like [tap-dot](https://github.com/scottcorgan/tap-dot), but with more information about failures, and where to find them.

based on [am-tap-dot](http://github.com/amokrushin/am-tap-dot) by [amokrushin](https://github.com/amokrushin). (Thanks!)

![image](https://user-images.githubusercontent.com/399657/39227440-9716c02a-4826-11e8-872e-4c1ad674446e.png)

---

![image](https://user-images.githubusercontent.com/399657/39227411-7038874a-4826-11e8-8907-de7fbf68ec05.png)

```bash
# local
npm i tap-dancer --save-dev

# global
npm i tap-dancer -g
```

### API
```js
const test = require('tape');
const TapDance = require('tap-dancer');

test.createStream()
    .pipe(new TapDance())
    .pipe(process.stdout);
```

### Command-line
```bash
tape test/index.js | node_modules/.bin/tap-dancer --color
```
or in **package.json**,

```json
{
  "name": "module-name",
  "scripts": {
    "test": "node ./test/tap-test.js | tap-dancer --color"
  }
}
```

Then run with `npm test`

MIT
