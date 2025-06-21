#!/bin/bash

echo "🚀 Quick CRUD Test"

# Start the development server if not running
if ! curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "Starting development server..."
    npm run dev &
    sleep 5
fi

# Open debug page
echo "Opening debug page..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000/debug/crud
elif command -v open > /dev/null; then
    open http://localhost:3000/debug/crud
else
    echo "Please open http://localhost:3000/debug/crud in your browser"
fi

echo "✅ Quick test setup complete!"
echo "📝 Instructions:"
echo "1. Login as admin (admin@si-umkm.com / admin123)"
echo "2. Go to /debug/crud page"
echo "3. Click 'Run All Tests' button"
echo "4. Check the results for any errors"
