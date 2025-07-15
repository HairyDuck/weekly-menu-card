#!/bin/bash

# Setup script for Weekly Menu Card HACS repository

echo "Setting up Weekly Menu Card HACS repository..."

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Weekly Menu Card for Home Assistant"

# Add remote origin (you'll need to create this repository on GitHub first)
echo "Adding remote origin..."
git remote add origin https://github.com/HairyDuck/weekly-menu-card.git

# Set main branch
git branch -M main

echo ""
echo "Repository setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub at: https://github.com/HairyDuck/weekly-menu-card"
echo "2. Push to GitHub: git push -u origin main"
echo "3. Add the repository to HACS as a custom repository"
echo "4. Install the card through HACS"
echo ""
echo "Repository URL for HACS: https://github.com/HairyDuck/weekly-menu-card" 