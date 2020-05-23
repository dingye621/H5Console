var req = GetRequest();
var type = req['tp'];  
var tagName = req['tn'];
var la = req['la']; //纬度
var lo = req['lo']; //经度

window.onresize = function () {
	var height =$(window).height();
	$("#videoElement").height(height);
	$("#mainContainer").height(height);
}

function groupBy(array, f) {
    //debugger;
    const groups = {};
    array.forEach(function (o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
}
//扩展js方法
//案例
//var alertCount = data.ArrivalRatesList.select(function (t) { return t.AlertCount });
//var li=list.select((t)=>t.xx);
Array.prototype.select = Array.prototype.map || function (selector, context) {
    context = context || window;
    var arr = [];
    var l = this.length;
    for (var i = 0; i < l; i++)
        arr.push(selector.call(context, this[i], i, this));
    return arr;
};

//获取sessionStorage
var storage = window.sessionStorage;  
var access_token = storage.getItem("access_token"); 
let fixShow=false; 
let inn=true;
let out=false;

//获取配置文件的ip
var ip = globalConfig.ip;

//浏览器当前窗口可视区域高度
var h=$(window).height();
$('#fix').css('bottom',h/2+'px');

//播放视频监控
async function playFlvFunc(cameraId)
{
	var res = await getGameraUrl(cameraId);
	if(res.data.Flag){
		playFlv(res.data.Data);
	}
	else{
		layer.alert(res.data.Msg);
	}
}

//过滤区域
function filterArea(areaList,areaStrList)
{
	var areaRes=[];
	for(var area of areaList)
	{
		if(areaStrList.includes(area.orgName)||areaStrList.includes(area.orgCode))
			areaRes.push(area);
	}
	return areaRes;
}
//填充弹窗内容
async function fitContent(info,layerName,layerType)
{
	// 准备好的数据源，可以是通过网络获取的json数据，也可以是通过ajax从后台拿到的数据
	var data = {name:"张三",sex:"男",equipment:"测试数据demo"};
	// 模板渲染
	var template1= document.getElementById('template'+layerName).innerHTML;
	var lineChartData={};
	var pieChartData={};

	if(globalConfig.poison.type==layerType)
	{
		var resList = await getHazardListPack();
		//var res = await getTagInfo(info.remarks);
		var ares = await getAreas();
		console.log(resList);
		for(let hazard of resList)
		{
			if(hazard.tag.tagName==info.remarks)
			{
				data = hazard;
				break;
			}
		}
		if(!data.tag.tagShortName)
			data.tag.tagShortName='未配置';
		for(let d of ares.data)
		{
			if(d.orgName==data.org.orgName){
				//data.equipment.org.orgType=d.typeName;
				data.orgName=d.orgName;
				data.orgTypeName=d.orgTypeName;
				break;
			}
		}
	}
	else if(globalConfig.danger.type==layerType)
	{
		var res=await getCameraInfo(info.name);
		if(res.data.success&&res.data.data.length>0)
		{
			data=res.data.data.length>0?res.data.data[0]:{};
			if(!data.equipment)
			{
				data.equipment={equipmentName:'点位未关联主设备',shortName:''};
			}
			if(data.rtspUrl)
			{
				try{playFlvFunc(data.rtspUrl);}catch{
					layer.alert('视频加载失败');
				}
			}
			else
			{
				layer.alert('视频绑定ID为空');
			}
		}
		else
		{
			layer.alert('数据加载失败');
			return;
		}
	}
	else if(globalConfig.hidden.type==type)
	{
		 var resData = await getLineChartDataPack();
		 var pieResData = await getPieChartDataPack();
			for(var item of resData)
			{
				if(item.CldName==info.name){
					data.equipment=info.name;
					lineChartData=item;
					break;
				}
			}
			for(var item of pieResData)
			{
				if(item.CldName==info.name){
					pieChartData=item;
					break;
				}
			}
	}
	else if(globalConfig.risk.type==layerType){
	}
	else if(globalConfig.work.type==layerType){
		debugger
		var workRes=await getPermit();
		if(workRes.data && workRes.data.msg=='success')
		{
			// var ppList=filterWorkList(workRes.data.data);
			// for(let p of ppList)
			// {
			// 	if(p.code==info.remarks)
			// 	{
			// 		data.push(p);
			// 	}
			// }
			if(workRes.data.data.length>0&&workRes.data.data[0].data.length>0)
			{
				data=workRes.data.data[0].data[0];
			}
			else{
				layer.alert('数据为空');
			}
		}
		else{
			layer.alert('数据加载失败');
		}
		//data=[{Name:'测试',Id:'2'},{Name:'我的',Id:'5'}];
	}
	else if(globalConfig.emer.type==layerType){
		var emerRes=await getEmer();
		if(emerRes.data && emerRes.data.msg=='success')
		{
			var ppList=filterEmerList(emerRes.data.data);
			for(var p of ppList)
			{
				if(p.ID==info.remarks)
				{
					data=p;
					break;
				}
			}
		}
		else{
			layer.alert('数据加载失败');
		}
	}
	else if(globalConfig.position.type==layerType){
	
	}
	console.log(data);
	document.getElementById('templatelist'+layerName).innerHTML = template(template1,{data:data});
	if(globalConfig.hidden.type==layerType)
	{
		if(lineChartData&&pieChartData)
		{
			initEChart(lineChartData,pieChartData);
		}
	}
}
   

function layerOpen(info)
{
	var layerType=0;
	var layerName='';
	var area=['620px', '420px'];
	if(globalConfig.poison.load.includes(info.type))
	{
		layerType=globalConfig.poison.type;
		layerName=globalConfig.poison.name;
		area=['320px', '266px'];
	}
	if(globalConfig.danger.load.includes(info.type))
	{
		layerType=globalConfig.danger.type;
		layerName=globalConfig.danger.name;
	}
	if(type==globalConfig.hidden.type)
	//if(globalConfig.hidden.load.includes(info.color))
	{
		layerType=globalConfig.hidden.type;
		layerName=globalConfig.hidden.name;
	}
	if(globalConfig.emer.load.includes(info.type))
	{
		layerType=globalConfig.emer.type;
		layerName=globalConfig.emer.name;
		area=['320px', '380px'];
	}
	if(type==globalConfig.work.type)
	//if(globalConfig.work.load.includes(info.color))
	{
		layerType=globalConfig.work.type;
		layerName=globalConfig.work.name;
	}
	
	layer.open({
		title:null,
  		type: 1,
  		//skin: 'layui-layer-rim', //加上边框
  		area:area, //宽高
		shade: 0,//阴影
		//anim:2,
  		content: '<div id="templatelist'+ layerName +'"></div>',
  		end: function () {
			tmap.rmFeatureSelsct();
      	}
	});
  	fitContent(info,layerName,layerType);
}

function initEChart(lineData,pieData)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('main'));
	//var option=null;
	var option = {
		title: {
			text: '工厂同类隐患发生次数：',
			left: 'left'
		},
    xAxis: {
        type: 'category',
        data: lineData.month
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: lineData.num,
        type: 'line'
    	}]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	var myChartYear = echarts.init(document.getElementById('mainYear'));
	var yearData=[];
	for(var item of pieData.pif)
	{
		yearData.push({value: item.cn, name: item.PitfallName});
	}
	option = {
		title: {
			text: '区域内各类隐患分布：',
			left: 'left'
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)'
		},
		
		series: [
			{
				name: pieData.CldName,
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: yearData,
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};
	myChartYear.setOption(option);
	
}

// 初始化
var tmap = new Mote.Map({
	target: "map",
	place: "61",
		//place: "2",
	building: 1,
	floor: "01",
		//floor: "22",
	mode: "2d"
})


function playFlv(url) {
	var height = $(window).height;
     $("#videoElement").height(height);
     $("#mainContainer").height(height);
    if (flvjs.isSupported()) {
      var videoElement = document.getElementById('videoElement');
      var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: url,
        isLive: true,
                hasAudio: false,
                hasVideo: true,
                enableStashBuffer: true,
      });
      flvPlayer.attachMediaElement(videoElement);
      flvPlayer.load();
      flvPlayer.play();
    }
}

