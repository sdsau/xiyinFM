/*
* YY开放平台JavaScript SDK
* @create date 2012-01-06
* @modify data 2013-01-15
* @version 1.10 beta
* ............................................................................
* ............................................................................
* yy open platform client javascript sdk 
* 广州华多网络科技有限公司 版权所有 (c) 2005-2012 DuoWan.com [多玩游戏]

******************************************************************************
* 更多开发资料请参考open.yy.com
*******************************************************************************/

//(function() {
var yy_e_api_call_error = 0xF230; //十进制值62000  Api调用错误，错误的函数名称，错误的调用格式会返回此错误。
var yy_e_api_param_error = 0xF231; //十进制值62001 Api调用参数错误，错误的参数个数和类型，会触发此错误。
var yy_e_api_return_format_error = 0xF232; //十进制值62002 Api调用返回值格式错误。
var yy_e_api_not_exist = 0xF233; //十进制值62003 Api不存在或者此YY版本下没有实现。
//------------------------------IYYCommon------------------------------------------------------------------------
/**
* IYYCommon 接口。
* @class 公共功能原型类，提供比如事件的侦听，取消侦听等公共功能。
* @constructor
*/
function IYYCommon() {
    /**
    * 保存事件侦听函数的对象，事件的类型作为eventsMap的key, key为事件唯一描述字符串，具体事件key 值，在每个接口有单独定义。
    * @field
    * @private
    */
    this.eventsMap = {};
};

/**
* 增加侦听事件。
* @param {String} eventType 事件的类型key，比如: IYY.ACTIVE,IYYChannel.CHANNEL_INFO_CHANGED
* @param {function} listenerFunc 事件的侦听函数。
*/
IYYCommon.prototype.addEventListener = function(eventType, listenerFunc) {
    if (this.eventsMap[eventType] === null || this.eventsMap[eventType] === undefined || this.eventsMap[eventType].length === 0) {
        this.eventsMap[eventType] = [listenerFunc];
        //第一次侦听，打开侦听功能
        switch (eventType) {
            case IYY.ACTIVE:
                callExternal("SubscribeYYEvent", eventType, true);
                break;
            case IYYAudio.RECORD_ERR:
            case IYYAudio.RECORD_FINISHED:
                callExternal("SubscribeAudioEvent", eventType, true);
                break;
            case IYYChannel.CHANNEL_INFO_CHANGED:
            case IYYChannel.FOCUS_CHANNEL_CHANGED:
            case IYYChannel.SUB_CHANNEL_ADD:
            case IYYChannel.SUB_CHANNEL_DEL:
            case IYYChannel.USER_ENTER_CHANNEL:
            case IYYChannel.USER_LEAVE_CHANNEL:
                callExternal("SubscribeChannelEvent", eventType, true);
                break;
            case IYYChannelAppMsg.APP_LINK_CLICKED:
            case IYYChannelAppMsg.APP_LINK_EX_CLICKED:
                callExternal("SubscribeAppMsgEvent", eventType, true);
                break;
            case IYYChannelMicList.USER_JOIN:
            case IYYChannelMicList.USER_LEAVE:
            case IYYChannelMicList.USER_MOVE:
            case IYYChannelMicList.CLEAR:
            case IYYChannelMicList.USER_LINKED:
            case IYYChannelMicList.USER_UNLINKED:
            case IYYChannelMicList.MODE_CHANGED:
                callExternal("SubscribeMicListEvent", eventType, true);
                break;
            case IYYChannelUserListPopMenu.CLICKED:
                callExternal("SubscribePopMenuEvent", eventType, true);
                break;
            case IYYNet.RECV:
            case IYYNet.CLOSED:
                callExternal("SubscribeNetEvent", eventType, true);
                break;
            case IYYUser.USER_INFO_CHANGED:
                callExternal("SubscribeUserEvent", eventType, true);
                break;
            case IYYTempAudioSession.USER_ENTER_ROOM:
            case IYYTempAudioSession.USER_LEAVE_ROOM:
                callExternal("SubscribeTempAudioSessionEvent", eventType, true);
                break;                
            default:
        }

    }
    else {
        this.eventsMap[eventType].push(listenerFunc);
    }

};

/**
* 删除侦听事件。即删除指定事件的所有侦听函数。
* @param {String} eventType 事件的类型。
*/
IYYCommon.prototype.removeEventListener = function(eventType) {
    if (this.eventsMap[eventType] !== null && this.eventsMap[eventType] !== undefined) {
        this.eventsMap[eventType] = []; //如果设置为null，dispatch时容易报错
        //取消侦听功能
        switch (eventType) {
            case IYY.ACTIVE:
                callExternal("SubscribeYYEvent", eventType, false);
                break;
            case IYYAudio.RECORD_ERR:
            case IYYAudio.RECORD_FINISHED:
                callExternal("SubscribeAudioEvent", eventType, false);
                break;
            case IYYChannel.CHANNEL_INFO_CHANGED:
            case IYYChannel.FOCUS_CHANNEL_CHANGED:
            case IYYChannel.SUB_CHANNEL_ADD:
            case IYYChannel.SUB_CHANNEL_DEL:
            case IYYChannel.USER_ENTER_CHANNEL:
            case IYYChannel.USER_LEAVE_CHANNEL:
                callExternal("SubscribeChannelEvent", eventType, false);
                break;
            case IYYChannelAppMsg.APP_LINK_CLICKED:
            case IYYChannelAppMsg.APP_LINK_EX_CLICKED:
                callExternal("SubscribeAppMsgEvent", eventType, false);
                break;
            case IYYChannelMicList.USER_JOIN:
            case IYYChannelMicList.USER_LEAVE:
            case IYYChannelMicList.USER_MOVE:
            case IYYChannelMicList.CLEAR:
            case IYYChannelMicList.USER_LINKED:
            case IYYChannelMicList.USER_UNLINKED:
            case IYYChannelMicList.MODE_CHANGED:
                callExternal("SubscribeMicListEvent", eventType, false);
                break;
            case IYYChannelUserListPopMenu.CLICKED:
                callExternal("SubscribePopMenuEvent", eventType, false);
                break;
            case IYYNet.RECV:
            case IYYNet.CLOSED:
                callExternal("SubscribeNetEvent", eventType, false);
                break;
            case IYYUser.USER_INFO_CHANGED:
                callExternal("SubscribeUserEvent", eventType, false);
                break;
            case IYYTempAudioSession.USER_ENTER_ROOM:
            case IYYTempAudioSession.USER_LEAVE_ROOM:
                callExternal("SubscribeTempAudioSessionEvent", eventType, false);
                break;
            default:
        }

    }
};

/**
* 触发事件，注意：此接口，在外部不要调用，外部调用此函数触发的事件，为无效事件
* @param {String} eventType 事件类型。 
* @param {String} eventData 事件数据。 
* @private
*/
IYYCommon.prototype.dispatchEvent = function(eventType, eventData) {
    //触发事件
    if (this.eventsMap[eventType] === null || this.eventsMap[eventType] === undefined) return;
    for (var i = 0; i < this.eventsMap[eventType].length; i++) {
        switch (arguments.length) {
            case 1:
                this.eventsMap[eventType][i](); //不需要信息的事件
                break;
            case 2:
                this.eventsMap[eventType][i](eventData);
                break;
            default:
        }
    }
};
//--------------------------------------set debug mode-----------------------
//设置为true时，会在id为txtConsole的textarea文本框中输出调试信息
var debugMode = false;

//--------------------------------------IYY----------------------------------
/**
* IYY 构造函数。
* @extends IYYCommon
* @class yy接口入口，获取到yy的其他接口和方法。
* @constructor
*/
function IYY() {
    /**
    * 获取语音接口。
    * @field
    * @type IYYAudio
    * @see IYYAudio   
    */
    this.audio = new IYYAudio();

    /**
    * 获取频道接口。
    * @field
    * @type IYYChannel
    * @see IYYChannel   
    */
    this.channel = new IYYChannel();

    /**
    * 获取简单存储接口。  
    * @field
    * @type IYYCloud
    * @see IYYCloud
    */
    this.cloud = new IYYCloud();

    /**
    * 获取IM接口。
    * @field
    * @type IYYIM
    * @see IYYIM    
    */
    this.im = new IYYIM();

    /**
    * 获取网络接口。
    * @field
    * @type IYYNet
    * @see IYYNet
    */
    this.net = new IYYNet();

    /**
    * 获取安全接口。
    * @field
    * @type IYYSecurity
    * @see IYYSecurity
    */
    this.security = new IYYSecurity();

    /**
    * 获取当前用户信息。
    * @field
    * @see IYYUser
    * @type IYYUser
    */
    this.user = new IYYUser();

    /**
    * 获取临时语音接口。
    * @field
    * @see IYYTempAudioSession
    * @type IYYTempAudioSession
    */
    this.tempAudioSession = new IYYTempAudioSession();
    /**
    * 获取应用互动接口。
    * @field
    * @see IYYInteraction
    * @type IYYInteraction
    */
    this.interaction = new IYYInteraction();

    var ret = callExternal("IYY_GetVersion");
    var ver = new YYVersion();
    ver.majorVersion = ret.main_version;
    ver.minorVersion = ret.sub_version;
    /**
    * 获取YY API的版本。
    * @returns 返回YY API的版本,是一个YYVersion对象。
    * @type YYVersion
    * @see YYVersion
    */
    this.version = ver;


    var retv = callExternal("IYYEx_GetYYVersion");
    var yyver = "";
    if (retv.ret === 0) yyver = retv.version;
	/**
    * 获取YY客户端的版本信息。
    * @returns 返回YY的版本,是一个字符串，发布版本典型的版本格式为"YY 4.17.0.3",注意空格。获取失败时返回空字符串。
    * @type String
    */
    this.yyVersion = yyver; 
    
    
    //关闭所有事件，提高效率
    

    callExternal("SubscribeAudioEvent","ALL", false);
    callExternal("SubscribeAppMsgEvent","ALL", false);
    callExternal("SubscribeChannelEvent","ALL", false);
    callExternal("SubscribeYYEvent","ALL", false);
    callExternal("SubscribeMicListEvent","ALL", false);
    callExternal("SubscribeUserEvent","ALL", false);
    callExternal("SubscribeNetEvent","ALL", false);
    callExternal("SubscribePopMenuEvent","ALL", false);
    callExternal("SubscribeTempAudioSessionEvent", "ALL",false);
};

IYY.prototype = new IYYCommon();


/**
* 应用激活事件。当应用运行时，应用图标在应用盒子或者其他应用入口被点击时产生的事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.activeCode: Number类型，正整数，表示点击的来源，0=点击来源于应用盒子图标。
*
* @example
* 使用示例：
* yy.addEventListener(IYY.ACTIVE,onActive);
*
* function onActive(eventData)
* {
*    document.getElementById("txtLog").innerHTML="点击来源："+eventData.activeCode;
* }
*/
IYY.ACTIVE = "YY_ACTIVE";

//------------------------------IYYAudio------------------------------

/**
* IYYAudio 构造函数。
* @extends IYYCommon
* @class 语音控制接口，提供处理YY的音频信息，比如录音的控制等。
* @constructor
*/
function IYYAudio() {

};

IYYAudio.prototype = new IYYCommon();
/**
* 开始录音
* @param {String} fileName 指定录音文件的文件名，不需要路径。
* 格式为MP3，会录制到固定的路径中，如果两次录音指定了同一个文件，第二次的会被覆盖。不指定文件名的话系统会使用默认名称。
* @returns 返回操作是否成功 0=成功， 非0值失败，具体请参考错误代码。
* @type Number
*/
IYYAudio.prototype.startRecord = function(fileName) {
    var result;
    if (arguments.length === 0) {
        result = callExternal("IAudio_StartRecord");
    }
    else if (arguments.length > 1) {
        return yy_e_api_param_error; //出错，参数错误
    }
    else {
        if (typeof (fileName) !== "string") return yy_e_api_param_error;
        result = callExternal("IAudio_StartRecord",fileName);
    }
    return result.ret;
};
/**
* 停止录音
* @returns 返回操作是否成功,0=成功， 非0值失败，具体请参考错误代码。
* @type Number
*/
IYYAudio.prototype.stopRecord = function() {
    var result = callExternal("IAudio_StopRecord");
    return result.ret;
};

