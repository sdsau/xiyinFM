<?php

//define('HTTP_APPNAME', 'xiyinFM');


if (isset($_SERVER['HTTP_APPNAME'])) {
	define("DB_HOST", SAE_MYSQL_HOST_M);
	define('DB_USER', SAE_MYSQL_USER);
	define('DB_PASSWORD', SAE_MYSQL_PASS);
	define('DB_NAME', SAE_MYSQL_DB);
	define('DB_PORT', SAE_MYSQL_PORT);
} else {
	define("DB_HOST", "localhost");
	define('DB_USER', 'root');
	define('DB_PASSWORD', '');
	define('DB_NAME', 'xiyinfm');
	define('DB_PORT', 3306);
}