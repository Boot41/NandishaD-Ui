#!/bin/bash

# Navigate to the frontend directory
cd Dscript

# Install dependencies
npm install

# Run the build command
npm run build

# Move the dist folder to the main directory
mv dist ../

# Optionally, you can navigate back to the root directory if needed
cd ..
