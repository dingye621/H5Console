// common
var IconPath = ".";//getContextPath();"http://47.103.35.78:8081/chem/";//
var locateIp = ".";//getContextPath();
var locate; // 中心点 定位点
var deviceId; // 手环id 从传入参数获取值 点位点
var mapParam = locateIp + '/param/getParamByName';
var ltype = 2;//assignment("LocateType", 2); // 定位点类型
var placeid = "61";//assignment("placeid", 2);
var buildingid = 1;
var floorid = "01";//assignment("floorNum", 2);// 楼层编号 选择楼层
var Ldistance = 3;//assignment("distance", 2);// 控制定位点跳动的最短距离
var mapMode = 2.5;//parseFloat(assignment("mapMode", 2));// 控制2,3d切换
// var LocationRequestParam; // 定位param
var Linterval = 2;//assignment("Linterval", 2);// 定位时间间隔
var DBs = "prison";//0 ? 'coges' : 'prison'; // 数据源选择（UWB：coges；其他：mote）
var comIp = "http://114.215.83.3:8090";//assignment("GeoServer", 3);

var wfsUrl = comIp + '/geoserver/wfs';
// var wmsUrl = comIp + '/geoserver/' + DBs + '/wms';
var locateAssetUrl = locateIp + '/location/getPersonLocation';// get
var locateAssetsUrl = locateIp + '/location/getPersonsLocation';// post
var locateNamesUrl = locateIp + '/location/getPersonsName';// post
var locateAssetCertainUrl = locateIp + '/location/getPersonCertainLocation';
var locateAllUrl = locateIp + '/location/getAllLocation';
var routeAssetUrl = locateIp + '/location/getTrack';
var mapIconUrl = locateIp + '/location/getIcon';
var AssetSavetype; // 资产信息编辑的flag（add or upd or dlt）
var AssetSelecttype; // 资产信息查看flag（one or all）
var drawAttendanceType;// 电子围栏
// 存放报警看板特殊显示的deviceId，数组
var deviceIdForHighlight = [], deviceIdMae;

var assetCenter;
// var assetFenceid;
var AseetIdForLocate = [];


// 获取地图数据
var featuresBuilding = getBasemapFeatures('building_point');
var featuresBackground = getBasemapFeatures('polygon_background');
var featuresPolygon = getBasemapFeatures('polygon');
var featuresPoint = getBasemapFeatures('point');
function getBasemapFeatures(typename){
	var features = [];
	$.ajax({
		url : wfsUrl,
		data : {
			service : 'WFS',
			version : '1.1.0',
			request : 'GetFeature',
			typename : DBs + ':' + typename,
			outputFormat : 'application/json',
			cql_filter: 'place_id=' + placeid
		},
		type : 'GET',
		dataType : 'json',
		async : false,
		success : function(response) {
			features = new ol.format.GeoJSON().readFeatures(response);	
		}
	});
	return features;
}

var featuresBackgroundObj = getFeaturesOBJ(featuresBackground);
var featuresPolygonObj = getFeaturesOBJ(featuresPolygon);
var featuresPointObj = getFeaturesOBJ(featuresPoint);
function getFeaturesOBJ (features){
	var newFeaturesObj = new Object();
	for(var i=0;i<features.length;i++){
		var featuresBuild = features[i].get('building_id');
		var featuresFloor = features[i].get('floor_id');
		if (!newFeaturesObj[featuresBuild]){newFeaturesObj[featuresBuild] = new Object();}
		if (!newFeaturesObj[featuresBuild][featuresFloor]){newFeaturesObj[featuresBuild][featuresFloor] = new Array();}
		newFeaturesObj[featuresBuild][featuresFloor].push(features[i]);
	}	
	return newFeaturesObj;
}


// 从数据库取值给基础变量赋值
function assignment(name, type) {
	var value;
	$.ajax({
		url : mapParam,
		data : {
			"paramName" : name,
			"paramTypeId" : type
		},
		async : false,
		success : function(data) {
			value = data;
		}
	});
	return value;
}


