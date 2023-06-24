import { test } from "@jest/globals";
import { mockedTeams } from "../test/fixtures";
import { statsMock, prismaMock } from "../test/mocks";
import { ingestTeams } from "./teams";

test("should upsert one team", async () => {
  statsMock.getTeams.mockResolvedValueOnce(mockedTeams);

  prismaMock.team.findUnique.mockResolvedValueOnce({
    id: 133,
    name: "Oakland Athletes",
    abbreviation: "ATH",
  });

  for (let i = 1; i < mockedTeams.length; i++) {
    const mockedTeam = mockedTeams[i];
    prismaMock.team.findUnique.mockResolvedValueOnce(
      mockedTeam || {
        id: -1,
        name: "Test Data Issue: Check Fixture",
        abbreviation: null,
      }
    );
  }

  await ingestTeams();

  expect(statsMock.getTeams).toHaveBeenCalledTimes(1);
  expect(prismaMock.team.findUnique).toHaveBeenCalledTimes(30);
  expect(prismaMock.team.upsert).toHaveBeenCalledTimes(1);
  expect(prismaMock.team.upsert).toHaveBeenCalledWith({
    where: {
      id: 133,
    },
    create: {
      id: 133,
      name: "Oakland Athletics",
      abbreviation: "OAK",
    },
    update: {
      name: "Oakland Athletics",
      abbreviation: "OAK",
    },
  });
});
