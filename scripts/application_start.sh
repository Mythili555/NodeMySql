#!/bin/bash
cd /var/www/nodejs
sudo pm2 start index.js -f --name "api"
