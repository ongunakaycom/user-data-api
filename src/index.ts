import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import cacheRoutes from './routes/cacheRoutes';
import { limiter } from './services/rateLimiter';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(limiter);

app.use('/users', userRoutes);
app.use('/cache', cacheRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));