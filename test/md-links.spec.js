const fs = require('fs'); 

const { isPathValid, getRouteType, getMdFilesInDirectory } = require('../functions.js');

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
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
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
      expect(type).toBe('unknown');
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

  it('should get .md files in the directory', async () => {
    const mockCallback = jest.fn();
    getMdFilesInDirectory(fakeAbsoluteRoute, mockCallback);
    await tick();
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });


  it('should return an array of .md files', () => {
    const files = ['file1.md', 'file2.txt', 'file3.md'];
    fs.readdir.mockImplementation((path, callback) => callback(null, files));

    getMdFilesInDirectory(fakeAbsoluteRoute, (error, mdFiles) => {
      expect(error).toBeNull();
      expect(mdFiles).toEqual(['file1.md', 'file3.md']);
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

// describe('test for makePathAbsolute', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//     jest.resetModules();
//   });

//   afterEach(() => {
//     jest.clearAllMocks()
//     jest.resetModules();
//   });

//   it('should return the same path if it is already absolute', () => {
//     const fakeAbsoluteRoute = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example';
//     const mockIsAbsolute = jest.fn().mockReturnValue(true);
//     path.isAbsolute = mockIsAbsolute;

//     const result = makePathAbsolute(fakeAbsoluteRoute);
//     expect(result).toBe(fakeAbsoluteRoute);

//     expect(mockIsAbsolute).toHaveBeenCalledTimes(1);
//     expect(path.resolve).not.toHaveBeenCalled();
//   });

//   it('should convert a relative path to an absolute one', () => {
//     const fakeAbsoluteRoute = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example';
//     const mockIsAbsolute = jest.fn().mockReturnValue(false);
//     const mockResolve = jest.fn().mockReturnValue(fakeAbsoluteRoute);
//     path.isAbsolute = mockIsAbsolute;
//     path.resolve = mockResolve;
//     // jest.mock('path', () => ({
//     //   isAbsolute: mockIsAbsolute,
//     //   resolve: mockResolve
//     // }));
//     // const { makePathAbsolute } = require('../functions.js');
//     const result = makePathAbsolute('..\\Example');
  
//     expect(result).toBe(fakeAbsoluteRoute);

//     expect(mockIsAbsolute).toHaveBeenCalledTimes(1);
//     expect(mockResolve).toHaveBeenCalledTimes(1);
//     expect(mockResolve).toHaveBeenCalledWith(fakeRelativeRoute);
//   });
// });