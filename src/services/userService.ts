import { User } from '../types/user';

// Mock user data
const mockUsers: Map<number, User> = new Map([
  [1, { id: 1, name: "John Doe", email: "john@example.com" }],
  [2, { id: 2, name: "Jane Smith", email: "jane@example.com" }],
  [3, { id: 3, name: "Alice Johnson", email: "alice@example.com" }]
]);

class UserService {
  private nextId: number = 4;

  async findById(id: number): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = mockUsers.get(id);
    return user || null;
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newUser: User = {
      id: this.nextId++,
      ...userData
    };
    
    mockUsers.set(newUser.id, newUser);
    return newUser;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const existingUser = mockUsers.get(id);
    if (!existingUser) return null;

    const updatedUser = { ...existingUser, ...userData };
    mockUsers.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: number): Promise<boolean> {
    return mockUsers.delete(id);
  }

  getAllUsers(): User[] {
    return Array.from(mockUsers.values());
  }
}

export default new UserService();