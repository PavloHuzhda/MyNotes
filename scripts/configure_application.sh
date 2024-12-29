#!/bin/bash
set -e

echo "Configuring application..."

# Ensure the application directory has the correct permissions
sudo chown -R ec2-user:ec2-user /home/ec2-user/MyNotes

# Optionally, set environment variables
echo "Setting environment variables..."
export ASPNETCORE_ENVIRONMENT=Production

echo "Configuration complete."
