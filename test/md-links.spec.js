const fs = require('fs');
const chalk = require('chalk');

const { isPathValid,
  makePathAbsolute,
  getRouteType,
  getMdFilesInDirectory,
  readMdFile,
  findLinksInFile,
  validateLinksInMdFile,
  calculateStatistics,
  printStatistics,
  printValidationResult
} = require('../functions.js');

const fakeAbsoluteRoute = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example';
const fakeValidFile = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example\\file-1.md'
const fakeRelativeRoute = '..\\Example';
const fakeInvalidRoute = 'C:\\Users\\Leslie\\Documents\\Labororia\\DElinks\\Example';

function tick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('test for isPathValid', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should validate a valid path', async () => {
    const mockCallback = jest.fn();
    isPathValid(fakeAbsoluteRoute, mockCallback);
    await tick();
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(true);
  });

  it('should show error if path is invalid', async () => {
    const mockCallback = jest.fn();
    isPathValid(fakeInvalidRoute, mockCallback);
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(false);
  });
});

describe('test for makePathAbsolute', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should keep an absolute path unchanged', () => {
    const absolutePath = '/absolute-route';
    const result = makePathAbsolute(absolutePath);

    expect(result).toBe(absolutePath);
  });

  it('should convert a relative path to an absolute one', async () => {
    const fakeAbsoluteRoute = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example';
    const mockIsAbsolute = jest.fn().mockImplementation(() => false);
    const mockResolve = jest.fn().mockImplementation(() => fakeAbsoluteRoute);
    jest.mock('path', () => ({
      isAbsolute: mockIsAbsolute,
      resolve: mockResolve
    }));
    const { makePathAbsolute } = require('../functions.js');
    const result = makePathAbsolute(fakeRelativeRoute);
    await tick();
    expect(result).toBe(fakeAbsoluteRoute);
    expect(mockIsAbsolute).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledWith(fakeRelativeRoute);
  });
});

describe('test for getRouteType', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get the route type', async () => {
    const mockCallback = jest.fn();
    getRouteType(fakeAbsoluteRoute, mockCallback);
    await tick();
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should return "file" for an existing file', (done) => {
    jest.mock('fs', () => ({
      stat: (path, callback) => {
        const mockCallback = {
          isFile: () => false,
          isDirectory: () => true,
        };
        callback(null, mockCallback);
      },
    }));
    getRouteType(fakeValidFile, (error, type) => {
      expect(error).toBeNull();
      expect(type).toBe('file');
      done();
    });
  });

  it('should return "directory" for an existing directory', (done) => {
    jest.mock('fs', () => ({
      stat: (path, callback) => {
        const mockCallback = {
          isFile: () => true,
          isDirectory: () => false,
        };
        callback(null, mockCallback);
      },
    }));

    getRouteType(fakeAbsoluteRoute, (error, type) => {
      expect(error).toBeNull();
      expect(type).toBe('directory');
      done();
    });
  });

  it('should return "unknown" for an unknown type', (done) => {
    jest.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const mockCallback = {
        isFile: () => false,
        isDirectory: () => false,
      };
      callback(null, mockCallback);
    });

    getRouteType('route/file/file-or-directoy-unknown', (error, type) => {
      expect(error).toBeNull();
      expect(type).toBe('Unknown route type');
      done();
    });
  });

  it('should handle an error getting the file/directory information', (done) => {
    const mockError = new Error('Error al obtener información');

    jest.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      callback(mockError);
    });

    getRouteType('ruta/al/archivo-o-directorio', (error, type) => {
      expect(error).toEqual(`Error getting route type: ${mockError.message}`);
      expect(type).toBeUndefined(); // No debería haber tipo en caso de error
      done();
    });
  });
});

