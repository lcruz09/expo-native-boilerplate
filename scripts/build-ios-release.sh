#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run the iOS build with Release configuration
npx expo run:ios --configuration Release --device "$@"
