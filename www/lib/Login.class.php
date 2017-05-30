<?php
/**
 * 登陆类
 */
class Login extends App {

	public function __construct() {
	}
	
	protected function Execute() {
	}
	
	//返回user ID，0表示没注册
	private static function isRegister($originid = 0, $origin = '') {
		$uid = 0;
		$mysqli = DbMySqli::getInstance();
		$sql = "SELECT * FROM `user_table` WHERE `origin_id`='$originid' AND `origin` ='$origin'";
		$result = $mysqli -> query($sql);
		if ($mysqli->affected_rows == 1) {
			$row = $result -> fetch_assoc();
			$uid = $row['user_id'];
			$result -> close();
		}
		return $uid;
	}

	//返回user ID，0表示注册失败
	private static function register($originid = 0, $origin = '', $info = '') {
		$info = addslashes($info);
		$mysqli = DbMySqli::getInstance();
		$sql = "INSERT INTO `user_table` (`origin_id`, `origin`, `info`)  VALUES ('$originid','$origin','$info')";
		$mysqli -> query($sql);
		return $mysqli -> insert_id;
	}

	//更新info字段，返回值没定义
	private static function updateInfo($uid, $info) {
		$info = addslashes($info);
		$mysqli = DbMySqli::getInstance();
		$sql = "UPDATE `user_table` set `info` = '$info' where `user_id` = $uid";
		$mysqli -> query($sql);
		return;
	}
	
	/*返回结果为一个struct，主要成员为：
		group        ->   当前活动的登录系统
		uid          ->   SeaingFM的用户id（最核心的id）
		userName     ->   用户的显示名
		groupName    ->   验证系统的显示名（需要自带@）
		isAnonymous  ->   是否是匿名用户
		canSinaShare ->   是否可以显示新浪微博分享按钮
	  $forceGroup用于刚setcookie('group')还没刷新页面、Cookie没写入的情形，平常不要滥用
	*/
	public static function getLoginInfo($forceGroup = '') {
		//这个类应该是系统里唯一一个操作session的类

		$group = '';
		if (isset($_COOKIE['group']))
			$group = $_COOKIE['group'];
		if ($forceGroup != '')
			$group = $forceGroup;

		if (($group != '') && ($_SESSION[$group]['used'])) {
			$user['group'] = $group;
			$user['uid'] = $_SESSION[$group]['uid'];
			$user['userName'] = $_SESSION[$group]['userName'];
			$user['groupName'] = $_SESSION[$group]['groupName'];
			$user['isAnonymous'] = false;
			$user['canSinaShare'] = ($group == 'sina');
		} else {
			// 匿名登录，目前设置了也没用，为了将来多个system账户时用
			$_SESSION['system']['uid'] = 1;
			$_SESSION['system']['userName'] = 'anonymous';
			$_SESSION['system']['groupName'] = '';
			$_SESSION['system']['used'] = true;
			// 设置返回值
			$user['group'] = 'system';
			$user['uid'] = 1;
			$user['userName'] = 'anonymous';
			$user['groupName'] = '';
			$user['isAnonymous'] = true;
			$user['canSinaShare'] = false;
		}
		return $user;
	}

	//返回true表示设置成功，返回false表示失败
	public static function login($group, $origin_id, $groupName, $origin_username, $info = '') {
		//检查是否是已有用户
		$uid = Login::isRegister($origin_id, $group);
		if (!$uid) {
			// 若没有注册则自动注册
			$uid = Login::register($origin_id, $group, $info);
		} else {
			Login::updateInfo($uid, $info);
		}

		if (!$uid) return false;

		$_SESSION[$group]['uid'] = $uid;
		$_SESSION[$group]['userName'] = $origin_username;
		$_SESSION[$group]['used'] = true;
		$_SESSION[$group]['groupName'] = $groupName;

		return setcookie('group', $group, 0, '/');
	}

}
