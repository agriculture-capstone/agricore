import { Router } from 'express';
import * as bodyParser from 'body-parser';

import arrayIncludes from '@/utilities/functions/arrayIncludes';

/** The different body formats that can be supported by a route */
export enum ParserType {
  JSON = 0x1,
  URL_ENCODED = 0x2,
}

function createRouterCore({ json, urlencoded }: typeof bodyParser, ...parserTypes: ParserType[]) {
  const router = Router();

  const contains = (el: ParserType) => arrayIncludes(parserTypes, el);

  if (parserTypes.length === 0) {
    // Default to JSON
    router.use(json());
  } else {
    if (contains(ParserType.JSON)) {
      router.use(json());
    }
    if (contains(ParserType.URL_ENCODED)) {
      router.use(urlencoded({ extended: true }));
    }
  }

  return router;
}

/** Inject parser into createRouter for test purposes */
export function injectCreateRouter(parser: any, ...parserTypes: ParserType[]) {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('should only be called in test environment');
  }
  return createRouterCore(parser, ...parserTypes);
}

/**
 * Creates a new instance of Express.Router configured with body-parser.
 *
 * @returns {Router} The Express router.
 */
export default function createRouter(...parserTypes: ParserType[]) {
  return createRouterCore(bodyParser, ...parserTypes);
}