/**
* 打开卡拉ok效果,即播放伴奏。<br>
* 权限规则如下：<br>
* OW,VP，MA 在当前的频道内，在任何模式下都可以开启和关闭卡拉OK功能。
* CA,CA2 在当前频道内拥有管理权限的子频道内可以开启和关闭卡拉OK功能。
* VIP，G，R，U必须在自由模式下或者麦序模式下到首位麦序的时候可以开启和关闭卡拉OK功能。
* 字母代表的意义如下：<br>
* 游客(U),临时嘉宾(G),嘉宾(VIP),会员(R),二级子频道管理员(CA2),子频道管理员(CA),全频道管理员(MA),频道总管理(VP),频道所有者(OW)<br>
* @returns 返回操作是否成功,0=成功， 非0值失败，具体请参考错误代码。
* @type Number
*/
IYYAudio.prototype.openKaraoke = function() {
    var result = callExternal("IAudio_OpenKaraoke");
    return result.ret;
};
/**
* 关闭卡拉ok效果,,即停止伴奏。权限规则和openKaraoke方法相同。
* @see #openKaraoke
* @returns 返回操作是否成功,0=成功， 非0值失败，具体请参考错误代码。
* @type Number
*/
IYYAudio.prototype.closeKaraoke = function() {
    var result = callExternal("IAudio_CloseKaraoke");
    return result.ret;
};

/**
* 开启混响效果。
* @returns 返回操作是否成功,0=成功， 非0值失败，具体请参考错误代码。
* @type Number
*/
IYYAudio.prototype.enableAudioMixing = function () {
    var result = callExternal("IAudio_EnableAudioMixing");
    return result.ret;
};
/**
* 关闭混响效果。
* @returns 返回操作是否成功,0=成功， 非0值失败，具体请参考错误代码。
* @type Number
*/
IYYAudio.prototype.disableAudioMixing = function () {
    var result = callExternal("IAudio_DisableAudioMixing");
    return result.ret;
};

/**
* 音频录音出错事件。录音出错的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.errCode: Number类型，整数，录音出错代码。
*
* @example
* 使用示例：
* yy.audio.addEventListener(IYYAudio.RECORD_ERR,onRecordError);
*
* function onRecordError(eventData)
* {
*    document.getElementById("txtLog").innerHTML=eventData.errCode;
* }
*/
IYYAudio.RECORD_ERR = "YY_RECORD_ERR";


/**
* 音频录音完成事件。录音完成的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.result: Number类型，表示录音结果的整数。 0=录音正确，非0值表示录音过程中有错误。
* eventData.fileName: String类型 录音文件的路径和文件名 。
*
* @example
* 使用示例：
* yy.audio.addEventListener(IYYAudio.RECORD_FINISHED,onRecordFinish);
*
* function onRecordFinish(eventData)
* {
*    if(eventData.result==0)
*    {
*       document.getElementById("txtLog").innerHTML="录好的文件在："+eventData.fileName;
*    }
* }
*/
IYYAudio.RECORD_FINISHED = "YY_RECORD_FINISHED";

//-------------------------------------IYYChannel-----------------------------------
/**
* IYYChannel 构造函数。
* @extends IYYCommon
* @class 频道接口，提供对频道的操作和交互。
* @constructor
*/
function IYYChannel() {

    /**
    * 获取用户菜单接口。
    * @type IYYChannelUserListPopMenu
    * @see IYYChannelUserListPopMenu    
    * @field
    */
    this.userListPopMenu = new IYYChannelUserListPopMenu();
    /**
    * 获取麦序接口。
    * @type IYYChannelMicList
    * @see IYYChannelMicList
    * @field
    */
    this.micList = new IYYChannelMicList();
    /**
    * 获取频道应用消息接口。
    * @type IYYChannelAppMsg
    * @see IYYChannelAppMsg
    * @field
    */
    this.appMsg = new IYYChannelAppMsg();

    /**
    * 获取频道用户控制接口。
    * @type IYYChannelUserController
    * @see IYYChannelUserController
    * @field
    */
    this.userController = new IYYChannelUserController();
    
    /**
    * 获取接待频道接口。
    * @type IYYReceptionChannel
    * @see IYYReceptionChannel
    * @field
    */
    this.receptionChannel = new IYYReceptionChannel();    
    
    /**
    * 获取频道 tab页接口。
    * @type IYYChannelTabPage
    * @see IYYChannelTabPage
    * @field
    */
    this.tabPage = new IYYChannelTabPage();      
    
};

IYYChannel.prototype = new IYYCommon();

/**
* 获取当前所在的根频道信息
* @returns 返回当前频道信息,是一个YYChannelInfo对象,如果频道没有短位id，短位id和长位id相同。获取失败时返回null。
* @type YYChannelInfo
* @see YYChannelInfo
*/
IYYChannel.prototype.getCurrentChannelInfo = function() {
    var result = callExternal("IChannel_GetCurrentChannelInfo");
    if (result.ret === 0) {
        return parseChannelInfo(result);
    }
    else {
        return null;
    }
};

/**
* 获取当前所在的子频道信息
* @returns 返回当前子频道信息,是一个YYChannelInfo对象。如果频道没有短位id，短位id和长位id相同。获取失败时返回null。
* @type YYChannelInfo
* @see YYChannelInfo
*/
IYYChannel.prototype.getCurrentSubChannelInfo = function() {
    var result = callExternal("IChannel_GetCurrentSubChannelInfo");
    if (result.ret === 0) {

        return parseChannelInfo(result);
    }
    else {
        return null;
    }
};

/**
* 获取当前大频道中，指定的子频道或者根频道的频道信息。
* @returns 返回指定频道信息,是一个YYChannelInfo对象。如果频道没有短位id，短位id和长位id相同。获取失败时返回null。
* @param {Number} cid 频道的id号 <b>是频道的长位Id</b> 。
* @type YYChannelInfo
* @see YYChannelInfo    
* 
*/
IYYChannel.prototype.getChannelInfo = function(cid) {
    if (arguments.length !== 1) return null;
    if (typeof cid !== "number" || isNaN(cid)) return null;
    var result = callExternal("IChannel_GetChannelInfo", cid);
    if (result.ret === 0) {
        return parseChannelInfo(result);
    }
    else {
        return null;
    }
};

//原始信息格式{"ret":0,"long_id":15477857}
/**
* 获取当前根频道id。
* @returns 返回当前根频道的频道长位id。获取失败时返回0。
* @type Number
*/
IYYChannel.prototype.getRootChannelId = function() {
    var result = callExternal("IChannel_GetRootChannelId");
    if (result.ret === 0) {
        return result.long_id;
    }
    else {
        return 0;

    }
};

//返回原始数据 {ret:0,ids:[15777555,18955441,15478888]}
/**
* 获取指定频道的所有子频道的id。
* @param {Number} cid 指定频道的的长位id,必须是在当前大频道中的一个频道。 
* @returns 返回所有子频道的长位id,id保存在一个数组中。获取失败时返回空数组。
* @type Array
*/
IYYChannel.prototype.getSubChannelIds = function(cid) {
    if (arguments.length !== 1) return [];
    if (typeof cid !== "number" || isNaN(cid)) return [];
    var result = callExternal("IChannel_GetSubChannelIds", cid);
    if (result.ret === 0) {
        return result.ids;
    }
    else {
        return [];
    }
};


/**
* 当前频道信息变化事件。用户<b>当前</b>所在的频道(子频道或者根频道)信息变化时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData: Object类型 是YYChannelInfo对象，保存频道的新信息。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.CHANNEL_INFO_CHANGED,onChannelInfoChanged);
*
* function onChannelInfoChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="发生变化的频道号："+eventData.longId+" 名称为："+eventData.name;
* }
*/
IYYChannel.CHANNEL_INFO_CHANGED = "YY_CHANNEL_INFO_CHANGED";

/**
* 切换频道事件。用户在大频道中切换频道的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.departedId: Number类型 离开的频道的长位id。
* eventData.nowId: Number类型 进入的频道的长位id。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.FOCUS_CHANNEL_CHANGED,onFocusChanged);
*
* function onFocusChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="离开："+eventData.departedId+" 进入了"+eventData.nowId;
* }
*/
IYYChannel.FOCUS_CHANNEL_CHANGED = "YY_FOCUS_CHANNEL_CHANGED";


/**
* 子频道增加事件。子频道创建的时候会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.cid: Number类型 增加的子频道的长位id。
* eventData.pcid: Number类型 增加到哪个频道下，长位id。
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.SUB_CHANNEL_ADD,onChannelAdd);
*
* function onChannelAdd(eventData)
* {
*     document.getElementById("txtLog").innerHTML="新的频道"+eventData.cid+"位于"+eventData.pcid+"下面";
* }
*/
IYYChannel.SUB_CHANNEL_ADD = "YY_SUB_CHANNEL_ADD";

/**
* 子频道删除事件。子频道被删除时触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.cid: Number类型 被删除的子频道长位id。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.SUB_CHANNEL_DEL,onChannelDel);
*
* function onChannelDel(eventData)
* {
*     document.getElementById("txtLog").innerHTML="被删除的子频道："+eventData.cid;
* }
*/
IYYChannel.SUB_CHANNEL_DEL = "YY_SUB_CHANNEL_DEL";

/**
* 用户进入当前大频道事件。当用户进入当前大频道中任一频道就会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 进入频道的用户uid。
* eventData.cid: Number类型 进入时，所在的那个频道的长位id。  
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.USER_ENTER_CHANNEL,onUserEnter);
*
* function onUserEnter(eventData)
* {
*     document.getElementById("txtLog").innerHTML="有新用户"+eventData.uid+"进入到"+eventData.cid+"频道";
* }
*/
IYYChannel.USER_ENTER_CHANNEL = "YY_USER_ENTER_CHANNEL";


/**
* 用户离开当前大频道事件。当有用户离开当前大频道就会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 离开频道的用户uid。
* eventData.cid: Number类型 离开大频道时所处的频道的长位id。
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.USER_LEAVE_CHANNEL,onUserLeave);
*
* function onUserLeave(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开了"+eventData.cid+"频道";
* }
*/
IYYChannel.USER_LEAVE_CHANNEL = "YY_USER_LEAVE_CHANNEL";


//-------------------------------------IYYChannelAppMsg-----------------------------------
/**
* IYYChannelAppMsg 构造函数
* @extends IYYCommon
* @class 频道应用消息接口，提供频道的应用消息发送和响应等操作，应用消息出现在应用盒子的应用消息选项卡中和公告栏下方。
* @constructor
*/
function IYYChannelAppMsg() {
};

IYYChannelAppMsg.prototype = new IYYCommon();


/**
* 发送应用消息到子频道。所有该子频道在线用户才能收到。
* @param {Number} subChannelId 子频道长位id。    
* @param {String} msg 消息内容，最大长度200字节。
* @param {Number} linkstart 内容中超链接开始位置，必须为正整数。
* @param {Number} linkend 内容中超链接结束位置，必须为正整数。    
* @param {Number} token  设置token，消息标记，必须为正整数。  
* @returns 发送是否成功。 0=成功 非0值参考错误代码。
* @type Number
*/
IYYChannelAppMsg.prototype.sendMsgToSubChannel = function(subChannelId, msg, linkstart, linkend, token) {
    if (arguments.length !== 5) return yy_e_api_param_error;
    if (typeof subChannelId !== "number" || typeof msg !== "string" || typeof linkstart !== "number" || typeof linkend !== "number" || typeof token !== "number") return yy_e_api_param_error;
    if (isNaN(subChannelId) || isNaN(linkstart) || isNaN(linkend) || isNaN(token)) return yy_e_api_param_error;
    msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IChannelAppMsg_SendMsgToSubChannel", subChannelId, msg, linkstart, linkend, token);
    return result.ret;
};


/**
* 发送应用消息给指定用户。用户必须在同一大频道中，且必须在线才能收到。
* @param {Array} userList 存有目标用户uid的数组。    
* @param {String} msg 消息内容 最大长度200字节。
* @param {Number} linkstart 内容中超链接开始位置，必须为正整数。
* @param {Number} linkend 内容中超链接结束位置，必须为正整数。    
* @param {Number} token  设置token，消息标记，必须为正整数。 
* @returns 发送是否成功。 0=成功 非0值参考错误代码。
* @type Number
*/
IYYChannelAppMsg.prototype.sendMsgToUsers = function(userList, msg, linkstart, linkend, token) {
    if (arguments.length !== 5) return yy_e_api_param_error;
    if (!(userList instanceof Array) || typeof msg !== "string" || typeof linkstart !== "number" || typeof linkend !== "number" || typeof token !== "number") return yy_e_api_param_error;
    if (isNaN(linkstart) || isNaN(linkend) || isNaN(token)) return yy_e_api_param_error;
    msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IChannelAppMsg_SendMsgToUsers", userList, msg, linkstart, linkend, token);
    return result.ret;
};

