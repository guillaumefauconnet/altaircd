#!/usr/bin/env node
var security = require(__dirname + '/../lib/security');
security.hash(process.argv[2], function(err, hash) {
  if (err) {
    throw(err);
  } else {
    console.log(hash);
  }
});
