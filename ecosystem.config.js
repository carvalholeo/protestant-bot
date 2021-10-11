module.exports = {
  apps: [
    {
      name: 'protestant-bot-api',
      script: './dist/src/server.js',
      args: '--use-strict',
      instances: 4,
      cron_restart: '0 0 * * *',
      increment_var: 'PORT',
      exec_mode: 'cluster',
      env: {
        'PORT': 6050,
        'NODE_ENV': 'production',
      },
    },
    {
      name: 'protestant-bot-bot',
      script: './dist/src/bot.js',
      args: '--use-strict',
      instances: 1,
      exec_mode: 'fork',
      env: {
        'NODE_ENV': 'production',
      },
      cron_restart: '0 * * * *',
    },
  ],
};
