var switchbutton = null;

$(document).ready(function() {
	// 播放器初始化
	$("#jquery_jplayer_1").jPlayer({
		swfPath : "js",
		wmode : "window"
	});
	$.ajaxSetup({
		// "beforeSend": function(xhr) {
	      // xhr.setRequestHeader("Referer", '');
	   // },
		'error' : function() {
			$('#adArea').html("啊咧，好奇怪，请求好像失败了，稍后再试？");
		}
	});
	
	// 频道栏初始化
	fm.init();
	// 初始化listArea
	list.init();
	// YY页面调整
	if ('duowan' == getCookie('group')) {
		$('body').height(550);
		$('#main').css({'width':'700px','height':'550px'});
		$('#container').css({'margin':'0px'});
	}
	// 初始化频道切换按钮
	switchbutton = $("a.switch2artist");
	
	$(document).keydown(function (e){
		//var e = e || window.event; 
		//var k = e.keyCode || e.which; 
		if (e.which == 38) {
			$('#channelup').click();
		} else if (e.which == 40) {
			$('#channeldown').click();
		} else if (e.which == 37) {
			//LEFT
			if (switchbutton == null)
			{
				return;
			}
			if (switchbutton.attr('id') == 'switch2common')
			{
				switchbutton.click();
			}
		} else if (e.which == 39) {
			//RIGHT
			if (switchbutton == null)
			{
				return;
			}
			if (switchbutton.attr('id') == 'switch2artist')
			{
				switchbutton.click();
			}
		}
	});
	
	$(document).mouseup(function (e){
		//点击鼠标中键
		if (e.which == 2)
		{
			if (switchbutton != null)
			{
				switchbutton.click();
			}
		}
	});

	//$('#channelContainer').mousewheel(function (e, delta){
	if ('sina' != getCookie('group')) {
		$(document).mousewheel(function (e, delta){
			if (delta > 0) {
				//event.preventDefault();
				$('#channelup').click();
			} else if (delta < 0) {
				//event.preventDefault();
				$('#channeldown').click();
			}
		});
	}
});

var fm = {
	init : function () {
		//fm.getChannelByAjax();
		fm.bindChannelEvent();
		fm.checkLastChannel(newcid,newsid);
	},
	bindChannelEvent : function() {
		$('#channelArea a').click(function(e) {
			if ($(this).hasClass('sub-channel-on')) {
				return ;
			}
			var self = this;
			$('#channelArea a').each(function() {
				$(this).removeClass();
				if (self == this) {
					$(this).addClass('sub-channel-on');
					$(this).siblings(".listened-num").show();
				} else {
					$(this).addClass('sub-channel-off');
					$(this).siblings(".listened-num").hide();
				}
			});
			//设置cookie信息
			setCookie("cid",$(this).attr("cid"),7);
			//播放歌曲
			$('#jquery_jplayer_1').jPlayer("getMedia","n",newsid);
		});
		$("a.switch2common").click(function (){
			if (switchbutton == null)
				return;
			switchbutton = null;
			channelList = $("#channelArea .list");
			channelList.show();
			//channelList.eq(0).clearQueue();
			channelList.eq(0).animate({"margin-left":"0"},"normal","linear",function () {
				channelList.eq(1).hide();
				switchbutton = $("a.switch2artist");
			});
			$(this).hide();
			$("a.switch2artist").show();
		});
		$("a.switch2artist").click(function (){
			if (switchbutton == null)
				return;
			switchbutton = null;
			channelList = $("#channelArea .list");
			channelList.show();
			//channelList.eq(0).clearQueue();
			channelList.eq(0).animate({"margin-left":"-220px"},"normal","linear",function () {
				channelList.eq(0).hide();
				switchbutton = $("a.switch2common");
			});
			$(this).hide();
			$("a.switch2common").show();
		});
		$(".channel-up").click(function (){
			//alert('up');
			cc = $('#channelContainer');
			st = cc.scrollTop() - cc.height();
			st = st < 0 ? 0 : st;
			cc.scrollTop(st);
		});
		$(".channel-down").click(function (){
			//alert('down');
			cc = $('#channelContainer');
			st = cc.scrollTop() + cc.height();
			st = st > cc[0].scrollHeight ? cc[0].scrollHeight : st;
			cc.scrollTop(st);
		});
	},
	checkLastChannel : function (cid,sid) {
		// 检查cookie，读取上次收听的频道
		cid ? setCookie("cid",cid,7) : cid = getCookie('cid');
		// 若存在上次收听信息，获取频道歌曲，并播放
		if (cid != "") {
			setTimeout(function() {
				$('#channelArea a').each(function (){
					if ($(this).attr('cid') == cid) {
						$(this).click();
						channelid = $(this).closest('ul').attr('id');
						channelid == 'artist_list' ? $('.switch2artist').click() : $('.switch2common').click();
					}
				});
				newcid = 0; newsid = 0;
			}, 1500);
		} else {
			$(".switch2common").click();
		}
	}
}