/**
* 发送应用消息到子频道。所有该子频道在线用户才能收到。可以发送包含多个链接的消息。
* @param {Number} subChannelId 子频道长位id。    
* @param {Number} token  设置token，消息标记，必须为正整数。  
* @param {String} key  消息的认证key，根据消息内容和应用Id计算出的key，应用通过审核后，可以在open.yy.com获取。  
* @param {Array} textData  包含文字信息的数组，数组每个元素是json对象，示例如下。<br>
* [{ text: "嘎嘎鱼", type: 2, userData: 87639876 }, { text: "邀请全部子频道的人一起玩", type: 1 }, { text: "猜骰子", type: 2, userData: 105620}]<br>
* 数组中每个元素的格式:<br>
* text： 文字信息<br>
* type： 是普通文字还是链接文字，1=普通文字 2=链接文字 其他值无效<br>
* userData： 如果是链接文字,userData保存链接自定义数据，是一个正整数，点击链接的时候可以得到此数据，如果是普通文字可以没有此属性<br>
* @returns 发送是否成功。 0=成功 非0值参考错误代码。
* @type Number
*/
IYYChannelAppMsg.prototype.sendMsgToSubChannelEx = function(subChannelId, token, key, textData) {
    if (arguments.length !== 4) return yy_e_api_param_error;
    if (typeof subChannelId !== "number" || typeof token !== "number" || typeof key !== "string" || !(textData instanceof Array)) return yy_e_api_param_error;
    if (isNaN(subChannelId) || isNaN(token)) return yy_e_api_param_error;

    var textString = "";
    var sp = "";
    for (var i = 0; i < textData.length; i++) {
        var dtString = "{";
        if (textData[i].text === null || textData[i].text === undefined || typeof textData[i].text !== "string") {
            return yy_e_api_param_error;
        }
        else {
            var msg = textData[i].text;
            msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
            msg = msg.replace(/\"/g, "\\\""); //替换双引号
            dtString = dtString + "\"text\":\"" + msg + "\"";
        }
        if (textData[i].type === null || textData[i].type === undefined || typeof textData[i].type !== "number") {
            return yy_e_api_param_error;
        }
        else {
            dtString = dtString + ",\"type\":" + textData[i].type;
        }
        if (textData[i].userData === null || textData[i].userData === undefined) {
            if (textData[i].type === 2) return yy_e_api_param_error;
            dtString = dtString + "}";
        }
        else {
            if (typeof textData[i].userData !== "number") return yy_e_api_param_error;
            dtString = dtString + ",\"userData\":" + textData[i].userData + "}";
        }

        textString = textString + sp + dtString;
        sp = ",";
    }
    var result = callExternal("IChannelAppMsg_SendMsgToSubChannelEx", subChannelId, token, key, "[" + textString + "]");
    return result.ret;
};


/**
* 发送应用消息给指定用户。用户必须在同一大频道中，且必须在线才能收到。可以发送包含多个链接的消息。
* @param {Array} userList 存有目标用户uid的数组。    
* @param {Number} token  设置token，消息标记，必须为正整数。 
* @param {String} key  消息的认证key，根据消息内容和应用Id计算出的key，应用通过审核后，可以在open.yy.com获取。 
* @param {Array} textData  包含文字信息的数组，数组每个元素是json对象。格式同sendMsgToSubChannelEx。
* @see #sendMsgToSubChannelEx
* @returns 发送是否成功。 0=成功 非0值参考错误代码。
* @type Number
*/
IYYChannelAppMsg.prototype.sendMsgToUsersEx = function(userList, token, key, textData) {
    if (arguments.length !== 4) return yy_e_api_param_error;
    if (!(userList instanceof Array) || typeof token !== "number" || typeof key !== "string" || !(textData instanceof Array)) return yy_e_api_param_error;
    if (isNaN(token)) return yy_e_api_param_error;
    var textString = "";
    var sp = "";
    for (var i = 0; i < textData.length; i++) {
        var dtString = "{";
        //----
        if (textData[i].text === null || textData[i].text === undefined || typeof textData[i].text !== "string") {
            return yy_e_api_param_error;
        }
        else {
            var msg = textData[i].text;
            msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
            msg = msg.replace(/\"/g, "\\\""); //替换双引号
            dtString = dtString + "\"text\":\"" + msg + "\"";
        }
        //----
        if (textData[i].type === null || textData[i].type === undefined || typeof textData[i].type !== "number") {
            return yy_e_api_param_error;
        }
        else {
            dtString = dtString + ",\"type\":" + textData[i].type;
        }
        //----
        if (textData[i].userData === null || textData[i].userData === undefined) {
            if (textData[i].type === 2) return yy_e_api_param_error;
            dtString = dtString + "}";
        }
        else {
            if (typeof textData[i].userData !== "number") return yy_e_api_param_error;
            dtString = dtString + ",\"userData\":" + textData[i].userData + "}";
        }

        textString = textString + sp + dtString;
        sp = ",";
    }

    var result = callExternal("IChannelAppMsg_SendMsgToUsersEx", userList, token, key, "[" + textString + "]");
    return result.ret;
};

/**
* 应用消息链接点击事件。应用消息中的超链接被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.token: Number类型，发送消息的时候设置的token,可以用来判断哪一条消息被点击。
* @example
* 使用示例：
* yy.channel.appMsg.addEventListener(IYYChannelAppMsg.APP_LINK_CLICKED,onLinkClicked);
*
* function onLinkClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="消息的Token="+eventData.token;
* }
*/
IYYChannelAppMsg.APP_LINK_CLICKED = "YY_APP_LINK_CLICKED";

/**
* 应用消息链接点击事件。应用消息中的超链接被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.token: Number类型，发送消息的时候设置的token,可以用来判断哪一条消息被点击。
* eventData.userData: Number类型，发送消息的时候链接里设置的userData值。
* @example
* 使用示例：
* yy.channel.appMsg.addEventListener(IYYChannelAppMsg.APP_LINK_EX_CLICKED,onLinkExClicked);
*
* function onLinkExClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="消息的Token="+eventData.token+" userData="+eventData.userData;
* }
*/
IYYChannelAppMsg.APP_LINK_EX_CLICKED = "YY_APP_LINK_EX_CLICKED";



//-------------------------------IYYReceptionChannel-------------------------------
/**
* IYYReceptionChannel 构造函数。
* @extends IYYCommon
* @class 接待频道接口，提供获取，设置，取消接待频道等功能。
* @constructor
*/
function IYYReceptionChannel() {
};

IYYReceptionChannel.prototype = new IYYCommon();


/**
* 设置接待频道。
* @param {Number} cid 频道的长位id。
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYReceptionChannel.prototype.setReceptionChannel = function(cid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof cid !== "number" || isNaN(cid)) return yy_e_api_param_error;
    var result = callExternal("IReceptionChannel_SetReceptionChannel", cid);
    return result.ret;
};

/**
* 获取接待频道。
* @returns 返回接待频道的长位id，没有接待频道或者获取失败时返回0 。
* @type Number
*/
IYYReceptionChannel.prototype.getReceptionChannel = function() {
    var result = callExternal("IReceptionChannel_GetReceptionChannel");
    if (result.ret == 0) {
        return result.channel_id;
    }
    else {
        return 0
    }
};
/**
* 反设置接待频道，移除接待频道。
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYReceptionChannel.prototype.unSetReceptionChannel = function() {
    var result = callExternal("IReceptionChannel_UnSetReceptionChannel");
    return result.ret;
};


//-------------------------------IYYChannelMicList-------------------------------
/**
* IYYChannelMicList 构造函数。
* @extends IYYCommon
* @class 麦序接口，提供麦序的信息和相关事件。

* @constructor
*/
function IYYChannelMicList() {
};

IYYChannelMicList.prototype = new IYYCommon();

//原始数据格式 { "ret":0, "mic_list";[9090115887,909058887] }。
/**
* 获取麦序用户列表。
* @returns 返回麦序中所有用户的uid，uid保存在一个数组中。麦序中无用户和获取失败时返回空数组。
* @type Array
*/
IYYChannelMicList.prototype.getMicList = function() {
    var result = callExternal("IChannelMicList_GetMicList");
    if (result.ret === 0) {
        return result.mic_list;
    }
    else {
        return [];
    }
};

/**
* 加入麦序。
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.joinMicList = function() {
    var result = callExternal("IChannelMicList_JoinMicList");
    return result.ret;
};
/**
* 离开麦序。
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.leaveMicList = function() {
    var result = callExternal("IChannelMicList_LeaveMicList");
    return result.ret;
};

/**
* 拉人上麦。需要的权限跟YY客户端一致。
* @param {Number} uid 被拉用户的uid。    
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.pullUserToMicList = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelMicList_PullUserToMicList", uid);
    return result.ret;
};
/**
* 踢人下麦。需要的权限跟YY客户端一致。
* @param {Number} uid 被踢用户的uid。  
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.kickMicListUser = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelMicList_KickMicListUser", uid);
    return result.ret;
};

/**
* 清空麦序。需要的权限跟YY客户端一致。
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.clearMicList = function() {
    var result = callExternal("IChannelMicList_ClearMicList");
    return result.ret;
};

/**
* 将用户调整到2号麦序。需要的权限跟YY客户端一致。
* @param {Number} uid 被移动用户的uid。  
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.moveUserToTop = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelMicList_MoveUserToTop", uid);
    return result.ret;
};


/**
* 获取连麦用户列表。
* @returns 返回连麦中的所有用户的uid，uid保存在一个数组中。无人连麦,不是麦序模式,调用错误均返回空数组。
* @type Array
*/
IYYChannelMicList.prototype.getLinkedMicList = function () {
    var result = callExternal("IChannelMicList_GetLinkedMicList");
    if (result.ret === 0) {
        return result.linked_mic_list;
    }
    else {
        return [];
    }
};

/**
* 将用户加入到连麦列表。需要在麦序模式才有效，需要有频道管理员及以上权限才能调用成功。
* @param {Number} uid 被连麦用户的uid。  
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.linkMicToTheQueueHead = function (uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelMicList_LinkMicToTheQueueHead", uid);
    return result.ret;
};

/**
* 将用户移出连麦列表。需要在麦序模式才有效，需要有频道管理员及以上权限才能调用成功。
* @param {Number} uid 移出连麦的用户的uid。  
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.removeFromLinkedMicList = function (uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelMicList_RemoveFromLinkedMicList", uid);
    return result.ret;
};

/**
* 获得频道模式。
* @returns 返回操频道模式。0=自由模式，1=主席模式，2=麦序模式，-1=获取失败。
* @type Number
*/
IYYChannelMicList.prototype.getMicListMode = function () {
    var result = callExternal("IChannelMicList_GetMicListMode");
    if (result.ret == 0) {
        return result.mode;
    } else {
        return -1;
    }
   
};
/**
* 设置频道模式。两次调用需要有一定的时间间隔。
* @param {Number} mode 频道模式，0=自由模式，1=主席模式，2=麦序模式，其它值无效。  
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYChannelMicList.prototype.setMicListMode = function (mode) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof mode !== "number" || isNaN(mode)) return yy_e_api_param_error;
    var result = callExternal("IChannelMicList_SetMicListMode",mode);
    return result.ret;
};

/**
* 麦序用户增加事件。当有用户加入到麦序时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 加入的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_JOIN,onUserJoin);
*
* function onUserJoin(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"加入到了麦序中";
* }
*/
IYYChannelMicList.USER_JOIN = "YY_MICLIST_USER_JOIN";


/**
* 麦序用户离开事件。当有用户离开麦序时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 离开的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_LEAVE,onUserLeave);
*
* function onUserLeave(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开麦序了";
* }
*/
IYYChannelMicList.USER_LEAVE = "YY_MICLIST_USER_LEAVE";


/**
* 麦序用户移动事件。麦序用户发生位置调整的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.moveId: Number类型 麦序中发生移动的用户uid。
* eventData.toAfterId: Number类型 移动到哪个用户后面，用户无法移动到第一个。   
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_MOVE,onUserMove);
*
* function onUserMove(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"移动到"+eventData.toAfterId+"后面";
* }
*/
IYYChannelMicList.USER_MOVE = "YY_MICLIST_USER_MOVE";


