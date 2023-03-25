import { jest, test } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import { MlbGame } from "../services/mlbstats";
import { fullSchedule } from "../test/fixtures";
import { mlbstatsMock, prismaMock } from "../test/mocks";
import { ingestGames } from "./games";
import { processPitcher } from "./pitchers";

jest.mock("./pitchers", () => ({
  processPitcher: jest.fn<typeof processPitcher>(),
}));

beforeEach(() => {
  mockReset(processPitcher);
});

test("should create one new game", async () => {
  const mlbGame: MlbGame = {
    gamePk: 123,
    gameDate: "2022-11-01:20:15:00Z",
    teams: {
      away: {
        probablePitcher: {
          id: 456,
          fullName: "John Doe",
        },
        team: {
          id: 654,
          name: "Weigh Team",
          abbreviation: "WT",
        },
      },
      home: {
        probablePitcher: {
          id: 789,
          fullName: "Jane Doe",
        },
        team: {
          id: 987,
          name: "Home Team",
          abbreviation: "HT",
        },
      },
    },
  };

  mlbstatsMock.getGames.mockResolvedValueOnce([mlbGame]);
  mlbstatsMock.getGames.mockResolvedValue([]);

  await ingestGames();

  expect(mlbstatsMock.getGames).toHaveBeenCalledTimes(5);
  expect(prismaMock.game.upsert).toHaveBeenCalledTimes(1);
  expect(prismaMock.game.upsert).toHaveBeenCalledWith({
    create: {
      date: new Date("2022-11-01:20:15:00Z"),
      awayPitcherId: 456,
      homePitcherId: 789,
      id: 123,
    },
    update: {
      date: new Date("2022-11-01:20:15:00Z"),
      awayPitcherId: 456,
      homePitcherId: 789,
    },
    where: {
      id: 123,
    },
  });
  expect(processPitcher).toHaveBeenCalledTimes(2);
  expect(processPitcher).toHaveBeenCalledWith({
    fullName: "John Doe",
    id: 456,
    currentTeam: {
      id: 654,
    },
  });
  expect(processPitcher).toHaveBeenCalledWith({
    fullName: "Jane Doe",
    id: 789,
    currentTeam: {
      id: 987,
    },
  });
});

test("should create a full schedule", async () => {
  mlbstatsMock.getGames.mockResolvedValueOnce(fullSchedule[0] || []);
  mlbstatsMock.getGames.mockResolvedValueOnce(fullSchedule[1] || []);
  mlbstatsMock.getGames.mockResolvedValueOnce(fullSchedule[2] || []);
  mlbstatsMock.getGames.mockResolvedValueOnce(fullSchedule[3] || []);
  mlbstatsMock.getGames.mockResolvedValueOnce(fullSchedule[4] || []);

  await ingestGames();

  expect(mlbstatsMock.getGames).toHaveBeenCalledTimes(5);
  expect(prismaMock.game.upsert).toHaveBeenCalledTimes(64);
  expect(prismaMock.game.upsert).toHaveBeenNthCalledWith(22, {
    create: {
      date: new Date("2022-09-14T00:05:00Z"),
      awayPitcherId: 686610,
      homePitcherId: 666142,
      id: 661838,
    },
    update: {
      date: new Date("2022-09-14T00:05:00Z"),
      awayPitcherId: 686610,
      homePitcherId: 666142,
    },
    where: {
      id: 661838,
    },
  });
  expect(prismaMock.game.upsert).toHaveBeenNthCalledWith(50, {
    create: {
      date: new Date("2022-09-16T18:20:00Z"),
      awayPitcherId: 608566,
      homePitcherId: 573186,
      id: 663126,
    },
    update: {
      date: new Date("2022-09-16T18:20:00Z"),
      awayPitcherId: 608566,
      homePitcherId: 573186,
    },
    where: {
      id: 663126,
    },
  });
  expect(processPitcher).toHaveBeenCalledTimes(128);
  expect(processPitcher).toHaveBeenNthCalledWith(11, {
    fullName: "Cooper Criswell",
    id: 681867,
    currentTeam: {
      id: 139,
    },
  });
  expect(processPitcher).toHaveBeenNthCalledWith(63, {
    fullName: "Mike Clevinger",
    id: 605182,
    currentTeam: {
      id: 135,
    },
  });
});
