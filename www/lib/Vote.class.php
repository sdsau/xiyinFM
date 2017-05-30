<?php
/**
 * “升温键”——加分、投票、赞
 */
class Vote extends CustomButton {

	function __construct() {
		$this->dbname = "user_vote_table";
	}

	protected function Execute() {
		if (isset($_GET['sid']) && isset($_GET['f'])) {
			$mysqli = DbMySqli::getInstance();
			$sid = intval($_GET['sid']);
			$user = Login::getLoginInfo();
			$uid = $user['uid'];
			switch ($_GET['f']) {
				// 添加一条记录
				case 'add' :
					$output = $this -> addItem($uid, $sid);
					DbMySqli::toLog('vote');
					break;

				// case 'del' :
					// $output = $this -> delItem($uid, $sid);
					// break;

				// case 'get':
					// $output = $this->getList($uid);
					// $output = json_encode($output);
					// break;
					
				//case 'delm':
				//	$output = $this->delMultiItem($uid,$sids);
				//	break;

				default :
					$output = FALSE;
					break;
			}
			
		} else {
			$output = '"parameter error."';
		}

		echo $output;
	}
	
	// //设置，用户点推荐时调用
	// public function setVote($uid, $sid) {
		// if ($this->isExist($uid, $sid)) {
			// $output = FALSE;
		// } else {
			// $mysqli = DbMySqli::getInstance();
			// $tmp = "(" . $uid . "," . $sid . ")";
			// $sql = "INSERT INTO `user_vote_table` (`user_id`,`song_id`) VALUES " . $tmp;
			// $result = $mysqli -> query($sql);
			// if ($result == FALSE) {
				// $output = $mysqli -> error;
			// } else {
				// $output = '"ok"';
			// }
			// $result -> free();
		// }
		// return $output;
	// }
// 	
	// //获取一首歌的总推荐数
	// public function count($sid) {
		// $mysqli = DbMySqli::getInstance();
		// $sql = "SELECT COUNT(*) AS amount FROM `user_vote_table` WHERE `song_id`=" . $sid;
		// $result = $mysqli -> query($sql);
		// $num = -1;
		// if ($row = $result->fetch_assoc()) {
			// //返回数据集
			// $num = $row['amount'];
		// }
		// $result->free();
		// return $num;
	// }
// 	
	// //检查记录是否存在
	// public function isExist($uid, $sid) {
		// $mysqli = DbMySqli::getInstance();
		// $sql = "SELECT 1 FROM `user_vote_table` WHERE `user_id` = " . $uid . " AND `song_id` = " . $sid;
		// $result = $mysqli -> query($sql);
		// if ($mysqli->affected_rows) {
			// $output = TRUE;
		// } else {
			// $output = FALSE;
		// }
		// $result->free();
		// return $output;
	// }

}
