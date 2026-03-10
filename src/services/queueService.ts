import { User } from '../types/user';
import userService from './userService';

type QueueTask = {
  id: number;
  resolve: (value: User | null) => void;
  reject: (reason?: any) => void;
};

class QueueService {
  private queue: QueueTask[] = [];
  private isProcessing: boolean = false;

  async addToQueue(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          const user = await userService.findById(task.id);
          task.resolve(user);
        } catch (error) {
          task.reject(error);
        }
      }
    }

    this.isProcessing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export default new QueueService();