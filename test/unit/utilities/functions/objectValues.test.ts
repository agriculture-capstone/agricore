import { expect } from 'chai';

import objectValues from '@/utilities/functions/objectValues';

interface CreateObjectData {
  enumerable?: boolean;
  nonEnumerable?: boolean;
  functions?: boolean;
  prototype?: boolean;
}

interface Property {
  name: string;
  value: number | Function;
}

describe('objectValues utility', function () {
  const ENUMERABLES: Property[] = [
    { name: 'eFirst', value: 0x1 },
    { name: 'eSecond', value: 0x2 },
    { name: 'eThird', value: 0x3 },
  ];
  const NON_ENUMERABLES: Property[] = [
    { name: 'nFirst', value: 0x4 },
    { name: 'nSecond', value: 0x5 },
    { name: 'nThird', value: 0x6 },
  ];
  const ENUM_FUNCTIONS: Property[] = [
    { name: 'fFirst', value: function fFirst() {} },
    { name: 'fSecond', value: function fSecond() {} },
    { name: 'fThird', value: function fThird() {} },
  ];

  it('should collect enumerable object\'s values', function () {
    // Arrange
    const o = createObject({
      enumerable: true,
    });

    // Act
    const values = objectValues(o);

    // Assert
    checkValues(values, ENUMERABLES);
  });

  it('should ignore non-enumerable values on an object', function () {
    throw new Error('not implemented');
  });

  it('should collect enumerable functions on an object', function () {
    throw new Error('not implemented');
  });

  it('should ignore values on an object\'s prototype', function () {
    throw new Error('not implemented');
  });

  function createObject({ enumerable = false, nonEnumerable = false, functions = false, prototype = false }: CreateObjectData) {
    const o = {};

    if (enumerable) {
      addProperties(o, ENUMERABLES, true);
    }

    if (nonEnumerable) {
      addProperties(o, NON_ENUMERABLES, false);
    }

    if (functions) {
      addProperties(o, ENUM_FUNCTIONS, true);
    }

    if (prototype) {
      const proto = {};
      addProperties(proto, ENUMERABLES, true);
      Object.setPrototypeOf(o, proto);
    }

    return o;
  }

  function checkValues(values: any[], props: Property[],  ) {
    props.map((prop) => {
      const numOccurances = values.filter(v => v === prop.value).length;
      expect(numOccurances).to.eq(1, `Should be one occurance of ${prop.name} in values`);
    });
  }
});

function addProperties(o: object, props: Property[], enumerable: boolean) {
  const descriptors = props.map((prop) => {
    return {
      [prop.name]: {
        enumerable,
        value: prop.value,
      },
    };
  }).reduce((a, b) => ({ ...a, ...b }));

  Object.defineProperties(o, descriptors);
}
