import { Game, Player, Team } from "../services/stats-api";

export const mockedTeams: Team[] = [
  { id: 133, name: "Oakland Athletics", abbreviation: "OAK" },
  { id: 134, name: "Pittsburgh Pirates", abbreviation: "PIT" },
  { id: 135, name: "San Diego Padres", abbreviation: "SD" },
  { id: 136, name: "Seattle Mariners", abbreviation: "SEA" },
  { id: 137, name: "San Francisco Giants", abbreviation: "SF" },
  { id: 138, name: "St. Louis Cardinals", abbreviation: "STL" },
  { id: 139, name: "Tampa Bay Rays", abbreviation: "TB" },
  { id: 140, name: "Texas Rangers", abbreviation: "TEX" },
  { id: 141, name: "Toronto Blue Jays", abbreviation: "TOR" },
  { id: 142, name: "Minnesota Twins", abbreviation: "MIN" },
  { id: 143, name: "Philadelphia Phillies", abbreviation: "PHI" },
  { id: 144, name: "Atlanta Braves", abbreviation: "ATL" },
  { id: 145, name: "Chicago White Sox", abbreviation: "CWS" },
  { id: 146, name: "Miami Marlins", abbreviation: "MIA" },
  { id: 147, name: "New York Yankees", abbreviation: "NYY" },
  { id: 158, name: "Milwaukee Brewers", abbreviation: "MIL" },
  { id: 108, name: "Los Angeles Angels", abbreviation: "LAA" },
  { id: 109, name: "Arizona Diamondbacks", abbreviation: "ARI" },
  { id: 110, name: "Baltimore Orioles", abbreviation: "BAL" },
  { id: 111, name: "Boston Red Sox", abbreviation: "BOS" },
  { id: 112, name: "Chicago Cubs", abbreviation: "CHC" },
  { id: 113, name: "Cincinnati Reds", abbreviation: "CIN" },
  { id: 114, name: "Cleveland Guardians", abbreviation: "CLE" },
  { id: 115, name: "Colorado Rockies", abbreviation: "COL" },
  { id: 116, name: "Detroit Tigers", abbreviation: "DET" },
  { id: 117, name: "Houston Astros", abbreviation: "HOU" },
  { id: 118, name: "Kansas City Royals", abbreviation: "KC" },
  { id: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" },
  { id: 120, name: "Washington Nationals", abbreviation: "WSH" },
  { id: 121, name: "New York Mets", abbreviation: "NYM" },
];

export const pendingNotifications = [
  {
    id: "DEVICE_A",
    timezone: "America/New_York",
    pushToken: "PUSH_TOKEN_A",
    notifications: [
      {
        id: 11,
        game: {
          date: new Date("2022-11-02T15:05:00Z"),
        },
        pitcher: {
          name: "Greg Maddux",
        },
      },
      {
        id: 22,
        game: {
          date: new Date("2022-11-02T17:20:00Z"),
        },
        pitcher: {
          name: "Babe Ruth",
        },
      },
    ],
  } as any,
  {
    id: "DEVICE_B",
    timezone: "America/New_York",
    pushToken: "PUSH_TOKEN_B",
    notifications: [
      {
        id: 33,
        sentOn: null,
        game: {
          date: new Date("2022-11-02T22:00:00Z"),
        },
        pitcher: {
          name: "Joe Jackson",
        },
      },
    ],
  } as any,
  {
    id: "DEVICE_B2",
    timezone: "America/Chicago",
    pushToken: "PUSH_TOKEN_B2",
    notifications: [
      {
        id: 44,
        sentOn: null,
        game: {
          date: new Date("2022-11-02T22:00:00Z"),
        },
        pitcher: {
          name: "Joe Jackson",
        },
      },
    ],
  } as any,
  {
    id: "DEVICE_B3",
    timezone: "America/New_York",
    pushToken: "PUSH_TOKEN_B3",
    notifications: [
      {
        id: 55,
        sentOn: null,
        game: {
          date: new Date("2022-11-02T22:00:00Z"),
        },
        pitcher: {
          name: "Joe Jackson",
        },
      },
    ],
  } as any,
];

export const fullSchedule: Game[][] = [
  [
    {
      gamePk: 661420,
      gameDate: "2022-09-12T17:10:00Z",
      teams: {
        away: {
          team: {
            id: 140,
            name: "Texas Rangers",
            abbreviation: "TEX",
          },
          probablePitcher: {
            id: 657248,
            fullName: "Glenn Otto",
          },
        },
        home: {
          team: {
            id: 146,
            name: "Miami Marlins",
            abbreviation: "MIA",
          },
          probablePitcher: {
            id: 669432,
            fullName: "Trevor Rogers",
          },
        },
      },
    },
    {
      gamePk: 661419,
      gameDate: "2022-09-12T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 140,
            name: "Texas Rangers",
            abbreviation: "TEX",
          },
          probablePitcher: {
            id: 592351,
            fullName: "Jon Gray",
          },
        },
        home: {
          team: {
            id: 146,
            name: "Miami Marlins",
            abbreviation: "MIA",
          },
          probablePitcher: {
            id: 666129,
            fullName: "Braxton Garrett",
          },
        },
      },
    },
    {
      gamePk: 662970,
      gameDate: "2022-09-12T22:10:00Z",
      teams: {
        away: {
          team: {
            id: 108,
            name: "Los Angeles Angels",
            abbreviation: "LAA",
          },
          probablePitcher: {
            id: 672282,
            fullName: "Reid Detmers",
          },
        },
        home: {
          team: {
            id: 114,
            name: "Cleveland Guardians",
            abbreviation: "CLE",
          },
          probablePitcher: {
            id: 663455,
            fullName: "Konnor Pilkington",
          },
        },
      },
    },
    {
      gamePk: 662782,
      gameDate: "2022-09-12T22:40:00Z",
      teams: {
        away: {
          team: {
            id: 117,
            name: "Houston Astros",
            abbreviation: "HOU",
          },
          probablePitcher: {
            id: 664285,
            fullName: "Framber Valdez",
          },
        },
        home: {
          team: {
            id: 116,
            name: "Detroit Tigers",
            abbreviation: "DET",
          },
          probablePitcher: {
            id: 593958,
            fullName: "Eduardo Rodriguez",
          },
        },
      },
    },
    {
      gamePk: 663085,
      gameDate: "2022-09-12T22:40:00Z",
      teams: {
        away: {
          team: {
            id: 134,
            name: "Pittsburgh Pirates",
            abbreviation: "PIT",
          },
          probablePitcher: {
            id: 669060,
            fullName: "Bryse Wilson",
          },
        },
        home: {
          team: {
            id: 113,
            name: "Cincinnati Reds",
            abbreviation: "CIN",
          },
          probablePitcher: {
            id: 501985,
            fullName: "Mike Minor",
          },
        },
      },
    },
    {
      gamePk: 661799,
      gameDate: "2022-09-12T23:07:00Z",
      teams: {
        away: {
          team: {
            id: 139,
            name: "Tampa Bay Rays",
            abbreviation: "TB",
          },
          probablePitcher: {
            id: 681867,
            fullName: "Cooper Criswell",
          },
        },
        home: {
          team: {
            id: 141,
            name: "Toronto Blue Jays",
            abbreviation: "TOR",
          },
          probablePitcher: {
            id: 621244,
            fullName: "Jose Berrios",
          },
        },
      },
    },
    {
      gamePk: 662423,
      gameDate: "2022-09-12T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 112,
            name: "Chicago Cubs",
            abbreviation: "CHC",
          },
          probablePitcher: {
            id: 665871,
            fullName: "Javier Assad",
          },
        },
        home: {
          team: {
            id: 121,
            name: "New York Mets",
            abbreviation: "NYM",
          },
          probablePitcher: {
            id: 605135,
            fullName: "Chris Bassitt",
          },
        },
      },
    },
    {
      gamePk: 663324,
      gameDate: "2022-09-13T01:40:00Z",
      teams: {
        away: {
          team: {
            id: 119,
            name: "Los Angeles Dodgers",
            abbreviation: "LAD",
          },
          probablePitcher: {
            id: 542881,
            fullName: "Tyler Anderson",
          },
        },
        home: {
          team: {
            id: 109,
            name: "Arizona Diamondbacks",
            abbreviation: "ARI",
          },
          probablePitcher: {
            id: 669194,
            fullName: "Ryne Nelson",
          },
        },
      },
    },
    {
      gamePk: 662029,
      gameDate: "2022-09-13T01:45:00Z",
      teams: {
        away: {
          team: {
            id: 144,
            name: "Atlanta Braves",
            abbreviation: "ATL",
          },
          probablePitcher: {
            id: 675911,
            fullName: "Spencer Strider",
          },
        },
        home: {
          team: {
            id: 137,
            name: "San Francisco Giants",
            abbreviation: "SF",
          },
          probablePitcher: {
            id: 502171,
            fullName: "Alex Cobb",
          },
        },
      },
    },
  ],
  [
    {
      gamePk: 663158,
      gameDate: "2022-09-13T16:35:00Z",
      teams: {
        away: {
          team: {
            id: 134,
            name: "Pittsburgh Pirates",
            abbreviation: "PIT",
          },
          probablePitcher: {
            id: 670912,
            fullName: "Johan Oviedo",
          },
        },
        home: {
          team: {
            id: 113,
            name: "Cincinnati Reds",
            abbreviation: "CIN",
          },
          probablePitcher: {
            id: 570666,
            fullName: "Luis Cessa",
          },
        },
      },
    },
    {
      gamePk: 663106,
      gameDate: "2022-09-13T22:40:00Z",
      teams: {
        away: {
          team: {
            id: 134,
            name: "Pittsburgh Pirates",
            abbreviation: "PIT",
          },
          probablePitcher: {
            id: 682847,
            fullName: "Luis Ortiz",
          },
        },
        home: {
          team: {
            id: 113,
            name: "Cincinnati Reds",
            abbreviation: "CIN",
          },
          probablePitcher: {
            id: 518585,
            fullName: "Fernando Cruz",
          },
        },
      },
    },
    {
      gamePk: 661840,
      gameDate: "2022-09-13T17:07:00Z",
      teams: {
        away: {
          team: {
            id: 139,
            name: "Tampa Bay Rays",
            abbreviation: "TB",
          },
          probablePitcher: {
            id: 605488,
            fullName: "Jeffrey Springs",
          },
        },
        home: {
          team: {
            id: 141,
            name: "Toronto Blue Jays",
            abbreviation: "TOR",
          },
          probablePitcher: {
            id: 657240,
            fullName: "Julian Merryweather",
          },
        },
      },
    },
    {
      gamePk: 661798,
      gameDate: "2022-09-13T23:07:00Z",
      teams: {
        away: {
          team: {
            id: 139,
            name: "Tampa Bay Rays",
            abbreviation: "TB",
          },
          probablePitcher: {
            id: 630023,
            fullName: "Yonny Chirinos",
          },
        },
        home: {
          team: {
            id: 141,
            name: "Toronto Blue Jays",
            abbreviation: "TOR",
          },
          probablePitcher: {
            id: 666201,
            fullName: "Alek Manoah",
          },
        },
      },
    },
    {
      gamePk: 662965,
      gameDate: "2022-09-13T22:10:00Z",
      teams: {
        away: {
          team: {
            id: 108,
            name: "Los Angeles Angels",
            abbreviation: "LAA",
          },
          probablePitcher: {
            id: 660761,
            fullName: "Jose Suarez",
          },
        },
        home: {
          team: {
            id: 114,
            name: "Cleveland Guardians",
            abbreviation: "CLE",
          },
          probablePitcher: {
            id: 663752,
            fullName: "Cody Morris",
          },
        },
      },
    },
    {
      gamePk: 662787,
      gameDate: "2022-09-13T22:40:00Z",
      teams: {
        away: {
          team: {
            id: 117,
            name: "Houston Astros",
            abbreviation: "HOU",
          },
          probablePitcher: {
            id: 686613,
            fullName: "Hunter Brown",
          },
        },
        home: {
          team: {
            id: 116,
            name: "Detroit Tigers",
            abbreviation: "DET",
          },
          probablePitcher: {
            id: 571800,
            fullName: "Drew Hutchison",
          },
        },
      },
    },
    {
      gamePk: 661320,
      gameDate: "2022-09-13T22:40:00Z",
      teams: {
        away: {
          team: {
            id: 143,
            name: "Philadelphia Phillies",
            abbreviation: "PHI",
          },
          probablePitcher: {
            id: 663559,
            fullName: "Bailey Falter",
          },
        },
        home: {
          team: {
            id: 146,
            name: "Miami Marlins",
            abbreviation: "MIA",
          },
          probablePitcher: {
            id: 645261,
            fullName: "Sandy Alcantara",
          },
        },
      },
    },
    {
      gamePk: 662464,
      gameDate: "2022-09-13T23:05:00Z",
      teams: {
        away: {
          team: {
            id: 110,
            name: "Baltimore Orioles",
            abbreviation: "BAL",
          },
          probablePitcher: {
            id: 665152,
            fullName: "Dean Kremer",
          },
        },
        home: {
          team: {
            id: 120,
            name: "Washington Nationals",
            abbreviation: "WSH",
          },
          probablePitcher: {
            id: 676265,
            fullName: "Cory Abbott",
          },
        },
      },
    },
    {
      gamePk: 662430,
      gameDate: "2022-09-13T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 112,
            name: "Chicago Cubs",
            abbreviation: "CHC",
          },
          probablePitcher: {
            id: 592716,
            fullName: "Adrian Sampson",
          },
        },
        home: {
          team: {
            id: 121,
            name: "New York Mets",
            abbreviation: "NYM",
          },
          probablePitcher: {
            id: 594798,
            fullName: "Jacob deGrom",
          },
        },
      },
    },
    {
      gamePk: 663160,
      gameDate: "2022-09-13T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 147,
            name: "New York Yankees",
            abbreviation: "NYY",
          },
          probablePitcher: {
            id: 543037,
            fullName: "Gerrit Cole",
          },
        },
        home: {
          team: {
            id: 111,
            name: "Boston Red Sox",
            abbreviation: "BOS",
          },
          probablePitcher: {
            id: 601713,
            fullName: "Nick Pivetta",
          },
        },
      },
    },
    {
      gamePk: 661645,
      gameDate: "2022-09-13T23:40:00Z",
      teams: {
        away: {
          team: {
            id: 118,
            name: "Kansas City Royals",
            abbreviation: "KC",
          },
          probablePitcher: {
            id: 663460,
            fullName: "Kris Bubic",
          },
        },
        home: {
          team: {
            id: 142,
            name: "Minnesota Twins",
            abbreviation: "MIN",
          },
          probablePitcher: {
            id: 657746,
            fullName: "Joe Ryan",
          },
        },
      },
    },
    {
      gamePk: 661922,
      gameDate: "2022-09-13T23:45:00Z",
      teams: {
        away: {
          team: {
            id: 158,
            name: "Milwaukee Brewers",
            abbreviation: "MIL",
          },
          probablePitcher: {
            id: 456713,
            fullName: "Matt Bush",
          },
        },
        home: {
          team: {
            id: 138,
            name: "St. Louis Cardinals",
            abbreviation: "STL",
          },
          probablePitcher: {
            id: 656756,
            fullName: "Jordan Montgomery",
          },
        },
      },
    },
    {
      gamePk: 661838,
      gameDate: "2022-09-14T00:05:00Z",
      teams: {
        away: {
          team: {
            id: 133,
            name: "Oakland Athletics",
            abbreviation: "OAK",
          },
          probablePitcher: {
            id: 686610,
            fullName: "Ken Waldichuk",
          },
        },
        home: {
          team: {
            id: 140,
            name: "Texas Rangers",
            abbreviation: "TEX",
          },
          probablePitcher: {
            id: 666142,
            fullName: "Cole Ragans",
          },
        },
      },
    },
    {
      gamePk: 661436,
      gameDate: "2022-09-14T00:10:00Z",
      teams: {
        away: {
          team: {
            id: 115,
            name: "Colorado Rockies",
            abbreviation: "COL",
          },
          probablePitcher: {
            id: 641771,
            fullName: "Chad Kuhl",
          },
        },
        home: {
          team: {
            id: 145,
            name: "Chicago White Sox",
            abbreviation: "CWS",
          },
          probablePitcher: {
            id: 656629,
            fullName: "Michael Kopech",
          },
        },
      },
    },
    {
      gamePk: 663323,
      gameDate: "2022-09-14T01:40:00Z",
      teams: {
        away: {
          team: {
            id: 119,
            name: "Los Angeles Dodgers",
            abbreviation: "LAD",
          },
          probablePitcher: {
            id: 477132,
            fullName: "Clayton Kershaw",
          },
        },
        home: {
          team: {
            id: 109,
            name: "Arizona Diamondbacks",
            abbreviation: "ARI",
          },
          probablePitcher: {
            id: 518876,
            fullName: "Merrill Kelly",
          },
        },
      },
    },
    {
      gamePk: 662119,
      gameDate: "2022-09-14T01:40:00Z",
      teams: {
        away: {
          team: {
            id: 135,
            name: "San Diego Padres",
            abbreviation: "SD",
          },
          probablePitcher: {
            id: 506433,
            fullName: "Yu Darvish",
          },
        },
        home: {
          team: {
            id: 136,
            name: "Seattle Mariners",
            abbreviation: "SEA",
          },
          probablePitcher: {
            id: 669302,
            fullName: "Logan Gilbert",
          },
        },
      },
    },
    {
      gamePk: 662028,
      gameDate: "2022-09-14T01:45:00Z",
      teams: {
        away: {
          team: {
            id: 144,
            name: "Atlanta Braves",
            abbreviation: "ATL",
          },
          probablePitcher: {
            id: 657140,
            fullName: "Kyle Wright",
          },
        },
        home: {
          team: {
            id: 137,
            name: "San Francisco Giants",
            abbreviation: "SF",
          },
          probablePitcher: {
            id: 596001,
            fullName: "Jakob Junis",
          },
        },
      },
    },
  ],
  [
    {
      gamePk: 663006,
      gameDate: "2022-09-14T16:35:00Z",
      teams: {
        away: {
          team: {
            id: 134,
            name: "Pittsburgh Pirates",
            abbreviation: "PIT",
          },
          probablePitcher: {
            id: 672710,
            fullName: "Roansy Contreras",
          },
        },
        home: {
          team: {
            id: 113,
            name: "Cincinnati Reds",
            abbreviation: "CIN",
          },
          probablePitcher: {
            id: 666157,
            fullName: "Nick Lodolo",
          },
        },
      },
    },
    {
      gamePk: 662969,
      gameDate: "2022-09-14T17:10:00Z",
      teams: {
        away: {
          team: {
            id: 108,
            name: "Los Angeles Angels",
            abbreviation: "LAA",
          },
          probablePitcher: {
            id: 663776,
            fullName: "Patrick Sandoval",
          },
        },
        home: {
          team: {
            id: 114,
            name: "Cleveland Guardians",
            abbreviation: "CLE",
          },
          probablePitcher: {
            id: 615698,
            fullName: "Cal Quantrill",
          },
        },
      },
    },
    {
      gamePk: 662792,
      gameDate: "2022-09-14T17:10:00Z",
      teams: {
        away: {
          team: {
            id: 117,
            name: "Houston Astros",
            abbreviation: "HOU",
          },
          probablePitcher: {
            id: 664299,
            fullName: "Cristian Javier",
          },
        },
        home: {
          team: {
            id: 116,
            name: "Detroit Tigers",
            abbreviation: "DET",
          },
          probablePitcher: {
            id: 666214,
            fullName: "Joey Wentz",
          },
        },
      },
    },
    {
      gamePk: 661435,
      gameDate: "2022-09-14T18:10:00Z",
      teams: {
        away: {
          team: {
            id: 115,
            name: "Colorado Rockies",
            abbreviation: "COL",
          },
          probablePitcher: {
            id: 607536,
            fullName: "Kyle Freeland",
          },
        },
        home: {
          team: {
            id: 145,
            name: "Chicago White Sox",
            abbreviation: "CWS",
          },
          probablePitcher: {
            id: 656302,
            fullName: "Dylan Cease",
          },
        },
      },
    },
    {
      gamePk: 662027,
      gameDate: "2022-09-14T19:45:00Z",
      teams: {
        away: {
          team: {
            id: 144,
            name: "Atlanta Braves",
            abbreviation: "ATL",
          },
          probablePitcher: {
            id: 450203,
            fullName: "Charlie Morton",
          },
        },
        home: {
          team: {
            id: 137,
            name: "San Francisco Giants",
            abbreviation: "SF",
          },
          probablePitcher: {
            id: 607074,
            fullName: "Carlos Rodon",
          },
        },
      },
    },
    {
      gamePk: 662118,
      gameDate: "2022-09-14T20:10:00Z",
      teams: {
        away: {
          team: {
            id: 135,
            name: "San Diego Padres",
            abbreviation: "SD",
          },
          probablePitcher: {
            id: 605182,
            fullName: "Mike Clevinger",
          },
        },
        home: {
          team: {
            id: 136,
            name: "Seattle Mariners",
            abbreviation: "SEA",
          },
          probablePitcher: {
            id: 622491,
            fullName: "Luis Castillo",
          },
        },
      },
    },
    {
      gamePk: 661336,
      gameDate: "2022-09-14T22:40:00Z",
      teams: {
        away: {
          team: {
            id: 143,
            name: "Philadelphia Phillies",
            abbreviation: "PHI",
          },
          probablePitcher: {
            id: 502043,
            fullName: "Kyle Gibson",
          },
        },
        home: {
          team: {
            id: 146,
            name: "Miami Marlins",
            abbreviation: "MIA",
          },
          probablePitcher: {
            id: 665795,
            fullName: "Edward Cabrera",
          },
        },
      },
    },
    {
      gamePk: 662463,
      gameDate: "2022-09-14T23:05:00Z",
      teams: {
        away: {
          team: {
            id: 110,
            name: "Baltimore Orioles",
            abbreviation: "BAL",
          },
          probablePitcher: {
            id: 669330,
            fullName: "Tyler Wells",
          },
        },
        home: {
          team: {
            id: 120,
            name: "Washington Nationals",
            abbreviation: "WSH",
          },
          probablePitcher: {
            id: 571578,
            fullName: "Patrick Corbin",
          },
        },
      },
    },
    {
      gamePk: 661770,
      gameDate: "2022-09-14T23:07:00Z",
      teams: {
        away: {
          team: {
            id: 139,
            name: "Tampa Bay Rays",
            abbreviation: "TB",
          },
          probablePitcher: {
            id: 656876,
            fullName: "Drew Rasmussen",
          },
        },
        home: {
          team: {
            id: 141,
            name: "Toronto Blue Jays",
            abbreviation: "TOR",
          },
          probablePitcher: {
            id: 548389,
            fullName: "Ross Stripling",
          },
        },
      },
    },
    {
      gamePk: 662422,
      gameDate: "2022-09-14T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 112,
            name: "Chicago Cubs",
            abbreviation: "CHC",
          },
          probablePitcher: {
            id: 592767,
            fullName: "Drew Smyly",
          },
        },
        home: {
          team: {
            id: 121,
            name: "New York Mets",
            abbreviation: "NYM",
          },
          probablePitcher: {
            id: 656849,
            fullName: "David Peterson",
          },
        },
      },
    },
    {
      gamePk: 663159,
      gameDate: "2022-09-14T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 147,
            name: "New York Yankees",
            abbreviation: "NYY",
          },
          probablePitcher: {
            id: 641482,
            fullName: "Nestor Cortes",
          },
        },
        home: {
          team: {
            id: 111,
            name: "Boston Red Sox",
            abbreviation: "BOS",
          },
          probablePitcher: {
            id: 678394,
            fullName: "Brayan Bello",
          },
        },
      },
    },
    {
      gamePk: 661646,
      gameDate: "2022-09-14T23:40:00Z",
      teams: {
        away: {
          team: {
            id: 118,
            name: "Kansas City Royals",
            abbreviation: "KC",
          },
          probablePitcher: {
            id: 425844,
            fullName: "Zack Greinke",
          },
        },
        home: {
          team: {
            id: 142,
            name: "Minnesota Twins",
            abbreviation: "MIN",
          },
          probablePitcher: {
            id: 543243,
            fullName: "Sonny Gray",
          },
        },
      },
    },
    {
      gamePk: 661921,
      gameDate: "2022-09-14T23:45:00Z",
      teams: {
        away: {
          team: {
            id: 158,
            name: "Milwaukee Brewers",
            abbreviation: "MIL",
          },
          probablePitcher: {
            id: 669203,
            fullName: "Corbin Burnes",
          },
        },
        home: {
          team: {
            id: 138,
            name: "St. Louis Cardinals",
            abbreviation: "STL",
          },
          probablePitcher: {
            id: 425794,
            fullName: "Adam Wainwright",
          },
        },
      },
    },
    {
      gamePk: 661829,
      gameDate: "2022-09-15T00:05:00Z",
      teams: {
        away: {
          team: {
            id: 133,
            name: "Oakland Athletics",
            abbreviation: "OAK",
          },
          probablePitcher: {
            id: 676664,
            fullName: "JP Sears",
          },
        },
        home: {
          team: {
            id: 140,
            name: "Texas Rangers",
            abbreviation: "TEX",
          },
          probablePitcher: {
            id: 641540,
            fullName: "Dane Dunning",
          },
        },
      },
    },
    {
      gamePk: 663322,
      gameDate: "2022-09-15T01:40:00Z",
      teams: {
        away: {
          team: {
            id: 119,
            name: "Los Angeles Dodgers",
            abbreviation: "LAD",
          },
          probablePitcher: {
            id: 675627,
            fullName: "Michael Grove",
          },
        },
        home: {
          team: {
            id: 109,
            name: "Arizona Diamondbacks",
            abbreviation: "ARI",
          },
          probablePitcher: {
            id: 605200,
            fullName: "Zach Davies",
          },
        },
      },
    },
  ],
  [
    {
      gamePk: 662974,
      gameDate: "2022-09-15T17:10:00Z",
      teams: {
        away: {
          team: {
            id: 145,
            name: "Chicago White Sox",
            abbreviation: "CWS",
          },
          probablePitcher: {
            id: 458681,
            fullName: "Lance Lynn",
          },
        },
        home: {
          team: {
            id: 114,
            name: "Cleveland Guardians",
            abbreviation: "CLE",
          },
          probablePitcher: {
            id: 683769,
            fullName: "Hunter Gaddis",
          },
        },
      },
    },
    {
      gamePk: 661822,
      gameDate: "2022-09-15T19:07:00Z",
      teams: {
        away: {
          team: {
            id: 139,
            name: "Tampa Bay Rays",
            abbreviation: "TB",
          },
          probablePitcher: {
            id: 663556,
            fullName: "Shane McClanahan",
          },
        },
        home: {
          team: {
            id: 141,
            name: "Toronto Blue Jays",
            abbreviation: "TOR",
          },
          probablePitcher: {
            id: 592332,
            fullName: "Kevin Gausman",
          },
        },
      },
    },
    {
      gamePk: 661321,
      gameDate: "2022-09-15T22:40:00Z",
      teams: {
        away: {
          team: {
            id: 143,
            name: "Philadelphia Phillies",
            abbreviation: "PHI",
          },
          probablePitcher: {
            id: 592789,
            fullName: "Noah Syndergaard",
          },
        },
        home: {
          team: {
            id: 146,
            name: "Miami Marlins",
            abbreviation: "MIA",
          },
          probablePitcher: {
            id: 641154,
            fullName: "Pablo Lopez",
          },
        },
      },
    },
    {
      gamePk: 662709,
      gameDate: "2022-09-15T23:20:00Z",
      teams: {
        away: {
          team: {
            id: 133,
            name: "Oakland Athletics",
            abbreviation: "OAK",
          },
          probablePitcher: {
            id: 621076,
            fullName: "James Kaprielian",
          },
        },
        home: {
          team: {
            id: 117,
            name: "Houston Astros",
            abbreviation: "HOU",
          },
          probablePitcher: {
            id: 621121,
            fullName: "Lance McCullers Jr.",
          },
        },
      },
    },
    {
      gamePk: 662398,
      gameDate: "2022-09-15T23:20:00Z",
      teams: {
        away: {
          team: {
            id: 134,
            name: "Pittsburgh Pirates",
            abbreviation: "PIT",
          },
          probablePitcher: {
            id: 664141,
            fullName: "JT Brubaker",
          },
        },
        home: {
          team: {
            id: 121,
            name: "New York Mets",
            abbreviation: "NYM",
          },
          probablePitcher: {
            id: 471911,
            fullName: "Carlos Carrasco",
          },
        },
      },
    },
    {
      gamePk: 661644,
      gameDate: "2022-09-15T23:40:00Z",
      teams: {
        away: {
          team: {
            id: 118,
            name: "Kansas City Royals",
            abbreviation: "KC",
          },
          probablePitcher: {
            id: 663738,
            fullName: "Daniel Lynch",
          },
        },
        home: {
          team: {
            id: 142,
            name: "Minnesota Twins",
            abbreviation: "MIN",
          },
          probablePitcher: {
            id: 605164,
            fullName: "Dylan Bundy",
          },
        },
      },
    },
    {
      gamePk: 661919,
      gameDate: "2022-09-15T23:45:00Z",
      teams: {
        away: {
          team: {
            id: 113,
            name: "Cincinnati Reds",
            abbreviation: "CIN",
          },
          probablePitcher: {
            id: 502624,
            fullName: "Chase Anderson",
          },
        },
        home: {
          team: {
            id: 138,
            name: "St. Louis Cardinals",
            abbreviation: "STL",
          },
          probablePitcher: {
            id: 571945,
            fullName: "Miles Mikolas",
          },
        },
      },
    },
    {
      gamePk: 663284,
      gameDate: "2022-09-16T01:40:00Z",
      teams: {
        away: {
          team: {
            id: 135,
            name: "San Diego Padres",
            abbreviation: "SD",
          },
          probablePitcher: {
            id: 640455,
            fullName: "Sean Manaea",
          },
        },
        home: {
          team: {
            id: 109,
            name: "Arizona Diamondbacks",
            abbreviation: "ARI",
          },
          probablePitcher: {
            id: 686753,
            fullName: "Drey Jameson",
          },
        },
      },
    },
  ],
  [
    {
      gamePk: 663126,
      gameDate: "2022-09-16T18:20:00Z",
      teams: {
        away: {
          team: {
            id: 115,
            name: "Colorado Rockies",
            abbreviation: "COL",
          },
          probablePitcher: {
            id: 608566,
            fullName: "German Marquez",
          },
        },
        home: {
          team: {
            id: 112,
            name: "Chicago Cubs",
            abbreviation: "CHC",
          },
          probablePitcher: {
            id: 573186,
            fullName: "Marcus Stroman",
          },
        },
      },
    },
    {
      gamePk: 662490,
      gameDate: "2022-09-16T23:05:00Z",
      teams: {
        away: {
          team: {
            id: 146,
            name: "Miami Marlins",
            abbreviation: "MIA",
          },
          probablePitcher: {
            id: 666200,
            fullName: "Jesus Luzardo",
          },
        },
        home: {
          team: {
            id: 120,
            name: "Washington Nationals",
            abbreviation: "WSH",
          },
          probablePitcher: {
            id: 680686,
            fullName: "Josiah Gray",
          },
        },
      },
    },
    {
      gamePk: 661776,
      gameDate: "2022-09-16T23:07:00Z",
      teams: {
        away: {
          team: {
            id: 110,
            name: "Baltimore Orioles",
            abbreviation: "BAL",
          },
          probablePitcher: {
            id: 543475,
            fullName: "Jordan Lyles",
          },
        },
        home: {
          team: {
            id: 141,
            name: "Toronto Blue Jays",
            abbreviation: "TOR",
          },
          probablePitcher: {
            id: 670950,
            fullName: "Trevor Richards",
          },
        },
      },
    },
    {
      gamePk: 663209,
      gameDate: "2022-09-16T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 118,
            name: "Kansas City Royals",
            abbreviation: "KC",
          },
          probablePitcher: {
            id: 669169,
            fullName: "Jonathan Heasley",
          },
        },
        home: {
          team: {
            id: 111,
            name: "Boston Red Sox",
            abbreviation: "BOS",
          },
          probablePitcher: {
            id: 608379,
            fullName: "Michael Wacha",
          },
        },
      },
    },
    {
      gamePk: 662404,
      gameDate: "2022-09-16T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 134,
            name: "Pittsburgh Pirates",
            abbreviation: "PIT",
          },
          probablePitcher: {
            id: 656605,
            fullName: "Mitch Keller",
          },
        },
        home: {
          team: {
            id: 121,
            name: "New York Mets",
            abbreviation: "NYM",
          },
          probablePitcher: {
            id: 592836,
            fullName: "Taijuan Walker",
          },
        },
      },
    },
    {
      gamePk: 662064,
      gameDate: "2022-09-16T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 140,
            name: "Texas Rangers",
            abbreviation: "TEX",
          },
          probablePitcher: {
            id: 527048,
            fullName: "Martin Perez",
          },
        },
        home: {
          team: {
            id: 139,
            name: "Tampa Bay Rays",
            abbreviation: "TB",
          },
          probablePitcher: {
            id: 446372,
            fullName: "Corey Kluber",
          },
        },
      },
    },
    {
      gamePk: 662959,
      gameDate: "2022-09-16T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 142,
            name: "Minnesota Twins",
            abbreviation: "MIN",
          },
          probablePitcher: {
            id: 641927,
            fullName: "Bailey Ober",
          },
        },
        home: {
          team: {
            id: 114,
            name: "Cleveland Guardians",
            abbreviation: "CLE",
          },
          probablePitcher: {
            id: 663474,
            fullName: "Triston McKenzie",
          },
        },
      },
    },
    {
      gamePk: 662781,
      gameDate: "2022-09-16T23:10:00Z",
      teams: {
        away: {
          team: {
            id: 145,
            name: "Chicago White Sox",
            abbreviation: "CWS",
          },
          probablePitcher: {
            id: 608337,
            fullName: "Lucas Giolito",
          },
        },
        home: {
          team: {
            id: 116,
            name: "Detroit Tigers",
            abbreviation: "DET",
          },
          probablePitcher: {
            id: 666159,
            fullName: "Matt Manning",
          },
        },
      },
    },
    {
      gamePk: 661473,
      gameDate: "2022-09-16T23:20:00Z",
      teams: {
        away: {
          team: {
            id: 143,
            name: "Philadelphia Phillies",
            abbreviation: "PHI",
          },
          probablePitcher: {
            id: 624133,
            fullName: "Ranger Suarez",
          },
        },
        home: {
          team: {
            id: 144,
            name: "Atlanta Braves",
            abbreviation: "ATL",
          },
          probablePitcher: {
            id: 608331,
            fullName: "Max Fried",
          },
        },
      },
    },
    {
      gamePk: 662740,
      gameDate: "2022-09-17T00:10:00Z",
      teams: {
        away: {
          team: {
            id: 133,
            name: "Oakland Athletics",
            abbreviation: "OAK",
          },
          probablePitcher: {
            id: 661309,
            fullName: "Adrian Martinez",
          },
        },
        home: {
          team: {
            id: 117,
            name: "Houston Astros",
            abbreviation: "HOU",
          },
          probablePitcher: {
            id: 434378,
            fullName: "Justin Verlander",
          },
        },
      },
    },
    {
      gamePk: 661164,
      gameDate: "2022-09-17T00:10:00Z",
      teams: {
        away: {
          team: {
            id: 147,
            name: "New York Yankees",
            abbreviation: "NYY",
          },
          probablePitcher: {
            id: 593423,
            fullName: "Frankie Montas",
          },
        },
        home: {
          team: {
            id: 158,
            name: "Milwaukee Brewers",
            abbreviation: "MIL",
          },
          probablePitcher: {
            id: 605288,
            fullName: "Adrian Houser",
          },
        },
      },
    },
    {
      gamePk: 661953,
      gameDate: "2022-09-17T00:15:00Z",
      teams: {
        away: {
          team: {
            id: 113,
            name: "Cincinnati Reds",
            abbreviation: "CIN",
          },
          probablePitcher: {
            id: 518585,
            fullName: "Fernando Cruz",
          },
        },
        home: {
          team: {
            id: 138,
            name: "St. Louis Cardinals",
            abbreviation: "STL",
          },
          probablePitcher: {
            id: 656427,
            fullName: "Jack Flaherty",
          },
        },
      },
    },
    {
      gamePk: 663427,
      gameDate: "2022-09-17T01:38:00Z",
      teams: {
        away: {
          team: {
            id: 136,
            name: "Seattle Mariners",
            abbreviation: "SEA",
          },
          probablePitcher: {
            id: 592662,
            fullName: "Robbie Ray",
          },
        },
        home: {
          team: {
            id: 108,
            name: "Los Angeles Angels",
            abbreviation: "LAA",
          },
          probablePitcher: {
            id: 547179,
            fullName: "Michael Lorenzen",
          },
        },
      },
    },
    {
      gamePk: 663283,
      gameDate: "2022-09-17T01:40:00Z",
      teams: {
        away: {
          team: {
            id: 135,
            name: "San Diego Padres",
            abbreviation: "SD",
          },
          probablePitcher: {
            id: 605483,
            fullName: "Blake Snell",
          },
        },
        home: {
          team: {
            id: 109,
            name: "Arizona Diamondbacks",
            abbreviation: "ARI",
          },
          probablePitcher: {
            id: 518516,
            fullName: "Madison Bumgarner",
          },
        },
      },
    },
    {
      gamePk: 662026,
      gameDate: "2022-09-17T02:15:00Z",
      teams: {
        away: {
          team: {
            id: 119,
            name: "Los Angeles Dodgers",
            abbreviation: "LAD",
          },
          probablePitcher: {
            id: 669160,
            fullName: "Dustin May",
          },
        },
        home: {
          team: {
            id: 137,
            name: "San Francisco Giants",
            abbreviation: "SF",
          },
          probablePitcher: {
            id: 657277,
            fullName: "Logan Webb",
          },
        },
      },
    },
  ],
];

