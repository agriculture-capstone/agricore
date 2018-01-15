import { createSandbox } from 'sinon';
import { expect } from 'chai';

import { numSubstrings } from '@/utilities/functions/numSubstrings';

const sandbox = createSandbox();

describe('numSubstrings utility', function () {
  const SUBSTRING = 'search_value';

  afterEach(() => sandbox.restore());

  it('should find multiple occurances', function () {
    // Arrange
    const str = `a random val${SUBSTRING}ue to find`;
    const expectedResult = 1;

    // Act
    const result = numSubstrings(str, SUBSTRING);

    // Assert
    expect(result).to.eq(expectedResult);
  });

  it('should find single occurance', function () {
    // Arrange
    const str = `Who let th${SUBSTRING}e dogs o${SUBSTRING}ut`;
    const expectedResult = 2;

    // Act
    const result = numSubstrings(str, SUBSTRING);

    // Assert
    expect(result).to.eq(expectedResult);
  });

  it('should find no occurances', function () {
    // Arrange
    const str = `I let the dogs out :(`;
    const expectedResult = 0;

    // Act
    const result = numSubstrings(str, SUBSTRING);

    // Assert
    expect(result).to.eq(expectedResult);
  });

});
