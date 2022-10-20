import { nativeProviders } from "@probable/api";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import { discovery as googleDiscovery } from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { getSignInInfo, SessionProvider, SigninResult } from "next-auth/expo";
import * as Sentry from "sentry-expo";
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
  console.log("signinInfo", signinInfo);
  const { state, codeChallenge, stateEncrypted, codeVerifier, clientId } =
    signinInfo;

  // This corresponds to useLoadedAuthRequest
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ["openid"],
    usePKCE: true,
  });
  console.log("request", request);

  request.state = state;
  request.codeChallenge = codeChallenge;
  request.codeVerifier = codeVerifier;
  await request.makeAuthUrlAsync({
    authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
  });
  console.log("request2", request);

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
  console.log("result", result);
  const returnVal = {
    result,
    state,
    stateEncrypted,
    codeVerifier,
    provider,
  };
  console.log("returnVal", returnVal);
  return returnVal;
};

export const appleLogin2 = async (): Promise<SigninResult | null> => {
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
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      // AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      // AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    state,
    nonce: codeChallenge,
  });
  Sentry.Native.captureMessage(`credential: ${credential.authorizationCode}`);
  return {
    codeVerifier,
    provider,
    result: {
      authentication: null,
      error: null,
      errorCode: null,
      params: {
        code: credential.authorizationCode!,
        // code: "c91420506f23b4b4481e986df607be19c.0.msv.PA_Vny14y0RBvsudRB2ZQg",
        state,
      },
      type: "success",
      // url: `exp://10.79.0.132:19000/--/expo-auth-session?state=${state}&code=${credential.authorizationCode!}`,
      url: "",
    },
    state,
    stateEncrypted,
  };
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <SessionProvider baseUrl={getBaseUrl()}>{children}</SessionProvider>;
};

export default AuthProvider;
