import { expect } from 'chai';

import arrayIncludes from '@/utilities/functions/arrayIncludes';

describe('arrayIncludes', function () {
  const BASE_ARR_SIZE = 5;
  const SML_ARR_SIZE = 1;
  const EMPTY_ARR_SIZE = 0;
  const START_INDEX = 0;
  const MIDDLE_INDEX = 2;
  const AFTER_MIDDLE_INDEX = MIDDLE_INDEX + 1;
  const BEFORE_MIDDLE_INDEX = MIDDLE_INDEX - 1;
  const END_INDEX = BASE_ARR_SIZE - 1;
  const NEGATIVE_INDEX = MIDDLE_INDEX - BASE_ARR_SIZE;
  const SEARCH_VAL = '10356';
  const COERCED_VAL = 10356;

  it('should be true given one occurrance at start of array', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[START_INDEX] = SEARCH_VAL;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.true;
  });

  it('should be true given one occurrance in middle of array', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[MIDDLE_INDEX] = SEARCH_VAL;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.true;
  });

  it('should be true given one occurrance at end of array', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[END_INDEX] = SEARCH_VAL;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.true;
  });

  it('should be true given mutiple occurances in array', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[START_INDEX] = SEARCH_VAL;
    arr[MIDDLE_INDEX] = SEARCH_VAL;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.true;
  });

  it('should be false given no occurences', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.false;
  });

  it('should be false if coerced value equal', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[MIDDLE_INDEX] = COERCED_VAL as any;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.false;
  });

  it('should be false given empty array', function () {
    // Arrange
    const arr = createArray(EMPTY_ARR_SIZE);

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.false;
  });

  it('should be true given occurance in single element array', function () {
    // Arrange
    const arr = createArray(SML_ARR_SIZE);
    arr[START_INDEX] = SEARCH_VAL;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.true;
  });

  it('should be false given no occurance in single element array', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL);

    // Assert
    expect(result).to.be.false;
  });

  it('should be true if search element occurs after fromIndex', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[AFTER_MIDDLE_INDEX] = SEARCH_VAL;
    const fromIndex = MIDDLE_INDEX;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL, fromIndex);

    // Assert
    expect(result).to.be.true;
  });

  it('should be true if search element occurs at fromIndex', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[MIDDLE_INDEX] = SEARCH_VAL;
    const fromIndex = MIDDLE_INDEX;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL, fromIndex);

    // Assert
    expect(result).to.be.true;
  });

  it('should be false if search element occurs before fromIndex', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[BEFORE_MIDDLE_INDEX] = SEARCH_VAL;
    const fromIndex = MIDDLE_INDEX;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL, fromIndex);

    // Assert
    expect(result).to.be.false;
  });

  it('should be searchable with negative fromIndex', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[MIDDLE_INDEX] = SEARCH_VAL;
    const fromIndex = NEGATIVE_INDEX;

    // Act
    const result = arrayIncludes(arr, SEARCH_VAL, fromIndex);

    // Assert
    expect(result).to.be.true;
  });

  it('should find NaN', function () {
    // Arrange
    const arr = createArray(BASE_ARR_SIZE);
    arr[MIDDLE_INDEX] = Number.NaN as any;

    // Act
    const result = arrayIncludes(arr, Number.NaN as any);

    // Assert
    expect(result).to.be.true;
  });

  it('should throw error if array undefined', function () {
    // Arrange
    const arr = undefined as any;

    // Act
    let failed = false;
    try {
      arrayIncludes(arr, SEARCH_VAL);
    } catch (e) {
      failed = true;
    }

    // Assert
    expect(failed).to.eq(true, 'should have failed');
  });

  it('should throw error if array null', function () {
    // Arrange
    const arr = null as any;

    // Act
    let failed = false;
    try {
      arrayIncludes(arr, SEARCH_VAL);
    } catch (e) {
      failed = true;
    }

    // Assert
    expect(failed).to.eq(true, 'should have failed');
  });

  /********************************** Helper Functions **********************************/

  function createArray(size: number) {
    return new Array(size).map((_, i) => {
      return getIndexVal(i);
    });
  }

  function getIndexVal(index: number) {
    return String(index);
  }
});
