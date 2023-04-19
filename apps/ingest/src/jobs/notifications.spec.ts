import { beforeEach, jest, test } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { mockReset } from "jest-mock-extended";
import { sendPushNotification } from "../services/push";
import { pendingNotifications } from "../test/fixtures";
import { prismaMock } from "../test/mocks";
import { ingestNotifications, sendNotifications } from "./notifications";

jest.mock("../services/push", () => ({
  sendPushNotification: jest.fn<typeof sendPushNotification>(),
}));

beforeEach(() => {
  mockReset(sendPushNotification);
});

test("should ignore existing notification", async () => {
  prismaMock.game.findMany.mockResolvedValueOnce([
    {
      id: 1,
      date: new Date(),
      homePitcherId: 2,
      awayPitcherId: undefined,
      homePitcher: { id: 2, name: "Babe Ruth", teamId: 5 },
      awayPitcher: undefined,
    } as any,
  ]);

  prismaMock.subscription.findMany.mockResolvedValueOnce([
    {
      id: 7,
      pitcherId: 2,
      userId: "A",
      user: {
        devices: [
          {
            id: "DEVICE_A",
            timezone: "America/New_York",
            pushToken: "PUSH_TOKEN_A",
          },
        ],
      },
    } as any,
    {
      id: 8,
      pitcherId: 2,
      userId: "B",
      user: {
        devices: [
          {
            id: "DEVICE_B",
            timezone: "America/New_York",
            pushToken: "PUSH_TOKEN_B",
          },
        ],
      },
    } as any,
  ]);

  prismaMock.notification.create.mockRejectedValueOnce(
    new Prisma.PrismaClientKnownRequestError(
      "Unique constraint violation",
      {
        code: "P2002",
        clientVersion: "1"
      }
    )
  );
  prismaMock.notification.create.mockResolvedValueOnce({
    id: 10,
    deviceId: "DEVICE_B",
    pitcherId: 2,
    gameId: 1,
    sentOn: null,
  });

  await ingestNotifications();

  expect(prismaMock.game.findMany).toHaveBeenCalledTimes(1);

  expect(prismaMock.subscription.findMany).toHaveBeenCalledTimes(1);
  expect(prismaMock.subscription.findMany).toHaveBeenCalledWith({
    where: { pitcherId: 2 },
    include: { user: { include: { devices: true } } },
  });

  expect(prismaMock.notification.create).toHaveBeenCalledTimes(2);
  expect(prismaMock.notification.create).toHaveBeenCalledWith({
    data: {
      deviceId: "DEVICE_A",
      gameId: 1,
      pitcherId: 2,
    },
  });
  expect(prismaMock.notification.create).toHaveBeenCalledWith({
    data: {
      deviceId: "DEVICE_B",
      gameId: 1,
      pitcherId: 2,
    },
  });
});

test("should ingest multiple game notifications", async () => {
  prismaMock.game.findMany.mockResolvedValueOnce([
    {
      id: 1,
      date: new Date(),
      homePitcherId: 11,
      awayPitcherId: 22,
      homePitcher: { id: 11, name: "Babe Ruth", teamId: 111 },
      awayPitcher: { id: 22, name: "Joe Jackson", teamId: 222 },
    } as any,
    {
      id: 2,
      date: new Date(),
      homePitcherId: 33,
      awayPitcherId: 44,
      homePitcher: { id: 33, name: "Greg Maddux", teamId: 333 },
      awayPitcher: { id: 44, name: "Pedro Martinez", teamId: 444 },
    } as any,
  ]);

  prismaMock.subscription.findMany.mockResolvedValueOnce([
    {
      id: 1111,
      pitcherId: 11,
      userId: "A",
      user: {
        devices: [
          {
            id: "DEVICE_A",
            timezone: "America/New_York",
            pushToken: "PUSH_TOKEN_A",
          },
        ],
      },
    } as any,
    {
      id: 2222,
      pitcherId: 11,
      userId: "B",
      user: {
        devices: [
          {
            id: "DEVICE_B",
            timezone: "America/New_York",
            pushToken: "PUSH_TOKEN_B",
          },
        ],
      },
    } as any,
  ]);
  prismaMock.subscription.findMany.mockResolvedValueOnce([]);
  prismaMock.subscription.findMany.mockResolvedValueOnce([
    {
      id: 3333,
      pitcherId: 33,
      userId: "C",
      user: {
        devices: [
          {
            id: "DEVICE_C",
            timezone: "America/New_York",
            pushToken: "PUSH_TOKEN_C",
          },
        ],
      },
    } as any,
  ]);
  prismaMock.subscription.findMany.mockResolvedValueOnce([]);

  prismaMock.notification.create.mockResolvedValueOnce({
    id: 11111,
    deviceId: "DEVICE_A",
    gameId: 1,
    pitcherId: 11,
    sentOn: null,
  });
  prismaMock.notification.create.mockResolvedValueOnce({
    id: 22222,
    deviceId: "DEVICE_B",
    gameId: 1,
    pitcherId: 11,
    sentOn: null,
  });
  prismaMock.notification.create.mockResolvedValueOnce({
    id: 33333,
    deviceId: "DEVICE_C",
    gameId: 2,
    pitcherId: 33,
    sentOn: null,
  });

  await ingestNotifications();

  expect(prismaMock.game.findMany).toHaveBeenCalledTimes(1);

  expect(prismaMock.subscription.findMany).toHaveBeenCalledTimes(4);
  expect(prismaMock.subscription.findMany).toHaveBeenNthCalledWith(1, {
    where: { pitcherId: 11 },
    include: { user: { include: { devices: true } } },
  });
  expect(prismaMock.subscription.findMany).toHaveBeenNthCalledWith(2, {
    where: { pitcherId: 22 },
    include: { user: { include: { devices: true } } },
  });
  expect(prismaMock.subscription.findMany).toHaveBeenNthCalledWith(3, {
    where: { pitcherId: 33 },
    include: { user: { include: { devices: true } } },
  });
  expect(prismaMock.subscription.findMany).toHaveBeenNthCalledWith(4, {
    where: { pitcherId: 44 },
    include: { user: { include: { devices: true } } },
  });

  expect(prismaMock.notification.create).toHaveBeenCalledTimes(3);
  expect(prismaMock.notification.create).toHaveBeenCalledWith({
    data: {
      deviceId: "DEVICE_A",
      gameId: 1,
      pitcherId: 11,
    },
  });
  expect(prismaMock.notification.create).toHaveBeenCalledWith({
    data: {
      deviceId: "DEVICE_B",
      gameId: 1,
      pitcherId: 11,
    },
  });
  expect(prismaMock.notification.create).toHaveBeenCalledWith({
    data: {
      deviceId: "DEVICE_C",
      gameId: 2,
      pitcherId: 33,
    },
  });
});

