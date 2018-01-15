import { BaseError } from './BaseError';

const DEFAULT_MSG = 'failed to authenticate';

/** Error thrown for failed authentication */
export class AuthError extends BaseError {
  constructor(msg = DEFAULT_MSG) {
    super(AuthError, msg);
  }
}