/**
* 麦序用户清除事件。麦序用户全部被清除的时候会触发。
* @field
* @example
* 侦听函数格式: function(){    } 
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.CLEAR,onUserClear);
*
* function onUserClear()
* {
*     document.getElementById("txtLog").innerHTML="麦序用户被清除";
* }
*/
IYYChannelMicList.CLEAR = "YY_MICLIST_CLEAR";

/**
* 用户加入连麦列表事件。当有新的用户连麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 新加入连麦的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_LINKED,onUserLinked);
*
* function onUserLinked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"加入连麦";
* }
*/
IYYChannelMicList.USER_LINKED = "YY_MICLIST_USER_MIC_LINKED";


/**
* 用户移出连麦列表事件。当有用户移出连麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 被移出连麦的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_UNLINKED,onUserUnlinked);
*
* function onUserUnlinked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"移出连麦";
* }
*/
IYYChannelMicList.USER_UNLINKED = "YY_MICLIST_USER_MIC_UNLINKED";

/**
* 频道模式变化事件。当频道模式发生变化的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.mode: Number类型 当前的频道模式 0=自由模式，1=主席模式，2=麦序模式。
* @example
* 使用示例： 
* yy.channel.micList.addEventListener(IYYChannelMicList.MODE_CHANGED,onModeChanged);
*
* function onModeChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="当前频道模式="+eventData.mode;
* }
*/
IYYChannelMicList.MODE_CHANGED = "YY_MICLIST_MODE_CHANGE";
//-------------------------------IYYChannelUserController-------------------------------
/**
* IYYChannelUserController 构造函数。
* @extends IYYCommon
* @class 频道用户控制接口。
* @constructor
*/
function IYYChannelUserController() {

};

IYYChannelUserController.prototype = new IYYCommon();

/**
* 允许频道用户发言。权限规则和disableMsg方法相同。
* @see #disableMsg
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码。
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @type Number
*/
IYYChannelUserController.prototype.enableMsg = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelUserController_EnableMsg", uid);
    return result.ret;
};

/**
* 禁止频道用户发言。
* 权限规则如下<br>
* OW:可以允许和禁止频道内任何其他成员语音，文字。包括（VP MA CA CA2 R VIP G U)。<br>
* VP：可以允许和禁止频道内任何其他成员语音，文字。 除了（OW，VP）。<br>
* MA：可以允许和禁止频道内任何其他成员语音，文字。 除了（OW，VP,MA）。<br>
* CA：可以允许和禁止相对应有管理权限的子频道内的语音，文字。包括（ CA2 R VIP G U）。<br>
* CA2：可以允许和禁止相对应有管理权限的子频道内的语音，文字。包括（ R VIP G U）。<br>
* R VIP G U 均无任何权限操作。<br>
* 字母代表的意义如下：<br>
* 游客(U),临时嘉宾(G),嘉宾(VIP),会员(R),二级子频道管理员(CA2),子频道管理员(CA),全频道管理员(MA),频道总管理(VP),频道所有者(OW)
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @type Number
* @see #enableMsg
*/
IYYChannelUserController.prototype.disableMsg = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelUserController_DisableMsg", uid);
    return result.ret;
};
/**
* 允许频道用户说话。权限规则和disableMsg方法相同。
* @see #disableMsg
* @returns 返回操作是否成功。0=成功， 其它值请参考错误代码
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @type Number
*/
IYYChannelUserController.prototype.enableSpeak = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelUserController_EnableSpeak", uid);
    return result.ret;
};
/**
* 禁止频道用户说话。权限规则和disableMsg方法相同。
* @see #disableMsg
* @returns 返回操作是否成功。0=成功，其它值请参考错误代码
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @type Number
*/
IYYChannelUserController.prototype.disableSpeak = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IChannelUserController_DisableSpeak", uid);
    return result.ret;
};

/**
* 进子频道。
* @param {Number} cid 子频道长位id,必须是在当前大频道中的一个频道。 
* @returns 返回操作是否成功，0=成功，非0值失败，具体请参考错误代码。
* @type Number
*/
IYYChannelUserController.prototype.jumpToSubChannel = function(cid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof cid !== "number" || isNaN(cid)) return yy_e_api_param_error;
    var result = callExternal("IChannelUserController_JumpToSubChannel", cid);
    return result.ret;
};
/**
* 拉人进子频道。<br>
* 权限规则如下<br>
* OW：可以调度频道内任何成员,包括（VP MA CA CA2 R VIP G U)。<br>
* VP：可以调度频道内除OW以外的任何成员，包括（VP MA CA1 CA2 R VIP G U)。<br>
* MA：可以调度频道内除了OW，VP以外的任何成员，包括（MA CA CA2 R VIP G U)。<br>
* CA:可以调度相对应有管理权限的1级子频道内的成员，（OW，VP,MA）除外。<br>
* CA2：可以调度相对应有管理权限的2级子频道内的成员，（OW，VP,MA，CA1）除外。<br>
* R VIP G U 均无任何权限操作。<br>
* 字母代表的意义如下：<br>
* 游客(U),临时嘉宾(G),嘉宾(VIP),会员(R),二级子频道管理员(CA2),子频道管理员(CA),全频道管理员(MA),频道总管理(VP),频道所有者(OW)<br>
* @param {Number} cid 子频道长位id,必须是当前大频道中的一个频道。 
* @returns 返回操作是否成功，0=成功，非0值失败，具体请参考错误代码。
* @type Number
*/
IYYChannelUserController.prototype.pullToSubChannel = function(uid, cid) {
    if (arguments.length !== 2) return yy_e_api_param_error;
    if (typeof cid !== "number" || typeof uid !== "number" || isNaN(uid) || isNaN(cid)) return yy_e_api_param_error;
    var result = callExternal("IChannelUserController_PullToSubChannel", uid, cid);
    return result.ret;
};
/**
* 获取用户所在子频道ID。该用户必须在当前大频道中。
* @param {Number} uid 用户的uid。 
* @returns 用户所在的频道Id，获取失败或出错时返回0。
* @type Number
*/
IYYChannelUserController.prototype.getUserSubChannelId = function(uid) {
    if (arguments.length !== 1) return 0;
    if (typeof uid !== "number" || isNaN(uid)) return 0;
    var result = callExternal("IChannelUserController_GetUserSubChannelId", uid);
    if (result.ret === 0) {
        return result.cid;
    }
    else {
        return 0;
    }

};

/**
* 设置马甲。发起设置用户和被设置用户必须在线且在同一个子频道。
* @param {Number} cid 用户所在的频道id。
* @param {Number} uid 用户的uid。 
* @param {Number} role 用户的角色(马甲)数值。可以设置的马甲的数值如下：  <br>
*   游客(U)  白马 25 <br>
*   临时嘉宾(G) 浅绿色马甲 66 <br>
*   嘉宾(VIP)  绿马 88 <br>
*   会员(R)  蓝马 100 <br>
*   二级子频道管理员(CA2)  粉马 150 <br>
*   子频道管理员(CA) 红马 175 <br>
*   全频道管理员(MA)  黄马 200 <br>
*   频道总管理(VP) 橙马 230 <br>
* @returns 返回操作是否成功，0=成功，其他值请参考错误代码。
* @type Number
*/
IYYChannelUserController.prototype.setUserRole = function(cid, uid, role) {
    if (arguments.length !== 3) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid) || typeof cid !== "number" || isNaN(cid) || typeof role !== "number" || isNaN(role)) return yy_e_api_param_error;
    var result = callExternal("IChannelUserController_SetUserRole", cid, uid, role);
    return result.ret;
};
//-------------------------------IYYChannelUserListPopMenu-------------------------------
/**
* IYYChannelUserListPopMenu 构造函数。
* @extends IYYCommon
* @class 频道右键菜单接口。频道用户列表右键菜单设置和取消， 和对应的菜单事件设置 。
* @constructor
*/
function IYYChannelUserListPopMenu() {

};

IYYChannelUserListPopMenu.prototype = new IYYCommon();


/**
* 设置大频道用户列表右键菜单，可以增加一个菜单项，一个应用只可以增加一个菜单项。
* @param {String} menuText 菜单上的文字,字符串最大长度20字节。
* @returns 返回操作是否成功, 0=成功 非0值参考错误代码。
* @type Number
*/
IYYChannelUserListPopMenu.prototype.setPopMenu = function(menuText) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof menuText !== "string") return yy_e_api_param_error;
    menuText = menuText.replace(/\\/g, "\\\\"); //替换斜杠
    menuText = menuText.replace(/\"/g, "\\\""); //替换双引号    
    var result = callExternal("IChannelUserListPopMenu_SetPopMenu", menuText);
    return result.ret;
};


/**
* 去掉右键菜单增加项。
* @returns 返回操作是否成功, 0=成功 非0值参考错误代码。
* @type Number
*/
IYYChannelUserListPopMenu.prototype.unSetPopMenu = function() {
    var result = callExternal("IChannelUserListPopMenu_UnSetPopMenu");
    return result.ret;
};


/**
* 用户点击菜单项事件。当用户列表右键菜单项被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.uid: Number类型 被选中的用户的uid。
* eventData.cid: Number类型 当前的频道长位id。    
* @example
* 使用示例：
* yy.channel.userListPopMenu.addEventListener(IYYChannelUserListPopMenu.CLICKED,onClicked);
*
* function onClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"菜单被点击,当前频道"+eventData.cid;
* }
*/

IYYChannelUserListPopMenu.CLICKED = "YY_POP_MENU_CLICKED";

//-------------------------------IYYChannelTabPage-------------------------------
/**
* IYYChannelTabPage 构造函数。
* @extends IYYCommon
* @class 频道tab页控制接口 。
* @constructor
*/
function IYYChannelTabPage() {

};

IYYChannelTabPage.prototype = new IYYCommon();
/**
* 显示应用所在的tabpage窗口。
* @type Number
*/
IYYChannelTabPage.prototype.selectTabPage = function() {
    var result = callExternal("IChannelTabPage_SelectTabPage");
    return result.ret;
};
//-------------------------------IYYCloud-----------------------------

/**
* IYYCloud 构造函数。
* @extends IYYCommon
* @class 简单存储接口。提供简单的简单存储数据服务，包括增，删，改，查的基本操作，除了 频道所有者(OW紫马)和 频道总管理(VP橙马)可以删除和修改所有数据之外，其他用户只能删除和修改自己的数据，每个用户都可以查询所有数据。
* @constructor
*/
function IYYCloud() {

};


IYYCloud.prototype = new IYYCommon();

//----------常量----------



/**
* 增加数据。<b>注意:同一个用户在一个应用中两次保存之间需要间隔1秒</b>。
* @param {Number} int1 要保存的数据，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {Number} int2 要保存的数据，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {String} str 要保存的数据。    
* @returns 返回操作是否成功,是一个json对象。
* @example 
* 成功时返回数据key值和返回码0,例如 {"ret":0,"key":"000000004f55d48f"}。
* 失败时返回错误代码，例如{"ret":5}
* @type Object
*/
IYYCloud.prototype.addData = function(int1, int2, str) {
    if (arguments.length === 0 || arguments.length > 3) return { ret: yy_e_api_param_error };
    if (typeof int1 !== "number" || typeof int2 !== "number" || typeof str !== "string" || isNaN(int1) || isNaN(int2)) return { ret: yy_e_api_param_error };
    str = str.replace(/\\/g, "\\\\"); //替换斜杠
    str = str.replace(/\"/g, "\\\""); //替换双引号
    switch (arguments.length) {
        case 1:
            return callExternal("ICloud_AddData", 0, 0, arguments[0]);
            break;
        case 2:
            return callExternal("ICloud_AddData", arguments[0], 0, arguments[1]);
            break;
        case 3:
            return callExternal("ICloud_AddData", arguments[0], arguments[1], arguments[2]);
            break;
        default:
    }
};


/**
* 修改数据。
* @returns 返回操作是否成功。0=成功，非0值请参考错误代码 。
* @param {Number} int1 被修改的数据的新值，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {Number} int2 被修改的数据的新值，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {String} str 被修改的数据的新值。          
* @param {Array} filter 过滤器数组，保存YYCloudFilter对象数组，找到要修改的数据。       
* @type Number
* @see YYCloudFilter
*/
IYYCloud.prototype.updateData = function(int1, int2, str, filter) {
    if (arguments.length !== 4) return yy_e_api_param_error;
    if (typeof int1 !== "number" || typeof int2 !== "number" || typeof str !== "string" || !(filter instanceof Array) || isNaN(int1) || isNaN(int2)) return yy_e_api_param_error;
    var filterString = "";
    var sp = "";
    str = str.replace(/\\/g, "\\\\"); //替换斜杠
    str = str.replace(/\"/g, "\\\""); //替换双引号
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_UpdateData", int1, int2, str, filterString);
    return result.ret;
};


