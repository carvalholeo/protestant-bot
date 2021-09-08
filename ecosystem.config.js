module.exports = {
  apps: [{
    name: 'protestant-bot',
    script: './server.js',
    args: 'use-strict',
    instances: 3,
    cron_restart: '0 0 * * *',
  }],
};
