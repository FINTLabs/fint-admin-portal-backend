react-pretty-json
=================
[![NPM version](http://img.shields.io/npm/v/react-pretty-json.svg)](https://www.npmjs.com/package/react-pretty-json) 
[![dependencies Status](https://david-dm.org/quatrocode/react-pretty-json/status.svg)](https://david-dm.org/quatrocode/react-pretty-json) 
[![devDependencies Status](https://david-dm.org/quatrocode/react-pretty-json/dev-status.svg)](https://david-dm.org/quatrocode/react-pretty-json?type=dev)

## Get started
1) Install `react-pretty-json` in your project: 
```sh
$ npm install react-pretty-json
```
2) Import package and pass JSON.
```typescript
import JsonView from 'react-pretty-json';

// ...

render() {
    let obj = {
        example: 'string',
        number: 123,
        boolean: true
    };
    return <JsonView json={obj} />;
}

```

3) (Optional) Importing styles. You can reach it with `react-pretty-json/assets/json-view.css'.
```typescript
import 'react/pretty-json/assets/json-view.css!';
```

## Component props

| Prop    | Type   | Default | Description                            |
|---------|--------|---------|----------------------------------------|
| json`*` | object | none    | Generate object.                       |
| spaces  | number | 4       | Parts that will be generated js files. |

`*` - Required.

## License
[GPL-3.0](LICENSE)