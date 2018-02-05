import * as expressJwt from 'express-jwt';

/**
 * Generate jwt middleware to verify presence of jwt token on requests
 */
export default function jwt() {
  return expressJwt({
    secret: process.env.JWT_SECRET,
  }).unless({
    path: [
      // Allow access to the login path only
      '/actions/authenticate',
    ],
  });
}
