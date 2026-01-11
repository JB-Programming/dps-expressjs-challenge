import db from './db.service';

export interface Game {
	id: number;
	tournament_id: number;
	player1_id: number;
	player2_id: number;
	player1_score: number;
	player2_score: number;
	created_at: string;
}

export interface CreateGameDto {
	tournament_id: number;
	player1_id: number;
	player2_id: number;
	player1_score: number;
	player2_score: number;
}

export class GameService {
	/**
	 * Erstellt ein neues Spiel und aktualisiert die Punkte
	 */
	create(dto: CreateGameDto): Game {
		const result = db.run(
			`INSERT INTO games (tournament_id, player1_id, player2_id, player1_score, player2_score) 
			VALUES (@tournament_id, @player1_id, @player2_id, @player1_score, @player2_score)`,
			{
				tournament_id: dto.tournament_id,
				player1_id: dto.player1_id,
				player2_id: dto.player2_id,
				player1_score: dto.player1_score,
				player2_score: dto.player2_score,
			},
		);

		return this.findById(result.lastInsertRowid as number)!;
	}

	/**
	 * Gibt ein Spiel anhand der ID zurück
	 */
	findById(id: number): Game | undefined {
		const games = db.query('SELECT * FROM games WHERE id = @id', {
			id,
		}) as Game[];

		return games.length > 0 ? games[0] : undefined;
	}

	/**
	 * Gibt alle Spiele eines Turniers zurück
	 */
	findByTournament(tournament_id: number): Game[] {
		return db.query(
			'SELECT * FROM games WHERE tournament_id = @tournament_id ORDER BY created_at DESC',
			{ tournament_id },
		) as Game[];
	}
}

export const gameService = new GameService();
