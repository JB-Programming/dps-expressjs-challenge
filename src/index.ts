import express, { Express } from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './services/init-db.service';
import tournamentRoutes from './routes/tournament.routes';
import playerRoutes from './routes/player.routes';
import participantRoutes from './routes/participant.routes';

dotenv.config();

initializeDatabase();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		timestamp: new Date().toISOString(),
	});
});

// Routes
app.use('/tournaments', tournamentRoutes);
app.use('/players', playerRoutes);
app.use('/participants', participantRoutes);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