export const mockedPitchers: Player[] = [
  {
    id: 676265,
    fullName: "Cory Abbott",
    currentTeam: { id: 120 },
    primaryPosition: { code: "1" },
    primaryNumber: "50",
  },
  {
    id: 656061,
    fullName: "Albert Abreu",
    currentTeam: { id: 147 },
    primaryPosition: { code: "1" },
    primaryNumber: "51",
  },
  {
    id: 650556,
    fullName: "Bryan Abreu",
    currentTeam: { id: 117 },
    primaryPosition: { code: "1" },
    primaryNumber: "52",
  },
  {
    id: 642758,
    fullName: "Domingo Acevedo",
    currentTeam: { id: 133 },
    primaryPosition: { code: "1" },
    primaryNumber: "53",
  },
  {
    id: 592094,
    fullName: "Jason Adam",
    currentTeam: { id: 139 },
    primaryPosition: { code: "1" },
    primaryNumber: "54",
  },
  {
    id: 613534,
    fullName: "Austin Adams",
    currentTeam: { id: 135 },
    primaryPosition: { code: "1" },
    primaryNumber: "55",
  },
  {
    id: 672851,
    fullName: "Joan Adon",
    currentTeam: { id: 120 },
    primaryPosition: { code: "1" },
    primaryNumber: "56",
  },
  {
    id: 669211,
    fullName: "Keegan Akin",
    currentTeam: { id: 110 },
    primaryPosition: { code: "1" },
    primaryNumber: "57",
  },
  {
    id: 660896,
    fullName: "Jorge Alcala",
    currentTeam: { id: 142 },
    primaryPosition: { code: "1" },
    primaryNumber: "58",
  },
  {
    id: 645261,
    fullName: "Sandy Alcantara",
    currentTeam: { id: 146 },
    primaryPosition: { code: "1" },
    primaryNumber: "59",
  },
  {
    id: 669920,
    fullName: "Jason Alexander",
    currentTeam: { id: 158 },
    primaryPosition: { code: "1" },
    primaryNumber: "60",
  },
  {
    id: 518397,
    fullName: "Scott Alexander",
    currentTeam: { id: 137 },
    primaryPosition: { code: "1" },
    primaryNumber: "61",
  },
  {
    id: 641302,
    fullName: "Tyler Alexander",
    currentTeam: { id: 116 },
    primaryPosition: { code: "1" },
    primaryNumber: "62",
  },
  {
    id: 669935,
    fullName: "A.J. Alexy",
    currentTeam: { id: 140 },
    primaryPosition: { code: "1" },
    primaryNumber: "63",
  },
  {
    id: 663465,
    fullName: "Kolby Allard",
    currentTeam: { id: 140 },
    primaryPosition: { code: "1" },
    primaryNumber: "64",
  },
  {
    id: 682027,
    fullName: "Cam Alldred",
    currentTeam: { id: 134 },
    primaryPosition: { code: "1" },
    primaryNumber: "65",
  },
  {
    id: 663531,
    fullName: "Logan Allen",
    currentTeam: { id: 110 },
    primaryPosition: { code: "1" },
    primaryNumber: "66",
  },
  {
    id: 622075,
    fullName: "Yency Almonte",
    currentTeam: { id: 119 },
    primaryPosition: { code: "1" },
    primaryNumber: "67",
  },
  {
    id: 621237,
    fullName: "Jose Alvarado",
    currentTeam: { id: 143 },
    primaryPosition: { code: "1" },
    primaryNumber: "68",
  },
  {
    id: 501625,
    fullName: "Jose Alvarez",
    currentTeam: { id: 137 },
    primaryPosition: { code: "1" },
    primaryNumber: "69",
  },
  {
    id: 571439,
    fullName: "R.J. Alvarez",
    currentTeam: { id: 121 },
    primaryPosition: { code: "1" },
    primaryNumber: "70",
  },
  {
    id: 640470,
    fullName: "Adbert Alzolay",
    currentTeam: { id: 112 },
    primaryPosition: { code: "1" },
    primaryNumber: "71",
  },
  {
    id: 666120,
    fullName: "Ian Anderson",
    currentTeam: { id: 144 },
    primaryPosition: { code: "1" },
    primaryNumber: "72",
  },
  {
    id: 502624,
    fullName: "Chase Anderson",
    currentTeam: { id: 113 },
    primaryPosition: { code: "1" },
    primaryNumber: "73",
  },
  {
    id: 641312,
    fullName: "Shaun Anderson",
    currentTeam: { id: 141 },
    primaryPosition: { code: "1" },
    primaryNumber: "74",
  },
  {
    id: 542881,
    fullName: "Tyler Anderson",
    currentTeam: { id: 119 },
    primaryPosition: { code: "1" },
    primaryNumber: "75",
  },
  {
    id: 571446,
    fullName: "Mark Appel",
    currentTeam: { id: 143 },
    primaryPosition: { code: "1" },
    primaryNumber: "76",
  },
  {
    id: 644364,
    fullName: "Victor Arano",
    currentTeam: { id: 120 },
    primaryPosition: { code: "1" },
    primaryNumber: "77",
  },
  {
    id: 502042,
    fullName: "Chris Archer",
    currentTeam: { id: 142 },
    primaryPosition: { code: "1" },
    primaryNumber: "78",
  },
  {
    id: 685503,
    fullName: "Kohei Arihara",
    currentTeam: { id: 140 },
    primaryPosition: { code: "1" },
    primaryNumber: "79",
  },
  {
    id: 542888,
    fullName: "Shawn Armstrong",
    currentTeam: { id: 139 },
    primaryPosition: { code: "1" },
    primaryNumber: "80",
  },
  {
    id: 676879,
    fullName: "Aaron Ashby",
    currentTeam: { id: 158 },
    primaryPosition: { code: "1" },
    primaryNumber: "81",
  },
  {
    id: 668933,
    fullName: "Graham Ashcraft",
    currentTeam: { id: 113 },
    primaryPosition: { code: "1" },
    primaryNumber: "82",
  },
  {
    id: 665871,
    fullName: "Javier Assad",
    currentTeam: { id: 112 },
    primaryPosition: { code: "1" },
    primaryNumber: "83",
  },
  {
    id: 658648,
    fullName: "Pedro Avila",
    currentTeam: { id: 135 },
    primaryPosition: { code: "1" },
    primaryNumber: "84",
  },
  {
    id: 673258,
    fullName: "Michel Baez",
    currentTeam: { id: 135 },
    primaryPosition: { code: "1" },
    primaryNumber: "85",
  },
  {
    id: 520980,
    fullName: "Pedro Baez",
    currentTeam: { id: 117 },
    primaryPosition: { code: "1" },
    primaryNumber: "86",
  },
  {
    id: 641329,
    fullName: "Bryan Baker",
    currentTeam: { id: 110 },
    primaryPosition: { code: "1" },
    primaryNumber: "87",
  },
  {
    id: 666364,
    fullName: "Jordan Balazovic",
    currentTeam: { id: 142 },
    primaryPosition: { code: "1" },
    primaryNumber: "88",
  },
  {
    id: 607455,
    fullName: "Anthony Banda",
    currentTeam: { id: 147 },
    primaryPosition: { code: "1" },
    primaryNumber: "89",
  },
  {
    id: 621383,
    fullName: "Tanner Banks",
    currentTeam: { id: 145 },
    primaryPosition: { code: "1" },
    primaryNumber: "90",
  },
  {
    id: 544365,
    fullName: "Manny Banuelos",
    currentTeam: { id: 134 },
    primaryPosition: { code: "1" },
    primaryNumber: "91",
  },
  {
    id: 453268,
    fullName: "Daniel Bard",
    currentTeam: { id: 115 },
    primaryPosition: { code: "1" },
    primaryNumber: "92",
  },
  {
    id: 572703,
    fullName: "Luke Bard",
    currentTeam: { id: 147 },
    primaryPosition: { code: "1" },
    primaryNumber: "93",
  },
  {
    id: 673316,
    fullName: "Luke Barker",
    currentTeam: { id: 158 },
    primaryPosition: { code: "1" },
    primaryNumber: "94",
  },
  {
    id: 669618,
    fullName: "Joe Barlow",
    currentTeam: { id: 140 },
    primaryPosition: { code: "1" },
    primaryNumber: "95",
  },
  {
    id: 605130,
    fullName: "Scott Barlow",
    currentTeam: { id: 118 },
    primaryPosition: { code: "1" },
    primaryNumber: "96",
  },
  {
    id: 606930,
    fullName: "Jacob Barnes",
    currentTeam: { id: 147 },
    primaryPosition: { code: "1" },
    primaryNumber: "97",
  },
  {
    id: 598264,
    fullName: "Matt Barnes",
    currentTeam: { id: 111 },
    primaryPosition: { code: "1" },
    primaryNumber: "98",
  },
  {
    id: 607457,
    fullName: "Kyle Barraclough",
    currentTeam: { id: 108 },
    primaryPosition: { code: "1" },
    primaryNumber: "99",
  },
  {
    id: 642545,
    fullName: "Jaime Barria",
    currentTeam: { id: 108 },
    primaryPosition: { code: "1" },
    primaryNumber: "100",
  },
  {
    id: 542914,
    fullName: "Anthony Bass",
    currentTeam: { id: 141 },
    primaryPosition: { code: "1" },
    primaryNumber: "101",
  },
  {
    id: 605135,
    fullName: "Chris Bassitt",
    currentTeam: { id: 121 },
    primaryPosition: { code: "1" },
    primaryNumber: "102",
  },
  {
    id: 657508,
    fullName: "Mike Baumann",
    currentTeam: { id: 110 },
    primaryPosition: { code: "1" },
    primaryNumber: "103",
  },
  {
    id: 642585,
    fullName: "Felix Bautista",
    currentTeam: { id: 110 },
    primaryPosition: { code: "1" },
    primaryNumber: "104",
  },
  {
    id: 669358,
    fullName: "Shane Baz",
    currentTeam: { id: 139 },
    primaryPosition: { code: "1" },
    primaryNumber: "105",
  },
  {
    id: 660825,
    fullName: "Eduard Bazardo",
    currentTeam: { id: 111 },
    primaryPosition: { code: "1" },
    primaryNumber: "106",
  },
  {
    id: 676886,
    fullName: "Jeremy Beasley",
    currentTeam: { id: 134 },
    primaryPosition: { code: "1" },
    primaryNumber: "107",
  },
  {
    id: 670280,
    fullName: "David Bednar",
    currentTeam: { id: 134 },
    primaryPosition: { code: "1" },
    primaryNumber: "108",
  },
  {
    id: 595881,
    fullName: "Tyler Beede",
    currentTeam: { id: 134 },
    primaryPosition: { code: "1" },
    primaryNumber: "109",
  },
  {
    id: 656222,
    fullName: "Jalen Beeks",
    currentTeam: { id: 139 },
    primaryPosition: { code: "1" },
    primaryNumber: "110",
  },
  {
    id: 571479,
    fullName: "Andrew Bellatti",
    currentTeam: { id: 143 },
    primaryPosition: { code: "1" },
    primaryNumber: "111",
  },
  {
    id: 678394,
    fullName: "Brayan Bello",
    currentTeam: { id: 111 },
    primaryPosition: { code: "1" },
    primaryNumber: "112",
  },
  {
    id: 669622,
    fullName: "Anthony Bender",
    currentTeam: { id: 146 },
    primaryPosition: { code: "1" },
    primaryNumber: "113",
  },
  {
    id: 657514,
    fullName: "Brennan Bernardino",
    currentTeam: { id: 136 },
    primaryPosition: { code: "1" },
    primaryNumber: "114",
  },
  {
    id: 621244,
    fullName: "Jose Berrios",
    currentTeam: { id: 141 },
    primaryPosition: { code: "1" },
    primaryNumber: "115",
  },
  {
    id: 641360,
    fullName: "Phil Bickford",
    currentTeam: { id: 119 },
    primaryPosition: { code: "1" },
    primaryNumber: "116",
  },
  {
    id: 669456,
    fullName: "Shane Bieber",
    currentTeam: { id: 114 },
    primaryPosition: { code: "1" },
    primaryNumber: "117",
  },
  {
    id: 656232,
    fullName: "Brandon Bielak",
    currentTeam: { id: 117 },
    primaryPosition: { code: "1" },
    primaryNumber: "118",
  },
  {
    id: 663467,
    fullName: "Jason Bilous",
    currentTeam: { id: 145 },
    primaryPosition: { code: "1" },
    primaryNumber: "119",
  },
  {
    id: 656234,
    fullName: "Jake Bird",
    currentTeam: { id: 115 },
    primaryPosition: { code: "1" },
    primaryNumber: "120",
  },
  {
    id: 621389,
    fullName: "Ty Blach",
    currentTeam: { id: 115 },
    primaryPosition: { code: "1" },
    primaryNumber: "121",
  },
  {
    id: 621112,
    fullName: "Paul Blackburn",
    currentTeam: { id: 133 },
    primaryPosition: { code: "1" },
    primaryNumber: "122",
  },
  {
    id: 669854,
    fullName: "Ronel Blanco",
    currentTeam: { id: 117 },
    primaryPosition: { code: "1" },
    primaryNumber: "123",
  },
  {
    id: 542947,
    fullName: "Richard Bleier",
    currentTeam: { id: 146 },
    primaryPosition: { code: "1" },
    primaryNumber: "124",
  },
  {
    id: 671790,
    fullName: "Ronald Bolanos",
    currentTeam: { id: 118 },
    primaryPosition: { code: "1" },
    primaryNumber: "125",
  },
  {
    id: 621366,
    fullName: "Ryan Borucki",
    currentTeam: { id: 136 },
    primaryPosition: { code: "1" },
    primaryNumber: "126",
  },
  {
    id: 680742,
    fullName: "Jonathan Bowlan",
    currentTeam: { id: 118 },
    primaryPosition: { code: "1" },
    primaryNumber: "127",
  },
  {
    id: 502202,
    fullName: "Brad Boxberger",
    currentTeam: { id: 158 },
    primaryPosition: { code: "1" },
    primaryNumber: "128",
  },
  {
    id: 571510,
    fullName: "Matthew Boyd",
    currentTeam: { id: 136 },
    primaryPosition: { code: "1" },
    primaryNumber: "129",
  },
  {
    id: 611093,
    fullName: "Silvino Bracho",
    currentTeam: { id: 144 },
    primaryPosition: { code: "1" },
    primaryNumber: "130",
  },
  {
    id: 680694,
    fullName: "Kyle Bradish",
    currentTeam: { id: 110 },
    primaryPosition: { code: "1" },
    primaryNumber: "131",
  },
  {
    id: 605151,
    fullName: "Archie Bradley",
    currentTeam: { id: 108 },
    primaryPosition: { code: "1" },
    primaryNumber: "132",
  },
  {
    id: 666374,
    fullName: "Matt Brash",
    currentTeam: { id: 136 },
    primaryPosition: { code: "1" },
    primaryNumber: "133",
  },
  {
    id: 518489,
    fullName: "Ryan Brasier",
    currentTeam: { id: 111 },
    primaryPosition: { code: "1" },
    primaryNumber: "134",
  },
  {
    id: 643230,
    fullName: "Steven Brault",
    currentTeam: { id: 112 },
    primaryPosition: { code: "1" },
    primaryNumber: "135",
  },
  {
    id: 623211,
    fullName: "Huascar Brazoban",
    currentTeam: { id: 146 },
    primaryPosition: { code: "1" },
    primaryNumber: "136",
  },
  {
    id: 605154,
    fullName: "John Brebbia",
    currentTeam: { id: 137 },
    primaryPosition: { code: "1" },
    primaryNumber: "137",
  },
  {
    id: 641394,
    fullName: "Jake Brentz",
    currentTeam: { id: 118 },
    primaryPosition: { code: "1" },
    primaryNumber: "138",
  },
  {
    id: 592169,
    fullName: "Austin Brice",
    currentTeam: { id: 134 },
    primaryPosition: { code: "1" },
    primaryNumber: "139",
  },
  {
    id: 689225,
    fullName: "Beau Brieske",
    currentTeam: { id: 116 },
    primaryPosition: { code: "1" },
    primaryNumber: "140",
  },
  {
    id: 656257,
    fullName: "Jeff Brigham",
    currentTeam: { id: 146 },
    primaryPosition: { code: "1" },
    primaryNumber: "141",
  },
  {
    id: 502154,
    fullName: "Zack Britton",
    currentTeam: { id: 147 },
    primaryPosition: { code: "1" },
    primaryNumber: "142",
  },
  {
    id: 641401,
    fullName: "Connor Brogdon",
    currentTeam: { id: 143 },
    primaryPosition: { code: "1" },
    primaryNumber: "143",
  },
  {
    id: 605156,
    fullName: "Aaron Brooks",
    currentTeam: { id: 138 },
    primaryPosition: { code: "1" },
    primaryNumber: "144",
  },
  {
    id: 686613,
    fullName: "Hunter Brown",
    currentTeam: { id: 117 },
    primaryPosition: { code: "1" },
    primaryNumber: "145",
  },
  {
    id: 664141,
    fullName: "JT Brubaker",
    currentTeam: { id: 134 },
    primaryPosition: { code: "1" },
    primaryNumber: "146",
  },
  {
    id: 677865,
    fullName: "Justin Bruihl",
    currentTeam: { id: 119 },
    primaryPosition: { code: "1" },
    primaryNumber: "147",
  },
  {
    id: 663460,
    fullName: "Kris Bubic",
    currentTeam: { id: 118 },
    primaryPosition: { code: "1" },
    primaryNumber: "148",
  },
  {
    id: 621111,
    fullName: "Walker Buehler",
    currentTeam: { id: 119 },
    primaryPosition: { code: "1" },
    primaryNumber: "149",
  },
  {
    id: 656266,
    fullName: "J.B. Bukauskas",
    currentTeam: { id: 109 },
    primaryPosition: { code: "1" },
    primaryNumber: "150",
  },
  {
    id: 518516,
    fullName: "Madison Bumgarner",
    currentTeam: { id: 109 },
    primaryPosition: { code: "1" },
    primaryNumber: "151",
  },
  {
    id: 607481,
    fullName: "Aaron Bummer",
    currentTeam: { id: 145 },
    primaryPosition: { code: "1" },
    primaryNumber: "152",
  },
  {
    id: 605164,
    fullName: "Dylan Bundy",
    currentTeam: { id: 142 },
    primaryPosition: { code: "1" },
    primaryNumber: "153",
  },
  {
    id: 656271,
    fullName: "Brock Burke",
    currentTeam: { id: 140 },
    primaryPosition: { code: "1" },
    primaryNumber: "154",
  },
  {
    id: 669203,
    fullName: "Corbin Burnes",
    currentTeam: { id: 158 },
    primaryPosition: { code: "1" },
    primaryNumber: "155",
  },
  {
    id: 621114,
    fullName: "Ryan Burr",
    currentTeam: { id: 145 },
    primaryPosition: { code: "1" },
    primaryNumber: "156",
  },
  {
    id: 456713,
    fullName: "Matt Bush",
    currentTeam: { id: 158 },
    primaryPosition: { code: "1" },
    primaryNumber: "157",
  },
  {
    id: 676130,
    fullName: "Jose Butto",
    currentTeam: { id: 121 },
    primaryPosition: { code: "1" },
    primaryNumber: "158",
  },
  {
    id: 665795,
    fullName: "Edward Cabrera",
    currentTeam: { id: 146 },
    primaryPosition: { code: "1" },
    primaryNumber: "159",
  },
  {
    id: 650893,
    fullName: "Genesis Cabrera",
    currentTeam: { id: 138 },
    primaryPosition: { code: "1" },
    primaryNumber: "160",
  },
  {
    id: 666974,
    fullName: "Yennier Cano",
    currentTeam: { id: 110 },
    primaryPosition: { code: "1" },
    primaryNumber: "161",
  },
  {
    id: 656290,
    fullName: "Drew Carlton",
    currentTeam: { id: 116 },
    primaryPosition: { code: "1" },
    primaryNumber: "162",
  },
  {
    id: 471911,
    fullName: "Carlos Carrasco",
    currentTeam: { id: 121 },
    primaryPosition: { code: "1" },
    primaryNumber: "163",
  },
  {
    id: 672629,
    fullName: "Gerardo Carrillo",
    currentTeam: { id: 120 },
    primaryPosition: { code: "1" },
    primaryNumber: "164",
  },
  {
    id: 641447,
    fullName: "Daniel Castano",
    currentTeam: { id: 146 },
    primaryPosition: { code: "1" },
    primaryNumber: "165",
  },
  {
    id: 624418,
    fullName: "Ryan Castellani",
    currentTeam: { id: 133 },
    primaryPosition: { code: "1" },
    primaryNumber: "166",
  },
  {
    id: 528748,
    fullName: "Humberto Castellanos",
    currentTeam: { id: 109 },
    primaryPosition: { code: "1" },
    primaryNumber: "167",
  },
  {
    id: 650895,
    fullName: "Diego Castillo",
    currentTeam: { id: 136 },
    primaryPosition: { code: "1" },
    primaryNumber: "168",
  },
  {
    id: 620454,
    fullName: "Jose Castillo",
    currentTeam: { id: 135 },
    primaryPosition: { code: "1" },
    primaryNumber: "169",
  },
  {
    id: 622379,
    fullName: "Luis Castillo",
    currentTeam: { id: 116 },
    primaryPosition: { code: "1" },
    primaryNumber: "170",
  },
  {
    id: 622491,
    fullName: "Luis Castillo",
    currentTeam: { id: 136 },
    primaryPosition: { code: "1" },
    primaryNumber: "171",
  },
  {
    id: 666721,
    fullName: "Max Castillo",
    currentTeam: { id: 118 },
    primaryPosition: { code: "1" },
    primaryNumber: "172",
  },
  {
    id: 621593,
    fullName: "Anthony Castro",
    currentTeam: { id: 114 },
    primaryPosition: { code: "1" },
    primaryNumber: "173",
  },
  {
    id: 665645,
    fullName: "Kervin Castro",
    currentTeam: { id: 112 },
    primaryPosition: { code: "1" },
    primaryNumber: "174",
  },
  {
    id: 612434,
    fullName: "Miguel Castro",
    currentTeam: { id: 147 },
    primaryPosition: { code: "1" },
    primaryNumber: "175",
  },
];
