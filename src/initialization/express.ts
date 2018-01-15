import middleware from '@/middleware';
import routers from '@/routers';

/** Default port to listen on */
export const DEFAULT_PORT = 8090;

/**
 * Initialize express application
 */
export function initExpress(createServer: Function) {
  // Setup express server
  const server = createServer();
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
