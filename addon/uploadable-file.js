/*global File, Blob*/
import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;
const observer = Ember.observer;
const on = Ember.on;

const UploadableFile = Ember.Object.extend({
  file: null,
  type: 'application/octet-stream',
  url: null,

  shouldGeneratePreview: true,
  isGeneratingPreview: false,
  generatePreviewDataURL: on('init', observer('file', function() {
    let file = get(this, 'file');
    if ((file instanceof File || file instanceof Blob) && get(this, 'shouldGeneratePreview'))  {
      set(this, 'isGeneratingPreview', true);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        set(this, 'url', e.target.result);
        set(this, 'isGeneratingPreview', false);
      };
    }
  })),

  toJSON() {
    return {
      type: get(this, 'type'),
      url: get(this, 'url')
    };
  },

  toStringExtension() {
    return get(this, 'file.name') || (get(this, 'url') || '').substr(0, 20);
  }

});

UploadableFile.reopenClass({
  toString() {
    return 'UploadableFile';
  }
});

export default UploadableFile;
