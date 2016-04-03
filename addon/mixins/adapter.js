/* global traverse */
import Ember from 'ember';
import UploadableFile from '../uploadable-file';

const get = Ember.get;
const inject = Ember.inject;

export default Ember.Mixin.create({

  store: inject.service(),

  formDataMethods: [ 'PUT', 'POST', 'PATCH' ],

  ajaxOptions: function(url, type, options) {
    let data              = options && options.data;
    let supportsFormData  = typeof FormData !== 'undefined';
    let shouldUseFormData = get(this, 'formDataMethods').indexOf(type) > -1;
    let hash = this._super.call(this, url, type, options);

    if (data && supportsFormData && shouldUseFormData) {
      let formData = new FormData();

      data = traverse.map(data, function(value) {
        if (value instanceof UploadableFile) {
          this.remove();
          let pointer = this.path.map((segment) => `/${ escapePointerSegment(segment) }`).join('');
          formData.append(pointer, get(value, 'file'));
        }
      });

      formData.append('', JSON.stringify(data));

      hash.processData = false;
      hash.contentType = false;
      hash.data = formData;
    }

    return hash;
  }

});

function escapePointerSegment(segment) {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}
