#!/bin/bash
set -e  # Exit on any error

echo "Installing dependencies..."
sudo yum update -y
sudo yum install -y git unzip

# Install .NET runtime if necessary
echo "Installing .NET runtime..."
sudo amazon-linux-extras enable dotnet7
sudo yum install -y dotnet-runtime-7.0

# Install Node.js and npm if your app uses them
echo "Installing Node.js..."
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

echo "Dependencies installed."
