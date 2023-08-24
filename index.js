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
  isPathValid(path, (isValid) => {
    if (isValid) {
      path = makePathAbsolute(path);

      getRouteType(path, (error, routeType) => {
        if (error) {
          // TODO: handle errors
          return;
        }
    
        if (routeType == 'file') {
          processFile(path)
            .then((validatedLinks) => {
              let statistics = calculateStatistics(validatedLinks, options.validate)
              printStatistics(statistics);
              printValidationResult(validatedLinks);
            })
            .catch();
        } else if ('directory') {
          getMdFilesInDirectory(path, (error, mdFiles) => {
            if (error) {
              // TODO: handle errors
              return;
            }
        
            let mdFileValidationPromises = []
            mdFiles.forEach((filePath) => {
              let processFilePromise = processFile(filePath);
              mdFileValidationPromises.push(processFilePromise);
            });
    
            Promise.all(mdFileValidationPromises)
            .then((validatedLinksByFile) => {
              let validatedLinks = []
              validatedLinksByFile.forEach(vl => {
                validatedLinks.push(...vl);
              });
              
              let statistics = calculateStatistics(validatedLinks, options.validate)
              printStatistics(statistics);
              printValidationResult(validatedLinks);
            })
            .catch();
          });
        }
      });
    } else {
      // TODO: handle errors
    }
  });


}

function processFile(filePath) {
  findLinksInFile(filePath, (error, links) => {
    if (error) {
      // TODO: handle errors
      return;
    }

    let mdFileValidationPromise = validateLinksInMdFile(links)
      .then((validatedLinks) => validatedLinks)
      .catch(() => {
        // TODO: handle errors
      });
    return mdFileValidationPromise;
  });
}

module.exports = () => { mdLinks };

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