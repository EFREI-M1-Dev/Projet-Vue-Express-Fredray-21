-- Création de la table "Users"
CREATE TABLE Users
(
    userId       INTEGER PRIMARY KEY AUTOINCREMENT,
    username     VARCHAR(255) UNIQUE,
    email        VARCHAR(255),
    password     VARCHAR(255),
    creationDate TIMESTAMP,
    avatarUrl    VARCHAR(255),
    bio          VARCHAR(190)
);

-- Création de la table "Servers"
CREATE TABLE Servers
(
    serverId     INTEGER PRIMARY KEY AUTOINCREMENT,
    owner        INT REFERENCES Users (userId),
    creationDate TIMESTAMP,
    serverName   VARCHAR(255),
    description  VARCHAR(255)
);

-- Création de la table "Channels"
CREATE TABLE Channels
(
    channelId    INTEGER PRIMARY KEY AUTOINCREMENT,
    name         VARCHAR(255),
    description  TEXT,
    creationDate TIMESTAMP,
    serverId     INT REFERENCES Servers (serverId)
);

-- Création de la table "Messages"
CREATE TABLE Messages
(
    messageId    INTEGER PRIMARY KEY AUTOINCREMENT,
    creationDate TIMESTAMP,
    owner        INT REFERENCES Users (userId),
    content      TEXT,
    serverId     INT REFERENCES Servers (serverId),
    channelId    INT REFERENCES Channels (channelId)
);

-- Création de la table "Memberships"
CREATE TABLE Memberships
(
    serverId    INT REFERENCES Servers (serverId),
    userId      INT REFERENCES Users (userId),
    joiningDate TIMESTAMP,
    PRIMARY KEY (serverId, userId)
);

-- Si possible :

-- Création de la table "Invitations"
-- CREATE TABLE Invitations (
--     invitationId INT PRIMARY KEY AUTOINCREMENT,
--     serverId INT REFERENCES Servers(serverId),
--     invitationCode VARCHAR(255),
--     creationDate TIMESTAMP
-- );

-- Création de la table "PrivateMessages"
-- CREATE TABLE PrivateMessages (
--     privateMessageId INT PRIMARY KEY AUTOINCREMENT,
--     userSender INT REFERENCES Users(userId),
--     userReceiver INT REFERENCES Users(userId),
--     creationDate TIMESTAMP
-- );

-- Création de la table "Reactions"
-- CREATE TABLE Reactions (
--     reactionId INT PRIMARY KEY AUTOINCREMENT,
--     messageId INT REFERENCES Messages(messageId),
--     userId INT REFERENCES Users(userId),
--     emoji VARCHAR(255)
-- );
