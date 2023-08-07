const { isPathValid, getRouteType } = require('../functions.js');

const fakeAbsoluteRoute = 'C:\\Users\\Leslie\\Documents\\Laboratoria\\DEV008-md-links\\Example';
const fakeRelativeRoute = '..\\Example';
const fakeInvalidRoute = 'C:\\Users\\Leslie\\Documents\\Labororia\\DElinks\\Example';

function tick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('test para isPathValid', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('debería pasar una ruta válida', async () => {
    const mockCallback = jest.fn();
    isPathValid(fakeAbsoluteRoute, mockCallback);
    await tick();
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(true);
  });

  it('debería mostrar error si la ruta es inválida', async () => {
    const mockCallback = jest.fn();
    isPathValid(fakeInvalidRoute, mockCallback);
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(false);
  });
});

describe('test para makePathAbsolute', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('debería convertir una ruta relativa a una absoluta', async () => {
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

describe('test para getRouteType', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('debería obtener el tipo de ruta', async () => {
    const mockCallback = jest.fn();
    getRouteType(fakeAbsoluteRoute, mockCallback);
    await tick();
    await tick();
    await tick();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

// describe('test para getMdFilesInDirectory', () => {

// });