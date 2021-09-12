module.exports = {
  apps: [{
    name: 'protestant-bot',
    script: './server.js',
    args: 'use-strict',
    instances: 4,
    cron_restart: '0 0 * * *',
    increment_var: 'PORT',
    exec_mode: 'cluster',
    env: {
      'PORT': 6050,
      'NODE_ENV': 'production',
    },
  }],
};
