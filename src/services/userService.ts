import { User } from '../types/user';
import { getCache, setCache } from './cacheService';

const mockUsers: Record<number, User> = {
  1: { id: 1, name: "John Doe", email: "john@example.com" },
  2: { id: 2, name: "Jane Smith", email: "jane@example.com" },
  3: { id: 3, name: "Alice Johnson", email: "alice@example.com" }
};

// Track ongoing requests
const pendingRequests: Map<number, Promise<User>> = new Map();

export const fetchUserById = async (id: number): Promise<User> => {
  const cached = getCache(id.toString());
  if (cached) return cached;

  if (pendingRequests.has(id)) return pendingRequests.get(id)!;

  const promise = new Promise<User>((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers[id];
      if (user) {
        setCache(id.toString(), user);
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
      pendingRequests.delete(id);
    }, 200); // simulate DB delay
  });

  pendingRequests.set(id, promise);
  return promise;
};

export const createUser = (user: User) => {
  mockUsers[user.id] = user;
  setCache(user.id.toString(), user);
  return user;
};