test("should trigger notifications for users", async () => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date('2023-04-04T13:30:00.000Z'))

  prismaMock.device.findMany.mockResolvedValueOnce(pendingNotifications);

  prismaMock.notification.update.mockResolvedValue({
    id: -1,
    deviceId: "DEVICE_A",
    gameId: -1,
    pitcherId: -1,
    sentOn: new Date('2023-04-04T13:30:00.000Z'),
  });

  await sendNotifications();

  expect(prismaMock.device.findMany).toHaveBeenCalledTimes(1);

  expect(sendPushNotification).toHaveBeenCalledTimes(3);

  expect(sendPushNotification).toHaveBeenNthCalledWith(
    1,
    "PUSH_TOKEN_A",
    "Probable Pitchers",
    "Greg Maddux @ 11:05 am EDT\nBabe Ruth @ 1:20 pm EDT"
  );
  expect(sendPushNotification).toHaveBeenNthCalledWith(
    2,
    "PUSH_TOKEN_B",
    "Probable Pitcher",
    "Joe Jackson @ 6:00 pm EDT"
  );
  expect(sendPushNotification).toHaveBeenNthCalledWith(
    3,
    "PUSH_TOKEN_B3",
    "Probable Pitcher",
    "Joe Jackson @ 6:00 pm EDT"
  );

  expect(prismaMock.notification.update).toHaveBeenCalledTimes(4);
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(1, {
    where: { id: 11 },
    data: { sentOn: expect.any(Date) },
  });
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(2, {
    where: { id: 22 },
    data: { sentOn: expect.any(Date) },
  });
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(3, {
    where: { id: 33 },
    data: { sentOn: expect.any(Date) },
  });
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(4, {
    where: { id: 55 },
    data: { sentOn: expect.any(Date) },
  });

  jest.useRealTimers()
});

test("should recover after error", async () => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date('2023-04-04T16:30:00.000Z'))

  prismaMock.device.findMany.mockResolvedValueOnce(pendingNotifications);

  prismaMock.notification.update.mockRejectedValueOnce(new Error("oops"));
  prismaMock.notification.update.mockResolvedValue({
    id: -1,
    deviceId: "DEVICE_A",
    gameId: -1,
    pitcherId: -1,
    sentOn: new Date("2023-04-04T16:30:00.000Z"),
  });

  await sendNotifications();

  expect(prismaMock.device.findMany).toHaveBeenCalledTimes(1);

  expect(sendPushNotification).toHaveBeenCalledTimes(4);

  expect(sendPushNotification).toHaveBeenNthCalledWith(
    1,
    "PUSH_TOKEN_A",
    "Probable Pitchers",
    "Greg Maddux @ 11:05 am EDT\nBabe Ruth @ 1:20 pm EDT"
  );
  expect(sendPushNotification).toHaveBeenNthCalledWith(
    2,
    "PUSH_TOKEN_B",
    "Probable Pitcher",
    "Joe Jackson @ 6:00 pm EDT"
  );
  expect(sendPushNotification).toHaveBeenNthCalledWith(
    3,
    "PUSH_TOKEN_B2",
    "Probable Pitcher",
    "Joe Jackson @ 5:00 pm CDT"
  );
  expect(sendPushNotification).toHaveBeenNthCalledWith(
    4,
    "PUSH_TOKEN_B3",
    "Probable Pitcher",
    "Joe Jackson @ 6:00 pm EDT"
  );

  expect(prismaMock.notification.update).toHaveBeenCalledTimes(5);
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(1, {
    where: { id: 11 },
    data: { sentOn: expect.any(Date) },
  });
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(2, {
    where: { id: 22 },
    data: { sentOn: expect.any(Date) },
  });
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(3, {
    where: { id: 33 },
    data: { sentOn: expect.any(Date) },
  });
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(4, {
    where: { id: 44 },
    data: { sentOn: expect.any(Date) },
  });
  expect(prismaMock.notification.update).toHaveBeenNthCalledWith(5, {
    where: { id: 55 },
    data: { sentOn: expect.any(Date) },
  });

  jest.useRealTimers()
});
