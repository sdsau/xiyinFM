<?php
/**
 * “升温键”——加分、投票、赞
 */
class Utility extends App {

	function __construct() {
		//$this->dbname = "user_favorite_table";
	}

	protected function Execute() {
		if (isset($_GET['f'])) {
			switch ($_GET['f']) {
				//某用户所有频道列表
				case 'shortUrl':
					$output = $this->urlShorten();
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
	
	public function urlShorten() {
		//include_once '../sina/weibo.conf.php';
		$url = 'https://api.weibo.com/2/short_url/shorten.json?access_token=' . $_SESSION['oauth2']['oauth_token'] . '&url_long=' . URLencode($_GET['url1']) . '&url_long=' . URLencode($_GET['url2']);
		$content = file_get_contents($url);
		return $content;
	}
}