// function playFlv(url) {
   
// 	var player = new Aliplayer({
// 	  "id": "player-flv",
// 	  "source": url,
// 	  "width": "100%",
// 	  "height": "340px",
// 	  "autoplay": true,
// 	  "isLive": true,
// 	  "rePlay": false,
// 	  "playsinline": false,
// 	  "preload": true,
// 	  "controlBarVisibility": "hover",
// 	  "useH5Prism": true
// 	}, function (player) {
// 	  console.log("The player is created");
// 	}
// 	);
// }

function loadAll()
{
 // 加载点
tmap.loadPoint();
// 加载面
tmap.loadPolygon();
// 加载透明面
tmap.loadAlphaPolygon();
}

// 隐藏图层
function hideAllLayer(){
	tmap.setPotVisible(!tmap.getPotVisible());
	tmap.setAreaVisible(!tmap.getAreaVisible());
	//tmap.setAlphaAreaVisible(!tmap.getAlphaAreaVisible());
}

// 隐藏区域
function hideArea(){
	tmap.setAreaVisible(!tmap.getAreaVisible());
	//tmap.setAlphaAreaVisible(!tmap.getAlphaAreaVisible());
}

// //消除鼠标单击事件
// function removeMouseEvent()
// 	{
// 	   tmap.rmMouseEvent();
// 	}
//控制点位大小
function setPOIScale(){
	// 默认scale：0.6
	tmap.setPotScale(0.2);
}

