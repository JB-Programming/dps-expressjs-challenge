import db from './db.service';

export function initializeDatabase() {
	// Tournaments table
	db.run(`
		CREATE TABLE IF NOT EXISTS tournaments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			status TEXT NOT NULL DEFAULT 'planning' CHECK(status IN ('planning', 'started', 'finished')),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Players table
	db.run(`
		CREATE TABLE IF NOT EXISTS players (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Games table
	db.run(`
		CREATE TABLE IF NOT EXISTS games (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			tournament_id INTEGER NOT NULL,
			player1_id INTEGER NOT NULL,
			player2_id INTEGER NOT NULL,
			player1_score INTEGER NOT NULL,
			player2_score INTEGER NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
			FOREIGN KEY (player1_id) REFERENCES players(id) ON DELETE CASCADE,
			FOREIGN KEY (player2_id) REFERENCES players(id) ON DELETE CASCADE,
			CHECK (player1_id != player2_id),
			UNIQUE(tournament_id, player1_id, player2_id)
		)
	`);

	// Tournament participants table
	db.run(`
		CREATE TABLE IF NOT EXISTS tournament_participants (
			tournament_id INTEGER NOT NULL,
			player_id INTEGER NOT NULL,
			PRIMARY KEY (tournament_id, player_id),
			FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
			FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
		)
	`);

	console.log('[database]: Database schema initialized successfully');
}
