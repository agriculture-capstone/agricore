import * as jwt from 'jsonwebtoken';

import { UserType } from '@/models/User/UserType';

/**
 * Generate a json web token for the specified user
 *
 * @param {string} [username] User to sign the token for
 *
 * @returns {Promise<string>} A JSON web token
 */
export async function createToken(username: string, type: UserType) {
  return new Promise<string>((resolve, reject) => {
    // Validate arguments
    (!username || !type) && reject(new TypeError('missing arguments'));

    // Generate token
    jwt.sign(
      { // Payload
        username,
        type,
      },
      // Secret
      process.env.JWT_SECRET,
      { // Options
        // [Thanks to Jamie Hill @ https://stackoverflow.com/a/40560953/4155595]
        ...process.env.JWT_ISSUER && { issuer: process.env.JWT_ISSUER },
        ...process.env.JWT_AUDIENCE && { audience: process.env.JWT_AUDIENCE },
        ...process.env.JWT_EXPIRES && { expiresIn: process.env.JWT_EXPIRES },
      },
      (err, encoded) => {
        err && reject(err);

        resolve(encoded);
      },
    );
  });
}