describe('test for getMdFilesInDirectory', () => {

  beforeEach(() => {
    jest.spyOn(fs, 'readdir');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  jest.mock('fs');

  it('should get .md files in the directory', async () => {
    const mockCallback = jest.fn();
    getMdFilesInDirectory(fakeAbsoluteRoute, mockCallback);
    await tick();
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });


  it('should return an array of .md files', (done) => {
    const files = ['file1.md', 'file2.txt', 'file3.md'];
    fs.readdir.mockImplementation((path, callback) => callback(null, files));

    getMdFilesInDirectory(fakeAbsoluteRoute, (error, mdFiles) => {
      expect(error).toBeNull();
      expect(mdFiles).toEqual(['C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example\\file1.md', 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example\\file3.md']);
      done();
    });
  });

  it('should handle readdir error', () => {
    fs.readdir.mockImplementation((path, callback) => callback(new Error('Read error')));

    getMdFilesInDirectory(fakeAbsoluteRoute, (error, mdFiles) => {
      expect(error).toBeInstanceOf(Error);
      expect(mdFiles).toBeUndefined();
    });
  });

});

describe('test for readMdFile', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  jest.spyOn(fs, 'readFile').mockImplementation((path, encoding, callback) => {
    if (path === 'existing.md') {
      callback(null, 'Contenido del archivo');
    } else {
      callback(new Error('Archivo no encontrado'));
    }
  });

  it('should read an existing file', async () => {
    const mockCallback = jest.fn();
    readMdFile(fakeValidFile, mockCallback);
    await tick();
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle an error reading a non-existent file', (done) => {
    readMdFile('non-existent.md', (error, data) => {
      expect(error).toBeDefined();
      expect(data).toBeUndefined();
      done();
    });
  });
});

describe('test for findLinksInFile', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
 
  it('should find links in file', async () => {
    const mockCallback = jest.fn();
    findLinksInFile(fakeValidFile, mockCallback, mockCallback);
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle files without links', () => {
    
    jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => {
      callback(null, 'Sample content without links');
    });

    const mockCallback = jest.fn();

    findLinksInFile('fileWithoutLinks', (error, links) => {
      expect(error).toBeNull();
      expect(links).toEqual([]);
      mockCallback();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when reading a file', () => {
    jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => {
      callback(new Error('File not found'));
    });
    const mockCallback = jest.fn();
    findLinksInFile('invalidFile', (error, links) => {
      expect(error).toBe(`Failed to find links in file invalidFile: Error reading file invalidFile: File not found`);
      expect(links).toBeUndefined();
      mockCallback();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

describe('test for validateLinksInMdFile', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should validate a single link with 200 status', async () => {
    const mockLink = {
      url: 'http://example.com',
      text: 'Example',
      file: 'example.md',
    };

    const mockResponse = {
      status: 200,
      ok: true,
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await validateLinksInMdFile([mockLink]);

    expect(result).toEqual([
      {
        url: mockLink.url,
        text: mockLink.text,
        file: mockLink.file,
        status: mockResponse.status,
        ok: mockResponse.ok,
      },
    ]);
  });

  it('should handle a single link with 404 status', async () => {
    const mockLink = {
      url: 'http://nonexistent.com',
      text: 'Nonexistent',
      file: 'nonexistent.md',
    };

    const mockErrorResponse = { status: 404 };

    global.fetch = jest.fn().mockRejectedValue(mockErrorResponse);

    const result = await validateLinksInMdFile([mockLink]);

    expect(result).toEqual([
      {
        url: mockLink.url,
        text: mockLink.text,
        file: mockLink.file,
        status: mockErrorResponse.status,
        ok: false,
      },
    ]);
  });
});

describe('test for calculateStatistics', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const sampleLinks = [
    { url: 'https://example.com', ok: true },
    { url: 'https://example.com', ok: false },
    { url: 'https://anotherexample.com', ok: true },
  ];

  it('should calculate base stats correctly', () => {
    const result = calculateStatistics(sampleLinks, false);
    expect(result).toEqual({ total: 3, unique: 2 });
  });

  it('should calculate stats including broken links', () => {
    const result = calculateStatistics(sampleLinks, true);
    expect(result).toEqual({ total: 3, unique: 2, broken: 1 });
  });

  it('should handle an empty list of links', () => {
    const result = calculateStatistics([], true);
    expect(result).toEqual({ total: 0, unique: 0, broken: 0 });
  });

  it('should handle a list of links with no broken links', () => {
    const linksWithoutBroken = [
      { url: 'https://example.com', ok: true },
      { url: 'https://anotherexample.com', ok: true },
    ];

    const result = calculateStatistics(linksWithoutBroken, true);
    expect(result).toEqual({ total: 2, unique: 2, broken: 0 });
  });

  it('should handle a list of links with no unique links', () => {
    const linksWithDuplicates = [
      { url: 'https://example.com', ok: true },
      { url: 'https://example.com', ok: true },
    ];

    const result = calculateStatistics(linksWithDuplicates, true);
    expect(result).toEqual({ total: 2, unique: 1, broken: 0 });
  });
});

describe('test for printStatistics', () => {
  jest.mock('chalk');
  let consoleSpy;

  jest.mock('chalk', () => ({
    cyan: jest.fn(),
    magenta: jest.fn(),
  }));

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should print basic statistics', () => {
    const statistics = { total: 5, unique: 3 };
    printStatistics(statistics);

    expect(consoleSpy).toHaveBeenCalledWith(chalk.cyan('Total: 5'));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.magenta('Unique: 3'));
  });

  it('should print basic statistics including broken links', () => {
    const statistics = { total: 7, unique: 4, broken: 2 };
    printStatistics(statistics);

    expect(consoleSpy).toHaveBeenCalledWith(chalk.cyan('Total: 7'));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.magenta('Unique: 4'));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.yellow('Broken: 2'));
  });

  it('should print statistics with no broken links', () => {
    const statistics = { total: 10, unique: 5 };
    printStatistics(statistics);

    expect(consoleSpy).toHaveBeenCalledWith(chalk.cyan('Total: 10'));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.magenta('Unique: 5'));
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Broken'));
  });
});