/**
* 删除数据。
* @returns 返回操作是否成功。0=成功，非0值请参考错误代码 。
* @param {Array} filter 过滤器数组,即删除的条件。保存YYCloudFilter对象数组。   
* @type Number
* @see YYCloudFilter
*/
IYYCloud.prototype.deleteData = function(filter) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (!(filter instanceof Array)) return yy_e_api_param_error;
    var filterString = "";
    var sp = "";
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_DeleteData", filterString);
    return result.ret;
};


//原始返回格式
//{"ret":0,"data":[
//*  {"key":"4f55d3d7","create_time":"2012-03-06 17:07:35","update_time":"2012-03-06 17:07:35","creator_uid":1710881282,"int1":1,"int2":100,"str":"你好，简单存储！hello cloud"},
// *  {"key":"4f55d48f","create_time":"2012-03-06 17:10:39","update_time":"2012-03-06 17:10:39","creator_uid":1710881282,"int1":1,"int2":100,"str":"可存可取"},
//*  {"key":"4f55d57d","create_time":"2012-03-06 17:14:37","update_time":"2012-03-06 17:14:37","creator_uid":1710881282,"int1":1,"int2":100,"str":"this is test"}
//*]} 
//* 如果没有查询到数据，格式如下
//* {"ret":0,"data":[]}


/**
* 查询数据。
* @param {Array} filter 过滤器数组，查询的条件。数组中为YYCloudFilter对象。没有查到数据或查询出错时返回空数组。    
* @returns 返回查询结果，保存在数组中。数组中为YYCloudData对象。
* @type Array
* @see YYCloudData 
* @see YYCloudFilter
*/
IYYCloud.prototype.queryData = function(filter) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (!(filter instanceof Array)) return yy_e_api_param_error;
    var filterString = "";
    var sp = "";
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_QueryData", filterString);
    if (result.ret === 0) {
        return parseCloudDataList(result.data);
    }
    else {

        return []
    }
};

//-----------------------------------IYYIM---------------------------
/**
* IYYIM 构造函数
* @extends IYYCommon
* @class 聊天接口。提供弹出聊天对话框，弹出添加好友对话框等功能。
* @constructor
*/
function IYYIM() {
};

IYYIM.prototype = new IYYCommon();


/**
* 给指定用户发送聊天消息， 调用后会弹出聊天对话框，需要用户点击确认才发送。
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @param {String} msg 等待发送的聊天的内容,最大长度40个字节。
* @returns 返回发送是否成功,0=成功 非0值参考错误代码。
* @type Number 
*/
IYYIM.prototype.chatTo = function(uid, msg) {
    if (arguments.length !== 2) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid) || typeof msg !== "string") return yy_e_api_param_error;
    msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IIM_ChatTo", uid, msg);
    return result.ret;
};


/**
* 判断指定的用户是否是好友。
* @param {Number} uid 指定用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回是否是好友,true=是好友 false=不是好友 出错或无法取得信息时也返回false。
* @type Boolean
*/
IYYIM.prototype.isFriend = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IIM_IsFriend", uid);
    if (result.ret == 0) {
        return result.is_friend;
    }
    else {
        return false;
    }
};


/**
* 弹出添加好友对话框，用户确认才开始添加。
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回弹出窗口是否成功,0=成功 非0值参考错误代码。
* @type Number
*/
IYYIM.prototype.addFriend = function(uid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof uid !== "number" || isNaN(uid)) return yy_e_api_param_error;
    var result = callExternal("IIM_AddFriend", uid);
    return result.ret;
};
//------------------------------IInteraction------------------------------
/**
* IYYInteraction 构造函数。
* @extends IYYCommon
* @class 应用互动接口。能够提供邀请者的信息。
* @constructor
*/
function IYYInteraction() {
}
IYYInteraction.prototype = new IYYCommon();

/**
* 获取邀请者uid,只有在被邀请启动应用才能获取成功。
* @returns 邀请者uid, 0=获取失败 。 
* @type Number
*/
IYYInteraction.prototype.getInviter = function() {
    var result = callExternal("IInteraction_GetInviter");
    if (result.ret == 0) {
        return result.inviter_id;
    }
    else {
        return 0;
    }
}

/**
* 发送邀请。可以邀请子频道的所有人或者邀请指定用户。
* @param {Number} inviteType 邀请的类型，1=邀请子频道所有人，2=邀请指定用户(将会打开窗口来选择用户列表)，其他值无效。
* @returns 返回发送邀请是否成功,0=成功 非0值参考错误代码。
* @type Number
*/
IYYInteraction.prototype.invite = function(inviteType) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (inviteType === 1 || inviteType === 2) {
        var result = callExternal("IInteraction_Invite", inviteType);
        return result.ret;
    }
    else {
        return yy_e_api_param_error;
    }
}
/**
* 获取应用交互启动参数。当应用通过网页的链接或者应用消息启动时，可以获取启动时设置的参数。
* @returns 返回参数信息。
* @example 
* 通过应用消息启动时：
* 返回String的格式为“{"cookie":8888}”，其中cookie的值是在发送应用消息的时候设置的token值。
*
* 通过网页链接启动应用时：
* 典型应用链接格式如下yy://pd-[sid=43670710&appid=100901&userData=hellobabby] 
* 其中sid是频道id，appid是应用id，userData就是启动参数，是一个字符串。
* 此例子中返回String为“hellobabby”
*
* 通过其他方式启动应用，返回空字符串。
* @type String
*/
IYYInteraction.prototype.getRunParams = function() {
    var result = callExternal("IInteraction_GetRunParams");
    if (result.ret === 0) {
        return result.run_params;
    }
    else {
        return "";
    }
}

//------------------------------IYYNet------------------------------
/**
* IYYNet 构造函数。
* @extends IYYCommon
* @class 网络通讯接口。提供广播数据和接收广播数据的功能。
* @constructor
*/
function IYYNet() {

};

IYYNet.prototype = new IYYCommon();

/**
* 子频道数据广播，包括自己。<b>两次广播需要间隔20毫秒,否则广播数据可能会丢失。</b>
* @returns 返回操作是否成功,0=成功，非0值请参考错误代码 。 
* @param {Number} sub_channel_id 子频道的长位id。
* @param {String} data 要广播的数据,最大长度2048个字节。
* @type Number
*/
IYYNet.prototype.broadcastSubChannel = function(sub_channel_id, data) {
    if (arguments.length !== 2) return yy_e_api_param_error;
    if (typeof sub_channel_id !== "number" || isNaN(sub_channel_id) || typeof data !== "string") return yy_e_api_param_error;
    var result = callExternal("INet_BroadCastSubChannel", sub_channel_id, encodeURI(data));
    return result.ret;
};

/**
* 全频道数据广播，包括自己。<b>两次广播需要间隔20毫秒,否则广播数据可能会丢失。</b>
* @returns 返回操作是否成功，0=成功，非0值请参考错误代码 。
* @param {String} data 要广播的数据。最大长度2048个字节。
* @type Number
*/
IYYNet.prototype.broadcastAllChannel = function(data) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof data !== "string") return yy_e_api_param_error;
    var result = callExternal("INet_BroadCastAllChannel", encodeURI(data));
    return result.ret;
};

/**
* 广播给指定用户。<b>两次广播需要间隔20毫秒,否则广播数据可能会丢失。</b>
* @returns 返回操作是否成功,0=成功，非0值请参考错误代码 。
* @param {Array} u_array 接收广播的用户uid，保存在一个数组中,用户个数必须小于等于100。 
* @param {String} data 要广播的数据。最大长度2048个字节。    
* @type Number
*/
IYYNet.prototype.broadcastToUsers = function(data, u_array) {
    if (arguments.length !== 2) return yy_e_api_param_error;
    if (typeof data !== "string" || !(u_array instanceof Array)) return yy_e_api_param_error;
    var result = callExternal("INet_BroadCastToUsers", encodeURI(data), u_array);
    return result.ret;
};

/**
* 收到频道广播消息事件。 收到广播消息后触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.data: String类型  接收到的数据。
* @example
* 使用示例：
* yy.net.addEventListener(IYYNet.RECV,onRecv);
*
* function onRecv(eventData)
* {
*     document.getElementById("txtLog").innerHTML="接收到"+eventData.data;
* }
*/
IYYNet.RECV = "YY_RECV";

/**
* 收到网络断开事件。点击关闭应用按钮的时候会触发，收到此消息2秒后，应用会被关闭。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.result: Number类型  基于何种原因断开了连接，请参考错误代码。result=983064时表示点击了关闭应用按钮，即将断开连接;
* @example
* 使用示例：
* yy.net.addEventListener(IYYNet.CLOSED,onClosed);
*
* function onClosed(eventData)
* {
*     document.getElementById("txtLog").innerHTML="关闭原因:"+eventData.result;
* }
*/
IYYNet.CLOSED = "YY_NET_CLOSED";


//------------------------------IYYSecurity------------------------------
/**
* IYYSecurity 构造函数。
* @extends IYYCommon
* @class 安全接口。提供获取安全认证信息等功能。
*/
function IYYSecurity() {

};


IYYSecurity.prototype = new IYYCommon();
/**
* 获取当前用户安全认证令牌。
* @returns 令牌字符,获取失败或出错时返回空字符。
* @type String
*/
IYYSecurity.prototype.getToken = function() {
    var result = callExternal("ISecurity_GetToken");
    if (result.ret === 0) {
        return result.token;
    }
    else {
        return "";
    }
};

/**
* 进行举报。当发现需要举报内容时，调用此Api会弹出举报窗口。
* @returns 举报窗口是否弹出。0=成功，其它值请参考错误代码。
* @type Number
*/
IYYSecurity.prototype.reportAbuse = function() {
    var result = callExternal("ISecurity_ReportAbuse");
    return result.ret;
};

//------------------------------IYYTempAudioSession------------------------------
/**
* IYYTempAudioSession 构造函数。
* @extends IYYCommon
* @class 临时语音接口。提供创建房间、加入房间、离开房间以及在房间语音聊天的功能.通过此接口可以跟其他用户建立临时语音聊天通道。<b>注意：用户同一时刻只能在一个房间进行语音聊天</b>
*/
function IYYTempAudioSession() {
}

IYYTempAudioSession.prototype = new IYYCommon();
/**
* 创建一个临时语音房间。创建后用户自动进入该房间。在应用的生命周期内，同一个用户只能创建一个房间,第二次调用此函数会返回已经创建的房间的rid。房间中能够发言的人数有限，先要先得，目前暂定为5人。
* @returns 创建的房间的rid,如果创建失败返回0。
* @type Number
*/
IYYTempAudioSession.prototype.createRoom = function() {
    var result = callExternal("ITempAudioSession_CreateRoom");
    if (result.ret === 0) {
        return result.room_id;
    }
    else {
        return 0;
    }
};
/**
* 进入一个房间。刚进入时，能听到其他人的语音，但自己暂时不能发言。
* @param {Number} rid 要进入的房间的rid。
* @returns 返回操作是否成功，0=成功，非0值请参考错误代码。
* @type Number
*/
IYYTempAudioSession.prototype.enterRoom = function(rid) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (isNaN(rid) || typeof rid !== "number") return yy_e_api_param_error;
    var result = callExternal("ITempAudioSession_EnterRoom", rid);
    return result.ret;
};
/**
* 离开房间。如果房间人数为0，服务器过一段时间后会销毁这个房间。
* @returns 返回操作是否成功，0=成功，非0值请参考错误代码。
* @type Number
*/
IYYTempAudioSession.prototype.leaveRoom = function() {
    var result = callExternal("ITempAudioSession_LeaveRoom");
    return result.ret;
};
/**
* 开始语音聊天。调用成功后，自己可以在房间中发言。
* @returns 返回操作是否成功，0=成功，非0值请参考错误代码。
* @type Number
*/
IYYTempAudioSession.prototype.startSpeak = function() {
    var result = callExternal("ITempAudioSession_StartSpeak");
    return result.ret;
};
/**
* 禁止语音聊天。调用成功后，自己不能在房间中发言。
* @returns 返回操作是否成功，0=成功，非0值请参考错误代码。
* @type Number
*/
IYYTempAudioSession.prototype.stopSpeak = function() {
    var result = callExternal("ITempAudioSession_StopSpeak");
    return result.ret;
};


