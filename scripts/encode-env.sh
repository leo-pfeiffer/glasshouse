#!/bin/bash

# replace = with : and comment out port
cat .env | sed 's/=/: /' | sed 's/PORT: /# PORT: /' > prod.env

# encode
openssl base64 -A -in prod.env -out encoded.env