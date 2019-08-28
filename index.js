const args = process.argv;
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

const readlineSync = require('readline-sync');
const request = require('request');
const fs = require('fs');

const fetcher = (target, file) => {

  if (!target || !file) {
    console.log('Not enough arguments');
    process.exit();
  }

  request(target, (error, response, body) => {
    
    //TODO maybe make this a seperate function
    if (response.statusCode !== 200) {
      console.log('Error: ' + response.statusCode);
      process.exit();
    }
    verifyDownloadedFile(error);

    //check if file exists
    fs.readFile(file, e => {
      if (e) {
        saveToFile(body, file);
      } else {
        if (getYesOrNo('This file already exists. Do you want to overwrite it?')) {
          saveToFile(body, file);
        } else process.exit();
      }
    });

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

const getYesOrNo = question => {
  let x;
  while (x !== false && x !== true) {
    x = readlineSync.keyInYN(question);
  }
  return x;
};

fetcher(args[2], args[3]);