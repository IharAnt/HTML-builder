const process = require('process');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(filePath, 'utf8');

process.stdout.write('Hello. Enter the text\n');

process.stdin.on('data', (chunk) => {
  if(chunk.toString().trim() === 'exit') {
    process.exit();
  }
  output.write(chunk);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  output.close();
  process.stdout.write(`Thank you. The text has been saved to the ${path.basename(filePath)} file. \n`);
});