//从mysql获取定位人员图标
var locateIcon;
//getlocateIcon();
function getlocateIcon() {
	var url = '';
	$.ajax({
		url : mapIconUrl,
		type : 'GET',
		async : false,
		success : function(data) {
			locateIcon = data;
		}
	});
}


// 获取中心点
var mapCenter = function(buildingId) {
	var buildingCenter = [];
	var buildingLength = featuresBuilding.length;
	for (var Num = 0; Num < buildingLength; Num++) {
		if (featuresBuilding[Num].get('building_id') == buildingid) {
			buildingCenter = featuresBuilding[Num].getGeometry().getCoordinates();
			break;
		}
	}
	return buildingCenter;
}
var placeCenter = ltype == 0 ? [ 1, 3 ] : mapCenter(buildingid);

// 设置视图
var lzoom = ltype == 0 ? 5 : 21;
var view = new ol.View({
	center : placeCenter,
	projection : 'EPSG:4326',
	zoom : lzoom,
	maxZoom : 24,
	minZoom : 15
});
// 设置控件
var controls = new Array();
var rotateControl = new ol.control.Rotate();// 指北针
controls.push(rotateControl);
var scaleLineControl = new ol.control.ScaleLine();// 比例尺
controls.push(scaleLineControl);


// 室内图对应数据显示
function getLoadBaseFeatures(baseFeatures) {
	var newBaseFeatures = [];
	for (var i=0; i<baseFeatures.length; i++ ){
		if(baseFeatures[i].get('building_id' == buildingid && baseFeatures[i].get('place_id') == placeid && baseFeatures[i].get('floor_id') == floorid)){
			newBaseFeatures.push(baseFeatures[i]);
		}
	}
	return newBaseFeatures;
};


// 更改楼层条高亮
function changeFloorAction() {
	var floorLength = document.getElementsByClassName('floorS').length;
	for (var i = 0; i < floorLength; i++) {
		document.getElementsByClassName('floorS')[i].classList.remove('active');
	}
	if (document.getElementsByClassName(floorid)[0] != null) {
		document.getElementsByClassName(floorid)[0].classList.add('active');
	}
}

var placePoistylefun = function(feature) {
	geojsonstyle['30060000'].getText().setText(feature.get('name'));
	return geojsonstyle['30060000'];
}

// 室内图样式设置
var geojsonstylefunction = function(feature) {
	var featureiiiid = feature.get('feature_id');
	if (feature.getGeometry().getType() == 'Point' && (featureiiiid in {
		'30060300' : '',
		'30060000' : '',
		'30040100' : ''
	})) {
		geojsonstyle[featureiiiid].getText().setText(feature.get('name'));
	}
	if (featureiiiid in {
		'30060100' : '',
		'30060200' : ''
	}) {
		if (map.getView().getZoom() > 19) {
			geojsonstyle[featureiiiid].getImage().setScale(
					(map.getView().getZoom() - 19) * 0.1);
		} else {
			var lscale = ltype == 0 ? 0.25 : 0.1;
			geojsonstyle[featureiiiid].getImage().setScale(lscale);
		}
	}
	if (featureiiiid in {
		'30050100' : '',
		'30050800' : '',
		'30050200' : '',
		'30050300' : ''
	}) {
		if (map.getView().getZoom() > 18) {
			geojsonstyle[featureiiiid].getImage().setScale(
					(map.getView().getZoom() - 18) * 0.06);
		} else {
			var lscale = ltype == 0 ? 0.2 : 0.1;
			geojsonstyle[featureiiiid].getImage().setScale(lscale);
		}
	}
	// 返回数据的style
	return geojsonstyle[featureiiiid];
};

