<?php
include_once '../config.php';
include_once 'weibo.conf.php';
// 指定开始歌曲
if (isset($_GET['cid'], $_GET['sid'])) {
	$_SESSION['cid'] = intval($_GET['cid']);
	$_SESSION['sid'] = intval($_GET['sid']);
}
//从POST过来的signed_request中提取oauth2信息
if(!empty($_REQUEST["signed_request"])){
	$o = new SaeTOAuthV2( WB_AKEY , WB_SKEY );
	$data=$o->parseSignedRequest($_REQUEST["signed_request"]);
	if($data=='-2'){
		 die('签名错误!');
	}else{
		//获取sina短链时需要此参数
		$_SESSION['oauth2']=$data;
	}
}
//判断用户是否授权
if (empty($_SESSION['oauth2']["user_id"])) {
	include "auth.php";
	exit;
} else {
	//读取sina用户名
	$c = new SaeTClientV2( WB_AKEY , WB_SKEY , $_SESSION['oauth2']['oauth_token'] );
	$user_message = $c->show_user_by_id($_SESSION['oauth2']["user_id"]);//根据ID获取weibo用户基本信息

	if (Login::login('sina',$_SESSION['oauth2']["user_id"],'@sina',$user_message['name'],json_encode($user_message))) {	
		header("Location: /");
	} else {
		echo "系统出错了……";	
	}
	exit;
}
?>