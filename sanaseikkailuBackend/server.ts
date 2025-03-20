import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import colRouter from './src/routes/colRouter';
import itRouter from './src/routes/itWordRouter';
import userRouter from './src/routes/userRouter';
import loginRouter from './src/routes/loginRouter';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const PORT: string = process.env.PORT ?? '3001';

app.use('/api/col', colRouter);
app.use('/api/it', itRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
