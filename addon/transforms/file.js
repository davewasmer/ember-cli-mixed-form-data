/*global File, Blob*/
import Ember from 'ember';
import DS from 'ember-data';
import UploadableFile from '../uploadable-file';

export default DS.Transform.extend({
  deserialize: function(serialized) {
    return UploadableFile.create({
      url: serialized.url,
      type: serialized.type
    });
  },
  serialize: function(deserialized) {
    if (deserialized instanceof File || deserialized instanceof Blob) {
      deserialized = UploadableFile.create({ file: deserialized });
    }
    if (deserialized instanceof UploadableFile) {
      return deserialized;
    } else {
      Ember.warn('You set a file attr to something other than an UploadableFile, File, or Blob instance!');
      return null;
    }
  }
});
