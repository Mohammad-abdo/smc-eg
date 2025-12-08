// PM2 Ecosystem Configuration
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'smc-backend',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto-restart
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Health monitoring
      health_check_grace_period: 3000,
    },
  ],
};

