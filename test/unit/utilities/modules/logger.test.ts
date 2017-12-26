import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { reset } from '@/utilities/modules/logger';

const sandbox = createSandbox();

describe('logger utility', function () {

  afterEach(() => sandbox.restore());

  beforeEach(() => reset());

  describe('resolve', function () {

    it('should create absolute path to logger files', function () {
      // Arrange

      // Act

      // Assert
    });
  });

  describe('check', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('generateLogger', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('prepareMessage', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('generateLoggerMethod', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('initLogger', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('networkLogger', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('init', function () {
    // Arrange

    // Act

    // Assert
  });
});
