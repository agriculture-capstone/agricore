import { BaseError } from './BaseError';

/**
 * Raised during initialization
 */
export class InitWarning extends BaseError {

  constructor(message: string) {
    super(InitWarning, message);
  }
}
