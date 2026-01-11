import { Router, Request, Response } from 'express';
import { playerService } from '../services/player.service';

const router = Router();

/**
 * POST /players
 * Erstellt einen neuen Spieler
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

		const player = playerService.create({ name: name.trim() });
		res.status(201).json(player);
	} catch (error) {
		if ((error as any).code === 'SQLITE_CONSTRAINT') {
			res.status(409).json({ error: 'Player with this name already exists' });
		} else {
			console.error('Error creating player:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

export default router;