// 根据坐标加载地图
function loadMapByLonLat(){
var lon = 119.02492270,lat = 33.38843574;
var ret = tmap.loadMap(lon, lat,function(e){
	 if(e == 1)
	alert("加载成功");
});
}
// 定位点显示
function loadLocate(){
var locators = [{
	bid:'233',
	placeId:'61',
	buildingId:1,
	floorId:'01',
	lon:119.02492270,
	lat:119.38843574
} ];
var ret = tmap.loadLocators(locators,function(e){
	 if(e == 1)
	alert("加载成功");
});
}
// 定位点鼠标移入
function getLocateByMoveon(){
	tmap.locatorMouseEvent('move', function(info){
	   alert(JSON.stringify(info));
	});
}
// 根据类型加载POI，示例：加载type=12的poi 参数传数组就是数组
function getPOIByType(tp){
	var filter = {
	types:tp
	};
// 删除全部pot图层
tmap.rmPoint();
// 根据type加载pot图层
	tmap.loadPointByType(filter,function(e){
		console.log('e',e);
	//if(e == 1)
		//alert("加载成功");
	});
}
// 根据类型加载AREA，示例：加载type=12的AREA
function getAreaByType(tp){
	var filter = {
		types:tp
	};
	// 删除全部Area图层
	// tmap.rmPolygon();
	// 根据type加载Area图层
	tmap.loadPolygonByType(filter,function(e){
		//if(e == 1)
			//alert("加载成功");
	});
}
// 根据类型加载透明框，示例：加载type=12的AlphaArea
function getAlphaAreaByType(tp){
	var filter = {
		type:tp
	};
	// 删除全部透明框图层
	// tmap.rmAlphaPolygon();
	// 根据type加载透明框图层
	tmap.loadAlphaPolygonByType(filter,function(e){
		//if(e == 1)
			//alert("加载成功");
	});
}
 // 根据名称加载POI
 function getPOIByName(names){
	var filter = {
		names:names
	};
	tmap.loadPointByName(filter,function(e){
		//if(e == 1)
		//	alert("加载成功");
		});
	}

	function getPOIByRemarks(remarks){
		var filter = {
			remarks:remarks
		};
		tmap.loadPointByRemarks(filter,function(e){
			//if(e == 1)
			//	alert("加载成功");
			});
		}
// 根据名称加载AREA
function getAreaByName(names){
	var filter = {
		names:names
	}
	tmap.loadPolygonByName(filter,function(e){
		//if(e == 1)
			//alert("加载成功");
		});
	}
