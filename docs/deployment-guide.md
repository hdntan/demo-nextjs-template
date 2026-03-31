# Deployment Guide

This guide covers deploying the Next.js + Fastify fullstack application to various environments.

---

## Development Deployment

### Local Development

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start development servers (in separate terminals)

# Terminal 1: Fastify backend (http://localhost:8080)
cd server
npm run dev

# Terminal 2: Next.js frontend (http://localhost:3000)
cd client
npm run dev
```

### Environment Configuration

**Server** (`server/.env`):
```env
# Database
DATABASE_URL=file:./dev.db

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Server
NODE_ENV=development
PORT=8080

# CORS
ALLOWED_ORIGIN=http://localhost:3000
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:8080
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] TypeScript compilation without errors
- [ ] ESLint passing
- [ ] Code reviewed and approved
- [ ] Security audit completed
- [ ] Performance benchmarks acceptable
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Backup strategy in place
- [ ] Monitoring/alerting configured

### Build Process

#### Server Build

```bash
cd server

# Install dependencies
npm ci

# Run tests
npm test

# Type-check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Output: server/dist/
```

#### Client Build

```bash
cd client

# Install dependencies
npm ci

# Run tests
npm test

# Type-check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Output: client/.next/
```

### Build Artifacts

**Server**:
- `dist/` - Compiled JavaScript files
- `prisma/` - Database schema

**Client**:
- `.next/` - Next.js build output
- `public/` - Static assets

### Runtime Requirements

**Server**:
- Node.js 18+ (tested on 18.17.0, 20.x)
- SQLite database file (writable directory)
- JWT_SECRET environment variable

**Client**:
- Served by Node.js via `npm start`
- Or deployable to static CDN with `npm run export`

---

## Deployment Options

### Option 1: Traditional VPS (Recommended for Learning)

#### Prerequisites
- VPS (AWS EC2, DigitalOcean, Linode, etc.)
- Ubuntu 22.04 LTS
- Domain name with DNS configured

#### Step-by-Step

**1. Initial Server Setup**

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs git nginx

# Create application user
useradd -m -s /bin/bash appuser
```

**2. Application Setup**

```bash
# Clone repository
sudo -u appuser git clone https://github.com/your-username/demo-nextjs-template.git /home/appuser/app
cd /home/appuser/app

# Install server dependencies
cd server
npm ci

# Install client dependencies
cd ../client
npm ci

# Build both
cd ../server && npm run build
cd ../client && npm run build
```

**3. Environment Configuration**

```bash
# Create server environment file
cat > /home/appuser/app/server/.env << 'EOF'
DATABASE_URL=file:/home/appuser/app/server/prod.db
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
PORT=3001
ALLOWED_ORIGIN=https://your-domain.com
EOF

# Create client environment
cat > /home/appuser/app/client/.env.local << 'EOF'
NEXT_PUBLIC_API_ENDPOINT=https://api.your-domain.com
EOF

# Set proper permissions
chmod 600 /home/appuser/app/server/.env
chown appuser:appuser /home/appuser/app/server/.env
```

**4. PM2 Process Management**

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem config
cat > /home/appuser/app/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'fastify-backend',
      script: '/home/appuser/app/server/dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/pm2/error.log',
      out_file: '/var/log/pm2/out.log',
    },
    {
      name: 'nextjs-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/appuser/app/client',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/pm2/error.log',
      out_file: '/var/log/pm2/out.log',
    },
  ],
};
EOF

# Start applications
sudo -u appuser pm2 start ecosystem.config.js

# Setup PM2 auto-restart on reboot
pm2 startup
pm2 save
```

**5. Nginx Reverse Proxy**

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/your-domain.com << 'EOF'
upstream fastify_backend {
  server localhost:3001;
}

upstream nextjs_frontend {
  server localhost:3000;
}

