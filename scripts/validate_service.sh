#!/bin/bash
set -e

echo "Validating application..."

# Check if the application is running (replace with your actual endpoint)
curl -f http://localhost:5000/health || {
  echo "Application validation failed."
  exit 1
}

echo "Application is running successfully."
