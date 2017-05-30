<?php
include_once '../config.php';

require_once('qqConnectAPI.php');

$qc = new QC();

if ($_GET['action'] == 'callback') {
	$token = $qc->qq_callback();
	$openid = $qc->get_openid();
	header('Location: /qq/?action=canvas');
	exit;
}
else if($_GET['action'] != 'canvas'){
	$qc->qq_login();
	exit;
}

$qc = new QC();
$openid = $qc->get_openid();
//var_dump($openid);

$profile = $qc->get_user_info();
//var_dump($profile['nickname']);

//搞定，设置QQ Connect用户的登录
if (Login::login('qq_connect',$openid,'@QQ_Connect',$profile['nickname'],json_encode($profile))) 
{	
	header("Location: /");
} else {
	echo "系统出错了……";	
}

exit;
?>
