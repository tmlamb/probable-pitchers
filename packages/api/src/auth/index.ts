import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { DefaultUser } from "next-auth";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@probable/db";
import { isValidProvider, nativeProviders } from "./providers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    };
  }
}

const adapter = PrismaAdapter(prisma);
export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
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
        providerAccountId: account.providerAccountId,
        provider: account.provider,
      });
      if (!userByAccount) {
        const provider = account.provider;
        if (isValidProvider(provider)) {
          const counterpart = nativeProviders[provider];
          const userByAccount = await adapter.getUserByAccount({
            providerAccountId: account.providerAccountId,
            provider: counterpart,
          });
          if (userByAccount) {
            await adapter.linkAccount({
              ...account,
              userId: userByAccount.id,
            });
          }
        }
      }
      return true;
    },
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);