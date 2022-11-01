import { test } from "@jest/globals";
import { mlbPitchers } from "../test/fixtures";
import { mlbstatsMock, prismaMock } from "../test/mocks";
import { processPitchers } from "./pitchers";

test("should upsert one existing pitcher ", async () => {
  mlbstatsMock.getPitchers.mockResolvedValueOnce(mlbPitchers);

  const updatedPitcher = { id: 676265, name: "Cory Smith", teamId: 139 };

  prismaMock.pitcher.findUnique.mockResolvedValueOnce(updatedPitcher);

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

  prismaMock.pitcher.findMany.mockResolvedValueOnce([updatedPitcher]);

  await processPitchers();

  expect(mlbstatsMock.getPitchers).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.findUnique).toHaveBeenCalledTimes(117);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledTimes(1);
  expect(prismaMock.pitcher.upsert).toHaveBeenCalledWith({
    where: {
      id: 139,
    },
    create: updatedPitcher,
    update: {
      name: updatedPitcher.name,
      teamId: updatedPitcher.teamId,
    },
  });
});
