# lnjson

> Link a plain old JavaScript object with a JSON file.

### Why

Because I'm tired of seeing and hearing this:

```js
const json = require("./file.json");

json.property = 42;
```

"Why doesn't the JSON file get updated?"

### Installation and usage

```
$ npm install lnjson --save
$ yarn add lnjson
$ git clone https://github.com/cursorsdottsx/lnjson.git node_modules/lnjson
```

**Code:**

```js
import lnjson from "lnjson";

const linked = lnjson("linked.json");

linked.property = 42;
```

**Output:**

`linked.json`:

```json
{
    "property": 42
}
```
