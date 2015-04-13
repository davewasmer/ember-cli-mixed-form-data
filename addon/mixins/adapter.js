/* global File, Blob */

import Ember from 'ember';
import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({

  ajaxOptions: function(url, type, options) {
    var data              = options && options.data;
    var supportsFormData  = typeof FormData !== 'undefined';
    var formDataTypes     = this.get('formDataMethods') || [ 'PUT', 'POST', 'PATCH' ];
    var shouldUseFormData = formDataTypes.indexOf(type) > -1;
    var hash              = this._super.apply(this, arguments);

    if (data && supportsFormData && shouldUseFormData) {
      var formData = new FormData();
      var root = Ember.keys(data)[0];

      Ember.keys(data[root]).forEach(function(key) {
        var value = data[root][key];
        var isUploadable = (value instanceof File) || (value instanceof Blob);

        if (isUploadable) {
          formData.append(root + '.' + key, value);
          delete data[root][key];
        }
      });

      formData.append(root, JSON.stringify(data));

      hash.processData = false;
      hash.contentType = false;
      hash.data = formData;
    }

    return hash;
  }

});
