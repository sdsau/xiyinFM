<?php
include_once 'config.php';
$user = Login::getLoginInfo();
$pl = App::factory('Playlist');

$songinfo = array();

if (isset($_GET['m']) && isset($_GET['cid']) && isset($_GET['sid'])) {
	$cid = intval($_GET['cid']);
	$sid = intval($_GET['sid']);
	switch ($_GET['m']) {
		// 新建
		case 'n':
			//DbMySqli::toLog('new');
			$pl->updateUserChannelTime($cid, $user['uid']);
			if ($pl->isExistInChannel($sid, $cid)) {
				$songinfo = $pl->getSongBySid($sid);
			}
			break;
		// 中途下一首
		case 's':
			DbMySqli::toLog('skip');
			break;
		// 听完一首歌
		case 'e':
			$pl->updateInfo($sid, $cid, $user['uid']);
			break;
		// 不再播放
		case 'u':
			if (!$user['isAnonymous']) {
				$c = App::factory('Unlove');
				$c->addItem($user['uid'], $sid);
				DbMySqli::toLog('ban');
			}
			break;
			
		default:
			echo '"error"';
			exit;
	}
	if (empty($songinfo)) {
		$songinfo = $pl->getOneRandomSong($cid,$user);
	}
	if (!empty($songinfo)) {
		if ($user['group'] == 'duowan') {
			// 多玩不允许有外链
			unset($songinfo['intro']);
		}
		$like = App::factory('Like');
		$songinfo['like'] = $like->isExist($user['uid'],$songinfo['sid']);
		// 百度网盘分享链接获取(已失效)
		//$file = file_get_contents($songinfo['mp3']);
		//$pattern = '/installMusicPlayer\(?\(?"(.+)"/i';
		//$pattern = '|http://.+file.+sign[^"]+|';
		//preg_match($pattern,$file,$result);
		//$tempurl = $result[0];
		//$songinfo['mp3'] = str_replace("&amp;","&",$tempurl);
		//$songinfo['mp3'] = html_entity_decode($result[1]);
		//urlencode
		$pattern = '/http:\/\/bcs\.duapp\.com\/seaingfm\/(.+)/i';
		preg_match($pattern,$songinfo['mp3'],$result);
		$songinfo['mp3'] = 'http://bcs.duapp.com/seaingfm/' . urlencode($result[1]);
		// 百度bcs签名算法
		$Flag = 'MBO';
		$Content= $Flag . "\nMethod=GET\nBucket=seaingfm\nObject=/" . $result[1] . "\n";
		$Signature = urlencode(base64_encode(hash_hmac('sha1', $Content, 'D7bc4324acb917a9685a0eb6bab8cd3d',true)));
		$songinfo['mp3'] .= '?sign=' . $Flag . ':C532c8fa4492d7ca6c80a6dd34abfeb2:' . $Signature;
	}
	echo json_encode($songinfo);
} else {
	echo '"error"';
}
?>