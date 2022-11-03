const path = require('path');
const fs = require('fs');
const { stdin, stdout } = require('process');

const input = fs.createReadStream(path.join(__dirname, 'text.txt'));
input.on('data', (chunk) => {
  stdout.write(chunk.toString());
});