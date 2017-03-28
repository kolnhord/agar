<?php
	header('Content-type: application/json');
	define('ROOT', dirname(dirname(dirname(__FILE__))));
	set_include_path(ROOT . DIRECTORY_SEPARATOR . 'application' . 
		PATH_SEPARATOR . get_include_path());
	
	require_once('controllers/APIController.php');
	
	$api = new API();
	print json_encode($api->answer());