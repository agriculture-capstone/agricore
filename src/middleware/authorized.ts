import { RequestHandler } from 'express';

import { UserType } from '@/models/User/UserType';
import arrayIncludes from '@/utilities/functions/arrayIncludes';
import { StatusCode } from '@/models/statusCodes';

/**
 * Middleware to perform authorization for only specific user types on a route
 *
 * @param {Array<UserType>} [types] The permitted types for the route
 *
 * @returns {RequestHandler} The express middleware
 */
export default function authorized(...types: UserType[]): RequestHandler {
  return (req, res, next) => {
    if (!arrayIncludes(types, req.user.type)) {
      // Send forbidden status
      res.sendStatus(StatusCode.FORBIDDEN);
      res.end();
    } else {
      // Continue
      next();
    }
  };
}
