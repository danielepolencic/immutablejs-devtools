'use strict';

const formatters = require('./src/formatter');
let isInstalled = false;

module.exports = {install};

function install () {
  if (typeof window === undefined || isInstalled === true) {return;}

  window.devtoolsFormatters = window.devtoolsFormatters || [];
  window.devtoolsFormatters.push({

    header(obj) {
      if (!(obj && obj.toJS)) return;

      if (obj.__IS_NESTED__) return formatters.formatHeaderAsTitle(obj.value);
      if (obj.size >= 100) return formatters.formatHeaderAsSummary(obj.slice(0, 99));

      return formatters.formatHeaderInFull(obj);
    },

    hasBody(obj) {
      return obj && obj.toJS && (obj.size >= 100 || obj.__IS_NESTED__);
    },

    body(obj) {
      return formatters.formatBody(obj.__IS_NESTED__ ? obj.value : obj);
    }

  });

  isInstalled = true;
}
