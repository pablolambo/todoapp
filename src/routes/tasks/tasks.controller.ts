import { NextFunction, Request, Response, Router } from 'express';
import auth from 'routes/auth/auth';

const router = Router();

// /**
//  * Create a task
//  * @auth none
//  * @route {POST} /users
//  * @bodyparam user User
//  * @returns user User
//  */
// router.post('/tasks', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const task = await createTask({ ...req.body.task });
//     res.status(201).json({ task });
//   } catch (error) {
//     next(error);
//   }
// });


export default router;