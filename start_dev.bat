@echo off
echo Starting Laravel API...
start cmd /k "cd /d C:\laragon\www\single_selller_marketplace_api && php artisan serve"

timeout /t 5

echo Starting Vue project...
start cmd /k "cd /d C:\Coding\Venturo\single_selller_marketplace_vue && npm run dev"
