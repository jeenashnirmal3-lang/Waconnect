// PM2 Ecosystem Configuration for 24x7 Production Daemon
// Target: AWS EC2 Ubuntu 22.04 LTS

module.exports = {
  apps: [
    {
      name: 'jeenash-wa-backend',
      script: 'server/src/index.js',
      cwd: '/var/www/jeenash-wa',
      instances: 1, // Single instance required to preserve in-memory Baileys socket state
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
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
