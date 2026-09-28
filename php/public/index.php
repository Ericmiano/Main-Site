<?php
// Every page request lands here (see .htaccess). The app lives in ./app on
// cPanel (upload layout) or ../app in the repo (development layout).
define('PUBLIC_DIR', __DIR__);
require is_dir(__DIR__ . '/app') ? __DIR__ . '/app/bootstrap.php' : dirname(__DIR__) . '/app/bootstrap.php';
dispatch();
