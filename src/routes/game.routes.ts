import { Router, Request, Response } from 'express';
import { gameService } from '../services/game.service';
import { tournamentService } from '../services/tournament.service';
import { participantService } from '../services/participant.service';

const router = Router();

/**
 * POST /games
 * Erstellt ein neues Spiel und aktualisiert Punkte
 */
router.post('/', (req: Request, res: Response) => {
	try {
		const { tournament_id, player1_id, player2_id, player1_score, player2_score } = req.body;

		// Validierungen
		if (!tournament_id || typeof tournament_id !== 'number') {
			res.status(400).json({ error: 'Tournament ID is required and must be a number' });
			return;
		}

		if (!player1_id || typeof player1_id !== 'number') {
			res.status(400).json({ error: 'Player1 ID is required and must be a number' });
			return;
		}

		if (!player2_id || typeof player2_id !== 'number') {
			res.status(400).json({ error: 'Player2 ID is required and must be a number' });
			return;
		}

		if (player1_score === undefined || typeof player1_score !== 'number' || player1_score < 0) {
			res.status(400).json({ error: 'Player1 score is required and must be a non-negative number' });
			return;
		}

		if (player2_score === undefined || typeof player2_score !== 'number' || player2_score < 0) {
			res.status(400).json({ error: 'Player2 score is required and must be a non-negative number' });
			return;
		}

		// Turnier existiert?
		const tournament = tournamentService.findById(tournament_id);
		if (!tournament) {
			res.status(404).json({ error: 'Tournament not found' });
			return;
		}

		// Beide Spieler sind Teilnehmer des Turniers?
		if (!participantService.isPlayerInTournament(tournament_id, player1_id)) {
			res.status(400).json({ error: 'Player1 is not a participant of this tournament' });
			return;
		}

		if (!participantService.isPlayerInTournament(tournament_id, player2_id)) {
			res.status(400).json({ error: 'Player2 is not a participant of this tournament' });
			return;
		}

		// Spieler können nicht gegen sich selbst spielen
		if (player1_id === player2_id) {
			res.status(400).json({ error: 'Players must be different' });
			return;
		}

		const game = gameService.create({
			tournament_id,
			player1_id,
			player2_id,
			player1_score,
			player2_score,
		});

		res.status(201).json(game);
        console.log('Game created in tournament ' + tournament.name + ' between players ' + player1_id + ' and ' + player2_id + ' with scores ' + player1_score + ' and ' + player2_score);
	} catch (error) {
		if ((error as any).code === 'SQLITE_CONSTRAINT') {
			res.status(409).json({
				error: 'A game between these two players in this tournament already exists',
			});
		} else {
			console.error('Error creating game:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

export default router;
