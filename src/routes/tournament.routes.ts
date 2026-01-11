import { Router, Request, Response } from 'express';
import { tournamentService } from '../services/tournament.service';

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

export default router;