// 资产初始点图标设置
var assetInitstylefunction = function(feature) {
	var asset_classiiiid = feature.get('class_id');
	var asset_floor = feature.get('floor_id');
	var assetstyle;
	if (asset_classiiiid == 1000002) {/* 相机专用 */
		assetstyle = new ol.style.Style({
			image : new ol.style.Icon({
				src : IconPath + '/icon/' + asset_classiiiid + '.png',
				anchor : [ 0.5, 0.5 ],
				scale : ltype == 0 ? 0.2
						: (map.getView().getZoom() - 16) * 0.05,
				rotateWithView : true
			}),
			text : new ol.style.Text({
				text : feature.values_.camera_name,
				font : '0.71em sans-serif',
				// scale: 100,
				textAlign : 'center',
				textBaseline : 'top',
				offsetY : 10,
				fill : new ol.style.Fill({
					color : [ 40, 40, 40, 1 ]
				}),
				stroke : new ol.style.Stroke({
					color : [ 255, 255, 255, 1 ],
					width : 1
				})
			}),
			zIndex : 300
		})
	} else {
		var asset_name = feature.get('asset_name');
		var asset_version = feature.get('asset_version');

		assetstyle = new ol.style.Style({
			image : new ol.style.Icon({
				src : IconPath + '/icon/' + asset_classiiiid + '.png',
				anchor : [ 0.5, 0.5 ],
				scale : ltype == 0 ? 0.2
						: (map.getView().getZoom() - 16) * 0.05,
			// rotateWithView: true
			}),
			text : new ol.style.Text({
				text : asset_name,
				font : '0.71em sans-serif',
				// scale: 100,
				textAlign : 'center',
				textBaseline : 'top',
				offsetY : 10,
				fill : new ol.style.Fill({
					color : [ 40, 40, 40, 1 ]
				}),
				stroke : new ol.style.Stroke({
					color : [ 255, 255, 255, 1 ],
					width : 1
				})
			}),
			zIndex : 300
		});
	}

	// 根据楼层显示初始点！
	if (asset_floor == floorid) {
		return assetstyle;
	} else {
		return null;
	}

}
// 资产定位点图标设置
var svglocationWarn = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px">'
		+ '<circle fill="#FFFFFF" stroke="#AA0000" stroke-width="1" cx="15" cy="15" r="8"/>'
		+ '<circle fill="#ff3333" stroke="#ff0000" stroke-width="1" cx="15" cy="15" r="5"/></svg>';
var mysvglocationWarn = new Image();
mysvglocationWarn.src = 'data:image/svg+xml,' + escape(svglocationWarn);

var svglocation = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px">'
		+ '<circle fill="#FFFFFF" stroke="#0000AA" stroke-width="1" cx="15" cy="15" r="8"/>'
		+ '<circle fill="#3333ff" stroke="#0000ff" stroke-width="1" cx="15" cy="15" r="5"/></svg>';
var mysvglocation = new Image();
mysvglocation.src = 'data:image/svg+xml,' + escape(svglocation);

var assetstylefunction = function(feature) {
	var asset_id = feature.get('l_id');
	var asset_classiiiid = feature.get('category');
	var locateFloor = feature.get('floor_id');
	var asset_name = feature.get('name');

	var assetLocateStyle = {
		'show' : new ol.style.Style({
			text : new ol.style.Text({
				text : asset_name,
				font : '0.76em sans-serif',
				// scale: 100,
				textAlign : 'center',
				textBaseline : 'top',
				offsetY : 20,
				fill : new ol.style.Fill({
					color : [ 40, 40, 40, 1 ]
				}),
				stroke : new ol.style.Stroke({
					color : [ 255, 255, 255, 1 ],
					width : 2
				})
			}),
			// image : new ol.style.Icon({
				// src : IconPath + '/' + locateIcon[asset_classiiiid],
				// anchor : [ 0.5, 0.5 ],
				// scale : 0.2 + (map.getView().getZoom()-19)*0.02,
				// rotateWithView : false
			// }),
			zIndex : 300
		}),
		'alarm' : new ol.style.Style({
			text : new ol.style.Text({
				text : asset_name,
				font : '0.76em sans-serif',
				// scale: 100,
				textAlign : 'center',
				textBaseline : 'top',
				offsetY : 0,
				fill : new ol.style.Fill({
					color : [ 40, 40, 40, 1 ]
				}),
				stroke : new ol.style.Stroke({
					color : [ 255, 255, 255, 1 ],
					width : 2
				})
			}),
			image : new ol.style.Icon({
				img : mysvglocation,
				imgSize : [ 30, 30 ], // 图标大小
				anchor : [ 0.5, 1 ], // 摆放位置
				rotateWithView : false
			}),
			zIndex : 300
		}),
		'Highlight' : new ol.style.Style({
			text : new ol.style.Text({
				text : asset_name,
				font : '0.71em sans-serif',
				textAlign : 'center',
				textBaseline : 'top',
				offsetY : 10,
				fill : new ol.style.Fill({
					color : [ 40, 40, 40, 1 ]
				}),
				stroke : new ol.style.Stroke({
					color : [ 255, 255, 255, 1 ],
					width : 1
				})
			}),
			// image : new ol.style.Icon({
				// src : IconPath + '/icon/' + asset_classiiiid + '_Highlight.png',
				// anchor : [ 0.5, 0.5 ],
				// scale : 0.3,
				// rotateWithView : false
			// }),
			zIndex : 300
		})
	};

	// 判断该记录是否需要显示
	var showOrHide;

	// 所在楼层是当前选择楼层
	if (locateFloor == floorid) {
		if (asset_id == deviceIdMae) {
			showOrHide = 'alarm'; // 告警高亮
		} else if ($.inArray(asset_id, deviceIdForHighlight) != -1) {
			showOrHide = 'Highlight'; // 高亮
		} else {
			showOrHide = 'show'; // 正常显示
		}
	}
	return assetLocateStyle['alarm'];
}

