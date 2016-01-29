'use strict';

const formatters = require('./src/formatter');
let isInstalled = false;

module.exports = {install};

function install () {
  if (typeof window === undefined || isInstalled === true) {return;}

  window.devtoolsFormatters = window.devtoolsFormatters || [];
  window.devtoolsFormatters.push({

    header(obj) {
      if (obj && obj.toJS) return formatters.formatHeader(obj);
      return null;
    },

    hasBody(obj) {
      return obj && obj.toJS && obj.size > 100;
    },

    body(obj) {
      return formatters.formatBody(obj);
    }

  });

  isInstalled = true;
}
