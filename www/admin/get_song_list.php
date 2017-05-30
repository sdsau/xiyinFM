<?php
header("Content-type: text/html; charset=utf-8");
if (isset($_GET['uid'])) {
	$uid = $_GET['uid'];
	if ($_GET['type']=='yc' || $_GET['type']=='fc') {
		$type_list = array($_GET['type']);
	} else {
		$type_list = array('yc','fc');
	}
	$output = array();
	echo "<pre>";
	foreach ($type_list as $type) {
		
		$config = array();
		
		$config['host'] = "http://{$type}.5sing.com";
		//$config['suffix'] = "HandlerSong.ashx?Command=MoreSong&type={$type}&userid={$uid}";
		//$config['url'] = $config['host'] . '/' . $config['suffix'];
		$config['url'] = "http://service.5sing.com/song/moreSong?type={$type}&userid={$uid}";
		$config['mpattern'] = '/<p class="blue lt">([\s\S]+)<\/p>/iU';
		
		$config['patterns'] = array();
		$config['patterns']['zuoqu'] = '/<em>作曲[\s\S]+">([\s\S]*)<\/a>/iU';
		$config['patterns']['yanchang'] = '/<em>演唱[\s\S]+">([\s\S]*)<\/a>/iU';
		$config['patterns']['zuoci'] = '/<em>作词[\s\S]+">([\s\S]*)<\/a>/iU';
		//$config['patterns'][] = '/<em>作曲[\s\S]+">([\s\S]*)<\/a>/iU';
		$config['patterns']['fenlei'] = '/<em>分类[\s\S]+">([\s\S]*)<\/a>/iU';
		$config['patterns']['hunsuo'] = '/<em>混缩[\s\S]+">([\s\S]*)<\/a>/iU';
		$config['patterns']['zhuanji'] = '/<em>专辑[\s\S]+>([\s\S]*)((<\/a>)|(<br))/iU';
		//$config['patterns'][] = '/<em>格式\/大小[\s\S]+>([\s\S]*)<br/iU';
		$config['patterns']['yuanchang'] = '/<em>原唱[\s\S]+">([\s\S]*)<\/a>/iU';
		//$config['patterns']['yanchang'] = '/<em>演唱[\s\S]+">([\s\S]*)<\/a>/iU';
		//$config['patterns']['fenlei'] = '/<em>分类[\s\S]+">([\s\S]*)<\/a>/iU';
		//$config['patterns']['zhuanji'] = '/<em>专辑[\s\S]+>([\s\S]*)((<\/a>)|(<br))/iU';
		$config['caption'] = "song_id;song_name;5sing_name;artist_id;era;play_link;original_link;released_date;song_baike;composer;lyricist;auditionmix;album;classification;type_5sing;id_5sing;name_artist_ori;原创;日翻;古风;中翻;V+;V+CN;欧美;流行;搞怪;动漫;游戏;删除";
		//sameple    "[songid(自增)];1;歌名;作曲;作词;混缩(后期);专辑;[上传时间];分类;key;type;[备注];[原歌名];[原唱];[原作曲];[原作词];1;1"
		# csv separator
		$cs = ';';
		
		var_dump($config['url']);
		
		$content = file_get_contents($config['url']);
		
		$song_list = json_decode($content);
		print_r($content);
		
		for ($i= count($song_list); $i > 0; --$i) { 
			$v = $song_list[$i-1];
		
			$tc = array();
			foreach ($v as $key => $val) {
				$tc[$key] = $val;
			}
			$url = $config['host'] . '/' . $tc['key'] . '.html';
		
			var_dump($url);
			$cont = file_get_contents($url);
			// 如果网页可以打开
			if ($cont) {
				// 截取信息段
				$pattern = $config['mpattern'];
				preg_match($pattern, $cont, $matches);
				if (is_array($matches) || isset($matches[1])) {
					// 信息段存在
					$newcont = $matches[1];
					//$tmp = $cs . '1' . $cs . $tc['name'] . $cs ;
					$s = array();
					foreach ($config['patterns'] as $k => $p) {
						preg_match($p, $newcont, $m);
						if (isset($m[1])) {
							$mm = preg_replace('/<a[\s\S]+>/i', '', $m[1]);
							//$tmp .= $mm . $cs;
							$s[$k] = '"' . str_replace(';', ',', $mm) . '"';
						} else {
							//$tmp .= $cs;
							$s[$k] = '';
						}
					}
					// "song_id;song_name;5sing_name;artist_id;era;"
					$tmp = "$cs$cs{$tc['name']}$cs{$s['yanchang']}$cs{$cs}";
					// "play_link;original_link;released_date;song_baike;"
					$tmp .= "$cs$url$cs{$tc['createtime']}$cs{$cs}";
					// "composer;lyricist;auditionmix;album;classification;type_5sing;id_5sing;name_artist_ori;"
					$tmp .= "{$s['zuoqu']}$cs{$s['zuoci']}$cs{$s['hunsuo']}$cs{$s['zhuanji']}$cs{$s['fenlei']}$cs{$tc['type']}$cs{$tc['key']}$cs{$s['yuanchang']}$cs";
					// 原创;日翻;古风;中翻;V+;V+CN;欧美;流行;搞怪;动漫;游戏;删除
					$tmp .= "$cs$cs$cs$cs$cs$cs$cs$cs$cs$cs$cs";
					# var_dump($tmp);
					echo "获取成功<br />";
					array_push($output, $tmp);
				}
			}
		}
	}
	$output_content = $config['caption'] . "\n" . implode($output, "\n");
	//file_put_contents('yc_song_list.csv', $output_content);
	echo "\n",'共计' , count($output) , "个URL\n";
	echo $output_content;
	echo "</pre>";
	exit;
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
</head>

<body>
<form method="get">
	5sing uid:<input type="text" name="uid" /><br />
	type:<input type="text" name="type" />fc/yc<br />
	<input type="submit" value="submit" />
</form>
<div id="msg"></div>
</body>
</html>