// 根据坐标和层级加载地图
function loadMapByLonLatZoom(){
	var lon = 119.02492270,lat = 33.38843574,zoom = 18;// minZoom 15,maxZoom 24
	if(lo&&la)
	{
		lon=lo;
		lat=la;
	}
	var ret = tmap.loadMap(lon, lat,zoom,function(e){
	//  if(e == 1)
	// alert("加载成功");
	});
}	
loadMapByLonLatZoom();
// 新增点&保存(输入坐标)
function drawPotByCoords(i){
	var info = {
 		name:i.name,
 		remarks:i.remarks,
 		lon: i.longitude,
 		lat: i.latitude,
 		building_id:tmap.getBuilding(),
 		floor_id:tmap.getFloor(),
 		place_id:tmap.getPlace(),
 		type:i.type
	};
	tmap.drawPointByCoords(info, function(e){
		let msg='[' +info.name + ']点位保存';
		if(e == 1)
		{
			msg+='成功!';
		}
		else{
			msg+='失败!';
		}
		console.log('poiMsg',msg);
		//layer.alert(msg);
	})
}
function drawAreaByCoords(a){
	var info = {
	 	name:a.name,
	 	remarks:a.code,
	 	coords: a.coords,
	 	building_id:tmap.getBuilding(),
	 	floor_id:tmap.getFloor(),
	 	place_id:tmap.getPlace(),
	 	color:a.color
	};
	tmap.drawAreaByCoords(info, function(e){
		let msg='[' +info.name + ']区域保存';
		if(e == 1)
		{
			msg+='成功!';
		}
		else{
			msg+='失败!';
		}
		console.log('areaMsg',msg);
		//layer.alert(msg);
	});
}

$('#reset').click(function(){
	resetAll();
});
$('#resetOther').click(function(){
	resetOtherArea();
});
$('#clear').click(function(){
	clearPotArea();
});
layerSelectHide();
$('#layer-select').click(function(){
	if(fixShow)
	{
		layerSelectHide();
		fixShow=false;
	}
	else
	{
		layerSelectShow();
		fixShow=true;
	}
});
function layerSelectHide()
{
	//$('.layer-select').hide();
	$('.layer-select').css('visibility','hidden');
}
function layerSelectShow()
{
	//$('.layer-select').hide();
	$('.layer-select').css('visibility','visible');
}
//多选框属性默认为选中
$("input[name='poison'],input[name='fire'],input[name='area']").prop('checked', true);

$("input[name='poison'],input[name='fire'],input[name='area']").click(function(){
	
	//先清除所有的
	tmap.rmPoint();
	//选中状态可参考下列2类
	//console.log('ch1',$("input[name='poison']").prop('checked'));  
	//console.log('ch2f',$("input[name='fire']").is(':checked'));
	//判断选中状态
	var fireStatus=$("input[name='fire']").is(':checked');
	var poisonStatus=$("input[name='poison']").is(':checked');
	var areaStatus=$("input[name='area']").is(':checked');
	if($("input[name='fire']").is(':checked'))
	{
		getPOIByType([globalConfig.poison.load[0]]);
	}
	if($("input[name='poison']").is(':checked'))
	{
		getPOIByType([globalConfig.poison.load[1]]);
	}
	if(fireStatus&&poisonStatus)
	{
		getPOIByType(globalConfig.poison.load);
	}
	hideArea();
});
$('#fireBtn').click(function(){
	getPOIByType(globalConfig.poison.load[0]);
	layerSelectHide();
});
$('#poisonBtn').click(function(){
	getPOIByType(globalConfig.poison.load[1]);
	layerSelectHide();
});

//hse的应急物资List重组
function filterEmerList(list)
{
	var ppList=[];
	for(let l of list)
	{
		for (let det of l.detail)
		{
			ppList.push({Organization:l.Organization,
				Supplies:l.Supplies,
				Stocks:det.Stocks,
				Coordinate:det.Coordinate,
				ID:l.VERID+','+det.VERID,
				Address:l.Address,
				Unit:l.Unit,
				Principal:l.Principal,
				RegPerson:det.RegPerson,
				RegDate:det.RegDate
			});
		}
	}
	return ppList;
}

