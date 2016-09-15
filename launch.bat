@echo off

cd %~dp0
start py -3 server.py --dashboard

npm start