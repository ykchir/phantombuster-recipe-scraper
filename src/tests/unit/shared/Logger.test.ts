import { Logger } from '../../../shared/Logger.js';

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log info messages', () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    Logger.info('Test info message');
    expect(consoleSpy).toHaveBeenCalledWith('[INFO] Test info message');
  });

  it('should log warning messages', () => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    Logger.warn('Test warn message');
    expect(consoleSpy).toHaveBeenCalledWith('[WARN] Test warn message');
  });

  it('should log error messages without stack', () => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    Logger.error('Test error message');
    expect(consoleSpy).toHaveBeenCalledWith('[ERROR] Test error message');
  });

  it('should log error messages with stack trace', () => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    Logger.error('Test error message', error);
    expect(consoleSpy).toHaveBeenCalledWith('[ERROR] Test error message');
    expect(consoleSpy).toHaveBeenCalledWith(error.stack);
  });
});
