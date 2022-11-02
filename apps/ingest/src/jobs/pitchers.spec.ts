import { beforeEach, test } from "@jest/globals";
import { mlbPitchers } from "../test/fixtures";
import { mlbstatsMock, prismaMock } from "../test/mocks";
import { ingestPitchers } from "./pitchers";

beforeEach(() => {
  mlbstatsMock.getPitchers.mockResolvedValueOnce(mlbPitchers);
});

test("should upsert one existing pitcher", async () => {
  const pitcherToUpdate = {
    id: mlbPitchers[0]!.id,
    name: "Babe Ruth",
    teamId: 139,
  };

  prismaMock.pitcher.findUnique.mockResolvedValueOnce(pitcherToUpdate);

  for (let i = 1; i < mlbPitchers.length; i++) {
    const mockedPitcher = mlbPitchers[i];
    prismaMock.pitcher.findUnique.mockResolvedValueOnce(
      !!mockedPitcher
        ? {
            name: mockedPitcher.fullName,
            id: mockedPitcher.id,
            teamId: mockedPitcher.currentTeam.id,
          }
        : {
            name: "Test Data Issue: Check Fixture",
            id: -1,
            teamId: -1,
          }
    );
  }

  prismaMock.pitcher.findMany.mockResolvedValueOnce([pitcherToUpdate]);

  await ingestPitchers();

  expect(mlbstatsMock.getPitchers).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.findUnique).toHaveBeenCalledTimes(126);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledWith({
    where: {
      id: mlbPitchers[0]!.id,
    },
    create: {
      id: mlbPitchers[0]!.id,
      name: mlbPitchers[0]!.fullName,
      teamId: mlbPitchers[0]!.currentTeam.id,
    },
    update: {
      name: mlbPitchers[0]!.fullName,
      teamId: mlbPitchers[0]!.currentTeam.id,
    },
  });
});

test("should insert one new pitcher", async () => {
  // const newPitcher = { id: 999999, name: "Babe Ruth", teamId: 111 };
  const newPitcher = {
    id: mlbPitchers[mlbPitchers.length - 1]!.id,
    name: mlbPitchers[mlbPitchers.length - 1]!.fullName,
    teamId: mlbPitchers[mlbPitchers.length - 1]!.currentTeam.id,
  };

  for (let i = 0; i < mlbPitchers.length - 1; i++) {
    const mockedPitcher = mlbPitchers[i];
    prismaMock.pitcher.findUnique.mockResolvedValueOnce(
      !!mockedPitcher
        ? {
            name: mockedPitcher.fullName,
            id: mockedPitcher.id,
            teamId: mockedPitcher.currentTeam.id,
          }
        : {
            name: "Test Data Issue: Check Fixture",
            id: -1,
            teamId: -1,
          }
    );
  }

  prismaMock.pitcher.findUnique.mockResolvedValueOnce(null);

  prismaMock.pitcher.findMany.mockResolvedValueOnce([newPitcher]);

  await ingestPitchers();

  expect(mlbstatsMock.getPitchers).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.findUnique).toHaveBeenCalledTimes(126);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledWith({
    where: {
      id: newPitcher.id,
    },
    create: {
      id: newPitcher.id,
      name: newPitcher.name,
      teamId: newPitcher.teamId,
    },
    update: {
      name: newPitcher.name,
      teamId: newPitcher.teamId,
    },
  });
});
