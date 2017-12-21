import logger from '@/utilities/modules/logger';
import { init } from '@/initialization';

// Initialize application
init().then(({ server, port }) => {

  // Start listening for requests
  server.listen(port, () => {
    logger.info(`The Agriculture Core is running on http://localhost:${port}`);
  });

}).catch((e) => {
  logger.error('Failed to initialize application');
  logger.error(e);
});
