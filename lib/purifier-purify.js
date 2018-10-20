'use strict';

const Purifier = require('html-purify');

module.exports = app => {
  app.purify = input => {
    const purifier = new Purifier();
    return purifier.purify(input);
  };
};
