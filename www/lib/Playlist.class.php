<?php
/**
 * 播放列表相关操作
 */
class Playlist extends App {

	function __construct() {
		//$this->dbname = "user_favorite_table";
	}

	protected function Execute() {
		return FALSE;
		if (isset($_GET['m']) && isset($_GET['cid']) && isset($_GET['sid'])) {
			$cid = intval($_GET['cid']);
			$sid = intval($_GET['sid']);
			$songinfo = array();
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
				// $vote = App::factory('Vote');
				$songinfo['like'] = $like->isExist($user['uid'],$songinfo['sid']);
				// $songinfo['vote'] = $vote->isExist($user['uid'],$songinfo['sid']);
				// 百度网盘分享链接获取
				$file = file_get_contents($songinfo['mp3']);
				//$pattern = '/<a class="new-dbtn" hidefocus="true" href="(.+)" id="downFileButtom">/i';
				$pattern = '/disk\.util\.ViewShareUtils\.installMusicPlayer\("(.+)"\,/i';
				preg_match($pattern,$file,$result);
				$tempurl = $result[1];
				$songinfo['mp3'] = str_replace("&amp;","&",$tempurl);
			}
			echo json_encode($songinfo);
		} else {
			echo '"error"';
		}
	}
	// 通过歌曲ID获取一首歌曲
	// return array
	public function getSongBySid($sid) {
		$mysqli = DbMySqli::getInstance();
		$tmp = array();
		$sql = "SELECT * FROM `song_table` JOIN `artist_table` ON `song_table`.`artist_id` = `artist_table`.`artist_id` WHERE `song_id` = $sid";
		$result = $mysqli -> query($sql);
		if ($row = $result->fetch_assoc()) {
			$tmp['mp3'] = $row['play_link3'];
			$tmp['artist'] = $row['artist_name'];
			$tmp['era'] = $row['era'] ? $row['era'] : substr($row['released_date'], 0,4);
			$tmp['title'] = $row['song_name'] ? $row['song_name'] : $row['5sing_name'];
			$tmp['link'] = $row['original_link'];
			$tmp['sid'] = $row['song_id'];
			$tmp['intro'] = $row['artist_baike'];
			$result->close();
		}
		return $tmp;
	}

	// 检查特定歌曲是否存在于指定频道中
	// return boolean
	public function isExistInChannel($sid = 0,$cid = 0) {
		$mysqli = DbMySqli::getInstance();
		$sql = "SELECT 1 FROM `channel_song_table` WHERE `channel_id` = $cid AND `song_id` = $sid";
		$result = $mysqli -> query($sql);
		$tmp = FALSE;
		if ($mysqli->affected_rows) {
			$result->close();
			$tmp = TRUE;
		}
		return $tmp;
	}

	//点击频道后更新相关信息
	public function updateUserChannelTime($cid = 0, $uid = 0) {
		$mysqli = DbMySqli::getInstance();
		//更新用户各频道听歌总数表
		if ($uid != 0 && $cid != 0) {
			//检查记录是否存在
			$sql = "SELECT 1 FROM `user_channel_table` WHERE `user_id` = $uid AND `channel_id` = $cid";
			$result = $mysqli -> query($sql);
			$exist = $mysqli -> affected_rows;
			$result -> close();
			if ($exist > 0) {
				//记录存在，更新时间截
				$sql = "UPDATE `user_channel_table` SET `open_time` = CURRENT_TIMESTAMP WHERE `user_id` = $uid and `channel_id` = $cid";
				$result = $mysqli -> query($sql);
			} else {
				//记录不存在，新建记录，值为0
				$sql = "INSERT INTO `user_channel_table` (`user_id`, `channel_id`, `amount`, `open_time`) VALUES ($uid, $cid, 0, CURRENT_TIMESTAMP);";
				$result = $mysqli -> query($sql);
			}
		}
	}
	
	//正常听完一首歌后更新相关信息
	public function updateInfo($sid = 0, $cid = 0, $uid = 0) {
		$mysqli = DbMySqli::getInstance();
		//更新歌曲信息表
		$sql = "UPDATE `song_table` SET `listen_times` = `listen_times` + 1 WHERE `song_id` = " . $sid;
		$result = $mysqli -> query($sql);
		//更新用户各频道听歌总数表
		if ($uid != 0 && $cid != 0) {
			$sql = "UPDATE `user_channel_table` SET `amount` = `amount` + 1 WHERE `user_id` = $uid and `channel_id` = $cid";
			$result = $mysqli -> query($sql);
		}
	}

	// 随机获取一首歌曲
	public function getOneRandomSong($cid = 0, $user = array()) {
		if (!is_numeric($cid) || $cid == 0) return FALSE;
		$mysqli = DbMySqli::getInstance(); 
		// 获取选定频道的所有候选歌曲
		if ($cid == 2) {
			$sql = "SELECT * FROM `user_favorite_table` WHERE `user_id` = {$user['uid']}";
		} else {
			$sql = "SELECT * FROM `channel_song_table` WHERE `channel_id` = $cid";
		}
		$result = $mysqli -> query($sql);
		$waitinglist = array();
		while ($row = $result->fetch_assoc()) {
			$waitinglist[] = $row;
		}
		$result->close();
		// 获取用户的不再播放列表
		$banlist = array();
		if (!$user['isAnonymous']) {
			$sql = "SELECT * FROM `user_unlove_table` WHERE `user_id` = {$user['uid']}";
			$result = $mysqli -> query($sql);
			while ($row = $result->fetch_assoc()) {
				$banlist[] = $row;
			}
			$result->close();
			// 取候选歌曲与不再播放歌曲的差集
			$waitinglist = array_udiff($waitinglist,$banlist,function ($a,$b) {
				if ($a['song_id'] < $b['song_id'])
					return -1;
				elseif ($a['song_id'] > $b['song_id'])
					return 1;
				else
					return 0;
			});
		}
		$len = count($waitinglist);
		if ($len == 0) return array();
		// 从候选列表中选取一首歌返回
		$num = array_rand($waitinglist,1);
		$sid = $waitinglist[$num]['song_id'];
		return $this->getSongBySid($sid);
	}

	//根据频道获取播放列表
	//not use
	public function getPlayList($cid = 0, $num = 1) {
		if ($cid == 0) {
			return FALSE;
		}
		$key = 'channel_' . $cid;
		$mmc = memcache_init();
		if ($mmc == false)
			echo "mc init failed\n";
		else {
			$arr = memcache_get($mmc, $key);
			if ($arr == FALSE) {
				$sql = "SELECT * FROM `channel_song_table` LEFT JOIN `song_table` ON `song_table`.`song_id` = `channel_song_table`.`song_id` LEFT JOIN `artist_table` ON `song_table`.`artist_id` = `artist_table`.`artist_id` WHERE `channel_id` = $cid";
				$result = $mysqli -> query($sql);
				while ($row = $result -> fetch_assoc()) {
					$tmp = array();
					$tmp['mp3'] = $row['play_link2'];
					$tmp['artist'] = $row['artist_name'];
					$tmp['era'] = $row['era'] ? $row['era'] : substr($row['released_date'], 0, 4);
					$tmp['title'] = $row['song_name'] ? $row['song_name'] : $row['5sing_name'];
					$tmp['link'] = $row['original_link'];
					$tmp['sid'] = $row['song_id'];
					// any other properties
					array_push($arr, $tmp);
				}
				$result -> close();
				memcache_set($mmc, $key, $arr, MEMCACHE_COMPRESSED, 0);
			}
			// do something 
		}
	}

}
