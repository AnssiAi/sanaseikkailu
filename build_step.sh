#!/bin/bash

echo "Build script"

cd sanaseikkailuBackend 
npm install 
npm run tsc
npm run build:front