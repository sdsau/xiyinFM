<?php
include_once '../config.php';

require_once('QClient.php');

// Build QClient object. 
$connection = new QOAuth2('14b621cb61e6a49911572459f72ff785', // api key
                        'b00f87d77f614061f0cd9831a923bcbb',  // app secret
                        ''); // access token
    
$scope = 'basic';

if ($_GET['action'] == 'callback') {
	$response = $connection->getAccessTokenByCode($_GET['code'], 'http://ksping.sinaapp.com/360web/?action=callback');
}
else {
	$url = $connection->getAuthorizeURL('code', 'http://ksping.sinaapp.com/360web/?action=callback', $scope);
	header("Location: $url");
	exit;
}

if(!isset($response['access_token'])) {
	exit;
}
$token  = $response['access_token'];
$connection = new QClient('14b621cb61e6a49911572459f72ff785', // api key
                        'b00f87d77f614061f0cd9831a923bcbb',  // app secret
                        $token); // access token

$user = $connection->userMe();
//var_dump($user);
//var_dump($user['id']);
//var_dump($user['name']);
//exit;

//搞定，设置360用户的登录
if (Login::login('360cn',$user['id'],'@360.cn',$user['name'],json_encode($user))) 
{	
	header("Location: /");
} else {
	echo "系统出错了……";	
}

exit;
?>
