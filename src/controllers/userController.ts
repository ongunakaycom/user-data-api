import { Request, Response } from 'express';
import cacheService from '../services/cacheService';
import queueService from '../services/queueService';
import userService from '../services/userService';
import { User } from '../types/user';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const user = await cacheService.getOrSet(id, async () => {
      const fetchedUser = await queueService.addToQueue(id);
      if (!fetchedUser) {
        throw new Error('User not found');
      }
      return fetchedUser;
    });

    res.json(user);
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const newUser = await userService.create({ name, email });
    
    // Cache the new user
    cacheService.set(newUser.id, newUser);
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const updatedUser = await userService.update(id, { name, email });
    
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update cache
    cacheService.set(id, updatedUser);
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const deleted = await userService.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Remove from cache
    cacheService.delete(id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = (req: Request, res: Response): void => {
  const users = userService.getAllUsers();
  res.json(users);
};