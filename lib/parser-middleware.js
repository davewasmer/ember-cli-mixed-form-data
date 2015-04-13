/* jshint node: true */

var assert = require('assert');
var Busboy = require('busboy');
var Promise = require('bluebird');

module.exports = function(options) {
  options = options || {};
  var supportedMethods = options.supportedMethods || [ 'PUT', 'POST', 'PATCH' ];
  var handleFile = options.handleFile;

  assert(handleFile, 'You must supply a handleFile callback.');

  return function parseMultipartUploads(req, res, next) {

    var contentType = req.headers['content-type'];
    var isMultiPart = contentType && contentType.indexOf('multipart/form-data') > -1;
    var isSupportedMethod = supportedMethods.indexOf(req.method) > -1;

    if (!(isMultiPart && isSupportedMethod)) {
      return next();
    }

    req.body = req.body || {};
    req.files = req.files || {};

    var uploads = [];

    var parser = new Busboy({ headers: req.headers });

    // Parse the JSON document
    parser.on('field', function(field, value) {
      if (field.indexOf('.') === -1) {
        try {
          req.body = JSON.parse(value);
        } catch(e) {
          throw new Error('Invalid JSON part');
        }
      }
    });

    // Handle any file uploads
    parser.on('file', function(field, stream, filename, encoding, mimeType) {
      // Ignore if no filename is given
      if (!filename) {
        return stream.resume();
      }
      // Send to upload handler
      var upload = handleFile(filename, mimeType, stream)
      .then(function(metadata) {
        req.files[field] = metadata;
      });
      uploads.push(upload);
    });

    parser.on('finish', function() {
      Object.keys(req.files).forEach(function(field) {
        var root = field.split('.')[0];
        var property = field.split('.')[1];
        req.body[root][property] = req.files[field];
      });

      Promise.all(uploads)
      .then(function() { next(); })
      .catch(next);
    });

    parser.on('error', next);

    req.pipe(parser);

  };
};
