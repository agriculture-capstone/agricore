export class BaseError extends Error {
  constructor(error: Function, message: string) {
    super(message);
    Error.captureStackTrace(error);
  }
}
