// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'secure-password-generator-api-prod', // Specific name for production
      script: 'dist/main.js', // Path to your NestJS app's entry point (after build)
      args: '', // Arguments to pass to the script

      // For a t3.micro with 1GiB RAM and 2 vCPUs:
      // Running 1 instance is safer to conserve memory.
      // If your app is very lightweight and you monitor memory usage carefully,
      // you could try '2', but start with '1'.
      instances: 1,
      exec_mode: 'cluster', // Still beneficial even with 1 instance for future scaling or if you try 2.
      // If strictly 1 instance and you want minimal overhead, 'fork' is an option.

      autorestart: true, // Restart the application if it crashes
      watch: false, // Disable watching files in production

      // Adjust memory restart based on your application's typical usage.
      // For a t3.micro (1GiB RAM), set this to a fraction of available memory.
      // e.g., 250MB to 350MB for a single instance, leaving room for OS and other processes.
      max_memory_restart: '300M',

      log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // Add timezone to logs

      // --- Production Environment Variables ---
      // These variables will be applied when starting with --env production
      // However, since we are defining the app block specifically for production,
      // you can also place them directly if you only have one app definition.
      // For clarity and standard PM2 usage with `env_` blocks, we'll keep it this way.
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000, // Or the port your application should run on in production
        // --- IMPORTANT ---
        // Add any other production-specific environment variables your application needs
        // For example:
        // DATABASE_URL: 'your_production_database_url'
        // API_KEY_SECRET: 'your_production_secret'
        // JWT_SECRET: 'a_very_strong_production_jwt_secret'
      },

      // Optional: Specify log file paths if you don't want the default ~/.pm2/logs
      // out_file: '/var/log/pm2/app-out.log',
      // error_file: '/var/log/pm2/app-error.log',
      // merge_logs: true, // If using multiple instances and want merged logs
    },
  ],

  // The deploy section is optional and only if you use `pm2 deploy`
  // deploy: {
  //   production: {
  //     user: 'your_ssh_user', // e.g., 'ec2-user' or 'ubuntu'
  //     host: 'your_t3_micro_public_ip_or_dns',
  //     ref: 'origin/main', // Or your production branch
  //     repo: 'git@github.com:your_username/your_repo.git',
  //     path: '/var/www/your_app_directory', // Deployment path on the server
  //     'post-deploy':
  //       'npm install && npm run build && pm2 reload ecosystem.config.js --env production --update-env',
  //   },
  // },
};
