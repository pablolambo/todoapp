import { Router } from 'express';
import authController from './auth/auth.controller';
import tasksController from './tasks/tasks.controller';

const api = Router()
  .use(authController)
  .use(tasksController);

export default Router().use('/api', api);