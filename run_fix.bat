@echo off
echo ==========================================
echo      Harisha's Portfolio DB Fixer
echo ==========================================
echo.
echo 1. Checking Database Connection and Updating Schema...
call node deploy_db.js
if errorlevel 1 goto error

echo.
echo ---------------------------------------------------
echo V Database Connected and Updated Successfully!
echo    - 'project_image_path' column added.
echo ---------------------------------------------------
echo.
echo 2. Restarting Server...
echo.
npm start
goto end

:error
echo.
echo ---------------------------------------------------
echo X ERROR: Database Connection Failed!
echo ---------------------------------------------------
echo Reasons:
echo  - PostgreSQL is not running.
echo.
echo SOLUTION:
echo  1. Search for "pgAdmin 4" in your Start Menu and open it.
echo  2. Wait for it to load (this starts the database background service).
echo  3. Try running this script again.
echo ---------------------------------------------------
pause
exit /b 1

:end
