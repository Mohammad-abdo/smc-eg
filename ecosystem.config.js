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
        PORT: process.env.PORT || 3000,
      },
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto-restart (prevents infinite restart loops)
      watch: false,
      max_memory_restart: '512M', // Reduced to prevent memory issues
      min_uptime: '10s',
      max_restarts: 5, // Reduced to prevent restart loops
      restart_delay: 4000, // Wait 4 seconds before restarting
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Health monitoring (prevents infinite restarts on health check failures)
      health_check_grace_period: 3000,
      
      // Prevent infinite loops by limiting restarts
      autorestart: true,
      stop_exit_codes: [0],
      
      // Additional safety: restart only on specific exit codes
      ignore_watch: ['node_modules', 'logs', '*.log'],
    },
  ],
};