// 获取下一首歌
// 新建，听完下一首，不再播放（该按钮需要切歌），直接下一首， 列表完结再获取（待实现）
// 一条list至少包含以下信息
// {
	// "title" : "",
	// "mp3" : "播放地址",
	// "artist" : "haiyao",
	// "pic" : "封面之类",
	// originLink:"源地址",
	// "era" : 2012,
	// "vote" : true,
	// "like" : false,
	// "sid" : 1
// 	
// }
// function getPlaylist(type, sid) {
	// param = {};
	// param.m = type;
	// param.cid = $('.sub-channel-on').attr('cid');
	// param.sid = sid;
	// obj = {};
	// $.getJSON('action.php', param, function (data) {
		// type = typeof (data);
		// if (type == "object") {
			// obj = data;
			// // 从第一首开始播放
		// } else if (type == "string") {
			// if (data == "ok") {
				// // do something
			// } else {
				// // error
			// }
		// }
	// });
	// return obj;
// }
var list = {
	init : function () {
		$(".like-num").click(getLikeUnloveList);
		$(".unlove-num").click(getLikeUnloveList);
		pageDiv.bindEvent();
	}
}
// show like or unlove list
var lastlist = '';
function getLikeUnloveList() {
	if ('system' == getCookie('loginGroup')) return;
	items = parseInt(($(this).html().match(/\d+/))[0]);
	if (items) {
		m = this.id;
		if (lastlist != m) {
			lastlist = m;
			$("#listArea .title").html(m=='like'?'喜爱list(点击喜爱频道，可以收听本列表里的歌曲)':'不再播放list(列表中的歌曲不会被播放，包括喜爱频道)');
			getListByAjax(m,1);
			pageDiv.initPageBar(items);
			$('#listArea').show();
		} else {
			$('#listArea').show();
		};
	};
}
// 获取喜爱|不再播放列表
function getListByAjax(m, page) {
	param = {};
	param.m = m;
	param.f = "get";
	param.sid = 0;
	param.page = page;
	var table = $("#listArea table");
	var element = table.find("tbody");
	$.ajax({
		"url": 'action.php',
		"data": param,
		"dataType": "json",
		"success": function (data) {
			type = typeof data;
			if (type == 'object') {
				// 设置当前页
				pageDiv.currentPage = page;
				// 清空table
				element.empty();
				for (var i = 0; i < data.length; ++i) {
					element.append(listTemplate.replace(/{(\d+)}/g, function (sub) {
						switch (sub) {
							//case '{0}' : return i+1;
							case '{1}' : return data[i]['song'];
							case '{2}' : return data[i]['artist'];
							case '{3}' : return data[i]['time'];
							case '{4}' : return data[i]['sid'];
						}
					}));
				}
				if (data.length == 0) {
					element.html('<tr><td colspan="4">列表为空.....</td></tr>');
				}
				// 给删除按钮绑定删除事件
				element.find('a').click(delItem);
			} else {
				element.html('<tr><td colspan="4">服务器出错了.....</td></tr>');
				pageDiv.currentPage = 1;
			}
			table.show();
			pageDiv.initPageBar(parseInt(($("#"+lastlist).html().match(/\d+/))[0]));
		},
		'beforeSend' : function(xhr) {
			table.hide();
			element.html("程序君正在努力加载中，请稍等~");
		},
		"error": function () {
			table.show();
			element.html('<tr><td colspan="4">无法加载列表.....</td></tr>');
			pageDiv.currentPage = 1;
		}
	});
}

