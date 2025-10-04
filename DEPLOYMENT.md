# Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying ZONE v.2 in various environments, from development to production.

## 📋 Prerequisites

### System Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB+ recommended
- **Storage**: 10GB+ available space
- **Network**: Stable internet connection

### Software Requirements
- **Node.js**: 16.0+ (for frontend)
- **Python**: 3.8+ (for backend)
- **MongoDB**: 4.4+ (for database)
- **Git**: For version control

### Optional Requirements
- **Docker**: For containerized deployment
- **Nginx**: For reverse proxy
- **SSL Certificate**: For HTTPS
- **Domain Name**: For production deployment

## 🏗️ Deployment Options

### 1. Local Development
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd frontend
npm install
npm start
```

### 2. Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### 3. Production Deployment
```bash
# Build for production
npm run build
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🐳 Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:16-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:4.4
    container_name: zone_mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    networks:
      - zone_network

  backend:
    build: ./backend
    container_name: zone_backend
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
    environment:
      - MONGO_URL=mongodb://admin:password@mongodb:27017
      - DB_NAME=zone_db
      - CORS_ORIGINS=http://localhost:3000,http://localhost:80
    networks:
      - zone_network

  frontend:
    build: ./frontend
    container_name: zone_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8000
    networks:
      - zone_network

volumes:
  mongodb_data:

networks:
  zone_network:
    driver: bridge
```

### Nginx Configuration
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🌐 Production Deployment

### 1. Server Setup

#### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt install python3.9 python3.9-venv python3.9-dev

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Nginx
sudo apt install nginx

# Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
```

#### CentOS/RHEL
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Install Python
sudo yum install python39 python39-devel

# Install MongoDB
sudo yum install -y mongodb-org

# Install Nginx
sudo yum install nginx
```

### 2. Application Deployment

#### Backend Deployment
```bash
# Create application directory
sudo mkdir -p /opt/zone
sudo chown $USER:$USER /opt/zone
cd /opt/zone

# Clone repository
git clone <repository-url> .

# Create virtual environment
python3.9 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Create systemd service
sudo tee /etc/systemd/system/zone-backend.service > /dev/null <<EOF
[Unit]
Description=ZONE v.2 Backend
After=network.target

[Service]
Type=simple
User=zone
WorkingDirectory=/opt/zone/backend
Environment=PATH=/opt/zone/venv/bin
ExecStart=/opt/zone/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable zone-backend
sudo systemctl start zone-backend
```

#### Frontend Deployment
```bash
# Install dependencies
cd frontend
npm install

# Build for production
npm run build

# Copy to web server
sudo cp -r build/* /var/www/html/

# Configure Nginx
sudo tee /etc/nginx/sites-available/zone > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/zone /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Database Setup

#### MongoDB Configuration
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use zone_db
db.createUser({
  user: "zone_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "zone_db" }]
})
```

#### Database Indexes
```javascript
// Create indexes for better performance
db.customers.createIndex({ "email": 1 })
db.products.createIndex({ "sku": 1 }, { unique: true })
db.sales_orders.createIndex({ "order_date": -1 })
db.users.createIndex({ "username": 1 }, { unique: true })
```

### 4. SSL Configuration

#### Let's Encrypt SSL
```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Application configuration
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
```bash
# Database
MONGO_URL=mongodb://zone_user:secure_password@localhost:27017
DB_NAME=zone_db

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# CORS
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=False

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_BACKEND_URL=https://your-domain.com/api
REACT_APP_API_TIMEOUT=30000

# Environment
REACT_APP_ENV=production
REACT_APP_VERSION=2.0.0

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
```

## 📊 Monitoring & Logging

### Application Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Log monitoring
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u zone-backend -f
```

### Database Monitoring
```bash
# MongoDB monitoring
mongo
db.runCommand({serverStatus: 1})
db.stats()
```

### Performance Monitoring
```bash
# System monitoring
htop
iotop
nethogs

# Application monitoring
curl -s http://localhost:8000/health
```

## 🔄 Backup & Recovery

### Database Backup
```bash
# Create backup script
sudo tee /opt/zone/backup.sh > /dev/null <<EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/zone/backups"
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db zone_db --out $BACKUP_DIR/mongodb_$DATE

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /opt/zone --exclude=venv --exclude=node_modules

# Clean old backups (keep 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

# Make executable
sudo chmod +x /opt/zone/backup.sh

# Add to crontab
sudo crontab -e
# Add: 0 2 * * * /opt/zone/backup.sh
```

### Recovery Process
```bash
# Restore database
mongorestore --db zone_db /path/to/backup/mongodb_YYYYMMDD_HHMMSS

# Restore application
tar -xzf /path/to/backup/app_YYYYMMDD_HHMMSS.tar.gz -C /
```

## 🚨 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Check service status
sudo systemctl status zone-backend

# Check logs
sudo journalctl -u zone-backend -f

# Restart service
sudo systemctl restart zone-backend
```

#### Frontend Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

#### Database Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Connect to database
mongo --host localhost --port 27017
```

### Performance Issues
```bash
# Check system resources
htop
free -h
df -h

# Check network
netstat -tulpn
ss -tulpn
```

## 🔐 Security Considerations

### Firewall Configuration
```bash
# Configure UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 8000
```

### User Management
```bash
# Create application user
sudo useradd -m -s /bin/bash zone
sudo usermod -aG sudo zone
```

### File Permissions
```bash
# Set proper permissions
sudo chown -R zone:zone /opt/zone
sudo chmod -R 755 /opt/zone
```

## 📈 Scaling

### Horizontal Scaling
- Load balancer configuration
- Multiple backend instances
- Database replication
- CDN integration

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching
- Code optimization

## 🎯 Best Practices

### Deployment Best Practices
1. **Use version control** for all configuration files
2. **Implement blue-green deployment** for zero downtime
3. **Use environment-specific configurations**
4. **Implement proper logging and monitoring**
5. **Regular security updates and patches**
6. **Automated backup and recovery procedures**
7. **Performance testing and optimization**
8. **Documentation and runbooks**

### Security Best Practices
1. **Use HTTPS everywhere**
2. **Implement proper authentication and authorization**
3. **Regular security audits**
4. **Keep dependencies updated**
5. **Implement proper logging and monitoring**
6. **Use secure configuration practices**
7. **Regular backup and recovery testing**

---

**ZONE v.2** - Production-Ready Business Management System
*Deployed with confidence*

---

*This deployment guide is regularly updated to reflect current best practices and new features.*







