import logger from '@/utilities/modules/logger';
import { init } from '@/initialization';

/**
 * AgriCore server
 */
export class Server {

  constructor() {
    this.start = this.start.bind(this);
  }

  /**
   * Start the server
   */
  public async start() {
    try {
      const { server, port } = await init();
      // Start listening for requests
      server.listen(port, () => {
        logger.info(`AgriCore is running on http://localhost:${port}`);
      });
    } catch (e) {
      logger.warn('Failed to initialize application');
      logger.error(e.message && e.stack ? `${e.message}\n${e.stack}` : e);
    }
  }
}
