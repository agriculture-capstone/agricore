import * as ExpressServer from 'express';

import middleware from '@/middleware';
import routers from '@/routers';

/**
 * Initialize express application
 */
export function initExpress() {
  // Setup express server
  const DEFAULT_PORT = 8090;
  const server = ExpressServer();
  const port = process.env.PORT || DEFAULT_PORT;

  // Configure middleware
  middleware.apply(server);

  // Setup routes
  server.use('/', routers);

  return {
    port,
    server,
  };
}
