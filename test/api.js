const { mdLinks } = require('../index')

const fileRoute = './Example';
mdLinks(fileRoute, { validate: true })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });