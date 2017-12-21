import * as compression from 'compression';
import * as cors from 'cors';

import { networkLogger } from '@/utilities/modules/logger';
import jwtMiddleware from '@/middleware/jwtMiddleware';
import jwtUnauthorized from '@/middleware/jwtUnauthorized';

const nl = networkLogger();

/**
 * Applies middleware to express app using old `configure` pattern
 */
export default function middleware() {
  this.use(jwtMiddleware());
  this.use(jwtUnauthorized());
  this.use(cors());
  this.use(compression());
  this.use(nl);
}
