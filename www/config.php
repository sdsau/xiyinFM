<?php
session_start();
header('Content-Type: text/html; charset=UTF-8');
header('P3P: CP=CAO PSA OUR');

define('OK', '"ok"');

include_once ('config/Db.config.php');

// include_once ('lib/DbMySqli.class.php');

function __autoload($class_name) {
    include_once 'lib/' . $class_name . '.class.php';
}

