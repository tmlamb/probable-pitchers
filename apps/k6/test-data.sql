INSERT IGNORE INTO `User` (
  `id`,
  `email`,
  `emailVerified`,
  `image`
)
VALUES
  (
    'test_user_id',
    'test@probablepitcher.com',
    NULL,
    NULL
  );
INSERT IGNORE INTO
  `Account` (
    `id`,
    `userId`,
    `type`,
    `provider`,
    `providerAccountId`,
    `refresh_token`,
    `access_token`,
    `expires_at`,
    `token_type`,
    `scope`,
    `id_token`,
    `session_state`
  )
VALUES
  (
    'test_account_id',
    'test_user_id',
    'oauth',
    'google',
    '123456789101112131415',
    NULL,
    'test_access_token',
    1970188389,
    'Bearer',
    'openid',
    'test_id_token',
    NULL
  );
INSERT IGNORE INTO
  `Session` (`id`, `sessionToken`, `userId`, `expires`)
VALUES
  (
    'test_session_id',
    '4c2358f5-51e0-4be5-ae8e-312a6b9888e8',
    'test_user_id',
    '2049-03-14 10:12:11.256'
  );
