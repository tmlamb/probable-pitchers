import { PrismaClient } from "@prisma/client";

import { beforeEach, jest } from "@jest/globals";
import {
  DeepMockProxy,
  mockDeep,
  MockProxy,
  mockReset,
} from "jest-mock-extended";
import prisma from "../db/client";
import { getGames, getPitchers, getTeams } from "../services/stats-api";

jest.mock("../db/client", () => ({
  __esModule: true,

  default: mockDeep<PrismaClient>(),
}));

const getGamesMock = jest.fn<typeof getGames>();
const getTeamsMock = jest.fn<typeof getTeams>();
const getPitchersMock = jest.fn<typeof getPitchers>();

jest.mock("../services/stats-api", () => ({
  getGames: getGamesMock,
  getTeams: getTeamsMock,
  getPitchers: getPitchersMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
  mockReset(statsMock.getGames);
  mockReset(statsMock.getTeams);
  mockReset(statsMock.getPitchers);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
export const statsMock = {
  getGames: getGamesMock,
  getTeams: getTeamsMock,
  getPitchers: getPitchersMock,
} as unknown as MockProxy<{
  getGames: jest.Mock<typeof getGames>;
  getTeams: jest.Mock<typeof getTeams>;
  getPitchers: jest.Mock<typeof getPitchers>;
}>;
