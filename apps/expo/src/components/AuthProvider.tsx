import { nativeProviders } from "@probable/api";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import { discovery as googleDiscovery } from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { CodedError } from "expo-modules-core";
import { getSignInInfo, SessionProvider, SigninResult } from "next-auth/expo";
import { getBaseUrl } from "../api";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const projectNameForProxy = Constants.manifest2?.extra?.scopeKey;

interface Props {
  children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
  return <SessionProvider baseUrl={getBaseUrl()}>{children}</SessionProvider>;
};

export const useSocialSignIn = () => {
  //const [token, setToken] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "624022936208-hdgigstklg2p4cp9hqhgoajla3stirr8.apps.googleusercontent.com",
  });

  //useEffect(() => {
  //  if (response?.type === "success") {
  //    setToken(response?.authentication?.accessToken || "");
  //  }
  //}, [response, token]);

  const googleSignIn = async (): Promise<SigninResult | null> => {
    const resp = await promptAsync();

    if(resp?.type !== "success") {
      throw new Error("Error prompting for google auth");
    }
    
    Alert.alert('resp', `resp: ${JSON.stringify(resp)}`);
    Alert.alert('token', `token: ${resp?.authentication?.accessToken}`);
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: false,
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
      scopes: ["openid"],
      usePKCE: false,
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

  const appleSignIn = async (): Promise<SigninResult | null> => {
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

  return {
    googleSignIn,
    appleSignIn,
  };
};

function isCodedError(
  possibleCodedError: any
): possibleCodedError is CodedError {
  return possibleCodedError && !!(possibleCodedError as CodedError).code;
}


