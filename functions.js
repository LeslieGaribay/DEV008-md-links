const fs = require('fs');
const { isAbsolute, resolve } = require('path');

const fileRoute = '.\\Example';

function isPathValid(path, callback) {
    fs.access(path, (error) => {
        if (error) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

function makePathAbsolute(path) {
    if (isAbsolute(path)) {
        return path;
    } else {
        return resolve(path);
    }
}

isPathValid(fileRoute, (exists) => {
    if (exists) {
        console.log('The file path exists.');
    } else {
        console.log('The file path does not exist.');
    }
});

console.log(makePathAbsolute(fileRoute));

module.exports = {
    isPathValid,
    makePathAbsolute,
}