//hse的作业许可List重组
function filterWorkList(list)
{
	var ppList=[];
	for(let l of list)
	{
		for (let da of l.data)
		{
			ppList.push({
				code:l.code,
				JobLeaderx:da.JobLeaderx,
				Timeend:da.Timeend,
				Timestrat:da.Timestrat,
				Operation:da.Operation,
				AreaName:da.AreaName,
				Name:da.Name
			});
		}
	}
	return ppList;
}
// 清空点和面
function clearPotArea(){
	var msg='';
	tmap.clearPot(function(e){
 		if(e == 1)
 			msg+=" 清除点成功";
   //layer.alert("清除点成功");
	});
	tmap.clearArea(function(e){
 		if(e == 1)
 			msg+=" 清除面成功";
   //layer.alert("清除面成功");
	});
	tmap.clearAlphaArea(function(e){
 		if(e == 1)
 			msg+=" 清除透明框成功";
   //layer.alert("清除透明框成功");
	});
	//layer.alert(msg);
	console.log('clearMsg',msg);
	layer.alert('清除成功');
}
//重置所有点位面框
function resetAll()
{
	//清除所有点位
	clearPotArea();
	resetPOI();
	resetArea();
	resetAlphaArea();
	getPOIByClickReal();
	getAreasByClickReal();
	layer.alert('生成成功');
}
async function resetPOI()
{
	var tp='';
	var info = {};
	var res = await getHazardList();
	var list = {};
	if(res.data.success && res.data.data.length>0)
	{
		list = res.data.data;
		for(let poi of list)
		{
			info.longitude=poi.longitude;
			info.latitude=poi.latitude;
			info.name=poi.tag.tagDescription;
			info.remarks=poi.tag.tagName;
			if(poi.hazardUdc.code==globalConfig.poison.code[0])
				tp=globalConfig.poison.load[0];
			else if(poi.hazardUdc.code==globalConfig.poison.code[1])
				tp=globalConfig.poison.load[1];
			else
				tp='';
			info.type=tp;
			if(info.longitude && info.latitude )
			{
				console.log('drawPoi',info);
				drawPotByCoords(info);
			}
		}
		//data=res.data.data.length>0?res.data.data[0]:{};
	}	
	else
	{
		layer.alert('危险源点位更新失败');
		return;
	}
	//监控
	var res= await getCameraList();
	if(res.data.success && res.data.data.length>0)
	{
		list = res.data.data;
		for(let poi of list)
		{
			info.longitude=poi.videoLongitude;
			info.latitude=poi.videoLatitude;
			info.name=poi.cameraName;
			info.remarks='监控备注';
			info.type=globalConfig.danger.load[0];
			if(info.longitude && info.latitude )
			{
				console.log('drawPoi',info);
				drawPotByCoords(info);
			}
		}
	}
	else{
		layer.alert('监控点位更新失败');
		return;
	}
	//应急物资点位
	var res = await getEmer();
	if(res.data && res.data.msg=='success')
	{
		list = res.data.data;
		var ppList=filterEmerList(list);
		for(let poi of ppList)
		{
			//判断点位属性是否为空
			if(!poi.Coordinate||poi.Coordinate.split(',').length<2)
			{
				continue;
			}
			info.longitude=poi.Coordinate.split(',')[0];
			info.latitude=poi.Coordinate.split(',')[1];
			info.name=poi.Supplies;
			info.remarks=poi.ID;
			info.type=globalConfig.emer.load[0];
			if(info.longitude && info.latitude )
			{
				console.log('drawPoi',info);
				drawPotByCoords(info);
			}
		}
	}
	else{
		layer.alert('监控点位更新失败');
		return;
	}
}
function initArea(areaList,color)
{
	var info = {};
	var coordList= [];
	var wn= '';
	var en= '';
	var es= '';
	var ws= '';
	var name='';
	var code='';
	var group=[];
	group = groupBy(areaList, (org) => {
		return org.orgCode
	});
	
	for(let data of group)
	{
		if(data.length!=4)
			continue;
		for(var o of data)
		{
			if(o.typeCode==globalConfig.wnCode)
				wn = o.value;
			if(o.typeCode==globalConfig.enCode)
				en = o.value;
			if(o.typeCode==globalConfig.esCode)
				es = o.value;
			if(o.typeCode==globalConfig.wsCode)
				ws = o.value;
			name = o.orgName;
			code = o.orgCode;
		}
		coordList = [
			{lon:en.split(',')[0],lat:en.split(',')[1]},
			{lon:wn.split(',')[0],lat:wn.split(',')[1]},
			{lon:ws.split(',')[0],lat:ws.split(',')[1]},
			{lon:es.split(',')[0],lat:es.split(',')[1]},
			{lon:en.split(',')[0],lat:en.split(',')[1]},];
		
		info = {
			 name:name,
			 coords: coordList,
			 color:color,
			 code:code
			};
		console.log('drawArea',info);
		drawAreaByCoords(info);
	}
}

