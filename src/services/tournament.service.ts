import db from './db.service';

export interface Tournament {
	id: number;
	name: string;
	status: 'planning' | 'started' | 'finished';
	created_at: string;
}

export interface CreateTournamentDto {
	name: string;
}

export class TournamentService {
	/**
	 * Erstellt ein neues Turnier
	 */
	create(dto: CreateTournamentDto): Tournament {
		const result = db.run(
			'INSERT INTO tournaments (name, status) VALUES (@name, @status)',
			{
				name: dto.name,
				status: 'planning',
			},
		);

		return this.findById(result.lastInsertRowid as number)!;
	}

	/**
	 * Gibt ein Turnier anhand der ID zurück
	 */
	findById(id: number): Tournament | undefined {
		const tournaments = db.query('SELECT * FROM tournaments WHERE id = @id', {
			id,
		}) as Tournament[];

		return tournaments.length > 0 ? tournaments[0] : undefined;
	}
}

export const tournamentService = new TournamentService();
