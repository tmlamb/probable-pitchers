import { nativeProviders } from "@probable/api";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as Sentry from "sentry-expo";
import { discovery as googleDiscovery } from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { CodedError } from "expo-modules-core";
import { getSignInInfo, SessionProvider, SigninResult } from "next-auth/expo";
import { getBaseUrl } from "../api";

const projectNameForProxy = Constants.manifest2?.extra?.scopeKey;

if (!projectNameForProxy) {
  Sentry.Native.captureException(
    new Error("No scopeKey found in manifest.extra.scopeKey. Full manifest2: " + JSON.stringify(Constants.manifest2))
  );
}

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
    throw new Error("Error getting sign-in info from server");
  }
  const { state, codeChallenge, stateEncrypted, codeVerifier, clientId } =
    signinInfo;

  // This corresponds to useLoadedAuthRequest
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ["openid", "email"],
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
  let credential = undefined;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      state,
    });
  } catch (e) {
    if (isCodedError(e) && e.code === "ERR_CANCELED") {
      return null;
    } else {
      throw e;
    }
  }

  return {
    codeVerifier,
    provider,
    result: {
      authentication: null,
      error: null,
      errorCode: null,
      params: {
        code: credential.authorizationCode!,
        state,
      },
      type: "success",
      url: "",
    },
    state,
    stateEncrypted,
  };
};

function isCodedError(
  possibleCodedError: any
): possibleCodedError is CodedError {
  return possibleCodedError && !!(possibleCodedError as CodedError).code;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <SessionProvider baseUrl={getBaseUrl()}>{children}</SessionProvider>;
};

export default AuthProvider;
