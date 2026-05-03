import type { Request, Response } from 'express';
import * as adminUserService from '../../services/admin/user.service';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit, page } = req.query;

    if (id) {
      const user = await adminUserService.getUserById(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } else {
      const users = await adminUserService.getAllUsers({
        limit: Number(limit || 10),
        page: Number(page || 1),
      });
      res.status(200).json(users);
    }
  } catch (error) {
    console.log(error, 'masuk error');
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, Email, and Password is required' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }

    if (password.length > 30) {
      return res
        .status(400)
        .json({ message: 'Maximum password length is 30 characters' });
    }

    const user = await adminUserService.createUser(name, email, password);

    res.status(201).json({
      message: 'User successfully created',
      data: user,
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, isActive } = req.body;

    const updatedUser = await adminUserService.updateUser(Number(id), {
      name,
      email,
      password,
      isActive,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User successfully updated',
      data: updatedUser,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await adminUserService.deleteUser(Number(id));

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User successfully deleted',
      data: deletedUser,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage });
  }
};
