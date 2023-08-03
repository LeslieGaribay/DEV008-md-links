const fs = require('fs');
const { isAbsolute, resolve } = require('path');

const fileRoute = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example\\file-1.md';

function isPathValid(path, callback) {
    fs.access(path, (error) => {
        if (error) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

// isPathValid(fileRoute, (exists) => {
//     if (exists) {
//         console.log('The file path exists.');
//     } else {
//         console.log('The file path does not exist.');
//     }
// });

function makePathAbsolute(path) {
    if (isAbsolute(path)) {
        return path;
    } else {
        return resolve(path);
    }
};

// console.log(makePathAbsolute(fileRoute));

// function isDirectory(fileRoute) {
//     if (fs.access(fileRoute).isDirectory()) {
//         const files = fs.access(path);
//         const mdFiles = files.filter(file => path.extname(file) === 'md');
//         if (mdFiles.length > 0) {
//             console.log(`Files with extension .md in the path ${fileRoute}:`);
//             mdFiles.forEach(file => console.log(file));
//         } else {
//             console.log(`No files with .md extension were found in the path ${fileRoute}`)
//         }
//         return true;

//     } else {
//         console.log('The path provided is a file, not a directory');
//     }
// }
// console.log(isDirectory(fileRoute));

function getRouteType(fileRoute, callback) {
  fs.stat(fileRoute, (error, stats) => {
    if (error) {
      return callback(`Error getting route type: ${error.message}`);
    }

    if (stats.isFile()) {
      return callback(null, 'file');
    } else if (stats.isDirectory()) {
      return callback(null, 'directory');
    } else {
      return callback(null, 'unknown');
    }
  });
}

// getRouteType(fileRoute, (error, routeType) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(`The path ${fileRoute} is a ${routeType}.`);
//   }
// });

module.exports = {
    isPathValid,
    makePathAbsolute,
    getRouteType
}