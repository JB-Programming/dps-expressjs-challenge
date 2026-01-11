import db from './db.service';
import { participantService } from './participant.service';
import { gameService } from './game.service';

export interface LeaderboardEntry {
	player_id: number;
	player_name: string;
	points: number;
	games_played: number;
	wins: number;
	draws: number;
	losses: number;
}

export interface TournamentStatus {
	tournament_id: number;
	tournament_name: string;
	status: 'planning' | 'started' | 'finished';
	leaderboard: LeaderboardEntry[];
}

export class TournamentStatusService {
	/**
	 * Berechnet die Punkte für einen Spieler in einem Turnier
	 * Win = 2 Punkte, Draw = 1 Punkt, Loss = 0 Punkte
	 */
	calculatePlayerPoints(tournament_id: number, player_id: number): {
		points: number;
		games_played: number;
		wins: number;
		draws: number;
		losses: number;
	} {
		const games = db.query(
			`SELECT * FROM games 
			WHERE tournament_id = @tournament_id 
			AND (player1_id = @player_id OR player2_id = @player_id)`,
			{ tournament_id, player_id },
		) as Array<{
			player1_id: number;
			player2_id: number;
			player1_score: number;
			player2_score: number;
		}>;

		let points = 0;
		let wins = 0;
		let draws = 0;
		let losses = 0;

		for (const game of games) {
			const isPlayer1 = game.player1_id === player_id;
			const playerScore = isPlayer1 ? game.player1_score : game.player2_score;
			const opponentScore = isPlayer1 ? game.player2_score : game.player1_score;

			if (playerScore > opponentScore) {
				points += 2; // Win
				wins++;
			} else if (playerScore === opponentScore) {
				points += 1; // Draw
				draws++;
			} else {
				// Loss = 0 points
				losses++;
			}
		}

		return {
			points,
			games_played: games.length,
			wins,
			draws,
			losses,
		};
	}

	/**
	 * Ermittelt den Status eines Turniers
	 * planning: keine Spiele gespielt
	 * started: mindestens ein Spiel, aber nicht alle
	 * finished: jeder gegen jeden gespielt
	 */
	determineTournamentStatus(tournament_id: number): 'planning' | 'started' | 'finished' {
		const participants = participantService.getParticipants(tournament_id);
		const participantCount = participants.length;

		if (participantCount < 2) {
			return 'planning';
		}

		const games = gameService.findByTournament(tournament_id);
		const gamesPlayed = games.length;

		// Anzahl der möglichen Spiele: n * (n - 1) / 2
		// Jeder spielt gegen jeden genau einmal
		const totalPossibleGames = (participantCount * (participantCount - 1)) / 2;

		if (gamesPlayed === 0) {
			return 'planning';
		} else if (gamesPlayed >= totalPossibleGames) {
			return 'finished';
		} else {
			return 'started';
		}
	}

	/**
	 * Gibt den vollständigen Status + Leaderboard eines Turniers zurück
	 */
	getTournamentStatus(tournament_id: number): TournamentStatus | null {
		// Turnier existiert?
		const tournaments = db.query('SELECT * FROM tournaments WHERE id = @id', {
			id: tournament_id,
		}) as Array<{ id: number; name: string }>;

		if (tournaments.length === 0) {
			return null;
		}

		const tournament = tournaments[0];
		const participants = participantService.getParticipants(tournament_id);

		// Leaderboard erstellen
		const leaderboard: LeaderboardEntry[] = participants.map((participant) => {
			const stats = this.calculatePlayerPoints(tournament_id, participant.id);

			return {
				player_id: participant.id,
				player_name: participant.name,
				points: stats.points,
				games_played: stats.games_played,
				wins: stats.wins,
				draws: stats.draws,
				losses: stats.losses,
			};
		});

		// Nach Punkten sortieren (absteigend)
		leaderboard.sort((a, b) => b.points - a.points);

		const status = this.determineTournamentStatus(tournament_id);

		return {
			tournament_id: tournament.id,
			tournament_name: tournament.name,
			status,
			leaderboard,
		};
	}
}

export const tournamentStatusService = new TournamentStatusService();
