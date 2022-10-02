import * as AuthSession from "expo-auth-session";
import { getSignInInfo, SigninResult } from "next-auth/expo";

import { nativeProviders } from "@probable/api";
import { discovery as googleDiscovery } from "expo-auth-session/providers/google";

export const socialLogin = async (): Promise<SigninResult | null> => {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const provider = nativeProviders.google;
  const signinInfo = await getSignInInfo({
    provider,
    proxyRedirectUri: redirectUri,
  });
  if (!signinInfo) {
    throw new Error("Couldn't get sign in info from server");
  }
  const { state, codeChallenge, stateEncrypted, codeVerifier, clientId } =
    signinInfo;

  // This corresponds to useLoadedAuthRequest
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ["openid"],
  });

  request.state = state;
  request.codeChallenge = codeChallenge;
  request.codeVerifier = codeVerifier;
  await request.makeAuthUrlAsync(googleDiscovery);

  // useAuthRequestResult
  const result = await request.promptAsync(googleDiscovery, { useProxy: true });
  return {
    result,
    state,
    stateEncrypted,
    codeVerifier,
    provider,
  };
};
