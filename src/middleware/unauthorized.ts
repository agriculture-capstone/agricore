import { ErrorRequestHandler } from 'express';
import { StatusCode } from '@/models/statusCodes';

/**
 * Express Middleware to handle when a jwt token is not provided
 *
 * @returns {ErrorRequestHandler} Express error request handler middleware
 */
export default function unauthorized(): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(StatusCode.UNAUTHORIZED).send('Unauthorized user').end();
      return;
    }

    next();
  };
}
