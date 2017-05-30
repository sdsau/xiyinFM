<?php
/**
 * “升温键”——加分、投票、赞
 */
class Channel extends CustomButton {

	function __construct() {
		//$this->dbname = "user_favorite_table";
	}

	protected function Execute() {
		if (isset($_GET['f'])) {
			$mysqli = DbMySqli::getInstance();
			//$sid = intval($_GET['sid']);
			//$sids = $_REQUEST['sids'];
			$user = Login::getLoginInfo();
			$uid = $user['uid'];

			switch ($_GET['f']) {
				//某用户所有频道列表
				case 'get':
					$output = $this->getListened($uid);
					$output = json_encode($output);
					break;
					
				default :
					$output = FALSE;
					break;
			}

		} else {
			$output = '"parameter error."';
		}

		echo $output;
	}
	
	//某用户所有频道的播放总歌曲数
	function getListened($uid) {
		$mysqli = DbMySqli::getInstance();
		//$sql = "SELECT `channel_table`.`channel_id` AS cid,`channel_type`,`channel_name`,`amount` FROM `channel_table` LEFT JOIN `user_channel_table` ON `channel_table`.`channel_id` = `user_channel_table`.`channel_id` WHERE `channel_table`.`enabled` = 1 AND (`user_id` = $uid OR `user_id` is NULL) ;";
		$sql = 'SELECT * FROM `channel_table` WHERE `enabled` = 1 ORDER BY `order`';
		$result = $mysqli -> query($sql);
		$arr = array();
		while ($row = $result -> fetch_assoc()) {
			$tmp = array();
			$tmp['cid'] = $row['channel_id']; 
			$tmp['name'] = $row['channel_name'];
			$tmp['num'] = 0;
			// 指定一个较早的日期
			$tmp['time'] = mktime(0,0,0,12,21,2012);
			// 歌手、榜单、标签
			$tmp['type'] = $row['channel_type'] == '榜单'? 1 : $row['channel_type'] == '标签' ? 2 : 0;
			$arr[] = $tmp;
		}
		$result -> close();
		$sql = "SELECT * FROM `user_channel_table` WHERE `user_id` = $uid ORDER BY `channel_id` ASC";
		$result = $mysqli -> query($sql);
		$rs = array();
		while ($row = $result -> fetch_assoc()) {
			$i = 0;
			while ($row['channel_id'] != $arr[$i]['cid']) {
				$i++;
			}
			$arr[$i]['num'] = $row['amount'];
			$arr[$i]['time'] = strtotime($row['open_time']);
		}
		$result -> close();
		return $arr;
	}
	public function getAllList() {
		$mysqli = DbMySqli::getInstance();
		$sql = 'SELECT * FROM `channel_table` ORDER BY `order`';
		$result = $mysqli -> query($sql);
		$arr = array();
		while ($row = $result -> fetch_assoc()) {
			$arr[] = $row;
		}
		$result -> close();
		return $arr;
	}
	public function edit() {
		$cid = $_GET['cid'];
		$arr = array();
		foreach ($_POST as $key => $value) {
			$arr[] = "`$key`='$value'";
		}
		$str = explode(',', $arr);
		$mysqli = DbMySqli::getInstance();
		$sql = "update `channel_table` set $str where `channel_id`=$cid";
		$result = $mysqli -> query($sql);
		return $result;
	}
	public function add() {
		$cid = $_GET['cid'];
		$keys = array();
		$values = array();
		foreach ($_POST as $key => $value) {
			$keys[] = "`$key`";
			$values[] = "'$value'";
		}
		$keystr = explode(',', $keys);
		$valuestr = explode(',', $values);
		$mysqli = DbMySqli::getInstance();
		$sql = "insert into `channel_table` ($keystr) values ($valuestr)";
		$result = $mysqli -> query($sql);
		return $result;
	}
}
