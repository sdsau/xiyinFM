<?php
/**
 * 数据库连接类，单一实例模式
 */
class DbMySqli {

	private static $instance;

	private function __construct($argument) {

	}

	public function __clone() {
		trigger_error('Clone is not allowed.', E_USER_ERROR);
	}

	public static function getInstance() {
		if (!isset(self::$instance)) {
			self::$instance = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);
			// if (mysqli_connect_errno())
			// die('Connect Error: ' . mysqli_connect_error());
			if (mysqli_connect_errno())
				throw_exception(mysqli_connect_error());
		}
		return self::$instance;
	}

	public static function close() {
		if (isset(self::$instance))
			self::$instance -> close();
	}
	
	public static function toLog($type = '') {
		$arr = array();
		$arr[] = 'type=' . $type;
		$arr[] = 'timestamp=' . time();
		$arr[] = 'cid=' . intval($_GET['cid']);
		$arr[] = 'sid=' . intval($_GET['sid']);
		switch ($type) {
			// 新建，换频道
			case 'new':
				
				break;
			// 下一首
			case 'skip':
				$arr[] = 'leftTime=' . floatval($_GET['time']);
				break;
			// 不再播放
			case 'ban':
				$arr[] = 'leftTime=' . floatval($_GET['time']);
				break;
			// 取消不再播放
			case 'unban':
				
				break;
			// 收藏
			case 'like':
				$arr[] = 'leftTime=' . floatval($_GET['time']);
				break;
			// 取消收藏
			case 'unlike':
				
				break;
			// 赞，推荐
			case 'vote':
				$arr[] = 'leftTime=' . floatval($_GET['time']);
				break;
			default:
				unset($arr);
				break;
		}
		if (isset($arr)) {
			$sql = 'INSERT INTO `user_log_table` (`add_time`, `context`) VALUES (CURRENT_TIMESTAMP ,\'' . implode(';', $arr) . '\');';
			if (!self::$instance)
				self::getInstance();
			self::$instance->query($sql);
		}
	}

}