/**
* 用户进入房间事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.rid: Number类型  进入的房间的rid。
* eventData.uid: Number类型  进入房间的用户的uid。
* @example
* 使用示例：
* yy.tempAudioSession.addEventListener(IYYTempAudioSession.USER_ENTER_ROOM,onUserEnterRoom);
*
* function onUserEnterRoom(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"进入了房间"+eventData.rid;
* }
*/
IYYTempAudioSession.USER_ENTER_ROOM = "YY_TEMP_AUDIO_SESSION_USER_ENTER";

/**
* 用户离开房间事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.rid: Number类型  离开的房间的rid。
* eventData.uid: Number类型  离开房间的用户的uid。
* @example
* 使用示例：
* yy.tempAudioSession.addEventListener(IYYTempAudioSession.USER_LEAVE_ROOM,onUserLeaveRoom);
*
* function onUserLeaveRoom(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开了房间"+eventData.rid;
* }
*/
IYYTempAudioSession.USER_LEAVE_ROOM = "YY_TEMP_AUDIO_SESSION_USER_LEAVE";

//--------------------------------------IYYUser----------------------------------
/**
* IYYUser 构造函数。
* @extends IYYCommon
* @class 用户信息接口。提供获取用户的信息，接收用户信息变化事件等功能。
*/
function IYYUser() {

};


IYYUser.prototype = new IYYCommon();

//原始信息格式 {"ret":0,"uid":50002277,"imid":51285414,"sex":1,"role":200,"points":114,"level":21,"name":"孤独小羊","sign":"最近经常失眠"}
/**
* 获取当前用户的信息。
* @example
* 使用示例：
* var userInfo = yy.user.getCurrentUserInfo();
* @returns 返回当前用户信息,是一个YYUserInfo对象。获取失败时返回null。
* @type YYUserInfo
* @see YYUserInfo
*/
IYYUser.prototype.getCurrentUserInfo = function() {
    var result = callExternal("IUser_GetCurrnetUserInfo");
    if (result.ret === 0) {
        return parseUserInfo(result);
    }
    else {
        return null;
    }
};


/**
* 获取指定的用户的信息。指定的用户必须在当前大频道中。
* @returns 返回指定用户信息,是一个YYUserInfo对象。获取失败时返回null。
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @type YYUserInfo
* @see YYUserInfo
*/
IYYUser.prototype.getUserInfo = function(uid) {
    if (arguments.length !== 1) return null;
    if (typeof uid !== "number" || isNaN(uid)) return null;
    var result = callExternal("IUser_GetUserInfo", uid);
    if (result.ret === 0) {
        return parseUserInfo(result);
    }
    else {
        return null;
    }
};

/**
* 修改用户昵称。调用此接口修改自己的昵称。两次调用必须间隔1秒以上。
* @returns 返回操作是否成功，0=成功，非0值请参考错误代码。
* @param {String} newName 用户的新昵称，用户昵称需要符合相关要求。
* @type Number
*/
IYYUser.prototype.rename = function(newName) {
    if (arguments.length !== 1) return yy_e_api_param_error;
    if (typeof newName !== "string") return yy_e_api_param_error;
    var result = callExternal("IUserEx_Rename", newName);
    return result.ret;
};


/**
* 当前用户信息变更事件。当前用户昵称，性别，签名,马甲修改的时候会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData: YYUserInfo类型 变化后的用户信息。
* @example
* 使用示例：
* yy.user.addEventListener(IYYUser.USER_INFO_CHANGED,onChange);
*
* function onChange(eventData)
* {
*    document.getElementById("txtLog").innerHTML=eventData.name+ "的信息发生了变化";
* }
* @see YYUserInfo
*/
IYYUser.USER_INFO_CHANGED = "YY_USER_INFO_CHANGED";


