<?php
/**
 * “升温键”——加分、投票、赞
 */
class Unlove extends CustomButton {

	function __construct() {
		$this->dbname = "user_unlove_table";
	}

	protected function Execute() {
		if (isset($_GET['sid']) && isset($_GET['f'])) {
			$mysqli = DbMySqli::getInstance();
			$sid = $sid = intval($_GET['sid']);
			$user = Login::getLoginInfo();
			$uid = $user['uid'];
			//$sids = $_REQUEST['sids'];

			switch ($_GET['f']) {
				// 添加一条记录
				case 'add' :
					$output = $this -> addItem($uid, $sid);
					DbMySqli::toLog('ban');
					break;
				// 删除一条记录
				case 'del' :
					$output = $this -> delItem($uid, $sid);
					DbMySqli::toLog('unban');
					break;
				// 获取记录列表（10条）	
				case 'get':
					$page = intval($_GET['page']);
					$output = $this->getList($uid, $page, 10);
					$output = json_encode($output);
					break;
				// 获取总数
				case 'sum' :
					$output = $this -> countSong($uid);
					break;	
				
				// case 'delm':
					// $output = $this->delMultiItem($uid,$sids);
					// break;
					
				default :
					$output = FALSE;
					break;
			}

		} else {
			$output = '"parameter error."';
		}

		echo $output;
	}
	
}
