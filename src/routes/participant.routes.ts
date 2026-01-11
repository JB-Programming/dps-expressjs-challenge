import { Router, Request, Response } from 'express';
import { participantService } from '../services/participant.service';
import { tournamentService } from '../services/tournament.service';
import { playerService } from '../services/player.service';

const router = Router();

/**
 * POST /participants
 * Fügt einen Spieler zu einem Turnier hinzu
 */
router.post('/', (req: Request, res: Response) => {
	try {
		const { tournament_id, player_id } = req.body;

		// Validierungen
		if (!tournament_id || typeof tournament_id !== 'number') {
			res.status(400).json({ error: 'Tournament ID is required and must be a number' });
			return;
		}

		if (!player_id || typeof player_id !== 'number') {
			res.status(400).json({ error: 'Player ID is required and must be a number' });
			return;
		}

		// Turnier existiert?
		const tournament = tournamentService.findById(tournament_id);
		if (!tournament) {
			res.status(404).json({ error: 'Tournament not found' });
			return;
		}

		// Spieler existiert?
		const player = playerService.findById(player_id);
		if (!player) {
			res.status(404).json({ error: 'Player not found' });
			return;
		}

		// Spieler bereits im Turnier?
		if (participantService.isPlayerInTournament(tournament_id, player_id)) {
			res.status(409).json({ error: 'Player is already in this tournament' });
			return;
		}

		// Max 5 Teilnehmer pro Turnier?
		const participantCount = participantService.getParticipantCount(tournament_id);
		if (participantCount >= 5) {
			res.status(400).json({ error: 'Tournament has reached maximum of 5 participants' });
			return;
		}

		const participant = participantService.addParticipant(tournament_id, player_id);
        console.log('Participant ' + player.name + ' added to tournament ' + tournament.name);
		res.status(201).json(participant);
	} catch (error) {
		console.error('Error adding participant:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
