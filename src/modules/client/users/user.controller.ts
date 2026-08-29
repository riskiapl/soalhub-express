import type { Request, Response } from 'express';
import { catchErrorResponse } from '@/utils/response-handler';
import * as userService from './user.service';

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await userService.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    catchErrorResponse(error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.userId !== Number(id)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only update your own profile' });
    }

    const { name, email, password } = req.body;

    const updatedUser = await userService.updateUser(Number(id), {
      name,
      email,
      password,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User successfully updated',
      data: updatedUser,
    });
  } catch (error) {
    catchErrorResponse(error, res);
  }
};
