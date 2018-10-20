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

HTML5 Purifier plugin for [egg.js](https://eggjs.org/)

The plugin uses a whitelist based approach to filter malicious characters,tags, attributes and attribute values while keeping the resulting output HTML5 compliant.

## Install

```bash
$ npm i egg-html-purify --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.htmlPurify = {
  enable: true,
  package: 'egg-html-purify',
};
```

## Example

```javascript
this.app.purify(input);

// or use in context
this.ctx.purify(input);
```

## Questions & Suggestions

Please open an issue [here](https://github.com/weihongyu12/egg-html-purify/issues).

## License

[MIT](LICENSE)