/**
* 调用YY平台提供的接口
* @private
*/
function callExternal() {

    try {
        if (debugMode) {//打印出日志
            var strArgu = "(";
            var sp = "";
            for (var i = 1; i < arguments.length; i++) {
                switch (typeof arguments[i]) {
                    case "string":
                        strArgu += sp + "'" + arguments[i] + "'";
                        break;
                    case "number":
                        strArgu += sp + arguments[i];
                        break;
                    case "boolean":
                        strArgu += sp + arguments[i];
                        break;
                    case "object":
                        if (arguments[i] instanceof Array) {
                            strArgu += sp + "'[" + arguments[i].toString() + "]'";
                        }
                        else
                            strArgu += sp + arguments[i].toString();
                        break;    
                    default:
                        strArgu += sp + arguments[i].toString();
                }

                sp = ","
            }
            strArgu += ");"
            var runCode = "window.external." + arguments[0] + strArgu;
            yytrace(runCode);        
        }
        
        var ret = "{ \"ret\": 62003 }";//如果api不存在，返回错误代码
        var yyexternal = window.external;
        switch (arguments[0]) {

            case "IYY_GetVersion":
                ret = yyexternal.IYY_GetVersion();
                break;
            case "IYYEx_GetYYVersion":
                ret = yyexternal.IYYEx_GetYYVersion();
                break;                
            case "IAudio_StartRecord":
                if (arguments.length === 1) {
                    ret = yyexternal.IAudio_StartRecord("");
                }
                else {
                    ret = yyexternal.IAudio_StartRecord(arguments[1]);
                }
                break;
            case "IAudio_StopRecord":
                ret = yyexternal.IAudio_StopRecord();
                break;
            case "IAudio_OpenKaraoke":
                ret = yyexternal.IAudio_OpenKaraoke();
                break;
            case "IAudio_CloseKaraoke":
                ret = yyexternal.IAudio_CloseKaraoke();
                break;
            case "IAudio_EnableAudioMixing":
                ret = yyexternal.IAudio_EnableAudioMixing();
                break;
            case "IAudio_DisableAudioMixing":
                ret = yyexternal.IAudio_DisableAudioMixing();
                break;
            case "IChannel_GetCurrentChannelInfo":
                ret = yyexternal.IChannel_GetCurrentChannelInfo();
                break;
            case "IChannel_GetCurrentSubChannelInfo":
                ret = yyexternal.IChannel_GetCurrentSubChannelInfo();
                break;
            case "IChannel_GetChannelInfo":
                ret = yyexternal.IChannel_GetChannelInfo(arguments[1]);

                break;
            case "IChannel_GetRootChannelId":
                ret = yyexternal.IChannel_GetRootChannelId();
                break;
            case "IChannel_GetSubChannelIds":
                ret = yyexternal.IChannel_GetSubChannelIds(arguments[1]);
                break;
            case "IChannelAppMsg_SendMsgToSubChannel":
                ret = yyexternal.IChannelAppMsg_SendMsgToSubChannel(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                break;
            case "IChannelAppMsg_SendMsgToUsers":

                ret = yyexternal.IChannelAppMsg_SendMsgToUsers("[" + arguments[1].toString() + "]", arguments[2], arguments[3], arguments[4], arguments[5]);
                break;
            case "IChannelAppMsg_SendMsgToSubChannelEx":
                ret = yyexternal.IChannelAppMsg_SendMsgToSubChannelEx(arguments[1], arguments[2], arguments[3], arguments[4]);
                break;
            case "IChannelAppMsg_SendMsgToUsersEx":
                ret = yyexternal.IChannelAppMsg_SendMsgToUsersEx("[" + arguments[1].toString() + "]", arguments[2], arguments[3], arguments[4]);
                break;
            case "IChannelMicList_GetMicList":
                ret = yyexternal.IChannelMicList_GetMicList();
                break;
            case "IChannelMicList_JoinMicList":
                ret = yyexternal.IChannelMicList_JoinMicList();
                break;
            case "IChannelMicList_LeaveMicList":
                ret = yyexternal.IChannelMicList_LeaveMicList();
                break;
            case "IChannelMicList_PullUserToMicList":
                ret = yyexternal.IChannelMicList_PullUserToMicList(arguments[1]);
                break;
            case "IChannelMicList_KickMicListUser":
                ret = yyexternal.IChannelMicList_KickMicListUser(arguments[1]);
                break;
            case "IChannelMicList_MoveUserToTop":
                ret = yyexternal.IChannelMicList_MoveUserToTop(arguments[1]);
                break;
            case "IChannelMicList_ClearMicList":
                ret = yyexternal.IChannelMicList_ClearMicList();
                break;
            case "IChannelMicList_GetLinkedMicList":
                ret = yyexternal.IChannelMicList_GetLinkedMicList();
                break;
            case "IChannelMicList_LinkMicToTheQueueHead":
                ret = yyexternal.IChannelMicList_LinkMicToTheQueueHead(arguments[1]);
                break;
            case "IChannelMicList_RemoveFromLinkedMicList":
                ret = yyexternal.IChannelMicList_RemoveFromLinkedMicList(arguments[1]);
                break;
            case "IChannelMicList_GetMicListMode":
                ret = yyexternal.IChannelMicList_GetMicListMode();
                break;
            case "IChannelMicList_SetMicListMode":
                ret = yyexternal.IChannelMicList_SetMicListMode(arguments[1]);
                break;
            case "IChannelUserController_EnableMsg":

                ret = yyexternal.IChannelUserController_EnableMsg(arguments[1]);
                break;
            case "IChannelUserController_DisableMsg":

                ret = yyexternal.IChannelUserController_DisableMsg(arguments[1]);
                break;

            case "IChannelUserController_EnableSpeak":

                ret = yyexternal.IChannelUserController_EnableSpeak(arguments[1]);
                break;
            case "IChannelUserController_DisableSpeak":

                ret = yyexternal.IChannelUserController_DisableSpeak(arguments[1]);
                break;
            case "IChannelUserController_JumpToSubChannel":

                ret = yyexternal.IChannelUserController_JumpToSubChannel(arguments[1]);
                break;
            case "IChannelUserController_PullToSubChannel":

                ret = yyexternal.IChannelUserController_PullToSubChannel(arguments[1], arguments[2]);
                break;
            case "IChannelUserController_GetUserSubChannelId":
                ret = yyexternal.IChannelUserController_GetUserSubChannelId(arguments[1]);
                break;
            case "IChannelUserController_SetUserRole":
                ret = yyexternal.IChannelUserController_SetUserRole(arguments[1], arguments[2], arguments[3]);
                break;
            case "IReceptionChannel_SetReceptionChannel":
                ret = yyexternal.IReceptionChannel_SetReceptionChannel(arguments[1]);
                break;
            case "IReceptionChannel_GetReceptionChannel":
                ret = yyexternal.IReceptionChannel_GetReceptionChannel();
                break;
            case "IReceptionChannel_UnSetReceptionChannel":
                ret = yyexternal.IReceptionChannel_UnSetReceptionChannel();
                break;
            case "IChannelUserListPopMenu_SetPopMenu":
                ret = yyexternal.IChannelUserListPopMenu_SetPopMenu(arguments[1]);
                break;
            case "IChannelUserListPopMenu_UnSetPopMenu":
                ret = yyexternal.IChannelUserListPopMenu_UnSetPopMenu();
                break;
            case "IChannelTabPage_SelectTabPage":
                ret = yyexternal.IChannelTabPage_SelectTabPage();
                break;
            case "ICloud_AddData":
                ret = yyexternal.ICloud_AddData(arguments[1], arguments[2], arguments[3]);
                break;
            case "ICloud_UpdateData":
                ret = yyexternal.ICloud_UpdateData(arguments[1], arguments[2], arguments[3], "[" + arguments[4] + "]");
                break;
            case "ICloud_DeleteData":
                ret = yyexternal.ICloud_DeleteData("[" + arguments[1] + "]");
                break;
            case "ICloud_QueryData":
                ret = yyexternal.ICloud_QueryData("[" + arguments[1] + "]");
                break;
            case "IIM_ChatTo":
                ret = yyexternal.IIM_ChatTo(arguments[1], arguments[2]);
                break;
            case "IIM_IsFriend":
                ret = yyexternal.IIM_IsFriend(arguments[1]);
                break;
            case "IIM_AddFriend":
                ret = yyexternal.IIM_AddFriend(arguments[1]);
                break;
            case "IInteraction_GetInviter":
                ret = yyexternal.IInteraction_GetInviter();
                break;
            case "IInteraction_Invite":
                ret = yyexternal.IInteraction_Invite(arguments[1]);
                break;
            case "IInteraction_GetRunParams":
                ret = yyexternal.IInteraction_GetRunParams();
                break;
            case "INet_BroadCastSubChannel":
                ret = yyexternal.INet_BroadCastSubChannel(arguments[1], arguments[2]);
                break;
            case "INet_BroadCastAllChannel":
                ret = yyexternal.INet_BroadCastAllChannel(arguments[1]);
                break;
            case "INet_BroadCastToUsers":
                ret = yyexternal.INet_BroadCastToUsers(arguments[1], "[" + arguments[2].toString() + "]");
                break;
            case "ISecurity_GetToken":
                ret = yyexternal.ISecurity_GetToken();
                break;
            case "ISecurity_ReportAbuse":
                ret = yyexternal.ISecurity_ReportAbuse();
                break;
            case "ITempAudioSession_CreateRoom":
                ret = yyexternal.ITempAudioSession_CreateRoom();
                break;
            case "ITempAudioSession_EnterRoom":
                ret = yyexternal.ITempAudioSession_EnterRoom(arguments[1]);
                break;
            case "ITempAudioSession_LeaveRoom":
                ret = yyexternal.ITempAudioSession_LeaveRoom();
                break;
            case "ITempAudioSession_StartSpeak":
                ret = yyexternal.ITempAudioSession_StartSpeak();
                break;
            case "ITempAudioSession_StopSpeak":
                ret = yyexternal.ITempAudioSession_StopSpeak();
                break;
            case "IUser_GetCurrnetUserInfo":
                ret = yyexternal.IUser_GetCurrnetUserInfo();
                break;
            case "IUser_GetUserInfo":
                ret = yyexternal.IUser_GetUserInfo(arguments[1]);
                break;
            case "IUserEx_Rename":
                ret = yyexternal.IUserEx_Rename(arguments[1]);
                break;                
            case "SubscribeYYEvent":
                ret = yyexternal.SubscribeYYEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeAudioEvent":
                ret = yyexternal.SubscribeAudioEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeChannelEvent":
                ret = yyexternal.SubscribeChannelEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeAppMsgEvent":
                ret = yyexternal.SubscribeAppMsgEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeMicListEvent":
                ret = yyexternal.SubscribeMicListEvent(arguments[1], arguments[2]);
                break;
            case "SubscribePopMenuEvent":
                ret = yyexternal.SubscribePopMenuEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeNetEvent":
                ret = yyexternal.SubscribeNetEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeUserEvent":
                ret = yyexternal.SubscribeUserEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeTempAudioSessionEvent":
                ret = yyexternal.SubscribeTempAudioSessionEvent(arguments[1], arguments[2]);
                break;

            default:

                //ret = eval(runCode);


        }
        yytrace(ret); //打印返回值
        //返回值转json
        try {
            var retJson = eval("(" + ret + ")");
        } catch (exjson) {
            throw "返回值转json出错:"+exjson.message;
        }
        //如果无ret字段
        if (typeof (retJson.ret) !== "number") throw "NO_RET";
        return retJson;

        

    } catch (ex) {
        //E_NOINTERFACE api不存在 62003
        //E_INVALIDARG api调用参数错误62001
        //E_FAIL api调用失败  62000
        yytrace("错误! 原因[" + ex.name + "] "+ex.number+":" + ex.message);
        if (ex === "NO_RET") return { ret: yy_e_api_return_format_error, message: "返回信息没有ret属性" };
        else if (ex.number === -2146827858) return { ret: yy_e_api_not_exist, message: "api不存在! 原因:[" + ex.number + "]" + ex.message };
        else if (ex.number === -2146828283) return { ret: yy_e_api_param_error, message: "api调用参数错误! 原因:[" + ex.number + "]" + ex.message };
        else return { ret: yy_e_api_call_error, message: "api调用失败! 原因:[" + ex.number + "]" + ex.message };
    }


}
var yyTraceMaxLine = 256;
var yyTraceData = [];
var yyConsole = null;
//输出debug信息到控制台
function yytrace(msg) {

    try {
        if (!debugMode) return;
        if (yyConsole == null) {
            yyConsole = document.getElementById("txtConsole");
        }
        if (yyConsole != null) {
            if (yyTraceData.length >= yyTraceMaxLine) {
                yyTraceData.pop();
            }
            yyTraceData.unshift(msg);
            yyConsole.innerText = yyTraceData.join("\n");
        }
    } catch (exLog) {
        throw "打印日志错误！" + exLog + exLog.message;
    }
}


//创建api对象，供调用所有api，全局变量。
window["yy"] = new IYY();

//})(); //保存到命名空间中


//---------------------------------------------------------数据类-----------------------------------------------------------------
/**
* 构造函数。
* @class 保存用户的信息。
*/
function YYUserInfo() {
    /**
    * 用户的名称
    * @field
    * @type String
    */
    this.name = "";
    /**
    * 用户的性别 （0:女 1:男） 
    * @field
    * @type Number
    */
    this.sex = 0;

    /**
    * 用户的uid,唯一标识id
    * @field
    * @type Number
    */
    this.uid = 0;

    /**
    * 用户的YY号
    * @field
    * @type Number    
    */
    this.imId = 0;

    /**
    * 用户的马甲 对应的信息如下：<br>
    *   无效角色 0 <br>
    *   未知用户  灰马 20 <br>
    *   游客(U)  白马 25 <br>
    *   临时嘉宾(G) 浅绿色马甲 66 <br>
    *   嘉宾(VIP)  绿马 88 <br>
    *   会员(R)  蓝马 100 <br>
    *   二级子频道管理员(CA2)  粉马 150 <br>
    *   子频道管理员(CA) 红马 175 <br>
    *   全频道管理员(MA)  黄马 200 <br>
    *   频道总管理(VP) 橙马 230 <br>
    *   频道所有者(OW)  紫马 255 <br>
    *   客服 300 <br>
    *   歪歪官方人员 黑马 1000 <br>       
    * @field
    * @type Number       
    */
    this.role = 0;

    /**
    * 用户的个人积分
    * @field
    * @type Number    
    */
    this.points = 0;

    /**
    * 用户的等级
    * @field
    * @type Number       
    */
    this.level = 0;

    /**
    * 用户的签名
    * @field
    * @type String       
    */
    this.sign = "";

    /**
    * 是否是会员
    * @field
    * @type Boolean       
    */
    this.vip = false;
    
    /**
    * 会员的等级
    * @field
    * @type Number       
    */
    this.vipLevel = 0;    
    
    /**
    * 用户对当前频道的贡献值
    * @field
    * @type Number       
    */
    this.contribution = 0;      
         
}
YYUserInfo.prototype.toString = function() {
    var s = "{\"uid\":" + this.uid + ",\"name\":\"" + this.name + "\",\"sex\":" + this.sex + ",\"imId\":" + this.imId + ",";
    s += "\"role\":" + this.role + ",\"points\":" + this.points + ",\"level\":" + this.level + ",\"sign\":\"" + this.sign + "\",\"vip\":" + this.vip+",";
    s += "\"vipLevel\":" + this.vipLevel + ",\"contribution\":" + this.contribution + "}";
    return s;
};
/**
* 构造函数。
* @class 保存频道的信息。
*/
function YYChannelInfo() {
    /**
    * 频道长位id。
    * @field
    * @type Number     
    */
    this.longId = 0;
    /**
    * 频道短位id。
    * @field
    * @type Number     
    */
    this.shortId = 0;
    /**
    * 频道名称。
    * @field
    * @type String     
    */
    this.name = "";
    
    /**
    * 所在子频道用户数量。
    * @field
    * @type Number     
    */
    this.userCount = 0;   
     
    /**
    * 大频道全部用户数量。
    * @field
    * @type Number     
    */
    this.totalUserCount = 0;   
    
    /**
    * 频道的类型。游戏=0 娱乐=1 其他=2 教育=3 
    * @field
    * @type Number     
    */
    this.channelType = 0;       
         
    /**
    * 频道的积分。
    * @field
    * @type Number     
    */
    this.channelPoints = 0;     
}
YYChannelInfo.prototype.toString = function() {
    var s = "{\"longId\":" + this.longId + ",\"shortId\":" + this.shortId + ",\"name\":\"" + this.name + ",";
    s += "\"userCount\":" + this.userCount + ",\"totalUserCount\":" + this.totalUserCount + ",\"channelType\":" + this.channelType + ",\"channelPoints\":" + this.channelPoints + "}";
    return s;
};
/**
* 构造函数。
* @class 保存YY API版本信息。
*/
function YYVersion() {
    /**
    * 主版本号，是正整数。
    * @field
    * @type Number
    */
    this.majorVersion = 0;
    /**
    * 副版本号，是正整数。
    * @field
    * @type Number
    */
    this.minorVersion = 0;
}

/**
* 构造函数。
* @class 保存云数据信息。
*/
function YYCloudData() {
    /**
    * 数据的键值。
    * @field
    * @type String
    */
    this.uniqueKey = "";
    /**
    * 数据创建的时间。
    * @field
    * @type String
    */
    this.createTime = "";

    /**
    * 数据更新的时间。
    * @field
    * @type String
    */
    this.updateTime = "";

    /**
    * 数据创建者的uid。
    * @field
    * @type Number
    */
    this.creatorUid = 0;
    /**
    * int字段数据，32位无符号整数,范围[0,4294967295]。
    * @field
    * @type Number
    */
    this.intValue1 = 0;
    /**
    * int字段数据，32位无符号整数,范围[0,4294967295]。
    * @field
    * @type Number
    */
    this.intValue2 = 0;
    /**
    * string字段数据。
    * @field
    * @type String
    */
    this.stringValue = "";
}

YYCloudData.prototype.toString = function() {
    var s = "{\"uniqueKey\":\"" + this.uniqueKey + "\",\"creatorUid\":" + this.creatorUid + ",\"createTime\":\"" + this.createTime + "\",\"updateTime\":\"" + this.updateTime + "\",";
    s += "\"intValue1\":" + this.intValue1 + ",\"intValue2\":" + this.intValue2 + ",\"stringValue\":\"" + this.stringValue + "\"}";
    return s;
};

/**
* 构造函数。
* @class 简单存储条件过滤器，保存查询条件。
*/
function YYCloudFilter() {
    /**
    * 对哪个字段进行过滤。
    * @field
    * @type Number
    */
    this.field = 0;
    /**
    * 操作符，比如大于小于等。
    * @field
    * @type Number
    */
    this.op = 0;
    /**
    * 字段数值。
    * @field
    * @type Object
    */
    this.value = null;
    /**
    * 和其他filter的关系。
    * @field
    * @type Number
    */
    this.condition = 0;
}
/**
* 简单存储的字段表示常量。
* @field
* @example
* YYCloudFilter.EField.NONE 0 无效字段
* YYCloudFilter.EField.UNIQUE_KEY 1 唯一键 字段
* YYCloudFilter.EField.USER_ID 2 uid字段
* YYCloudFilter.EField.EXTERNAL_VALUE1 3 扩展int1 字段
* YYCloudFilter.EField.EXTERNAL_VALUE2 4 扩展int2 字段
* YYCloudFilter.EField.CREATE_TIME 5 创建时间
* YYCloudFilter.EField.UPDATE_TIME 6 更新时间
*/
YYCloudFilter.EField =
{
    //!无效字段
    NONE: 0,
    //!key 唯一键 字段
    UNIQUE_KEY: 1,
    //!uid 字段
    USER_ID: 2,
    //!扩展int1 字段
    EXTERNAL_VALUE1: 3,
    //!扩展int2 字段
    EXTERNAL_VALUE2: 4,
    //!创建时间
    CREATE_TIME: 5,
    //!更新时间
    UPDATE_TIME: 6
};

/**
* 简单存储的操作符常量。
* @field
* @example
* YYCloudFilter.EFilterOperator.NONE 0 无效操作
* YYCloudFilter.EFilterOperator.EQ 1 等于
* YYCloudFilter.EFilterOperator.GE 2 大于等于
* YYCloudFilter.EFilterOperator.LE 3 小于等于
* YYCloudFilter.EFilterOperator.GREATER 4 大于
* YYCloudFilter.EFilterOperator.LESS 5 小于
*/
YYCloudFilter.EFilterOperator =
{
    //! 无效操作
    NONE: 0,
    //! = 等于
    EQ: 1,
    //! >= 大于等于
    GE: 2,
    //! <= 小于等于	
    LE: 3,
    //! = 大于
    GREATER: 4,
    //! < 小于
    LESS: 5
};

/**
* 简单存储的条件运算常量。
* @field
* @example
* YYCloudFilter.EFilterCondition.NONE 0 无效条件
* YYCloudFilter.EFilterCondition.AND  1 条件 与 and 
* YYCloudFilter.EFilterCondition.OR 2 条件 或 or
*/
YYCloudFilter.EFilterCondition =
{
    //!无效条件
    NONE: 0,
    //! 条件 与 and 
    AND: 1,
    //! 条件 或 or
    OR: 2
};
YYCloudFilter.prototype.toString = function() {
    switch (this.field) {
        case YYCloudFilter.EField.EXTERNAL_VALUE1, YYCloudFilter.EField.EXTERNAL_VALUE2:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":" + this.value + ",\"condition\":" + this.condition + "}";
        case YYCloudFilter.EField.UNIQUE_KEY:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":\"" + this.value + "\",\"condition\":" + this.condition + "}";
        default:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":" + this.value + ",\"condition\":" + this.condition + "}";
    }


};



//---------------------------------------下面为回调函数------------------------------------------------------------------------------------------------
/**
* 运行时，应用图标被点击事件。
* @private
*/
function IYY_OnActive(activeCode) {
    if (debugMode) {
        yytrace(IYY.ACTIVE + ":" + activeCode);
    }
    yy.dispatchEvent(IYY.ACTIVE, { activeCode: activeCode });
}


//-----------------------语音设备更换[Event]----------------------
/**
* 录音错误事件。
* @param {Number} err_code 录音错误代码，参考错误代码表。
* @private
*/
function IAudioEvent_OnRecordErr(err_code) {
    if (debugMode) {
        yytrace(IYYAudio.RECORD_ERR + ":" + err_code);
    }
    yy.audio.dispatchEvent(IYYAudio.RECORD_ERR, { errCode: err_code });
}


/**
* 录音完成事件。
* @param {String} info 录音完成信息。
* @example 
* 返回参数示例: {result:0,file_name:"abcd"} 
* result 录音是否成功 0成功，非0值失败。
* file_name 录音文件的名称，不带没有扩展名和路径。
* @private
*/
function IAudioEvent_OnRecordFinished(info) {
    if (debugMode) {
        yytrace(IYYAudio.RECORD_FINISHED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.audio.dispatchEvent(IYYAudio.RECORD_FINISHED, { result: retJson.result, fileName: retJson.file_name });
}

//-----------------------频道信息获取回调接口 [Event]----------------------
/**
* 子频道跳转事件。
* @param {String} info 频道跳转信息，是一个可以转成Json的字符串。
* @example
* 返回参数示例: {departed_id:15488855,now_id:85526655}
* departed_id 原来子频道id。
* now_id 现在子频道id。
* @private
*/

function IChannelEvent_OnFocusChannelChannged(info) {
    if (debugMode) {
        yytrace(IYYChannel.FOCUS_CHANNEL_CHANGED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.FOCUS_CHANNEL_CHANGED, { departedId: retJson.departed_id, nowId: retJson.now_id });
}

/**
* 当前频道信息改变事件。
* @param {String} info 改变后的频道信息，是一个可以转成Json的字符串。
* @example
* 返回参数示例: 
*
* {"ret":0,"long_id":51285414,"short_id":6048,"name":"月光酒吧"}
*
* ret 返回码 
* long_id 频道长位id
* short_id 频道短位id
* name 频道名称id
* @private
*/
function IChannelEvent_OnChannelInfoChannged(info) {
    if (debugMode) {
        yytrace(IYYChannel.CHANNEL_INFO_CHANGED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.CHANNEL_INFO_CHANGED, parseChannelInfo(retJson));
}





/**
* 删除子频道时产生事件。
* @param {Number} cid 被删除的子频道长位id。
* @private
*/
function IChannelEvent_OnSubChannelDel(cid) {
    if (debugMode) {
        yytrace(IYYChannel.SUB_CHANNEL_DEL + ":" + cid);
    }
    yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_DEL, { cid: cid });
}


/**
* 添加子频道时产生事件。
* @param {String} info 频道添加的信息，是一个可以转成Json的字符串。
* @example 
* 返回参数示例: {cid:15488855,pcid:85526655} 
* cid 增加的子频道长位id。
* pcid 增加到哪个父频道下，长位id。
* @private
*/
function IChannelEvent_OnSubChannelAdd(info) {
    if (debugMode) {
        yytrace(IYYChannel.SUB_CHANNEL_ADD + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_ADD, { cid: retJson.cid, pcid: retJson.pcid });
}
/**

* 用户进入大频道事件，子频道之间跳转不会触发此事件。
* @param {String} info 用户加入频道的信息
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 进入的用户的uid。
* cid 进入时进入到大频道中的哪个频道。
* @private
*/
function IChannelEvent_OnUserEnterChannel(info) {
    if (debugMode) {
        yytrace(IYYChannel.USER_ENTER_CHANNEL + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.USER_ENTER_CHANNEL, { uid: retJson.uid, cid: retJson.cid });
}

/**
* 用户离开大频道事件，子频道之间跳转不会触发此事件。
* @param {String} info 用户离开频道的信息
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 离开的用户的uid。
* cid 离开大频道时所处的频道。
* @private
*/
function IChannelEvent_OnUserLeaveChannel(info) {
    if (debugMode) {
        yytrace(IYYChannel.USER_LEAVE_CHANNEL + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.USER_LEAVE_CHANNEL, { uid: retJson.uid, cid: retJson.cid });
}



///
//------------------------频道用户列表右键菜单事件通知 [Event]
///
/**
* 频道用户列表右键菜单项被点击事件。
* @param {String} info 点击用户的信息。
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 被点中的用户uid。
* cid 当前所在的频道。
* @private
*/
function IChannelUserPopMenuEvent_OnClicked(info) {
    if (debugMode) {
        yytrace(IYYChannelUserListPopMenu.CLICKED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.userListPopMenu.dispatchEvent(IYYChannelUserListPopMenu.CLICKED, { uid: retJson.uid, cid: retJson.cid });
}

///
//------------------------网络状态回调 [Event]
///


/**
* 连接成功的事件。
* @param {Number} result 0成功，非0值失败。
* @private
*/
/*
function INetEvent_OnConnected(result) {
yy.net.dispatchEvent(IYYNet.CONNECTED, { result: result });
}*/


/**
* 连接断开后事件。
* @param {Number} result 0:主动断开, 其他错误参考错误代码表
* @private
*/

function INetEvent_OnClosed(result) {
    if (debugMode) {
        yytrace(IYYNet.CLOSED + ":" + result);
    }
    yy.net.dispatchEvent(IYYNet.CLOSED, { result: result });
}


/**
* 收到广播数据包事件。
* @param {Object} data 收到数据
* @private
*/
function INetEvent_OnRecv(data) {
    if (debugMode) {
        yytrace(IYYNet.RECV + ":" + data);
    }
    yy.net.dispatchEvent(IYYNet.RECV, { data: decodeURI(data) });
}


///
//------------------------------------------频道应用信息链接事件 [Event]
///


/**
* 应用消息中的链接被点击事件。
* @param {Number} token 消息标记，区分不同的消息。
* @private
*/
function IChannelAppLinkEvent_OnAppLinkClicked(token) {
    if (debugMode) {
        yytrace(IYYChannelAppMsg.APP_LINK_CLICKED + ":" + token);
    }
    yy.channel.appMsg.dispatchEvent(IYYChannelAppMsg.APP_LINK_CLICKED, { token: token });
}
function IChannelAppLinkEvent_OnAppLinkExClicked(token, userData) {
    if (debugMode) {
        yytrace(IYYChannelAppMsg.APP_LINK_EX_CLICKED + ":" + token + " " + userData);
    }
    yy.channel.appMsg.dispatchEvent(IYYChannelAppMsg.APP_LINK_EX_CLICKED, { token: token, userData: userData });
}

///
//------------------------------------------麦序相关接口事件
///

//麦序列表发生改变


/**
* 用户加入到麦序事件。
* @param {uid} 加入到麦序的用户uid。
* @private
*/
function IMicListEvent_OnUserJoin(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_JOIN + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_JOIN, { uid: uid });
}
/**
* 用户离开麦序事件。
* @param {Number} uid 离开麦序的用户uid。
* @private
*/
function IMicListEvent_OnUserLeave(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_LEAVE + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_LEAVE, { uid: uid });
}
/**
* 用户在麦序中的位置发生变化事件，同一子频道的用户会收到。
* @example 
* 返回参数示例: {move_id:905488855,to_after_id:905477756} 
* move_id:发生移动的id。
* to_after_id:移动到那个用户后面。
* @private
*/
function IMicListEvent_OnUserMove(info) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_MOVE + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_MOVE, { moveId: retJson.move_id, toAfterId: retJson.to_after_id });
}

/**
* 麦序被清除事件。
* @private
*/
function IMicListEvent_OnClear() {
    if (debugMode) {
        yytrace(IYYChannelMicList.CLEAR);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.CLEAR);
}

function IChannelMicList_OnUserMicLinked(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_LINKED + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_LINKED, { uid: uid });
}

function IChannelMicList_OnUserMicUnlinked(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_UNLINKED + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_UNLINKED, { uid: uid });
}

function IChannelMicList_OnMicListModeChanged(mode) {
    if (debugMode) {
        yytrace(IYYChannelMicList.MODE_CHANGED + ":" + mode);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.MODE_CHANGED, { mode: mode });
}
//----------------------------用户事件回调------------------------------------------
/**
* 用户信息改变事件，得到改变后的用户信息。
* @param {String} info 改变后的用户信息,是一个可以转成Json的字符串。
* @private
*/
function IUserEvent_OnUserInfoChanged(info) {
    if (debugMode) {
        yytrace(IYYUser.USER_INFO_CHANGED+":"+info);
    }
    var retJson = eval("(" + info + ")");
    yy.user.dispatchEvent(IYYUser.USER_INFO_CHANGED, parseUserInfo(retJson));
}

/**
* 转换频道信息格式。
* @private
*/
function parseChannelInfo(info) {
    var cinfo = new YYChannelInfo();
    cinfo.longId = info.long_id;
    cinfo.shortId = info.short_id;
    cinfo.name = info.name;
    cinfo.userCount = info.user_count;
    cinfo.totalUserCount = info.total_user_count;
    cinfo.channelType = info.channel_type;
    cinfo.channelPoints = info.channel_points;   
    return cinfo;
}

/**
* 转换用户信息格式。
* @private
*/
function parseUserInfo(info) {
    var userInfo = new YYUserInfo();
    userInfo.uid = info.uid;
    userInfo.name = info.name;
    userInfo.imId = info.imid;
    userInfo.role = info.role;
    userInfo.points = info.points;
    userInfo.level = info.level;
    userInfo.sex = info.sex;
    userInfo.sign = info.sign;
    userInfo.vip = info.vip;
    userInfo.vipLevel = info.vip_level;
    userInfo.contribution = info.contribution;
    return userInfo;
}
/**
* 转换用户信息格式。
* @private
*/
function parseCloudDataList(data) {
    var dataArray = [];
    for (var i = 0; i < data.length; i++) {
        var dt = new YYCloudData();
        dt.uniqueKey = data[i].key;
        dt.createTime = data[i].create_time;
        dt.updateTime = data[i].update_time;
        dt.creatorUid = data[i].creator_uid;
        dt.intValue1 = data[i].int1;
        dt.intValue2 = data[i].int2;
        dt.stringValue = data[i].str;
        dataArray.push(dt);
    }

    return dataArray;
}
//----------------------------临时语音事件回调------------------------------------------
/**
* 用户进入房间。
* @private
*/
function ITempAudioSession_OnUserEnterRoom(info) {
    if (debugMode) {
        yytrace(IYYTempAudioSession.USER_ENTER_ROOM + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.tempAudioSession.dispatchEvent(IYYTempAudioSession.USER_ENTER_ROOM, { rid: retJson.rid, uid: retJson.uid });
}
/**
* 用户离开房间。
* @private
*/
function ITempAudioSession_OnUserLeaveRoom(info) {
    if (debugMode) {
        yytrace(IYYTempAudioSession.USER_LEAVE_ROOM + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.tempAudioSession.dispatchEvent(IYYTempAudioSession.USER_LEAVE_ROOM, { rid: retJson.rid, uid: retJson.uid });
}


