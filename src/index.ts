import { config } from 'dotenv'
import { resolve } from 'path'
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Bot Kenya-sensei sudah online!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

config({ path: resolve(__dirname, '..', '.env') })

import './client'