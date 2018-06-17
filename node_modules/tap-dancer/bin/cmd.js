#!/usr/bin/env node

const TapDance = require('../builds/tap-dance')
const stream = new TapDance()

process.stdin
  .pipe(stream)
  .pipe(process.stdout);

process.on('exit', status => {
  if (status === 1) {
    process.exit(1);
  }
  if (stream.failed) {
    process.exit(1);
  }
});
