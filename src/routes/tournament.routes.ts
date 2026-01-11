import { Router, Request, Response } from 'express';
import { tournamentService } from '../services/tournament.service';
import { tournamentStatusService } from '../services/tournament-status.service';

const router = Router();

/**
 * POST /tournaments
 * Erstellt ein neues Turnier
 */
router.post('/', (req: Request, res: Response) => {
	try {
		const { name } = req.body;

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			res.status(400).json({
				error: 'Name is required and must be a non-empty string',
			});
			return;
		}

		const tournament = tournamentService.create({ name: name.trim() });
		res.status(201).json(tournament);
	} catch (error) {
		console.error('Error creating tournament:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

/**
 * GET /tournaments/:id/status
 * Spezial-Endpoint: Gibt Status und Leaderboard eines Turniers zurück
 */
router.get('/:id/status', (req: Request, res: Response) => {
	try {
		const tournament_id = parseInt(req.params.id, 10);

		if (isNaN(tournament_id)) {
			res.status(400).json({ error: 'Invalid tournament ID' });
			return;
		}

		const status = tournamentStatusService.getTournamentStatus(tournament_id);

		if (!status) {
			res.status(404).json({ error: 'Tournament not found' });
			return;
		}

		res.status(200).json(status);
	} catch (error) {
		console.error('Error fetching tournament status:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
