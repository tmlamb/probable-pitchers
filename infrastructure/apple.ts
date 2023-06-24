import { createPrivateKey } from "crypto";
import { SignJWT } from "jose";

interface AppleClientInfo {
  teamId: string;
  keyId: string;
  privateKey: string;
  clientId: string;
}
/*
  Creates a JWT from the components found at Apple.
  Read more: https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens#3262048
    
  Params:
    teamId       The Apple team ID
    keyId        The key id of the private key
    privateKey   The private key to use to sign the JWT. (Starts with -----BEGIN PRIVATE KEY-----)
    clientId     The client id to use in the JWT.
*/
export async function generateSecret({
  teamId,
  keyId,
  privateKey,
  clientId,
}: AppleClientInfo) {
  const expirationTime = Math.ceil(Date.now() / 1000) + 86400 * 180;
  privateKey = privateKey.replace(/\\n/g, "\n");

  const clientSecret = await new SignJWT({})
    .setAudience("https://appleid.apple.com")
    .setIssuer(teamId)
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .setSubject(clientId)
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .sign(createPrivateKey(privateKey));

  return clientSecret;
}
