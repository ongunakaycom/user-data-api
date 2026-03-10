import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import cacheRoutes from './routes/cacheRoutes';
import rateLimiter from './services/rateLimiter';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express built-in body parsers (replace body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const icon = status >= 400 ? '❌' : '✅';
    console.log(`${icon} ${req.method} ${req.originalUrl} ${status} - ${duration}ms`);
  });
  
  next();
});

// Rate limiting middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  
  if (rateLimiter.isRateLimited(clientIp)) {
    const { remaining, burstRemaining } = rateLimiter.getRemainingRequests(clientIp);
    
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      remainingRequests: remaining,
      remainingBurst: burstRemaining,
      retryAfter: '60 seconds'
    });
    return;
  }
  
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API root
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'User Data API',
    version: '1.0.0',
    endpoints: {
      users: {
        getAll: 'GET /users',
        getById: 'GET /users/:id',
        create: 'POST /users',
        update: 'PUT /users/:id',
        delete: 'DELETE /users/:id'
      },
      cache: {
        clear: 'DELETE /cache',
        status: 'GET /cache/status'
      },
      system: {
        health: 'GET /health'
      }
    }
  });
});

// API routes
app.use('/users', userRoutes);
app.use('/cache', cacheRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  
  // Handle specific errors
  if (err.name === 'SyntaxError') {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }
  
  // Default error
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== SERVER START ====================

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ==================== GRACEFUL SHUTDOWN ====================

const gracefulShutdown = () => {
  console.log('\n📦 Shutting down server...');
  server.close(() => {
    console.log('📦 Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;