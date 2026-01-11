import sqlite from 'better-sqlite3';
import path from 'path';
import { initializeDatabase } from '../services/init-db.service';

const dbPath = path.resolve('./db/db.sqlite3');

console.log('[reset-db]: Resetting database...');

// Datenbank öffnen
const db = new sqlite(dbPath, { fileMustExist: true });

// Alle Tabellen löschen
console.log('[reset-db]: Dropping all tables...');
db.exec('DROP TABLE IF EXISTS tournament_participants');
db.exec('DROP TABLE IF EXISTS games');
db.exec('DROP TABLE IF EXISTS players');
db.exec('DROP TABLE IF EXISTS tournaments');

db.close();

// Neu initialisieren
console.log('[reset-db]: Recreating tables...');
initializeDatabase();

console.log('[reset-db]: Database reset completed successfully!');
