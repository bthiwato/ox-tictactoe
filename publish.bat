@echo off
setlocal
set REPO=https://github.com/bthiwato/ox-tictactoe.git
git init
git add .
git commit -m "chore: publish"
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO%
git push -u origin main
echo Done.
pause
