<?php
/**
 * “升温键”——加分、投票、赞
 */
class Like extends CustomButton {

	function __construct() {
		$this->dbname = "user_favorite_table";
	}

	protected function Execute() {
		if (isset($_GET['sid']) && isset($_GET['f'])) {
			$mysqli = DbMySqli::getInstance();
			$sid = intval($_GET['sid']);
			//$sids = $_REQUEST['sids'];
			$user = Login::getLoginInfo();
			$uid = $user['uid'];

			switch ($_GET['f']) {
				// 添加一条记录
				case 'add' :
					$output = $this -> addItem($uid, $sid);
					DbMySqli::toLog('like');
					break;
				// 删除一条记录
				case 'del' :
					$output = $this -> delItem($uid, $sid);
					DbMySqli::toLog('unlike');
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
}
