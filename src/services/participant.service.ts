import db from './db.service';

export interface TournamentParticipant {
	tournament_id: number;
	player_id: number;
}

export interface AddParticipantDto {
	player_id: number;
}

export class ParticipantService {
	/**
	 * Fügt einen Spieler zu einem Turnier hinzu
	 */
	addParticipant(tournament_id: number, player_id: number): TournamentParticipant {
		db.run(
			'INSERT INTO tournament_participants (tournament_id, player_id) VALUES (@tournament_id, @player_id)',
			{
				tournament_id,
				player_id,
			},
		);

		return { tournament_id, player_id };
	}

	/**
	 * Gibt die Anzahl der Teilnehmer eines Turniers zurück
	 */
	getParticipantCount(tournament_id: number): number {
		const result = db.query(
			'SELECT COUNT(*) as count FROM tournament_participants WHERE tournament_id = @tournament_id',
			{ tournament_id },
		) as [{ count: number }];

		return result[0]?.count || 0;
	}

	/**
	 * Gibt alle Teilnehmer eines Turniers zurück
	 */
	getParticipants(tournament_id: number): Array<{ id: number; name: string }> {
		return db.query(
			`SELECT p.id, p.name 
			FROM players p 
			INNER JOIN tournament_participants tp ON p.id = tp.player_id 
			WHERE tp.tournament_id = @tournament_id`,
			{ tournament_id },
		) as Array<{ id: number; name: string }>;
	}

	/**
	 * Prüft, ob ein Spieler bereits im Turnier ist
	 */
	isPlayerInTournament(tournament_id: number, player_id: number): boolean {
		const result = db.query(
			'SELECT 1 FROM tournament_participants WHERE tournament_id = @tournament_id AND player_id = @player_id',
			{ tournament_id, player_id },
		);

		return result.length > 0;
	}
}

export const participantService = new ParticipantService();
