# 📊 User Data API - High-Performance User Management System

A robust, scalable REST API built with TypeScript and Express for managing user data with advanced caching, rate limiting, and queue processing capabilities. This API demonstrates enterprise-grade backend architecture patterns and best practices.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🚀 **High Performance** | Redis caching layer for optimized data retrieval |
| 🔒 **Rate Limiting** | Advanced request throttling to prevent abuse |
| 📦 **Queue Processing** | Async job processing with Bull/Redis |
| 🛡️ **Type Safety** | Full TypeScript implementation |
| 📊 **Scalable Architecture** | Modular design with separation of concerns |

---

## 🏗️ Architecture

```
user-data-api/
├── src/
│   ├── controllers/     # Request handlers & business logic
│   │   ├── cacheController.ts
│   │   └── userController.ts
│   ├── routes/          # API route definitions
│   │   ├── cacheRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/        # Core business logic & external services
│   │   ├── cacheService.ts    # Redis caching operations
│   │   ├── queueService.ts    # Bull queue management
│   │   ├── rateLimiter.ts     # Request throttling
│   │   └── userService.ts     # User data operations
│   ├── types/           # TypeScript type definitions
│   │   └── user.ts
│   └── index.ts         # Application entry point
```

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Cache**: Redis
- **Queue**: Bull (Redis-based)
- **Package Manager**: pnpm
- **Build Tool**: TypeScript Compiler (tsc)

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- Redis server (v6 or higher)
- pnpm (v8 or higher)

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/ongunakaycom/user-data-api.git
cd user-data-api

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Configuration

Create a `.env` file:

```env
PORT=3000
REDIS_URL=redis://localhost:6379
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

### Running the Application

```bash
# Development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Production mode
pnpm start
```

---

## 📡 API Endpoints

### User Routes
| Method | Endpoint | Description | Rate Limited |
|--------|----------|-------------|--------------|
| GET | `/api/users/:id` | Get user by ID | Yes |
| POST | `/api/users` | Create new user | Yes |
| PUT | `/api/users/:id` | Update user | Yes |
| DELETE | `/api/users/:id` | Delete user | Yes |

### Cache Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cache/stats` | Get cache statistics |
| DELETE | `/api/cache/clear` | Clear entire cache |
| DELETE | `/api/cache/:key` | Clear specific cache key |

---

## 💡 Core Services

### Cache Service
- Redis-based caching layer
- Automatic cache invalidation
- Configurable TTL
- Cache statistics monitoring

### Queue Service
- Background job processing
- Retry mechanisms
- Job status tracking
- Error handling

### Rate Limiter
- Sliding window algorithm
- Per-endpoint limits
- Distributed rate limiting
- Customizable windows

---

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e
```

---

## 📈 Performance Optimizations

- **Connection Pooling**: Efficient Redis connection management
- **Compression**: Response compression enabled
- **Caching Strategy**: Multi-level caching with stale-while-revalidate
- **Batch Processing**: Bulk operations support
- **Pagination**: Cursor-based pagination for large datasets

---

## 🔐 Security Features

- Rate limiting per IP
- Request validation
- CORS configuration
- Helmet.js security headers
- Input sanitization
- SQL injection prevention

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Support

**Ongun Akay** - Senior Full-Stack Developer

- 🌐 **Website**: [ongunakay.com](https://ongunakay.com)
- 💼 **LinkedIn**: [linkedin.com/in/ongunakay](https://linkedin.com/in/ongunakay)
- 🧑‍💻 **GitHub**: [github.com/ongunakaycom](https://github.com/ongunakaycom)
- 📧 **Email**: [info@ongunakay.com](mailto:info@ongunakay.com)

---

## 🙏 Acknowledgments

- Inspired by enterprise API design patterns
- Thanks to the open-source community for amazing tools