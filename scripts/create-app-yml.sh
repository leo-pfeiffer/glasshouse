#!/bin/bash

indent() { sed 's/^/  /'; }

echo "runtime: nodejs16
env: standard

env_variables:" > app.yaml

echo "$1" | indent >> app.yaml
