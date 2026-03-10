import { Request, Response } from 'express';
import { fetchUserById, createUser } from '../services/userService';

export const getUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const user = await fetchUserById(id);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const addUser = (req: Request, res: Response) => {
  const { id, name, email } = req.body;
  if (!id || !name || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const user = createUser({ id, name, email });
  res.status(201).json(user);
};