describe('test for printValidationResult', () => {
  jest.mock('chalk');
  let consoleSpy;

  jest.mock('chalk', () => ({
    cyan: jest.fn(),
    magenta: jest.fn(),
    red: jest.fn(),
    green: jest.fn(),
    yellow: jest.fn(),
  }));

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should print "No links found!" when there are no links', () => {
    const validatedLinks = [];
    printValidationResult(validatedLinks);

    expect(consoleSpy).toHaveBeenCalledWith(chalk.red('No links found!'));
  });

  it('should print links with no validation', () => {
    const validatedLinks = [
      { file: 'file1.md', url: 'https://example.com', text: 'Example' },
      { file: 'file2.md', url: 'https://anotherexample.com', text: 'Another Example' },
    ];

    printValidationResult(validatedLinks);

    validatedLinks.forEach(element => {
      expect(consoleSpy).toHaveBeenCalledWith(`${chalk.magenta(element.file)} ${chalk.cyan(element.url)} ${chalk.yellow(element.text)}`);
    });
  });

  it('should print validated links', () => {
    const validatedLinks = [
      { file: 'file1.md', url: 'https://example.com', text: 'Example', ok: true, status: 200 },
      { file: 'file2.md', url: 'https://anotherexample.com', text: 'Another Example', ok: false, status: 404 },
    ];

    printValidationResult(validatedLinks);

    validatedLinks.forEach(element => {
      expect(consoleSpy).toHaveBeenCalledWith(
        `${chalk.magenta(element.file)} ${chalk.cyan(element.url)} ${chalk.yellow(element.text)} ${element.ok ? chalk.green("ok " + element.status) : chalk.red("fail " + element.status)}`
      );
    });
  });

});
