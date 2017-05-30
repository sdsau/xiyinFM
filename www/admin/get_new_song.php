<?php
include_once 'config.inc.php';

// 参数变量
$config = array();

$config['host'] = 'http://{0}.5sing.com';
//$config['suffix'] = 'HandlerSong.ashx?Command=MoreSong&type={0}&userid={1}';
//$config['url'] = $config['host'] . '/' . $config['suffix'];
$config['url'] = "http://service.5sing.com/song/moreSong?type={0}&userid={1}";
$config['mpattern'] = '/<p class="blue lt">([\s\S]+)<\/p>/iU';

$config['patterns'] = array();
$config['patterns']['artist_name'] = '/<em>演唱[\s\S]+">([\s\S]*)<\/a>/iU';
$config['patterns']['composer'] = '/<em>作曲[\s\S]+">([\s\S]*)<\/a>/iU';
$config['patterns']['lyricist'] = '/<em>作词[\s\S]+">([\s\S]*)<\/a>/iU';
$config['patterns']['classification'] = '/<em>分类[\s\S]+">([\s\S]*)<\/a>/iU';
$config['patterns']['auditionmix'] = '/<em>混缩[\s\S]+">([\s\S]*)<\/a>/iU';
$config['patterns']['album'] = '/<em>专辑[\s\S]+>([\s\S]*)((<\/a>)|(<br))/iU';
//$config['patterns'][] = '/<em>格式\/大小[\s\S]+>([\s\S]*)<br/iU';
$config['patterns']['ori_artist'] = '/<em>原唱[\s\S]+">([\s\S]*)<\/a>/iU';
//edited by ping
$config['caption'] = "song_id;song_name;5sing_name;artist_id;era;shared;play_link;original_link;released_date;song_baike;listen_times;composer;lyricist;auditionmix;album;classification;type_5sing;id_5sing;name_artist_ori;原创;日翻;古风;中翻;V+;V+CN;欧美;流行;搞怪;动漫;游戏;删除";
# csv separator
$cs = ';';

$type_list = array('yc','fc');

// 歌手表操作类
$artist = App::G('Artist');
// 歌曲表操作类
$song = App::G('Song');

$newsong = array();
$artist_list = $artist->getAll();

// 检查是否有新歌
// 以歌手为单位循环
foreach ($artist_list as $item) {
	if (preg_match('/(\d+).5sing.com/i', $item['homepage'],$match)) {
		$uid = $match[1];
		// 以5sing的类型为单位循环
		foreach ($type_list as $type) {
			$host = str_replace('{0}', $type, $config['host']);
			$suffix = str_replace('{0}', $type, $config['url']);
			//$url = $host . '/' . str_replace('{1}', $uid, $suffix);
			$url = str_replace('{1}', $uid, $suffix);
			$content = file_get_contents($url);
			$song_list = json_decode($content);
			// 以歌曲为单位循环
			for ($i=0,$l=count($song_list); $i < $l; ++$i) { 
			//foreach ($song_list as $tc) {
				$tc = $song_list[$i];
				// 对象转数组
				$v = array();
				foreach ($tc as $key => $val) {
					$v[$key] = $val;
				}
				$v['link'] = $host . '/' . $v['key'] . '.html';
				if ($song->checkByOriLink($v['link'])) {
					break;
				} else {
					$v['artist_id'] = $item['artist_id'];
					array_push($newsong,$v);
				}
			}
		}
	}
}
$sum = 0;
for ($i= count($newsong); $i > 0; --$i) { 
	// $v = $newsong[$i-1];
	$tc = $newsong[$i-1];
	// $tc = array();
	// foreach ($v as $key => $val) {
		// $tc[$key] = $val;
	// }
	
	$cont = file_get_contents($tc['link']);
	// 如果网页可以打开
	if ($cont) {
		// 截取信息段
		$pattern = $config['mpattern'];
		preg_match($pattern, $cont, $matches);
		$s = array();
		if (is_array($matches) || isset($matches[1])) {
			// 信息段存在
			$newcont = $matches[1];
			// artist_name,composer,lyricist,classification,auditionmix,album,ori_artist
			foreach ($config['patterns'] as $k => $p) {
				preg_match($p, $newcont, $m);
				if (isset($m[1])) {
					$mm = preg_replace('/<a[\s\S]+>/i', '', $m[1]);
					$s[$k] = str_replace(';', ',', $mm);
				} else {
					$s[$k] = '';
				}
			}
			// 5sing_name
			$s['5sing_name'] = $tc['name'];
			// artist_id
			$s['artist_id'] = $tc['artist_id'];
			// released_date
			$s['released_date'] = $tc['createtime'];
			// original_link
			$s['original_link'] = $tc['link'];
			// play_link
			$s['play_link'] = "http://api.5sing.com/weibo/{$tc['type']}/{$tc['key']}";
			if ($song->add5sing($s)) {
				$sum++;
				echo $tc['link'] . "获取成功<br />";
			};
		}
	}
}

echo "<br />";

echo '共计' . $sum . "个URL";