# ember-cli-mixed-form-data

## Installation

This addon comes bundled with a mixin for your adapter, a transform, and a Express middleware parser.

To install into your Ember CLI app, just run:

```sh
your-project/$ ember install ember-cli-mixed-form-data
```

Then apply the mixin to your adapter:

```js
import DS from 'ember-data';
import FormDataMixin from 'ember-cli-mixed-form-data/mixins/adapter';

export default DS.RESTAdapter.extend({ FormDataMixin });
```

The transform should be available automatically, just use it like so:

```js
export default DS.Model.extend({
  avatar: DS.attr('file')
});
```

To use the parser middleware in your server app, just require it directly:

```js
var uploadParser = require('ember-cli-mixed-form-data/lib/parser-middleware');
// ...
app.use(uploadParser({
  handleFile: function(filename, mimeType, stream) {
    // This function is required. It is invoked for each file uploaded. It
    // receives the stream representing the file upload. You should handle
    // the stream (i.e. pipe it to local disk, or S3).
    //
    // You should return a Promise from this method with any metadata you
    // want to store underneath the property that the file was uploaded. So
    // if you resolve with { url: 'http://example.com/foo' }, the request body
    // will contain that object at the property that contained the File object
    // on the client.
  }
}));
```

## How it works

Multipart HTTP requests allow you to send a single HTTP request with multiple parts consisting of potentially different content types. The adapter mixin will use the FormData API to build up a multipart request consisting of your data and files.

## Why not ember-cli-form-data

`ember-cli-form-data` is a similar project, and this project borrows heavily from it. But that project limits uploads to purely file uploads, whereas this project allows you to send file and JSON uploads in a single request.

The goal of this project is to let you treat file uploads like any other piece of data from within Ember.
