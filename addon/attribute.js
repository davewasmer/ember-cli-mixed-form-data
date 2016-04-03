/*global File,Blob*/
import UploadableFile from './uploadable-file';
import Ember from 'ember';
import DS from 'ember-data';

const computed = Ember.computed;
const attr = DS.attr;

export default function fileAttribute(options = {}) {
  let attribute = attr('file');
  return computed({
    get(key) {
      return attribute.get(this, key);
    },
    set(key, value) {
      if (value instanceof File || value instanceof Blob) {
        options.file = value;
        value = UploadableFile.create(options);
      } else if (!(value instanceof UploadableFile)) {
        Ember.assert('You can only set a file() attribute to a File, Blob, or UploadableFile instance!');
      }
      return attribute.set(this, key, value);
    }
  }).meta({ isAttribute: true });
}
