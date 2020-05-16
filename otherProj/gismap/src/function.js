var req = GetRequest();
var type = req['tp'];  


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
//获取sessionStorage
var storage = window.sessionStorage;  
var access_token = storage.getItem("access_token"); 
let fixShow=false; 
let inn=true;
let out=false;
let poison=true;
let fire=true;
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
		playFlv(res.data.data);
	}
	else{
		layer.alert(res.data.msg);
	}
}

//填充弹窗内容
async function fitContent(info,layerName,layerType)
{
// 准备好的数据源，可以是通过网络获取的json数据，也可以是通过ajax从后台拿到的数据
var data = {name:"张三",sex:"男",equipment:"测试数据demo"};
// 模板渲染
var template1= document.getElementById('template'+layerName).innerHTML;
 
if(globalConfig.poison.type==layerType)
{
	var res=await getTagInfo(info.remarks);
	console.log(res);
	if(res.data.success&&res.data.data.length>0)
	{
		data=res.data.data.length>0?res.data.data[0]:{};
		if(!data.equipment)
		{
			data.equipment={equipmentName:'点位未关联主设备',shortName:'',org:{orgName:'点位未关联区域'}};
		}
	}
	else{
		layer.alert('数据加载失败');
		return;
	}
}
else if(globalConfig.danger.type==layerType)
{
	var res=await getCameraInfo(info.name);
	if(res.data.success&&res.data.data.length>0)
	{
		data=res.data.data.length>0?res.data.data[0]:{};
		console.log('datacamera',data);
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
		else{
				layer.alert('视频绑定ID为空');
			}
	}
	else
	{
		layer.alert('数据加载失败');
		return;
	}
}
else if(globalConfig.hidden.load.includes(info.type))
{
	template1 = document.getElementById('templateHidden').innerHTML;
}
else if(globalConfig.risk.load.includes(info.type)){


}
else if(globalConfig.work.load.includes(info.type)){}
else if(globalConfig.emer.load.includes(info.type)){}
else if(globalConfig.position.load.includes(info.type)){
	template1 = document.getElementById('templatePosition').innerHTML;
}

document.getElementById('templatelist'+layerName).innerHTML = template(template1,{data:data});

if(globalConfig.hidden.load.includes(info.type))
 	initEChart();
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
		area=['420px', '260px'];
	}
	if(globalConfig.danger.load.includes(info.type))
	{
		layerType=globalConfig.danger.type;
		layerName=globalConfig.danger.name;
	}
		
	layer.open({
		title:null,
  		type: 1,
  		//skin: 'layui-layer-rim', //加上边框
  		area:area, //宽高
  		shade: 0,//阴影
  		content: '<div id="templatelist'+ layerName +'"></div>',
  		end: function () {
			tmap.rmFeatureSelsct();
      	}
	  });
  	fitContent(info,layerName,layerType);
}

function initEChart()
{
	var data={
    "CldCode": "AA0104",
    "num": [4,0,0,0],
    "month": [1,2,3,4],
    "CldName": "发展部",
    "ClientDevices": 11065
};
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
//var option=null;
option = {
    xAxis: {
        type: 'category',
        data: data.month
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: data.num,
        type: 'line'
    }]
};
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
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


//视频播放
function playFlv(url) {
   
	var player = new Aliplayer({
	  "id": "player-flv",
	  "source": url,
	  "width": "100%",
	  "height": "340px",
	  "autoplay": true,
	  "isLive": true,
	  "rePlay": false,
	  "playsinline": false,
	  "preload": true,
	  "controlBarVisibility": "hover",
	  "useH5Prism": true
	}, function (player) {
	  console.log("The player is created");
	}
	);
}

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
function hideLayer(){
	tmap.setPotVisible(!tmap.getPotVisible());
	tmap.setAreaVisible(!tmap.getAreaVisible());
	//tmap.setAlphaAreaVisible(!tmap.getAlphaAreaVisible());
}

// //消除鼠标单击事件
// function removeMouseEvent()
// 	{
// 	   tmap.rmMouseEvent();
// 	}

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

