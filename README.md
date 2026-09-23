# Jeenash WA - WhatsApp Business Automation Platform

Production-grade, secure, multi-session WhatsApp Business Automation Platform with Baileys socket integration, real-time chat interface, intelligent keyword auto-reply engine, and enterprise SaaS administration.

---

## Architecture Overview

- **Backend**: Node.js 20+ LTS, Express, `@whiskeysockets/baileys` (v6.7+), Socket.io, Prisma ORM, Helmet, Express-Rate-Limit, Winston / Pino logging.
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Glassmorphic Modern SaaS UI.
- **Security**: JWT access + refresh tokens, bcrypt password hashing, session directory permissions enforcement (0700), Nginx reverse proxy with SSL & WebSocket upgrades, Fail2ban brute force prevention.
- **Deployment**: AWS EC2 (Ubuntu 22.04 LTS), PM2 process manager, Nginx, Let's Encrypt SSL.
- **Target Domain**: `https://wa.jeenashera.online`

---

## Ubuntu 22.04 LTS VPS Deployment Guide

### Step 1: System Update & Dependencies

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git build-essential nginx certbot python3-certbot-nginx fail2ban ufw

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
node -v # >= v20.x
npm -v  # >= 10.x

# Install PM2 globally
sudo npm install -g pm2
```

---

### Step 2: Firewall & Security Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw --force enable
sudo ufw status
```

---

### Step 3: Clone & Setup Project Files

```bash
# Create web root directory
sudo mkdir -p /var/www/jeenash-wa
sudo chown -R $USER:$USER /var/www/jeenash-wa

# Navigate to web root
cd /var/www/jeenash-wa

# Extract or git clone project into /var/www/jeenash-wa
# Install root/client dependencies and build Vite SPA
npm install
npm run build

# Install server dependencies
cd server
npm install
cd ..

# Create secure sessions & logs directories with 700 permissions
mkdir -p /var/www/jeenash-wa/sessions
mkdir -p /var/www/jeenash-wa/uploads
mkdir -p /var/www/jeenash-wa/logs
mkdir -p /var/log/pm2
chmod 700 /var/www/jeenash-wa/sessions
```

---

### Step 4: Configure Environment Variables

```bash
# Copy and edit server environment configuration
cp server/.env.example server/.env
nano server/.env
```

Ensure the following variables are set:
```env
NODE_ENV=production
PORT=3000
ADMIN_DASHBOARD_PASSWORD=@Jeenash123
JWT_SECRET=your_generated_64_character_random_hex_key
JWT_REFRESH_SECRET=your_generated_64_character_refresh_hex_key
DATABASE_URL="file:./dev.db"
CLIENT_URL=https://wa.jeenashera.online
SESSION_PATH=/var/www/jeenash-wa/sessions
UPLOAD_PATH=/var/www/jeenash-wa/uploads
```

Generate secure secrets using:
```bash
openssl rand -hex 32
```

Initialize Prisma database:
```bash
cd server
npx prisma generate
npx prisma db push
cd ..
```

---

### Step 5: Nginx Reverse Proxy Setup

```bash
# Copy Nginx site configuration
sudo cp nginx/whatsapp.conf /etc/nginx/sites-available/wa.jeenashera.online

# Enable the site
sudo ln -s /etc/nginx/sites-available/wa.jeenashera.online /etc/nginx/sites-enabled/

# Test Nginx syntax
sudo nginx -t

# Obtain Let's Encrypt SSL Certificate
sudo certbot --nginx -d wa.jeenashera.online

# Reload Nginx
sudo systemctl reload nginx
```

---

### Step 6: Fail2ban Setup

```bash
# Copy fail2ban configuration
sudo cp fail2ban/jail.local /etc/fail2ban/jail.local
sudo cp fail2ban/filter.d/whatsapp-auth.conf /etc/fail2ban/filter.d/whatsapp-auth.conf

# Restart and enable Fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
sudo fail2ban-client status
```

---

### Step 7: Launch via PM2 Daemon

```bash
cd /var/www/jeenash-wa

# Start server using ecosystem config
pm2 start ecosystem.config.js --env production

# Save PM2 state
pm2 save

# Setup PM2 auto-startup on reboot
pm2 startup systemd
# (Run the command displayed in the terminal)

# Check status and logs
pm2 status
pm2 logs jeenash-wa-backend
```

---

## Verifying the Deployment

1. Open your browser: `https://wa.jeenashera.online`
2. You will be greeted by the stunning glassmorphic login screen.
3. Authenticate with admin password: `@Jeenash123`
4. Connect WhatsApp sessions via **QR Code** or **Pairing Code**.
5. Import auto-reply rules from `rules.sample.json`.
6. Start managing customer conversations and automated responses in real-time!
