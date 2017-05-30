<?php
/**
 * 共通函数
 * 参数只有用户ID和歌曲ID的情况
 */
abstract class CustomButton extends App {

	protected $dbname = '';
	
	//向数据库添加一条记录
	public function addItem($uid, $sid) {
		if ($sid < 1) return FALSE;
		if ($this->isExist($uid, $sid)) {
			$output = '"Item existed"';
		} else {
			$mysqli = DbMySqli::getInstance();
			$tmp = "(" . $uid . "," . $sid . ")";
			$sql = "INSERT INTO `" . $this->dbname . "` (`user_id`,`song_id`) VALUES " . $tmp;
			$result = $mysqli -> query($sql);
			if ($result == FALSE) {
				$output = $mysqli -> error . "<br />" . $sql;
			} else {
				$output = OK;
			}
		}
		return $output;
	}
	//从数据库删除一条记录
	public function delItem($uid, $sid) {
		if ($sid < 1) return FALSE;
		$mysqli = DbMySqli::getInstance();
		$sql = "DELETE FROM `" . $this->dbname . "` WHERE `user_id` = " . $uid . " AND `song_id` = " . $sid;
		$result = $mysqli -> query($sql);

		if ($result == FALSE) {
			$output = $mysqli -> error . "<br />" . $sql;
		} else {
			$output = OK;
		}
		return $output;
	}
	
	//从数据库删除多条记录
	//uid int
	//sids array
	public function delMultiItem($uid, $sids) {
		$mysqli = DbMySqli::getInstance();
		$sql = "DELETE FROM `" . $this->dbname . "` WHERE `user_id` = " . $uid . " AND `song_id` IN (" . implode(',', $sids) .")";
		$result = $mysqli -> query($sql);

		if ($result == FALSE) {
			$output = $mysqli -> error . "<br />" . $sql;
		} else {
			$output = OK;
		}
		return $output;
	}
	
	//获取某首歌的总用户数
	public function countUser($sid) {
		if ($sid < 1) return FALSE;
		$mysqli = DbMySqli::getInstance();
		$sql = "SELECT COUNT(*) AS amount FROM `" . $this->dbname . "` WHERE `song_id`=" . $sid;
		$result = $mysqli -> query($sql);
		$num = -1;
		if ($row = $result->fetch_assoc()) {
			//返回数据集
			$num = $row['amount'];
			$result->free();
		}
		return $num;
	}
	//获取某用户的总歌曲数
	public function countSong($uid) {
		$mysqli = DbMySqli::getInstance();
		$sql = "SELECT COUNT(*) AS amount FROM `" . $this->dbname . "` WHERE `user_id`=" . $uid;
		$result = $mysqli -> query($sql);
		$num = -1;
		if ($row = $result->fetch_assoc()) {
			//返回数据集
			$num = $row['amount'];
			$result->free();
		}
		return $num;
	}
	
	//检查记录是否存在
	public function isExist($uid, $sid) {
		if ($sid < 1) return FALSE;
		$mysqli = DbMySqli::getInstance();
		$sql = "SELECT 1 FROM `" . $this->dbname . "` WHERE `user_id` = " . $uid . " AND `song_id` = " . $sid;
		$result = $mysqli -> query($sql);
		if ($mysqli->affected_rows == 1) {
			$output = TRUE;
			$result->free();
		} else {
			$output = FALSE;
		}
		return $output;
	}
	// 获取某用户的喜爱/不再播放列表
	public function getList($uid, $page, $itemPerPage) {
		$mysqli = DbMySqli::getInstance();
		$start = ($page - 1) * $itemPerPage;
		// u.`song_id` AS sid, u.`add_time` AS time, s.`song_name` AS song, a.`artist_name` AS artist
		$sql = "SELECT * 
			FROM `$this->dbname` AS u 
			LEFT JOIN `song_table` AS s ON u.`song_id` = s.`song_id` LEFT JOIN `artist_table` AS a ON s.`artist_id` = a.`artist_id`
			WHERE u.`user_id` = $uid ORDER BY u.`add_time` LIMIT $start, $itemPerPage;";
		$result = $mysqli -> query($sql);
		$arr = array();
		while ($row = $result->fetch_assoc()) {
			//返回数据集
			$tmp = array();
			$tmp['sid'] = $row['song_id']; 
			$tmp['time'] = substr($row['add_time'], 0, 10);
			$tmp['artist'] = $row['artist_name'];
			$tmp['song'] = $row['song_name'] ? $row['song_name'] : $row['5sing_name'];
			
			$arr[] = $tmp;
		}
		// if (count($arr))
			// $result->free();
		return $arr;
	}
	//喜爱或不再播放列表用
	// public function formatString($arr = array())
	// {
		// $arrTmp = array();
		// for ($i=0; $i < count($arr); ++$i) { 
			// $tmp = array();
			// foreach ($arr[$i] as $key => $value) {
				// $tmp[] = "\"$key\" : \"$value\"";
			// }
			// $arrTmp[] = '{' . implode(",", $tmp) . '}';
		// }
		// $str = '[' . implode(",", $arrTmp) . ']';
		// return $str;
	// }

}