// 网关基站样式设置
var assetInitstylefunction = function(feature) {
	var asset_classiiiid = feature.get('class_id');
	return APStyle['0'];
}

// 电子围栏样式设置
var electronicFenceStyleFun = function(feature) {
	var featureFloor = feature.get('floor_id');
	var featureiiiid = '1';
	// 返回数据的style
	if(Dbtype == 'fence_fourcolor'){
		return new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: $("#colorPicker").val()?$("#colorPicker").val():feature.get('color'),
				width:1
			}),
			fill: new ol.style.Fill({
				color: $("#colorPicker").val()?$("#colorPicker").val():feature.get('color'),
			})
		});
	}
	if (featureFloor == floorid) {
		return electronicFenceStyle[featureiiiid];
	} else {
		return electronicFenceStyle['2'];
		;
	}
};
//config-pot
var configPotStyleFun = function(feature) {
	var featureFloor = feature.get('floor_id');
	var featureName = feature.get('name');
	var featureIcon = feature.get('icon')?feature.get('icon'):null;
	var imageSrc = featureIcon?IconPath + '/images/pot/' + featureIcon + '.png':IconPath + '/icon/inspection.png';
	var imageScale = featureIcon?0.6:0.24;
	// 返回数据的style
	return new ol.style.Style({
		image: new ol.style.Icon({
			src: imageSrc,
			scale: imageScale,
		}),
		text: new ol.style.Text({
			text: featureName,
			font: '0.71em sans-serif',
			// scale: 100,
			textAlign: 'center',
			textBaseline: 'bottom',
			offsetY: -15,
			fill: new ol.style.Fill({
				color: [40,40,40,1]
			}),
			stroke: new ol.style.Stroke({
				color: [255,200,100,1],
				width: 5
			})
		}),
		zIndex: 700
	});
};
//config-area
var configAreaStyleFun = function(feature) {
	var featureFloor = feature.get('floor_id');
	var featureName = feature.get('name');
	var featureStrokeColor = feature.get('border_color')
		?[255,255,255,0.1]//feature.get('border_color')
		:feature.get('color')
		?feature.get('color')
		:[255,200,100,0.5];
	var featureFillColor = feature.get('border_color')
		?[255,255,255,0.1]
		:feature.get('color')
		?feature.get('color')
		:[255,200,100,0.5];
	// 返回数据的style
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: featureStrokeColor,
			width:2
		}),
		fill: new ol.style.Fill({
			color: featureFillColor
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: featureFillColor
			})
		}),
		text: new ol.style.Text({
			text: featureName,
			font: '0.71em sans-serif',
			textAlign: 'center',
			textBaseline: 'bottom',
			offsetY: -15,
			fill: new ol.style.Fill({
				color: [40,40,40,1]
			}),
			stroke: new ol.style.Stroke({
				color: [255,200,100,1],
				width: 5
			})
		}),
		zIndex: 700
	});
};
//config-alphaarea
var configAlphaAreaStyleFun = function(feature) {
	var featureFloor = feature.get('floor_id');
	var featureName = feature.get('name');
	var featureStrokeColor = feature.get('border_color')
		?feature.get('border_color')
		:feature.get('color')
		?feature.get('color')
		:[255,200,100,0.5];
	var featureFillColor = feature.get('border_color')
		?[255,255,255,0.1]
		:feature.get('color')
		?feature.get('color')
		:[255,200,100,0.5];
	// 返回数据的style
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: featureStrokeColor,
			width:2
		}),
		fill: new ol.style.Fill({
			color: featureFillColor
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: featureFillColor
			})
		}),
		text: new ol.style.Text({
			text: featureName,
			font: '0.71em sans-serif',
			textAlign: 'center',
			textBaseline: 'bottom',
			offsetY: -15,
			fill: new ol.style.Fill({
				color: [40,40,40,1]
			}),
			stroke: new ol.style.Stroke({
				color: [255,200,100,1],
				width: 5
			})
		}),
		zIndex: 700
	});
};

