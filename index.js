const {
  isPathValid,
  makePathAbsolute,
  getRouteType,
  getMdFilesInDirectory,
  findLinksInFile,
  validateLinksInMdFile,
  calculateStatistics,
  printStatistics,
  printValidationResult
} = require("./functions.js");

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {

    isPathValid(path, (isValid) => {
      if (isValid) {
        path = makePathAbsolute(path);

        getRouteType(path, (error, routeType) => {
          if (error) {
            reject(error);
            return;
          }

          if (routeType == 'file') {
            processFile(path, options.validate)
              .then((validatedLinks) => {
                resolve(validatedLinks)
              })
              .catch((error) => {
                reject(error)
              });
          } else if ('directory') {
            getMdFilesInDirectory(path, (error, mdFiles) => {
              if (error) {
                reject(error);
                return;
              }

              let mdFileValidationPromises = []
              mdFiles.forEach((filePath) => {
                let processFilePromise = processFile(filePath, options.validate);
                mdFileValidationPromises.push(processFilePromise);
              });

              Promise.all(mdFileValidationPromises)
                .then((validatedLinksByFile) => {
                  let validatedLinks = []
                  validatedLinksByFile.forEach(vl => {
                    validatedLinks.push(...vl);
                  });
                  resolve(validatedLinks)
                })
                .catch((error) => {
                  reject(error)
                });
            });
          }
        });
      } else {
        reject('Invalid path.');
      }
    });
  });
}

function processFile(filePath, validate) {
  return new Promise((resolve, reject) => {
    findLinksInFile(filePath, (error, links) => {
      if (error) {
        reject(error);
        return;
      }

      if (validate) {
        let mdFileValidationPromise = validateLinksInMdFile(links);
        resolve(mdFileValidationPromise);
      } else {
        resolve(links);
      }
    });
  });
}

module.exports = () => { mdLinks };


const fileRoute = './Example';
mdLinks(fileRoute, { validate: false })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
// const mdLinks = require("md-links");

// mdLinks("./some/example.md")
//   .then(links => {
//     // => [{ href, text, file }, ...]
//   })
//   .catch(console.error);

// mdLinks("./some/example.md", { validate: true })
//   .then(links => {
//     // => [{ href, text, file, status, ok }, ...]
//   })
//   .catch(console.error);

// mdLinks("./some/dir")
//   .then(links => {
//     // => [{ href, text, file }, ...]
//   })
//   .catch(console.error);

// Crea una promesa
// El valor de retorno de nuestra librería es una Promesa, no un Array.