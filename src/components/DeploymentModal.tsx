import React, { useState } from 'react';
import {
  Layers,
  Copy,
  Check,
  Terminal,
  Server,
  FileCode,
  Shield,
  Download,
  X
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'nginx' | 'pm2' | 'fail2ban' | 'prisma' | 'env'>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const configs = {
    quickstart: `# 🚀 Quickstart Deployment on AWS EC2 Ubuntu 22.04 LTS
# Target: wa.jeenashera.online

# 1. Update system & install Node 20 + Nginx + PM2 + Certbot
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx certbot python3-certbot-nginx fail2ban ufw
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 2. Setup project folder & secure session permissions
sudo mkdir -p /var/www/jeenash-wa
sudo chown -R $USER:$USER /var/www/jeenash-wa
cd /var/www/jeenash-wa

# 3. Build & Install
npm install && npm run build
cd server && npm install && npx prisma db push && cd ..
mkdir -p sessions logs uploads
chmod 700 sessions

# 4. Configure Nginx Reverse Proxy
sudo cp nginx/whatsapp.conf /etc/nginx/sites-available/wa.jeenashera.online
sudo ln -s /etc/nginx/sites-available/wa.jeenashera.online /etc/nginx/sites-enabled/
sudo certbot --nginx -d wa.jeenashera.online
sudo systemctl reload nginx

# 5. Start 24x7 Daemon with PM2
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup`,

    nginx: `# /etc/nginx/sites-available/wa.jeenashera.online
server {
    listen 80;
    listen [::]:80;
    server_name wa.jeenashera.online;
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name wa.jeenashera.online;

    ssl_certificate /etc/letsencrypt/live/wa.jeenashera.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wa.jeenashera.online/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    client_max_body_size 50M;

    root /var/www/jeenash-wa/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400s;
    }

    location /sessions {
        deny all;
        return 404;
    }
}`,

    pm2: `// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'jeenash-wa-backend',
      script: 'server/src/index.js',
      cwd: '/var/www/jeenash-wa',
      instances: 1, // Single instance required to preserve Baileys socket state
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        SESSION_PATH: '/var/www/jeenash-wa/sessions',
        UPLOAD_PATH: '/var/www/jeenash-wa/uploads'
      },
      error_file: '/var/log/pm2/jeenash-wa-error.log',
      out_file: '/var/log/pm2/jeenash-wa-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};`,

    fail2ban: `# /etc/fail2ban/jail.local
[whatsapp-auth]
enabled  = true
port     = http,https
filter   = whatsapp-auth
logpath  = /var/log/pm2/jeenash-wa-out.log
maxretry = 5
findtime = 900
bantime  = 86400

# /etc/fail2ban/filter.d/whatsapp-auth.conf
[Definition]
failregex = ^.*Failed login attempt detected from client IP.*<HOST>.*$
            ^.*Login error: Invalid credentials from <HOST>.*$
ignoreregex =`,

    prisma: `// server/src/prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Session {
  id           String    @id
  phoneNumber  String?
  name         String
  status       String    @default("connecting")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Rule {
  id           String    @id @default(uuid())
  name         String
  keywords     String    // JSON array
  matchType    String    @default("contains")
  replyContent String
  delaySeconds Int       @default(2)
  priority     Int       @default(50)
  enabled      Boolean   @default(true)
}`,

    env: `# server/.env.example
NODE_ENV=production
PORT=3000
ADMIN_DASHBOARD_PASSWORD=@Jeenash123
JWT_SECRET=super_secret_jwt_random_key_64_bytes_hex
JWT_REFRESH_SECRET=super_secret_refresh_random_key_64_bytes_hex
DATABASE_URL="file:./dev.db"
CLIENT_URL=https://wa.jeenashera.online
SESSION_PATH=/var/www/jeenash-wa/sessions
UPLOAD_PATH=/var/www/jeenash-wa/uploads`
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl glass-panel flex flex-col shadow-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Production Deployment Files</h3>
              <p className="text-xs text-slate-400">
                Pre-configured scripts for Ubuntu VPS, Nginx, PM2, Prisma &amp; Fail2ban
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto shrink-0 text-xs">
          {[
            { id: 'quickstart', label: 'VPS Quickstart', icon: Terminal },
            { id: 'nginx', label: 'Nginx SSL Conf', icon: Server },
            { id: 'pm2', label: 'PM2 Ecosystem', icon: Layers },
            { id: 'fail2ban', label: 'Fail2ban Jails', icon: Shield },
            { id: 'prisma', label: 'Prisma Schema', icon: FileCode },
            { id: 'env', label: '.env Template', icon: FileCode }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-950/90 relative font-mono text-xs text-slate-300">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => handleCopy(configs[activeTab], activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors shadow-sm"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy File Content</span>
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap leading-relaxed pr-24">{configs[activeTab]}</pre>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Target Host: wa.jeenashera.online</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
