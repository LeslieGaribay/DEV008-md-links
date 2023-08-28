# Markdown Links

## Index

* [1. Project description](#1-project-description)
* [2. Installation](#2-installation)
* [3. Functionality and Usage Guide](#3-functionality-and-usage-guide)
* [4. Test](#4-test)
* [5. Fundamentals](#5-fundamentals)
* [6. Author](#6-author)

***

## 1. Project description

md-links-lg is a library and command-line tool (CLI) that allows you to analyze and read one or multiple markdown format files to search for and validate the status of the links they contain, as well as obtain some statistics such as the total number of unique or broken links found.


## 2. Installation

To install this library, enter the following command in your terminal:

`npm install --global <github-user>/md-links`


## 3. Functionality and Usage Guide

This project consists of two parts:

### 1) JavaScript API

The module can be imported into other Node.js scripts and provides the following interface:

#### `mdLinks(path, options)`

#### Arguments

* `path`: Corresponds to the absolute or relative path to the file or directory.

* `options`: It is an object with only the "validate" property, a boolean that determines whether to validate the found links (true or false).

#### Return value

The function returns a promise that resolves an array of objects, where each object represents a link and contains the following properties:

With `validate: false` :

* `href`: Found URL.
* `text`: The accompanying text (`<a>`).
* `file`: Path of the file where the link was found.

With `validate: true` :

* `href`: Found URL.
* `text`: The accompanying text (`<a>`).
* `file`: Path of the file where the link was found.
* `status`: HTTP response code.
* `ok`: "fail" message in case of failure or "ok" in case of success.

#### Example

```js
const mdLinks = require("md-links");

mdLinks("./some/example.md")
  .then(links => {
    // => [{ href, text, file }, ...]
  })
  .catch(console.error);

mdLinks("./some/example.md", { validate: true })
  .then(links => {
    // => [{ href, text, file, status, ok }, ...]
  })
  .catch(console.error);

mdLinks("./some/dir")
  .then(links => {
    // => [{ href, text, file }, ...]
  })
  .catch(console.error);
```

### 2) CLI (Command Line Interface)

The application executable can be run through the terminal as follows:

`md-links <path> [options]`

* `path`: corresponds to the path, either absolute or relative, of the file or directory you want to analyze. On the other hand, [options] provide flexibility to customize the output according to your needs.

#### Options

#### `--validate` or `--v`

If you choose to include this option, the program will make an HTTP request to verify the validity of each link, and you will receive a report with the link, the file where it is located, the accompanying text, and its status (fail or ok).

Example:

```sh
$ md-links ./some/example.md --validate
./some/example.md http://somepage.com/2/3/ Some text ok 200 
./some/example.md https://other-page.net/some-doc.html Other text fail 404 
./some/example.md http://google.com/ Google ok 301 
```

#### `--stats` or `--s`

By selecting this option, the result will display basic statistics about the links identified in the file, such as the total number of links and the count of unique or non-repeated links.

Example:

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

#### `--stats --validate` or `--s --v`

If you choose both options, the result will include the previously mentioned statistics about the found links, but it will also include the count of broken links.

Example:

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

## 4. Test

The unit tests for this project were built using Jest, which achieved 100% coverage in statements, functions, lines, and branches.

## 5. Fundamentals

JavaScript, Node.js, NPM.

## 6. Author

Leslie Angélica Garibay Raymundo, 2023.