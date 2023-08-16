const fs = require('fs');
const { isAbsolute, resolve } = require('path');
const path = require('path');
const readline = require('readline');
const fetch = require('node-fetch');

const fileRoute = './Example';
const fileBeingRead = './Example/file-1.md';

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
};

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

function getMdFilesInDirectory(fileRoute, callback) {
  fs.readdir(fileRoute, (error, files) => {
    if (error) {
      return callback(new Error(`Error getting the .md files in the directory: ${error.message}`))
    }
    const mdFiles = files.filter(file => path.extname(file) === '.md');
    return callback(null, mdFiles);
  });
}

function readMdFile(fileRoute, callback) {
  fs.readFile(fileRoute, 'utf-8', (error, data) => {
    if (error) {
      return callback(new Error(`Error reading file ${fileRoute}: ${error.message}`));
    }
    return callback(null, data);
  });
}

function findLinksInFile(fileRoute, successCallback, errorCallback) {
  fs.readFile(fileRoute, 'utf-8', (error, content) => {
    if (error) {
      return errorCallback(`Failed to find links in file ${fileRoute}: ${error.message}`);
    }
    const linkRegex = /\[(.+)\] *\((.+)\)/g;
    const matches = [...content.matchAll(linkRegex)];

    if (!matches || matches.length === 0) {
      return successCallback([]);
    }

    const links = matches.map(match => {
      const [, text, url ] = match;
      return { text, url, file: fileRoute };
    });

    successCallback(links);
  });
}

function validateLinksInMdFile(links) {
  const validatedLinks = links.map(link =>
    fetch(link.url, { method: 'HEAD' })
      .then(response => ({
        url: link.url,
        text: link.text,
        file: link.file,
        status: response.status,
        ok: response.ok,
      }))
      .catch(error => ({
        url: link.url,
        text: link.text,
        file: link.file,
        status: error.status || 404,
        ok: false,
      }))
  );
  return Promise.all(validatedLinks);
}

findLinksInFile(fileBeingRead, linksFound => {
  validateLinksInMdFile(linksFound)
    .then(validatedLinks => {
      console.log('Links validation results:');
      console.log(validatedLinks);
    })
    .catch(error => {
      console.error('Error:', error);
    });
},
  error => {
    console.error(error);
  });


module.exports = {
  isPathValid,
  makePathAbsolute,
  getRouteType,
  getMdFilesInDirectory,
  readMdFile,
  findLinksInFile,
  validateLinksInMdFile
}

// isPathValid(fileRoute, (exists) => {
//   if (exists) {
//     console.log('The file path exists.');
//   } else {
//     console.log('The file path does not exist.');
//   }
// });

// console.log(makePathAbsolute(fileRoute));

// getRouteType(fileRoute, (error, routeType) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(`The path ${fileRoute} is a ${routeType}.`);
//   }
// });

// getMdFilesInDirectory(fileRoute, (error, mdFiles) => {
//   if (error) {
//     console.error(error.message);
//   } else {
//     console.log(`Files with extension .md in the path ${fileRoute}:`);
//     console.log(mdFiles)
//   }
// });

// readMdFile(fileBeingRead, (error, data) => {
//   if (error) {
//     console.error(error.message);
//   } else {
//     console.log('File content:');
//     console.log(data);
//   }
// });

// findLinksInFile(fileBeingRead, links => {
//   console.log('Links found in the file:');
//   console.log(links)
// },
//   error => {
//     console.error(error);
//   }
// );

//   if(fs.access(fileRoute).isDirectory()) {
//     const files = fs.access(path);
//     const mdFiles = files.filter(file => path.extname(file) === 'md');
//     if (mdFiles.length > 0) {
//       console.log(`Files with extension .md in the path ${fileRoute}:`);
//       mdFiles.forEach(file => console.log(file));
//     } else {
//       console.log(`No files with .md extension were found in the path ${fileRoute}`)
//     }
//     return true;

//   } else {
//     console.log('The path provided is a file, not a directory');
//   }
// }
// console.log(getFiles(fileRoute));