import express, { NextFunction, Request, Response, Router } from 'express';
import auth from 'routes/auth/auth';
import { createUser, getCurrentUser, login, updateUser } from './auth.service';

const router = Router();

/**
 * Create an user
 * @auth none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser({ ...req.body.user, demo: false });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * Login
 * @auth none
 * @route {POST} /users/login
 * @bodyparam user User
 * @returns user User
 */
router.post('/users/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await login(req.body.user);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current user
 * @auth required
 * @route {GET} /user
 * @returns user User
 */
router.get('/user', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.auth?.user?.id;

    if (typeof userId !== 'number') {
      throw new Error('Invalid user id');
    }

    const user = await getCurrentUser(userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user
 * @auth required
 * @route {PUT} /user
 * @bodyparam user User
 * @returns user User
 */
router.put('/user', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.auth?.user?.id;

    if (typeof userId !== 'number') {
      throw new Error('Invalid user id');
    }

    const user = await updateUser(req.body.user, userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;