const args = process.argv;
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

const request = require('request');
const fs = require('fs');

const fetcher = (target, file) => {

  if (!target || !file) {
    console.log('Not enough arguments');
    process.exit();
  }

  request(target, (error, response, body) => {
    verifyDownloadedFile(error);
    saveToFile(body, file);
  });

};

const verifyDownloadedFile = e => {
  if (e) {
    console.log('Oops! Something went wrong when downloading your file.');
    console.log(trimError(e));
    process.exit();
  }
  return true;
};

const saveToFile = (content, fileName) => {
  fs.writeFile(fileName, content, e => {
    if (e) {
      console.log(trimError(e));
      process.exit();
    } else {
      console.log(content.length + ' bytes was saved to ' + fileName);
    }
  });
  return true;
};

const trimError = e => String(e).split('\n')[0];

fetcher(args[2], args[3]);