// 电子围栏
var electronicLayerOff = true; // 显示电子围栏的FLAG 当为true时显示电子围栏图层
var drawElectronicFlag = false;
var addElectronicFlag = false; // 第一次add后，设为true
var updateElectronicFlag = false; // 第一次upd后，设为true
var rmElectronicFlag = false; // 第一次rm后，设为true
var drawtype = null; // add or upd or rm
var DrawElectronicFence; // 绘制的interaction draw
var ModifyElectronicFence; // 修改的interaction select and modify
var DeleteElectronicFence; // 删除的interaction select
// var electronicFeatureDummy = new ol.source.Vector(); // 电子围栏的feature 临时存储
var electronicFeatureDummy = []; // 电子围栏的feature 临时存储
var OldWarnType = null; // 电子围栏预警的flag 对比前一次的变化去预警
var AseetIdForSaveFence = [];
var fenceNumForSaveFence = [];
var AseetType = [];
var alertModelFlag = false;

// 修改记录
function updateNewFeature(features, featureType, updType) {
	var WFSTSerializer = new ol.format.WFS();
	var formatGML = new ol.format.GML({
		featureNS : 'http://www.' + DBs + '.com',
		featurePrefix : DBs,
		featureType : featureType,
		srsName : 'EPSG:4326',
	});
	var featObject;
	switch (updType) {
	case 'insert':
		featObject = WFSTSerializer.writeTransaction(features, null, null,formatGML);
		break;
	case 'update':
		featObject = WFSTSerializer.writeTransaction(null, features, null,formatGML);
		break;
	case 'remove':
		featObject = WFSTSerializer.writeTransaction(null, null, features,formatGML);
		break;
	}
	var serializer = new XMLSerializer();
	var featString = serializer.serializeToString(featObject);
	featObjectSend(featString);
	// console.log(featString);
}

// 发送操作数据库请求
function featObjectSend(featString) {
	var request = new XMLHttpRequest();
	request.open('POST', wfsUrl + '?service=wfs');
	request.setRequestHeader('Content-Type', 'text/xml');
	request.send(featString);
	if (AssetSavetype in {
		'upd' : '',
		'add' : ''
	} || (map && map.getTarget() in {
		'adddeploymap' : '',
		'adddetainmap' : '',
		'adddangermap' : ''
	})) {
		request.onreadystatechange = function() {
			// alert(request.readyState);
			if (request.readyState == 4) {
				setTimeout(parentlayerclose, 1000);
			}
		}
	}
	/*
	 * if(drawtype != null){ request.onreadystatechange = function(){
	 * if(request.readyState == 4){ electronicFence(AseetIdForSaveFence); if
	 * (drawAttendanceType == 'Add' ){ electronicFeatureDummy = []; }else if (
	 * drawAttendanceType == 'Upd' ){
	 * ReloadElectronicFence(electronicFeatureDummy[0].values_.fence_id,);
	 * electronicFeatureDummy = []; } } } }
	 */

}
// 两点间距离计算
var wgs84Sphere = new ol.Sphere(6378137);
function distanceFromAToB(A, B) {
	var sourceProj = map.getView().getProjection();
	var c1 = ol.proj.transform(A, sourceProj, 'EPSG:4326');
	var c2 = ol.proj.transform(B, sourceProj, 'EPSG:4326');
	var length = wgs84Sphere.haversineDistance(c1, c2);
	return length;
}

