module.exports = {
  apps: [{
    name: 'protestant-bot',
    script: './server.js',
    args: 'use-strict',
    instances: 3,
    cron_restart: '0 0 * * *',
    watch: true,
    increment_var: 'PORT',
    exec_mode: 'cluster',
    env: {
      'PORT': 3000,
      'NODE_ENV': 'production',
    },
  }],
};
