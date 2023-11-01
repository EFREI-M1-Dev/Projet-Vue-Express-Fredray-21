import Database from 'better-sqlite3';

export const openConnection = () => {
    return new Database('expressChat.db');
}