async function resetArea()
{
	//reset基础区域
	var res = await getAreas();
	if(res.data && res.data.length>0)
	{
		initArea(res.data,'#FFFF3030');
		//initArea(res.data,globalConfig.hidden.load[0]);
		//initArea(res.data,globalConfig.work.load[0]);
	}
	//resetOtherArea(res);
}
async function resetAlphaArea()
{

}

async function resetOtherArea(res)
{
//reset隐患区域
var resLine = await getLineChartDataPack();
var orgNameList = resLine.select((t)=>t.CldName);
var flist = filterArea(res.data,orgNameList); //经过筛选的area
console.log('flist',flist);
initArea(flist,globalConfig.hidden.load[0]);

//reset工作许可区域
var resPermit = await getPermit();
if(resPermit.data && resPermit.data.msg=='success')
{
	var list = resPermit.data.data;
	var orgNameList2 = list.select((t)=>t.name);
	var flist2 = filterArea(res.data,orgNameList2); //经过筛选的area
	initArea(flist2,globalConfig.work.load[0]);
}
}

function getPOIByClickReal(){
	console.log('执行点位添加单击事件');
	tmap.poiMouseEvent('click', function(info){
		if(info && info.length>0)
		{
			layerOpen(info[0]);
		}
		else{
			layer.alert('未获取到任何点或区域');
		}
		tmap.rmFeatureSelsct();
	});
}
//鼠标移入事件
function getPOIByMoveon(){
	tmap.poiMouseEvent('move', function(info){
	   //alert(JSON.stringify(info));
	   //tmap.rmFeatureSelsct();
	});
}

function getAreasByClickReal(){
	console.log('执行区域添加单击事件');
	tmap.areaMouseEvent('click', function(info){
		if(info && info.length>0)
		{
			layerOpen(info[0]);
		}
		else{
			layer.alert('未获取到任何点或区域');
		}
		tmap.rmFeatureSelsct();
	});
}

//根据参数加载点位
async function loadPointByParams()
{
	$('.layer-select li').hide();
	$('#layer-select').hide();

if(tagName)
{
	//加载单独点位
	getPOIByRemarks([tagName]);
	getPOIByClickReal();
	return;
}
	if(type == globalConfig.poison.type)
	{
		getPOIByType(globalConfig.poison.load); //可传数组也可传单个字符串
		//getAreaByType(t);
		//getAlphaAreaByType(t);
		$('.poison-li').show();
		$('#layer-select').show();
		tmap.loadPolygon();
		getPOIByClickReal();
	}
	else if(type == globalConfig.danger.type)
	{
		getPOIByType(globalConfig.danger.load);
		tmap.loadPolygon();
		getPOIByClickReal();
	}
	else if(type == globalConfig.hidden.type)
	{
		var rr = await getLineChartDataPack();
		var names = rr.select((t)=>t.CldName);
		getAreaByName(names);
		//getAreaByType(globalConfig.hidden.load);
	}
	else if(type == globalConfig.risk.type)
	{
		//for(let t of globalConfig.risk.load) //in 是key  , of 是object
		getAreaByType(globalConfig.risk.load);
		getAreasByClickReal();
	}
	else if(type == globalConfig.work.type)
	{
		var rw = await getPermitPack();
		var names = rw.select((t)=>t.name);
		getAreaByName(names);
		getAreasByClickReal();
		//getAreaByType(globalConfig.work.load);
	}
	else if(type == globalConfig.emer.type)
	{
		getPOIByType(globalConfig.emer.load);
		getPOIByClickReal();
	}
	else if(type == globalConfig.position.type)
	{
		// for(let t of globalConfig.position.load) //in 是key  , of 是object
		// {
		// 	 getPOIByType(t);
		// }
	}
	else
	{
		loadAll();
		getPOIByClickReal();
		getAreasByClickReal();
	}
}
//移入事件
//getPOIByMoveon();
//加载点
loadPointByParams();
//设置点icon大小
setPOIScale();

