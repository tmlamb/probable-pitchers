import { test } from "@jest/globals";
import { mlbTeams } from "../test/fixtures";
import { mlbstatsMock, prismaMock } from "../test/mocks";
import { processTeams } from "./teams";

test("should upsert one team ", async () => {
  mlbstatsMock.getTeams.mockResolvedValueOnce(mlbTeams);

  prismaMock.team.findUnique.mockResolvedValueOnce({
    id: 133,
    name: "Oakland Athletes",
  });

  for (let i = 1; i < mlbTeams.length; i++) {
    const mockedTeam = mlbTeams[i];
    prismaMock.team.findUnique.mockResolvedValueOnce(
      mockedTeam || { id: -1, name: "Test Data Issue: Check Fixture" }
    );
  }

  await processTeams();

  expect(mlbstatsMock.getTeams).toHaveBeenCalledTimes(1);
  expect(prismaMock.team.findUnique).toHaveBeenCalledTimes(30);
  expect(prismaMock.team.upsert).toHaveBeenCalledTimes(1);
  expect(prismaMock.team.upsert).toHaveBeenCalledWith({
    where: {
      id: 133,
    },
    create: {
      id: 133,
      name: "Oakland Athletics",
    },
    update: {
      name: "Oakland Athletics",
    },
  });
});
