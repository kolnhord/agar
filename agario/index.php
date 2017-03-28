<?php
	define('ROOT', dirname(dirname(__FILE__)));
	set_include_path(ROOT . DIRECTORY_SEPARATOR . 'application' . 
		PATH_SEPARATOR . get_include_path());
	require_once('controllers/MainController.php');
/*
	require_once("libraries/db.php");
	
	$db = new DataBase();
*/

	$main = new Main();
	echo $main->render();