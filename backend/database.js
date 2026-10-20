const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
    path.join(__dirname, "emergency_messages.db")
);

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        level TEXT NOT NULL,
        analysis TEXT NOT NULL,
        acknowledged INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;