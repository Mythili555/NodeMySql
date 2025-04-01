#!/bin/bash
cd /var/www/nodejs
sudo pm2 start app.js -f --name "api"
