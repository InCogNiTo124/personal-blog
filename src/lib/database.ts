import sqlite from 'better-sqlite3';

const db = new sqlite('./posts.sqlite');

export default db;
