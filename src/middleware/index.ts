import * as compression from 'compression';
import * as cors from 'cors';

import { createNetworkLogger } from '@/utilities/modules/logger';
import jwtMiddleware from '@/middleware/jwt';
import unauthorizedMiddleware from '@/middleware/unauthorized';

/**
 * Applies middleware to express app using old `configure` pattern
 */
export default function middleware() {
  // this.use(jwtMiddleware());
  // this.use(unauthorizedMiddleware());
  this.use(cors());
  this.use(compression());
  this.use(createNetworkLogger);
}
