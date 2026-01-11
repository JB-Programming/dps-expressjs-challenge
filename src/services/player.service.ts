import db from './db.service';

export interface Player {
	id: number;
	name: string;
	created_at: string;
}

export interface CreatePlayerDto {
	name: string;
}

export class PlayerService {
	/**
	 * Erstellt einen neuen Spieler
	 */
	create(dto: CreatePlayerDto): Player {
		const result = db.run(
			'INSERT INTO players (name) VALUES (@name)',
			{
				name: dto.name,
			},
		);

		return this.findById(result.lastInsertRowid as number)!;
	}

	/**
	 * Gibt einen Spieler anhand der ID zurück
	 */
	findById(id: number): Player | undefined {
		const players = db.query('SELECT * FROM players WHERE id = @id', {
			id,
		}) as Player[];

		return players.length > 0 ? players[0] : undefined;
	}
}

export const playerService = new PlayerService();