// 根据坐标和层级加载地图
function loadMapByLonLatZoom(){
var lon = 119.02492270,lat = 33.38843574,zoom = 17;// minZoom 15,maxZoom 24
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
	 	remarks:'自动添加的区域',
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

// $('#tpPoison').click(function(){
// getPOIByType(globalConfig.poison);
// });
// $('#tpDanger').click(function(){
// getPOIByType(globalConfig.danger);
// });
// $('#tpHidden').click(function(){
// getPOIByType(globalConfig.hidden);
// });
$('#reset').click(function(){
	resetAll();
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
$("input[name='in']").click(function(){
if(inn)
{
	$("input[name='in']").attr('checked','checked');
	inn=false;
}
else{
	$("input[name='out']").attr('checked','checked');
		inn=true;
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
$("input[name='poison']").click(function(){
	if(poison)
	{
		hideLayer();
		getPOIByType(globalConfig.poison.load[0]);
		poison=false;
	}
	else
	{
		hideLayer();
		getPOIByType(globalConfig.poison.load[1]);
		poison=true;
	}
});
$("input[name='fire']").click(function(){
	if(fire)
	{
		hideLayer();
		getPOIByType(globalConfig.poison.load[1]);
		fire=false;
	}
	else
	{
		hideLayer();
		getPOIByType(globalConfig.poison.load[0]);
		fire=true;
	}
});
$('#fireBtn').click(function(){
	getPOIByType(globalConfig.poison.load[0]);
	layerSelectHide();
});
$('#poisonBtn').click(function(){
	getPOIByType(globalConfig.poison.load[1]);
	layerSelectHide();
});
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
	//clearPotArea();
	resetPOI();
	resetArea();
	resetAlphaArea();
	//getPOIByClickReal();
	//getAreasByClickReal();
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
	var res= await getCameraList();
	if(res.data.success && res.data.data.length>0)
	{
		list = res.data.data;
		for(let poi of list)
		{
			info.longitude=poi.videoLongitude;
			info.latitude=poi.videoLatitude;
			info.name=poi.cameraName;
			info.remarks='';
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
}
async function resetArea()
{
	var res = await getAreas();
	if(res.data && res.data.length>0)
	{
		var info = {};
		var coordList= [];
		var wn= '';
		var en= '';
		var es= '';
		var ws= '';
		var name='';
		var group = groupBy(res.data, (org) => {
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
				 color:'#FFFF3030'
				};
			console.log('drawArea',info);
			drawAreaByCoords(info);
		}
	}
}
async function resetAlphaArea()
{

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

function getAreasByClickReal(){
	console.log('执行区域添加单击事件');
	tmap.areaMouseEvent('click', function(info){
		layer.alert('区域弹出框');
		tmap.rmFeatureSelsct();
	});
}

//根据参数加载点位
function loadPointByParams()
{
	$('.layer-select li').hide();
	if(type == globalConfig.poison.type)
	{
		getPOIByType(globalConfig.poison.load); //可传数组也可传单个字符串
		//getAreaByType(t);
		//getAlphaAreaByType(t);
		$('.poison-li').show();
	}
	else if(type == globalConfig.danger.type)
	{
		getPOIByType( globalConfig.danger.load);
		$('#layer-select').hide();
	}
	else if(type == globalConfig.hidden.type)
	{
	
	}
	else if(type == globalConfig.risk.type)
	{
		for(let t of globalConfig.risk.load) //in 是key  , of 是object
		{
			 getAreaByType(t);
		}
	}
	else if(type == globalConfig.work.type)
	{
	
	}
	else if(type == globalConfig.emer.type)
	{
	
	}
	else if(type == globalConfig.position.type)
	{
		for(let t of globalConfig.position.load) //in 是key  , of 是object
		{
			 getPOIByType(t);
		}
	}
	else
	{
		 loadAll();
	}
}

loadPointByParams();

// if(type == globalConfig.poison.type || type == globalConfig.danger.type)
// {
	//给点位加上事件
	getPOIByClickReal();
// }
// else
// {
	//给区域加上事件
	getAreasByClickReal();
//}