// 定位点顺滑平移-伪实现
function moveAnimation(beforePoints, nowfeaturesLocate) {
	var featuresLocate = nowfeaturesLocate;
	var progress = 0;
	var speed = 30;

	var intervalX = {}, intervalY = {};
	for (var i = 0; i < featuresLocate.length; i++) {
		var assetID = featuresLocate[i].get('l_id');
		if (checkWallInFlag[assetID][2].length < 3) {
			var futurePoint = featuresLocate[i].getGeometry().getCoordinates();
			intervalX[assetID] = (futurePoint[0] - beforePoints[assetID][0]) / speed;
			intervalY[assetID] = (futurePoint[1] - beforePoints[assetID][1]) / speed;
		}
	}
	var timer = requestAnimationFrame(function moveFeature() {
		progress += 1;
		var newpoint = [];
		for (var i = 0; i < featuresLocate.length; i++) {
			var assetID = featuresLocate[i].get('l_id');

			if (intervalX[assetID] || intervalX[assetID] == 0) {
				newpoint[0] = beforePoints[assetID][0] + intervalX[assetID] * progress;
				newpoint[1] = beforePoints[assetID][1] + intervalY[assetID] * progress;
			} else {
				var newpointNum = checkWallInFlag[assetID][2].length;
				var newpointNumDummy = parseInt(progress / (speed / newpointNum));
				newpointNumDummy = newpointNumDummy < newpointNum ? newpointNumDummy : newpointNum - 1;
				newpoint = checkWallInFlag[assetID][2][newpointNumDummy];
			}
			featuresLocate[i].setGeometry(new ol.geom.Point(newpoint));
		}

		AssetLocateSource.clear();
		AssetLocateSource.addFeatures(featuresLocate);

		if (progress % speed != 0) {
			timer = requestAnimationFrame(moveFeature);
		} else {
			cancelAnimationFrame(timer);
		}
	});
}
// 墙
var polygonWallsFeature = function() {
	var arr = [];
	var listFeatures = Object.keys(geojsonstyle);
	var reg = new RegExp('100305');
	for (var i = 0; i < listFeatures.length; i++) {
		if (listFeatures[i].match(reg) && listFeatures[i] != '10030505') {
			arr.push(listFeatures[i]);
		}
	}
	arr.push('10020401');
	arr.push('10020511');
	return arr;
}
// 判断定位点位置
var polygonWalls = [];
var polygonWallsFeatures;
var WallInFlag = function checkWallIn(Geom) {
	if (polygonWalls.length == 0) {
		polygonWalls = featuresBackgroundObj[buildingid][floorid];
	}
	polygonWallsFeatures = polygonWallsFeature();
	for (var i = 0; i < polygonWalls.length; i++) {
		var polygonWallId = polygonWalls[i].get('feature_id');

		for ( var j in polygonWallsFeatures) {
			if (polygonWallId == polygonWallsFeatures[j]) {
				var polygonWall = polygonWalls[i].getGeometry().getCoordinates()[0];
				if (rayCasting(Geom, polygonWall) == 'in') {
					return polygonWalls[i].getId();
				}
			}
		}
	}
	return null;
};
// bug 循环太多，处理太慢
/*
 * var PolygonInFlag = function checkPolygonIn(Geom){ var getPolygons = [];
 * polygonWallsFeatures = polygonWallsFeature();
 * 
 * if(polygonWalls.length == 0){ console.log(666); for (var i in
 * polygonLayer.getSource().getFeatures()){ var polygonWallId =
 * polygonLayer.getSource().getFeatures()[i].get('feature_id'); for(var j in
 * polygonWallsFeatures){ if(polygonWallId == polygonWallsFeatures[j]){
 * polygonWalls.push(polygonLayer.getSource().getFeatures()[i]); } } } } for
 * (var i = 0; i< polygonWalls.length; i++){ var polygonWall =
 * polygonWalls[i].getGeometry().getCoordinates()[0]; if
 * (rayCasting(Geom,polygonWall) == 'in'){
 * getPolygons.push(polygonWalls[i].getId()); //return getPolygons; } } return
 * getPolygons; };
 */
