import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@probable/db";
import { isValidProvider, nativeProviders, providerPairs } from "./providers";

const adapter = PrismaAdapter(prisma);
export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    AppleProvider({
      clientId: process.env.APPLE_WEB_CLIENT_ID as string,
      clientSecret: process.env.APPLE_WEB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email",
          response_mode: "form_post",
          response_type: "code",
        },
      },
    }),
    {
      ...AppleProvider({
        name: "Apple Expo Proxy",
        checks: ["state", "pkce"],
        clientId: process.env.APPLE_CLIENT_ID as string,
        clientSecret: process.env.APPLE_CLIENT_SECRET as string,
        token: {
          async request(context) {
            const tokens = await context.client.callback(
              process.env.NEXTAUTH_EXPO_URL,
              context.params,
              context.checks
            );
            return { tokens };
          },
        },
        id: nativeProviders.apple,
      }),
    },
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email",
        },
      },
    }),
    {
      ...GoogleProvider({
        name: "Google Expo Proxy",
        checks: ["state", "pkce"],
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
        token: {
          async request(context) {
            const tokens = await context.client.callback(
              process.env.NEXTAUTH_EXPO_URL,
              context.params,
              context.checks
            );
            return { tokens };
          },
        },
        id: nativeProviders.google,
      }),
    },
  ],
  callbacks: {
    async signIn({ account }) {
      const userByAccount = await adapter.getUserByAccount({
        providerAccountId: account!.providerAccountId,
        provider: account!.provider,
      });
      if (!userByAccount) {
        const provider = account!.provider;
        if (isValidProvider(provider)) {
          const counterpart = providerPairs[provider];
          const userByAccount = await adapter.getUserByAccount({
            providerAccountId: account!.providerAccountId,
            provider: counterpart,
          });
          if (userByAccount) {
            await adapter.linkAccount({
              ...account!,
              userId: userByAccount.id,
            });
          }
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
