# egg-html-purify

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-html-purify.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-html-purify
[travis-image]: https://img.shields.io/travis/weihongyu12/egg-html-purify.svg?style=flat-square
[travis-url]: https://travis-ci.org/weihongyu12/egg-html-purify
[codecov-image]: https://img.shields.io/codecov/c/github/weihongyu12/egg-html-purify.svg?style=flat-square
[codecov-url]: https://codecov.io/github/weihongyu12/egg-html-purify?branch=master
[david-image]: https://img.shields.io/david/weihongyu12/egg-html-purify.svg?style=flat-square
[david-url]: https://david-dm.org/weihongyu12/egg-html-purify
[snyk-image]: https://snyk.io/test/npm/egg-html-purify/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-html-purify
[download-image]: https://img.shields.io/npm/dm/egg-html-purify.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-html-purify

[egg.js](https://eggjs.org/) 的 HTML5 净化器插件

 该插件使用基于白名单的方法来过滤恶意字符，标签，属性和属性值，同时保持结果输出HTML5兼容。

## 开启插件

```js
// config/plugin.js
exports.htmlPurify = {
  enable: true,
  package: 'egg-html-purify',
};
```

## 使用

```javascript
this.app.purify(input);

// or use in context
this.ctx.purify(input);
```

## 提问交流

请到 [egg issues](https://github.com/weihongyu12/egg-html-purify/issues) 异步交流。

## License

[MIT](LICENSE)
