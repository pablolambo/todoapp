import { Router } from 'express';
import authController from 'routes/auth/auth.controller';
import tasksController from 'routes/tasks/tasks.controller';

const api = Router()
  .use(authController)
  .use(tasksController);

export default Router().use('/api', api);