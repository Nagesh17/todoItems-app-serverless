import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
import { APIGatewayProxyEvent } from 'aws-lambda'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export function getJwtToken(event: APIGatewayProxyEvent): string{
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  return jwtToken
}
/**
 * If you wanted to use `n` and `e` from JWKS check out node-jwks-rsa's implementation:
 * https://github.com/auth0/node-jwks-rsa/blob/master/src/utils.js#L35-L57
 */

export function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}