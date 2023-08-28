const fs = require('fs');
const { isAbsolute, resolve } = require('path');
const path = require('path');
const readline = require('readline');
const fetch = require('node-fetch');
const chalk = require('chalk');

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
      return callback(null, 'Unknown route type');
    }
  });
}

function getMdFilesInDirectory(fileRoute, callback) {
  fs.readdir(fileRoute, (error, files) => {
    if (error) {
      return callback(new Error(`Error getting the .md files in the directory: ${error.message}`))
    }
    let mdFiles = files.filter(file => path.extname(file) === '.md');
    mdFiles = mdFiles.map(file => fileRoute + '\\' + file); // TODO: Use path union function
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

function findLinksInFile(fileRoute, callback) {
  readMdFile(fileRoute, (error, content) => {
    if (error) {
      return callback(`Failed to find links in file ${fileRoute}: ${error.message}`);
    }
    const linkRegex = /\[(.+)\] *\((.+)\)/g;
    const matches = [...content.matchAll(linkRegex)];

    if (!matches || matches.length === 0) {
      return callback(null, []);
    }

    const links = matches.map(match => {
      const [, text, url ] = match;
      return { text, url, file: fileRoute };
    });

    callback(null, links);
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

function calculateStatistics(validatedLinks, validateOption) { //validateOption: true o false. Se va a llamar en la megafunción
  let total = 0;
  let unique = 0;
  let broken = 0;

  total = validatedLinks.length;
  unique = (new Set(validatedLinks.map(value => value.url))).size;

  if (validateOption) {
    broken = validatedLinks.filter(value => value.ok === false).length;
    return {
      total,
      unique,
      broken
    };
  } else {
    return {
      total,
      unique
    };
  }
}

function printStatistics(statistics) {
  console.log(chalk.cyan(`Total: ${statistics.total}`));
  console.log(chalk.magenta(`Unique: ${statistics.unique}`));
  if (statistics.broken !== undefined) {
    console.log(chalk.yellow(`Broken: ${statistics.broken}`));
  }
}

function printValidationResult(validatedLinks) {
  if (validatedLinks.length === 0) {
    console.log(chalk.red('No links found!'));
  }
  else if (validatedLinks[0].ok === undefined) { // links sin validación
    validatedLinks.forEach(element => {
      console.log(`${chalk.magenta(element.file)} ${chalk.cyan(element.url)} ${chalk.yellow(element.text)}`);
    });
  } else {
    validatedLinks.forEach(element => { // links validados
      console.log(`${chalk.magenta(element.file)} ${chalk.cyan(element.url)} ${chalk.yellow(element.text)} ${element.ok ? chalk.green("ok " + element.status) : chalk.red("fail " + element.status)}`);
    });
  }
}

module.exports = {
  isPathValid,
  makePathAbsolute,
  getRouteType,
  getMdFilesInDirectory,
  readMdFile,
  findLinksInFile,
  validateLinksInMdFile,
  calculateStatistics,
  printStatistics,
  printValidationResult
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

// findLinksInFile(fileBeingRead, linksFound => {
//   console.log(chalk.bgWhite.bold("Links found statistics:"));
//   printStatistics(
//     calculateStatistics(linksFound, false)
//   );
//   validateLinksInMdFile(linksFound)
//     .then(validatedLinks => {
//       console.log(chalk.bgWhite.bold('Links validation results:'));
//       printValidationResult(validatedLinks);
//       console.log(chalk.bgWhite.bold("Validate statistics:"));
//       printStatistics(
//         calculateStatistics(validatedLinks, true)
//       );
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// },
//   error => {
//     console.error(chalk.red(error));
//   });