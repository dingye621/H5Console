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
		playFlv(res.data.data);
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
	else if(globalConfig.hidden.type==layerType)
	{
		 var res = await getLineChartData();
		 var pieRes = await getPieChartData();
		 if(res.data&&res.data.msg=='success')
		 {
			for(var item in res.data.data)
			{
				if(item.CldName==info.name){
					data.equipment=info.name;
					lineChartData=item;
					break;
				}
			}
		 }
		 else{
			 layer.alert('数据加载失败');
		 }
		 if(pieRes.data&&pieRes.data.msg=='success')
		 {
			for(var item in pieRes.data.data)
			{
				if(item.CldName==info.name){
					pieChartData=item;
					break;
				}
			}
		 }
		 else{
			 layer.alert('数据加载失败');
		 }	
	}
	else if(globalConfig.risk.type==layerType){


	}
	else if(globalConfig.work.type==layerType){
		
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
		var pieRes=await getPieChartData();
		//if(lineChartData&&pieChartData)
		//{
			initEChart(lineChartData,pieChartData);
		//}
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
		area=['420px', '260px'];
	}
	if(globalConfig.danger.load.includes(info.type))
	{
		layerType=globalConfig.danger.type;
		layerName=globalConfig.danger.name;
	}
	if(globalConfig.hidden.load.includes(info.color))
	{
		layerType=globalConfig.hidden.type;
		layerName=globalConfig.hidden.name;
	}
	if(globalConfig.emer.load.includes(info.type))
	{
		layerType=globalConfig.emer.type;
		layerName=globalConfig.emer.name;
		area=['320px', '300px'];
	}
	if(globalConfig.work.load.includes(info.color))
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
  		content: '<div id="templatelist'+ layerName +'"></div>',
  		end: function () {
			tmap.rmFeatureSelsct();
      	}
	  });
  	fitContent(info,layerName,layerType);
}

function initEChart(lineData,pieData)
{
	lineData={
    	"CldCode": "AA0104",
    	"num": [4,0,0,0],
    	"month": [1,2,3,4],
    	"CldName": "发展部",
    	"ClientDevices": 11065
	};
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
	pieData.pif= [
		{
		  "PitfallName": "资质证照",
		  "PitfallTypex": 14197,
		  "cn": 2
		},
		{
		  "PitfallName": "安全规章制度",
		  "PitfallTypex": 14205,
		  "cn": 1
		},
		{
		  "PitfallName": "安全培训教育",
		  "PitfallTypex": 14211,
		  "cn": 1
		},
		{
		  "PitfallName": "相关方管理",
		  "PitfallTypex": 14220,
		  "cn": 2
		},
		{
		  "PitfallName": "重大危险源管理",
		  "PitfallTypex": 14225,
		  "cn": 2
		},
		{
		  "PitfallName": "个体防护装备",
		  "PitfallTypex": 14230,
		  "cn": 3
		},
		{
		  "PitfallName": "职业健康",
		  "PitfallTypex": 14234,
		  "cn": 1
		}
	  ];
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
//多选框属性默认为选中
$("input[name='poison'],input[name='fire']").prop('checked', true);

$("input[name='poison'],input[name='fire']").click(function(){
	
	//先清除所有的
	tmap.rmPoint();
	//选中状态可参考下列2类
	//console.log('ch1',$("input[name='poison']").prop('checked'));  
	//console.log('ch2f',$("input[name='fire']").is(':checked'));
	//判断选中状态
	var fireStatus=$("input[name='fire']").is(':checked');
	var poisonStatus=$("input[name='poison']").is(':checked');
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
		//initArea(res.data,'#FFFF3030');
	}

	//reset隐患区域
	var resLine = await getLineChartData();
	if(resLine.data && resLine.data.msg=='success')
	{
		var list = resLine.data.data;
		list=[
			{
			  "CldCode": "AA0104",
			  "num": [4,0,0,0],
			  "month": [1,2,3,4],
			  "CldName": "发展部",
			  "ClientDevices": 11065
			},
			{
		 
			  "CldCode": "AA010701",
			  "num": [1,2,9,0],
			  "month": [1,2,3,4],
			  "CldName": "丙烯酸装置",
			  "ClientDevices": 11069
			}
		  ];
		var orgNameList = list.select((t)=>t.CldName);
		var flist = filterArea(res.data,orgNameList); //经过筛选的area
		console.log('flist',flist);
		initArea(flist,globalConfig.hidden.load[0]);
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
function loadPointByParams()
{
	$('.layer-select li').hide();
	$('#layer-select').hide();
	if(type == globalConfig.poison.type)
	{
		getPOIByType(globalConfig.poison.load); //可传数组也可传单个字符串
		//getAreaByType(t);
		//getAlphaAreaByType(t);
		$('.poison-li').show();
		$('#layer-select').show();
	}
	else if(type == globalConfig.danger.type)
	{
		getPOIByType(globalConfig.danger.load);
	}
	else if(type == globalConfig.hidden.type)
	{
		getAreaByType(globalConfig.hidden.load);
	}
	else if(type == globalConfig.risk.type)
	{
		//for(let t of globalConfig.risk.load) //in 是key  , of 是object
		getAreaByType(globalConfig.risk.load);
	}
	else if(type == globalConfig.work.type)
	{
		getAreaByType(globalConfig.work.load);
	}
	else if(type == globalConfig.emer.type)
	{
		getPOIByType(globalConfig.emer.load);
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

getPOIByClickReal();

getAreasByClickReal();



