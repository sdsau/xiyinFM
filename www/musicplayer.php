<?php
$user = Login::getLoginInfo();

//是否显示新浪微博分享按钮
$displayShareButton = $user['canSinaShare'];

$like_sum = 0;
$unlove_sum = 0;
if (!$user['isAnonymous']) {
	$like = App::factory('Like');
	$unlove = App::factory('Unlove');
	$like_sum = $like->countSong($user['uid']);
	$unlove_sum = $unlove->countSong($user['uid']);
}

$channel = App::factory('Channel');
$channel_list = $channel->getListened($user['uid']);
$artist_list = array();
$common_list = array();

while ($row = array_shift($channel_list)) {
	// 歌手是 0
	if ($row['type'] == 0) {
		array_push($artist_list,$row);
	} else {
		array_push($common_list,$row);
	}
}
// 重排序歌手频道，逆向排序
usort($artist_list, function ($a,$b) {
	if ($a['time'] < $b['time'])
		return 1;
	elseif ($a['time'] > $b['time'])
		return -1;
	else
		return 0;
});

$newcid = 0;
$newsid = 0;
if (isset($_SESSION['cid'], $_SESSION['sid'])) {
	$newcid = $_SESSION['cid'];
	$newsid = $_SESSION['sid'];
	unset($_SESSION['cid'], $_SESSION['sid']);
} 
if (isset($_GET['cid'], $_GET['sid'])) {
	$newcid = intval($_GET['cid']);
	$newsid = intval($_GET['sid']);
}
?>
<!DOCTYPE HTML
PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns:wb="http://open.weibo.com/wb">

<head>
<link rel="stylesheet" type="text/css" href="css/default.min.css?v=20130721" />
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="author" content="ksping@weibo" />
<meta name="description" content="Music aggregation" />
<meta property="qc:admins" content="1421076330167631611006375" />
<script type="text/javascript" src="http://lib.sinaapp.com/js/jquery/1.8.1/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.jplayer.min.js?v=20130721"></script>
<script type="text/javascript" src="js/default.min.js?v=20130721"></script>
<?php if ($displayShareButton) : ?>
<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=2855888774" type="text/javascript" charset="utf-8"></script>
<?php endif; ?>
<?php if ($user['group'] == 'duowan') : ?>
<script type="text/javascript" src="duowan/yyapi-1.10beta.js" language="javascript"></script>
<script>
function bugReport() {
	yy.im.chatTo(105236671,'这里写你想说的内容，Bug报告或者其他什么的，妹子的话欢迎来告白哟（完全不对）');
}
</script>
<?php endif; ?>
<title>汐音社·鱼花自然Hi</title>
<script type="text/javascript">
	var newcid = <?php echo $newcid;?>;
	var newsid = <?php echo $newsid;?>;
</script>
</head>

<body scroll="no">
<div id="main">
<div id="container">
	<div id="header">
		<div id="appName"><a href="javascript:;" hidefocus>汐音FM</a></div>
		<div id="userInfo">
			<ul>
				<li><a class="user-name" href="javascript:;" hidefocus><?php echo $user['userName'], $user['groupName']; ?></a></li>
				<li><a class="like-num" href="javascript:;" id="like" hidefocus>喜爱<?php echo $like_sum > 0 ? $like_sum : 0; ?>首</a></li>
				<li><a class="unlove-num" href="javascript:;" id="unlove" hidefocus><?php echo $unlove_sum > 0 ? $unlove_sum : 0; ?>首不再播放</a></li>
			</ul>
		</div>
	</div>
	<div id="channelArea">
		<div id="channelContainer">
<?php if (count($common_list)) : ?>
		<ul class="list" id="common_list">
<?php while ($row = array_shift($common_list)) :	?>
			<li><span class="channel-name"><?php echo $row['name']; ?></span><span class="listened-num">已听<br /><?php echo $row['num']; ?>首</span><a cid="<?php echo $row['cid']; ?>" class="sub-channel" href="javascript:;" hidefocus></a></li>
<?php endwhile;?>
		</ul>
<?php endif; ?>
<?php if (count($artist_list)) : ?>
		<ul class="list" id="artist_list">
<?php while ($row = array_shift($artist_list)) :	?>
			<li><span class="channel-name"><?php echo $row['name']; ?></span><span class="listened-num">已听<br /><?php echo $row['num']; ?>首</span><a cid="<?php echo $row['cid']; ?>" class="sub-channel" href="javascript:;" hidefocus></a></li>
<?php endwhile;?>
		</ul>
