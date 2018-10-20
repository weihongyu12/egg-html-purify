'use strict';

const purify = require('./lib/purifier-purify');

module.exports = app => {
  purify(app);
};