function delItem(e) {
	var self = this;
	var cssClass = "." + lastlist + "-num";
	param = {};
	param.m = lastlist;
	param.f = "del";
	param.sid = $(this).attr('sid');
	$.getJSON('action.php',param,function (data) {
		if (data == "ok") {
			$(cssClass).html($(cssClass).html().replace(/-?\d+/, function (num){
				return parseInt(num) - 1;
			}));
			$(self).closest('tr').remove();
		} else {
			$('#adArea').html('出错了.....');
		}
	});
}

function clickPage() {
	if ($(this).html() != pageDiv.currentPage) {
		getListByAjax(lastlist,$(this).html());
	}
};

var pageDiv = {
	currentPage :1,
	itemPerPage : 10,
	totalPage : 1,
	initPageBar : function (items) {
		pageDiv.totalPage = Math.ceil(items/pageDiv.itemPerPage);
		cp = pageDiv.currentPage;
		pageDiv.edgePage();
		pageDiv.midPage(cp);
		pageDiv.addCurrentClass();
	},
	shiftPageBar : function () {
		tp = pageDiv.totalPage;
		if (tp > 7) {
			mid = parseInt($('#pagebar a.pages').eq(3).html());
			newmid = this.id == "left_arrow" ? mid - 5 : mid + 5;
			pagDiv.midPage(newmid);
			pageDiv.addCurrentClass();
		}
	},
	edgePage: function () {
		tp = pageDiv.totalPage;
		$('#first_page').html(1);
		$('#first_page').show();
		if (tp > 1) {
			$('#last_page').show();
			$('#last_page').html(tp);
		} else {
			$('#last_page').hide();
		};
	},
	midPage: function (mp) {
		tp = pageDiv.totalPage; // total page
		if (cp <= 4) {
			arr = [2,3,4,5,6];
			$('#left_suspension').hide();
			$('#right_suspension').show();
		} else if (tp - cp <= 3) {
			arr = [tp-5,tp-4,tp-4,tp-3,tp-2,tp-1];
			$('#left_suspension').show();
			$('#right_suspension').hide();
		} else {
			arr = [mp-2,mp-1,mp,mp+1,mp+2];
			$('#left_suspension').show();
			$('#right_suspension').show();
		}
		if (tp < 8) {
			$('#left_suspension').hide();
			$('#right_suspension').hide();
			$('#left_arrow').hide();
			$('#right_arrow').hide();
		} else {
			$('#left_arrow').show();
			$('#right_arrow').show();
		}
		$('#pagebar a.pages').each(function (index){
			if (index > 0 && index < 6) {
				pagenum = arr.shift();
				if (pagenum < tp) {
					$(this).html(pagenum);
					$(this).show();
				} else {
					$(this).hide();
				}
			}
		});
	},
	addCurrentClass: function () {
		$('#pagebar a.pages').each(function (){
			$(this).removeClass('current-page');
			if (parseInt($(this).html()) == pageDiv.currentPage) {
				$(this).addClass('current-page');
			}
		});
	},
	bindEvent: function () {
		$('#left_arrow').click(pageDiv.shiftPageBar);
		$('#right_arrow').click(pageDiv.shiftPageBar);
		$('#pagebar a.pages').click(clickPage);
	}
}

function setCookie(c_name, value, expiredays) {
	var exdate = new Date()
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1)
				c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return ""
}
// sample
// function checkCookie() {
	// username = getCookie('username')
	// if (username != null && username != "") {
		// alert('Welcome again ' + username + '!')
	// } else {
		// username = prompt('Please enter your name:', "")
		// if (username != null && username != "") {
			// setCookie('username', username, 365)
		// }
	// }
// }
listTemplate = '<tr><td>{1}</td><td>{2}</td><td>{3}</td><td><a href="javascript:;" class="del-button" sid="{4}" hidefocus>删除</a></td></tr>';