<?php endif; ?>
		</div>
	</div>
	<a href="javascript:;" class="switch2common" id="switch2common"></a>
	<a href="javascript:;" class="switch2artist" id="switch2artist"></a>
	<a href="javascript:;" class="channel-up" id="channelup"></a>
	<a href="javascript:;" class="channel-down" id="channeldown"></a>
	<div id="playerArea">
		<div id="jquery_jplayer_1" class="jp-jplayer"></div>
		<div id="jp_container_1" class="jp-audio">
			<div class="jp-gui jp-interface">
				<div class="jp-info-bar">
					<ul class="jp-info-bar">
						<li class="jp-title">樱花，遇见你真好</li>
						<li class="jp-artist">西国の海妖</li>
						<li class="jp-era">2012</li>
					</ul>
				</div>
				<ul class="jp-controls jp-share-bar">
<?php if ($displayShareButton) : ?>
					<li><a href="javascript:;" class="jp-share" tabindex="1" title="分享到新浪微博" hidefocus>share</a></li>
					<li><a href="javascript:;" id="weiboSender" style="width: 0;height: 0;"></a></li>
<?php endif; ?>
				</ul>
				<div class="jp-remain-time">-03:21</div>
				<ul class="jp-controls jp-play-button">
					<li><a href="javascript:;" tabindex="1" class="jp-play" title="播放" hidefocus>play</a></li>
					<li><a href="javascript:;" tabindex="1" class="jp-pause" title="暂停" hidefocus>pause</a></li>
				</ul>
				<div class="jp-progress">
					<div class="jp-seek-bar">
						<div class="jp-play-bar"></div>
					</div>
				</div>
				<ul class="jp-controls jp-bottom-bar jp-controls ">
					<li><a href="javascript:;" class="jp-unlove" tabindex="1" title="不再播放" hidefocus>unlove</a></li>
					<li><a href="javascript:;" class="jp-like" tabindex="1" title="喜爱" hidefocus>like</a></li>
					<li><a href="javascript:;" class="jp-liked" tabindex="1" title="取消喜爱" hidefocus>liked</a></li>
					<li><a href="javascript:;" class="jp-next" tabindex="1" title="下一首" hidefocus>next</a></li>
				</ul>
				<ul class="jp-controls jp-volume-button">
					<li><a href="javascript:;" class="jp-repeat" tabindex="1" title="循环" hidefocus>repeat</a></li>
					<li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="顺序" hidefocus>repeatOff</a></li>
					<li><a href="javascript:;" class="jp-mute" tabindex="1" title="静音" hidefocus>mute</a></li>
					<li><a href="javascript:;" class="jp-unmute" tabindex="1" title="解除静音" hidefocus>unmute</a></li>
				</ul> 
				<div class="jp-volume-bar">
					<div class="jp-volume-bar-value"></div>
				</div>
			</div>
			<div class="jp-no-solution">
				<span>Update Required</span>
				To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
			</div>
		</div>
	</div>
	<div id="adArea">
	</div>
	<div id="adArea2">汐音FM同人电台，让我们一起来淘你喜欢的动漫翻唱、古风音乐！<br /><br />点击频道列表，切换你想收听的歌曲集。在频道列表上按方向键可以看到更多频道哟~~<br />点击播放器的心形按钮收藏你喜欢的音乐，垃圾桶按钮可以让你不想再听的歌从你的列表里灰飞烟灭。<br /><br />开发：汐音社，欢迎大家支持我们继续前进！<br />汐音社联谊QQ群：56128662<br />建议收集和Bug报告：
<?php if ($user['group'] == 'duowan') :?>
		<a class="adLink" onclick="bugReport();">猛戳这里</a>
<?php else : ?> 
		<a class="adLink" href="http://t.cn/zTGjM5i" target="xiyin_page" >猛戳这里</a>
<?php endif; ?>
	</div>
</div>
<div id="listArea">
	<div class="alpha-bg">
	<div class="top">
		<span class="title">不再播放list</span>
		<a href="javascript:;" class="close" title="close" onclick="$('#listArea').hide();" hidefocus>close</a>
	</div>
	<div class="middle">
		<table cellpadding="1px" cellspacing="1px">
			<thead>
				<tr>
					<th>歌曲名</th>
					<th>歌手</th>
					<th>添加时间</th>
					<th>状态</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{1}</td>
					<td>{2}</td>
					<td>{3}</td>
					<td><a href="javascript:;" class="del-button" sid="{4}" hidefocus>删除</a></td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="bottom" id="pagebar">
		<a href="javascript:;" class="arrow" id="left_arrow">&lt;</a>
		<a href="javascript:;" class="pages" id="first_page">1</a>
		<a href="javascript:;" class="suspension" id="left_suspension">......</a>
		<a href="javascript:;" class="pages">10</a>
		<a href="javascript:;" class="pages">11</a>
		<a href="javascript:;" class="pages current-page">12</a>
		<a href="javascript:;" class="pages">13</a>
		<a href="javascript:;" class="pages">14</a>
		<a href="javascript:;" class="suspension" id="right_suspension">......</a>
		<a href="javascript:;" class="pages" id="last_page">30</a>
		<a href="javascript:;" class="arrow" id="right_arrow">&gt;</a>
		<div class="line"></div>
		</div>
	</div>
</div>
</div>
</body>
</html>