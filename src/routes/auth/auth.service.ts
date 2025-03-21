import { RegisterInput } from 'models/user/register-input.model';
import { RegisteredUser } from 'models/user/register-user.model';
import { User } from 'models/user/user.model';
import generateToken from 'utils/token.utils';
import HttpException from 'models/exception/http-exception.model';
import * as bcrypt from 'bcryptjs';
import prisma from 'db/prisma/prisma-client';

const checkUserUniqueness = async (email: string, username: string) => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  const existingUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (existingUserByEmail || existingUserByUsername) {
    throw new HttpException(422, {
      errors: {
        ...(existingUserByEmail ? { email: ['has already been taken'] } : {}),
        ...(existingUserByUsername ? { username: ['has already been taken'] } : {}),
      },
    });
  }
};

export const createUser = async (input: RegisterInput): Promise<RegisteredUser> => {
  const email = input.email?.trim();
  const username = input.username?.trim();
  const password = input.password?.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkUserUniqueness(email, username);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return {
    ...user,
    token: generateToken(user.id),
  };
};

export const login = async (userPayload: any) => {
  const email = userPayload.email?.trim();
  const password = userPayload.password?.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return {
        email: user.email,
        username: user.username,
        token: generateToken(user.id),
      };
    }
  }

  throw new HttpException(403, {
    errors: {
      'email or password': ['is invalid'],
    },
  });
};

export const getCurrentUser = async (id: number) => {
  const user = (await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  })) as User;

  return {
    ...user,
    token: generateToken(user.id),
  };
};

export const updateUser = async (userPayload: any, id: number) => {
  const { email, username, password } = userPayload;
  let hashedPassword;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...(email ? { email } : {}),
      ...(username ? { username } : {}),
      ...(password ? { password: hashedPassword } : {}),
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return {
    ...user,
    token: generateToken(user.id),
  };
};