server {
  listen 80;
  server_name api.your-domain.com;

  location / {
    proxy_pass http://fastify_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://nextjs_frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /api {
    proxy_pass http://fastify_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**6. SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d your-domain.com -d api.your-domain.com

# Auto-renewal
systemctl enable certbot.timer
```

### Option 2: Docker Containerization

#### Dockerfile (Server)

```dockerfile
# server/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY dist ./dist/

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/test', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/index.js"]
```

#### Dockerfile (Client)

```dockerfile
# client/Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: file:/app/data/prod.db
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      PORT: 8080
      ALLOWED_ORIGIN: https://your-domain.com
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/test"]
      interval: 30s
      timeout: 3s
      retries: 3

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_ENDPOINT: http://server:8080
    ports:
      - "3000:3000"
    depends_on:
      - server
```

**Deploy with Docker**:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 3: Heroku Deployment

#### Procfile

```
web: npm start --prefix client
api: npm start --prefix server
```

#### Deploy Steps

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 4: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel)**:
1. Push code to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_ENDPOINT` environment variable
4. Deploy

**Backend (Railway)**:
1. Sign up at railway.app
2. Connect GitHub repo
3. Configure environment variables
4. Deploy

---

## Database Management

### Initialize Database

```bash
# Generate Prisma schema (if needed)
npx prisma generate

# Create database schema
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

### Backup & Recovery

**Backup SQLite**:
```bash
# Simple file copy
cp server/prod.db server/prod.db.backup.$(date +%Y%m%d_%H%M%S)

# Automated daily backup
0 2 * * * cp /home/appuser/app/server/prod.db /backup/prod.db.$(date +\%Y\%m\%d)
```

**Restore from Backup**:
```bash
# Stop application
pm2 stop all

# Restore database
cp server/prod.db.backup.20240101_000000 server/prod.db

# Restart application
pm2 start all
```

### Production Database Migration

To upgrade from SQLite to PostgreSQL:

```bash
# 1. Update DATABASE_URL in .env
# DATABASE_URL=postgresql://user:password@host:5432/dbname

# 2. Push schema to new database
npx prisma db push

# 3. Migrate data (if using migration scripts)
# Custom script to transfer data from SQLite to PostgreSQL

# 4. Update connection string in production
# Restart application
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Save logs
pm2 save
pm2 startup

# View logs
pm2 logs
pm2 logs fastify-backend
pm2 logs nextjs-frontend
```

### Application Logging

```bash
# Enable debug logging
export DEBUG=*
npm start

# Write to file
npm start >> /var/log/app.log 2>&1
```

### Health Checks

Add to monitoring tools:
- Server health: `GET http://your-domain.com:8080/test`
- Client health: `GET http://your-domain.com/`

---

## Performance Optimization

### Server Optimization
- Enable compression (Nginx gzip)
- Configure connection pooling
- Set appropriate timeouts
- Monitor CPU & memory usage

### Client Optimization
- Enable caching headers
- Minimize bundle size
- Use CDN for static assets
- Enable gzip compression

### Database Optimization
- Add indexes on frequently queried columns
- Archive old data
- Regular maintenance tasks
- Monitor query performance

---

## Troubleshooting

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs

# Verify environment variables
printenv | grep -E "DATABASE_URL|JWT_SECRET"

# Check Node.js version
node --version

# Verify port availability
lsof -i :8080
lsof -i :3000
```

### Database Connection Error
```bash
# Verify database file exists
ls -la server/prod.db

# Check file permissions
chmod 664 server/prod.db

# Verify DATABASE_URL format
cat server/.env | grep DATABASE_URL
```

### Memory Leak
```bash
# Monitor memory usage
pm2 monit

# Restart application periodically
pm2 restart all --cron "0 3 * * *"
```

---

## Rollback Strategy

### Quick Rollback

```bash
# Keep previous version ready
git checkout <previous-commit>
npm run build
pm2 restart all
```

### Database Rollback

```bash
# If database schema changed, rollback:
cp server/prod.db.backup server/prod.db
npm run seed  # If needed
```

---

## Deployment Checklist

Before going to production:

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Environment variables set
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] Monitoring enabled
- [ ] Logging configured
- [ ] Health checks working
- [ ] Rollback plan documented
- [ ] Team trained on deployment

---

## Maintenance Schedule

### Daily
- Monitor application logs
- Check error rates
- Verify uptime

### Weekly
- Review performance metrics
- Check security updates
- Backup database

### Monthly
- Full security audit
- Performance review
- Dependency updates
- Disaster recovery drill

### Quarterly
- Major version upgrades
- Database maintenance
- Capacity planning
- Architecture review
