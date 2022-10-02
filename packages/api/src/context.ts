// src/server/router/context.ts
import { prisma } from "@probable/db";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import type { Session } from "next-auth";
import getServerAuthSession from "./auth/getAuthSession";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session,
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
