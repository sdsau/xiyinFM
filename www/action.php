<?php

/**
 * 参数（必须是GET提交）
 * m: 需要调用的类名(必选)
 * f: 需要调用的方法名(可选)
 * sid:歌曲ID(可选)
 * cid:频道ID(可选)
 * 其他未知参数(可选)
 */

require_once 'config.php';
include_once 'sina/weibo.conf.php';
$user = Login::getLoginInfo();

if (!$user['isAnonymous']) {
	if (isset($_GET['m'])) {
		$c = App::factory(ucfirst($_GET['m']));
		if (is_null($c))
			echo 'Action not found';
		else
			$c -> run();
	}
} else {
	return '"FALSE"';
}
