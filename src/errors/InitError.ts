import { BaseError } from './BaseError';

/**
 * Raised during initialization
 */
export class InitError extends BaseError {

  constructor(message: string) {
    super(InitError, message);
  }
}