// 防止穿墙
function checkLocateIn(assetID, beforeGeom, nowGeom) {
	checkWallInFlag[assetID][0] = checkWallInFlag[assetID][1];
	checkWallInFlag[assetID][1] = WallInFlag(nowGeom);
	if (checkWallInFlag[assetID][0] != checkWallInFlag[assetID][1]) {
		// 取路径(折点包括前后定位点)
		checkWallInFlag[assetID][2] = getRoute(beforeGeom, nowGeom);
	} else {
		checkWallInFlag[assetID][2] = [];
	}
}
// 取路径(折点包括前后定位点)
function getRoute(beforeGeom, nowGeom) {
	var RouteParam = 'x1:' + beforeGeom[0] + ';y1:' + beforeGeom[1] + ';x2:'
			+ nowGeom[0] + ';y2:' + nowGeom[1];
	var RouteRequestParam = {
		service : 'WFS',
		version : '1.1.0',
		request : 'GetFeature',
		typeName : DBs + ':route_new', // 路径规划图层
		outputFormat : 'application/json',
		viewparams : RouteParam
	};
	var routeCoordinates = [];
	$
			.ajax({
				url : wfsUrl,
				data : $.param(RouteRequestParam),
				type : 'GET',
				dataType : 'json',
				async : false,
				success : function(response) {
					var geoms = response.features[0].geometry.coordinates;
					if (geoms) {
						// 判断所取线段的方向
						var dis = distanceFromAToB(beforeGeom, geoms[0])
								- distanceFromAToB(beforeGeom,
										geoms[geoms.length - 1]);
						if (dis < 0) {
							routeCoordinates = geoms;
						} else {
							var newgeoms = [];
							var j = 0;
							for (var i = geoms.length - 1; i >= 0; i--) {
								newgeoms[j++] = geoms[i];
							}
							routeCoordinates = newgeoms;
						}
					}

				},
				error : function() {
					console.log('error   route');
				}
			});
	routeCoordinates.unshift(beforeGeom);
	routeCoordinates.push(nowGeom);
	return routeCoordinates;
}

// 关闭当前弹框
function parentlayerclose() {
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}

// 获取当前时间
function getNowFormatDate() {
	var date = new Date();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + '' + month + strDate
			+ date.getHours() + date.getMinutes() + date.getSeconds();
	return currentdate;
}

// 获取根目录
function getContextPath() {
	//var pathName = window.document.location.pathname;
	var js = document.scripts;
    var pathName =js[js.length - 1].src;
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
	return projectName;
}

// 获取人员图像---popup
function getImg(id) {
	var url;
	$.ajax({
		url : IconPath + "/personInfo/showImg",
		data : "id=" + id,
		type : 'GET',
		dataType : 'json',
		async : false,
		success : function(data) {
			url = data.returnData.url;
			// alert(url);
		}
	});
	return url;
}

// 判断点在面内
var poly = [];
function rayCasting(p, poly) {
	var px = p[0];
	var py = p[1];
	var flag = false;

	for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
		var sx = poly[i][0];
		var sy = poly[i][1];
		var tx = poly[j][0];
		var ty = poly[j][1];

		// 点与多边形顶点重合
		if ((sx === px && sy === py) || (tx === px && ty === py)) {
			// console.log('点与多边形顶点重合');
			return 'on';
		}

		// 判断线段两端点是否在射线两侧
		if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
			// 线段上与射线 Y 坐标相同的点的 X 坐标
			var x = sx + (py - sy) * (tx - sx) / (ty - sy);

			// 点在多边形的边上
			if (x === px) {
				// console.log('点在多边形的边上');
				return 'on';
			}

			// 射线穿过多边形的边界
			if (x > px) {
				// console.log('射线穿过多边形的边界');
				flag = !flag;
			}
		}
	}
	// 射线穿过多边形边界的次数为奇数时点在多边形内
	return flag ? 'in' : 'out';
}
