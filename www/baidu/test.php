<?php
include_once '../config.php';

require_once('Baidu.php');
require_once('BaiduPCS.class.php');

$clientId = '1gFYbNR3VrOZsp6XnZMNsSgQ';
$clientSecret = 'DIw6cGDimPbj0Vvbnjh9pTfxhqRIxDZf';
$redirectUri = 'http://ksping.sinaapp.com/baidu/test.php';

$baidu = new Baidu($clientId, $clientSecret, $redirectUri, new BaiduCookieStore($clientId));

$user = $baidu->getLoggedInUser();
if ($user) {
	$apiClient = $baidu->getBaiduApiClientService();
	$profile = $apiClient->api('/rest/2.0/passport/users/getInfo', 
								array('fields' => 'userid,username,sex,birthday,portrait,birthday,realname'));
	if ($profile === false) {
		//get user profile failed
		var_dump(var_export(array('errcode' => $baidu->errcode(), 'errmsg' => $baidu->errmsg()), true));
		$user = null;
		exit();
	}
	else
	{
		//搞定，设置百度用户的登录
			$a = $profile['portrait'];
			if (Login::login('baidu',$profile['userid'],'@百度',$profile['username'],json_encode($profile))) 
			{	
				$token = $baidu->getAccessToken();
				$pcs = new BaiduPCS($token);
				$x = $pcs->getQuota();

				var_dump($profile);
				var_dump($x);
			
			} else {
				echo "系统出错了……";	
			}
		//var_dump($profile);
	}
}
else {
	$loginUrl = $baidu->getLoginUrl('basic super_msg netdisk');
	header("Location: $loginUrl");
}

exit;
?>
