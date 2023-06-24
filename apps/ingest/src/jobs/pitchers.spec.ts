import { beforeEach, test } from "@jest/globals";
import { mockedPitchers } from "../test/fixtures";
import { statsMock, prismaMock } from "../test/mocks";
import { ingestPitchers } from "./pitchers";

beforeEach(() => {
  statsMock.getPitchers.mockResolvedValueOnce(mockedPitchers);
});

test("should upsert one existing pitcher", async () => {
  const pitcherToUpdate = {
    id: mockedPitchers[0]!.id,
    name: "Babe Ruth",
    teamId: 139,
    primaryNumber: "3",
  };

  prismaMock.pitcher.findUnique.mockResolvedValueOnce(pitcherToUpdate);

  for (let i = 1; i < mockedPitchers.length; i++) {
    const mockedPitcher = mockedPitchers[i];
    prismaMock.pitcher.findUnique.mockResolvedValueOnce(
      !!mockedPitcher
        ? {
            name: mockedPitcher.fullName,
            id: mockedPitcher.id,
            teamId: mockedPitcher.currentTeam.id,
            primaryNumber: mockedPitcher.primaryNumber || null,
          }
        : {
            name: "Test Data Issue: Check Fixture",
            id: -1,
            teamId: -1,
            primaryNumber: null,
          }
    );
  }

  prismaMock.pitcher.findMany.mockResolvedValueOnce([pitcherToUpdate]);

  await ingestPitchers();

  expect(statsMock.getPitchers).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.findUnique).toHaveBeenCalledTimes(126);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledWith({
    where: {
      id: mockedPitchers[0]!.id,
    },
    create: {
      id: mockedPitchers[0]!.id,
      name: mockedPitchers[0]!.fullName,
      teamId: mockedPitchers[0]!.currentTeam.id,
      primaryNumber: mockedPitchers[0]!.primaryNumber,
    },
    update: {
      name: mockedPitchers[0]!.fullName,
      teamId: mockedPitchers[0]!.currentTeam.id,
      primaryNumber: mockedPitchers[0]!.primaryNumber,
    },
  });
});

test("should insert one new pitcher", async () => {
  const newPitcher = {
    id: mockedPitchers[mockedPitchers.length - 1]!.id,
    name: mockedPitchers[mockedPitchers.length - 1]!.fullName,
    teamId: mockedPitchers[mockedPitchers.length - 1]!.currentTeam.id,
    primaryNumber:
      mockedPitchers[mockedPitchers.length - 1]!.primaryNumber || null,
  };

  for (let i = 0; i < mockedPitchers.length - 1; i++) {
    const mockedPitcher = mockedPitchers[i];
    prismaMock.pitcher.findUnique.mockResolvedValueOnce(
      !!mockedPitcher
        ? {
            name: mockedPitcher.fullName,
            id: mockedPitcher.id,
            teamId: mockedPitcher.currentTeam.id,
            primaryNumber: mockedPitcher.primaryNumber || null,
          }
        : {
            name: "Test Data Issue: Check Fixture",
            id: -1,
            teamId: -1,
            primaryNumber: null,
          }
    );
  }

  prismaMock.pitcher.findUnique.mockResolvedValueOnce(null);

  prismaMock.pitcher.findMany.mockResolvedValueOnce([newPitcher]);

  await ingestPitchers();

  expect(statsMock.getPitchers).toHaveBeenCalledTimes(1);
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
      primaryNumber: newPitcher.primaryNumber,
    },
    update: {
      name: newPitcher.name,
      teamId: newPitcher.teamId,
      primaryNumber: newPitcher.primaryNumber,
    },
  });
});
