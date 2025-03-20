#!/bin/bash

echo "Build script"

cd sanaseikkailuBackend 
npm install 
npm run tsc
cd ../sanaseikkailuFrontend
npm install
cd ../sanaseikkailuBackend
npm run build:front