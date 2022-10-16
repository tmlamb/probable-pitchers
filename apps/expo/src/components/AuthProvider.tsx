import { nativeProviders } from "@probable/api";
import * as AuthSession from "expo-auth-session";
import { discovery as googleDiscovery } from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { getSignInInfo, SessionProvider, SigninResult } from "next-auth/expo";
import { getBaseUrl } from "../api";

const projectNameForProxy = Constants.manifest2?.extra?.scopeKey;

export const googleLogin = async (): Promise<SigninResult | null> => {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
    projectNameForProxy,
  });
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
    usePKCE: true,
  });

  request.state = state;
  request.codeChallenge = codeChallenge;
  request.codeVerifier = codeVerifier;
  await request.makeAuthUrlAsync(googleDiscovery);

  // useAuthRequestResult
  const result = await request.promptAsync(googleDiscovery, {
    useProxy: true,
    projectNameForProxy,
  });
  return {
    result,
    state,
    stateEncrypted,
    codeVerifier,
    provider,
  };
};

export const appleLogin = async (): Promise<SigninResult | null> => {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
    projectNameForProxy,
  });
  const provider = nativeProviders.apple;
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
    usePKCE: true,
  });

  request.state = state;
  request.codeChallenge = codeChallenge;
  request.codeVerifier = codeVerifier;
  await request.makeAuthUrlAsync({
    authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
  });

  // useAuthRequestResult
  const result = await request.promptAsync(
    {
      authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
    },
    {
      useProxy: true,
      projectNameForProxy,
    }
  );
  return {
    result,
    state,
    stateEncrypted,
    codeVerifier,
    provider,
  };
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <SessionProvider baseUrl={getBaseUrl()}>{children}</SessionProvider>;
};

export default AuthProvider;
