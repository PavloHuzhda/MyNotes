#!/bin/bash
set -e

echo "Starting application..."

# Navigate to the application directory
cd /home/ec2-user/MyNotes/MyNotes.Server

# Start the .NET application (if it's an API)
nohup dotnet MyNotes.Server.dll &

# Or start Node.js if it's a frontend
cd /home/ec2-user/MyNotes/mynotes.client
nohup npm start &

echo "Application started."
