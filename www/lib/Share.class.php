<?php
/**
 * “分享”——对应分享榜单
 */
class Share extends App {

	function __construct() {
	}

	protected function Execute() {
		if (isset($_GET['sid'])) {
			$mysqli = DbMySqli::getInstance();
			$sid = $mysqli -> real_escape_string($_GET['sid']);
			$user = Login::getLoginInfo();
			$uid = $user['uid'];
			
			$output = $this->addShare($sid);
			
		} else {
			$output = '"parameter error."';
		}

		echo $output;
	}
	
	//设置，用户点分享时调用
	public function addShare( $sid) {
			$mysqli = DbMySqli::getInstance();
			$sql = "UPDATE `song_table` SET `shared` = shared + 1 WHERE `song_id` = " . $sid;
			$result = $mysqli -> query($sql);
			if ($result == FALSE) {
				$output = $mysqli -> error . "<br />" . $sql;
			} else {
				$output = OK;
			}
		return $output;
	}
	
	//获取一首歌的总分享数
	public function getShared($sid) {
		$mysqli = DbMySqli::getInstance();
		$sql = "SELECT * FROM `song_table` WHERE `song_id`=" . $sid;
		$result = $mysqli -> query($sql);
		$num = -1;
		if ($row = $result->fetch_assoc()) {
			//返回数据集
			$num = $row['shared'];
		}
		$result->free();
		return $num;
	}

}
