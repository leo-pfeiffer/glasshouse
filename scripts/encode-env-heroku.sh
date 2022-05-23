#!/bin/bash

# replace = with : and comment out port
cat .env |
sed 's/PORT=/# PORT=/' |
sed 's/# HEROKU_BASE_URL=/BASE_URL=/' > prod-heroku.env

# encode
openssl base64 -A -in prod-heroku.env -out encoded-heroku.env