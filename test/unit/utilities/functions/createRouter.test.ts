import { createSandbox, assert, SinonStub } from 'sinon';
import { expect } from 'chai';
import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

import createRouter, { ParserType, injectCreateRouter } from '@/utilities/functions/createRouter';

const sandbox = createSandbox();

interface Stubs {
  urlencoded: SinonStub;
  json: SinonStub;
}

describe('createRouter utility', function () {
  let stubs: Stubs;

  afterEach(() => sandbox.restore());

  beforeEach(function () {
    stubs = {
      urlencoded: sandbox.stub(bodyParser, 'urlencoded').returns(createRequestHandler()),
      json: sandbox.stub(bodyParser, 'json').returns(createRequestHandler()),
    };
  });

  it('should successfully create router', function () {
    // Act
    const router = createRouter();

    // Assert
    expect(Object.getPrototypeOf(router)).to.eq(Router);
  });

  it('should default to json parser', function () {
    // Act
    injectCreateRouter(stubs);

    // Assert
    assert.calledOnce(stubs.json);
    assert.notCalled(stubs.urlencoded);
  });

  it('should use json parser when specified', function () {
    // Act
    injectCreateRouter(stubs, ParserType.JSON);

    // Assert
    assert.calledOnce(stubs.json);
    assert.notCalled(stubs.urlencoded);
  });

  it('should use urlencoded parsers when specified', function () {
    // Act
    injectCreateRouter(stubs, ParserType.URL_ENCODED);

    // Assert
    assert.calledOnce(stubs.urlencoded);
    assert.notCalled(stubs.json);
  });

  it('should use json and urlencoded parsers when specified', function () {
    // Act
    injectCreateRouter(stubs, ParserType.JSON, ParserType.URL_ENCODED);

    // Assert
    assert.calledOnce(stubs.json);
    assert.calledOnce(stubs.urlencoded);
  });

  it('should only use json parser once when specified twice', function () {
    // Act
    injectCreateRouter(stubs, ParserType.JSON, ParserType.JSON);

    // Assert
    assert.calledOnce(stubs.json);
    assert.notCalled(stubs.urlencoded);
  });
});

function createRequestHandler(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {};
}
