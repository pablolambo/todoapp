import express from 'express';
import routes from 'routes/routes';

const app = express();

app.use(routes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ status: 'API is running on /api' });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});