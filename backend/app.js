import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import urlRoutes from './routes/urlRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', urlRoutes);

export default app;
