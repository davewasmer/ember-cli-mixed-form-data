/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-mixed-form-data',
  isDevelopingAddon: function() { return true; },
  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/js-traverse/traverse.js');
  }
};
