# Database Schema

## Table "Users"
- `userId`
- `username` (unique)
- `email`
- `password`
- `creationDate`
- `avatarUrl`
- `bio`

## Table "Servers"
- `serverId`
- `owner` (references `userId`)
- `creationDate`

## Table "Channels"
- `channelId`
- `name`
- `description`
- `creationDate`
- `serverId` (references `serverId`)

## Table "Messages"
- `messageId`
- `creationDate`
- `owner` (references `userId`)
- `content`
- `serverId` (references `serverId`)
- `channelId` (references `channelId`)

## Table "Memberships"
- `serverId` (references `serverId`)
- `userId` (references `userId`)
- `joiningDate`

<hr>

# Si possible :

## Table "Invitations"
- `invitationId`
- `serverId` (references `serverId`)
- `invitationCode`
- `creationDate`

## Table "PrivateMessages"
- `privateMessageId`
- `userSender` (references `userId`)
- `userReceiver` (references `userId`)
- `creationDate`

## Table "Reactions"
- `reactionId`
- `messageId` (references `messageId`)
- `userId` (references `userId`)
- `emoji`
