const fs = require('fs'); 

const { isPathValid, getRouteType, getMdFilesInDirectory } = require('../functions.js');

const fakeAbsoluteRoute = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example';
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