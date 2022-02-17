#!/bin/bash

# replace = with : and comment out port
cat .env | sed 's/=/: /' |
sed 's/PORT: /# PORT: /' |
sed 's/# BASE_URL: /BASE_URL: /' > prod.env

# encode
openssl base64 -A -in prod.env -out encoded.env