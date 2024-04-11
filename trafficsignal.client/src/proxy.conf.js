const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://127.0.0.1:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://127.0.0.1:5001';

const PROXY_CONFIG = [
  {
    context: [
      "/TrafficSignal",
    ],
    target,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
