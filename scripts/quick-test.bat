@echo off
echo 🚀 Quick CRUD Test

echo Starting development server...
start /B npm run dev

timeout /t 5

echo Opening debug page...
start http://localhost:3000/debug/crud

echo ✅ Quick test setup complete!
echo 📝 Instructions:
echo 1. Login as admin (admin@si-umkm.com / admin123)
echo 2. Go to /debug/crud page
echo 3. Click 'Run All Tests' button
echo 4. Check the results for any errors
