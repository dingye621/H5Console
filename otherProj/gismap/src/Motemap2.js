var Mote = (function()
{
	
  function Map(e)
  {
     this.placeId = e.place;
	 this.buildingId = e.building;
	 this.floorId = e.floor;
	 this.target = e.target;
	 
	 var self = this;

	 const dbtype_pot = 'fence_configpot'; 
	 const dbtype_area = "fence_configarea";
	 
	 Map.prototype.init = function(target){
		 initLoadMap(target);
	 }
	 Map.prototype.refresh = function(placeId, buildingId, floorId)
	 {	
		placeid = placeId;
		floorid =  floorId;
		buildingid = buildingId;
		featuresBuilding = getBasemapFeatures('building_point');
		featuresBackground = getBasemapFeatures('polygon_background');
		featuresPolygon = getBasemapFeatures('polygon');
		featuresPoint = getBasemapFeatures('point');
		featuresBackgroundObj = getFeaturesOBJ(featuresBackground);
		featuresPolygonObj = getFeaturesOBJ(featuresPolygon);
		featuresPointObj = getFeaturesOBJ(featuresPoint);
		setPlacePoi();
		loadBasemap();
		view.setCenter(mapCenter(buildingid));
	 }
	 
	 Map.prototype.getBuilding = function(){
		 return buildingid
	 }
	 Map.prototype.getFloor = function(){
		 return floorid
	 }
	 Map.prototype.getZoom = function(){
		 return view.getZoom()
	 }
	 Map.prototype.getPlace = function()
	 {
		 return this.placeId;
	 }
	 /*
	 * 获取经纬度
	 */
	 Map.prototype.getCoordByClick = function(callback){
		
         self.rmEvent('click');			 
		 this.clickEvent = map.on('click',function(e){
		  var t = e.coordinate;
		 // alert(t);
		 	 var coord = new Object();
			 coord.lon = t[0];//经度
			 coord.lat = t[1];//纬度
			 
			 callback &&　callback(coord);
		});

	 }
	 Map.prototype.rmEvent = function(Event){
		  switch (Event){
			  case 'click':
			  	ol.Observable.unByKey(this.clickEvent);
			  	break;
			  case 'dblclick':
			  
			  	break;
			  case 'moveon':
			  
			  	break;
			  }
	 }
	 /*
	  *处理鼠标事件
	  *eventType 参数类型，单击'click',双击"dbclick"，移入'move'
	  *callback 返回的回调函数，info为返回的对象，对象定义{name:"", type:"", remarks:"", building_id:"", floor_id:"", place_id:"", lon:"", lat:""}
	 */
	 Map.prototype.poiMouseEvent = function(eventType, callback)
	 {
		 switch(eventType){
			 case 'move':
			 {
				 var condition = ol.events.condition.pointerMove;
				 self.select = self.selectByInteraction([configPotLayer],condition);
				 self.select.select.on('select', function(e) {
					//alert(e.selected[0].get('name'));
					
					var info = new Object();
					info.name = e.selected[0].get('name');
					info.remarks = e.selected[0].get('remarks');
					info.type = e.selected[0].get('type');
					info.building_id = e.selected[0].get('building_id');
					info.floor_id = e.selected[0].get('floor_id');
					info.place_id = e.selected[0].get('place_id');
					var geom = e.selected[0].get('geometry');
					
					callback && callback(info);
		        });
				//self.rmInteraction(select.select);
			 }break;
			case 'click':
			{
				 var condition = ol.events.condition.singleClick;
				 self.select = tmap.selectByInteraction([configPotLayer],condition);
				 self.select.select.on('select', function(e) {
					//alert(e.selected[0].get('name'));
					var info = new Object();
					info.name = e.selected[0].get('name');
					info.remarks = e.selected[0].get('remarks');
					info.type = e.selected[0].get('type');
					info.building_id = e.selected[0].get('building_id');
					info.floor_id = e.selected[0].get('floor_id');
					info.place_id = e.selected[0].get('place_id');
					var geom = e.selected[0].get('geometry');
					
					callback && callback(info);
				});
			}break;
			case 'dbclick':
			{
				var condition = ol.events.condition.doubleClick;
				self.select = tmap.selectByInteraction([configPotLayer],condition);
				self.select.select.on('select', function(e) {
					
                    	var info = new Object();
					info.name = e.selected[0].get('name');
					info.remarks = e.selected[0].get('remarks');
					info.type = e.selected[0].get('type');
					info.building_id = e.selected[0].get('building_id');
					info.floor_id = e.selected[0].get('floor_id');
					info.place_id = e.selected[0].get('place_id');
					var geom = e.selected[0].get('geometry');
					
					callback && callback(info);
				});
			}break;
			 
		 }
		 
	 }
	 
	 
	  /*
	  *处理框的鼠标事件
	  *eventType 参数类型，单击'click',双击"dbclick"，移入'move'
	  *callback 返回的回调函数，info为返回的对象，对象定义{name:"", type:"", memo:"", lon:"", lat:""}
	 */
	 Map.prototype.areaMouseEvent = function(eventType, callback)
	 {
		 switch(eventType){
			 case 'move':
			 {
				 var condition = ol.events.condition.pointerMove;
				 self.select = self.selectByInteraction([configAreaLayer],condition);
				 self.select.select.on('select', function(e) {
					//alert(e.selected[0].get('name'));
					
					var info = new Object();
					info.name = e.selected[0].get('name');
					info.remarks = e.selected[0].get('remarks');
					info.type = e.selected[0].get('type');
					info.building_id = e.selected[0].get('building_id');
					info.floor_id = e.selected[0].get('floor_id');
					info.place_id = e.selected[0].get('place_id');
					info.color = e.selected[0].get('color');
					
					callback && callback(info);
		        });
			 }break;
			case 'click':
			{
				 var condition = ol.events.condition.singleClick;
				 self.select = tmap.selectByInteraction([configAreaLayer],condition);
				 self.select.select.on('select', function(e) {
					//alert(e.selected[0].get('name'));
					var info = new Object();
					info.name = e.selected[0].get('name');
					info.remarks = e.selected[0].get('remarks');
					info.type = e.selected[0].get('type');
					info.building_id = e.selected[0].get('building_id');
					info.floor_id = e.selected[0].get('floor_id');
					info.place_id = e.selected[0].get('place_id');
					info.color = e.selected[0].get('color');
					
					callback && callback(info);
				});
			}break;
			case 'dbclick':
			{
				var condition = ol.events.condition.doubleClick;
				self.select = tmap.selectByInteraction([configAreaLayer],condition);
				self.select.select.on('select', function(e) {
					
                   	var info = new Object();
					info.name = e.selected[0].get('name');
					info.remarks = e.selected[0].get('remarks');
					info.type = e.selected[0].get('type');
					info.building_id = e.selected[0].get('building_id');
					info.floor_id = e.selected[0].get('floor_id');
					info.place_id = e.selected[0].get('place_id');
					info.color = e.selected[0].get('color');
					
					callback && callback(info);
				});
			}break;
			 
		 }
		 
	 }
	 
	 /*
	 * 消除事件
	 */
	 Map.prototype.rmMouseEvent = function()
	 {
		 self.rmInteraction(self.select.select);
	 }
	 
	 Map.prototype.getClickEventFlag = function(){
		 return this.clickEvent?Object.keys(this.clickEvent).length:false
	 }
	 Map.prototype.selectByInteraction = function(layers,condition){
		 this.selectFeature = {
			init: function() {
				this.select = new ol.interaction.Select({
					layers: layers,
					condition: condition
				}); 
				map.addInteraction(this.select);
				this.setEvents();
			},
			setEvents: function() {
				var selectedFeatures = this.select.getFeatures();
			
				this.select.on('change:active', function() {
					selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
				});
			},
			setActive: function(active) {
				this.select.setActive(active);
			}
		 };
		  this.selectFeature.init();
		 return this.selectFeature
	 }
	 Map.prototype.drawPotByInteraction = function(source){
		 this.drawPot = {
	    	init : function() {
	    		map.addInteraction(this.Point);
	    		this.Point.setActive(true);
	    	},
	    	Point : new ol.interaction.Draw({
	    		source : source,
	    		type : /** @type {ol.geom.GeometryType} **/('Point'),
	    		geometryName : 'geom',
	    		condition : ol.events.condition.primaryAction,
	    		style : configPotStyleFun
	    	}),
	    	setActive : function(active) {
	    		this.Point.setActive(active);
	    	},
	    	getActive : function() {
	    		return this.Point.getActive();
	    	}
	     };
	     this.drawPot.init();
		 return this.drawPot
	 }
	 Map.prototype.modifyPotByInteraction = function(layers){
		 this.modifyPot = {
			init: function() {
				this.select = new ol.interaction.Select({
					layers:layers,
				}); 
				this.modify = new ol.interaction.Modify({
					features: this.select.getFeatures(),
				});
				map.addInteraction(this.select);
				map.addInteraction(this.modify);
			
				this.setEvents();
			},
			setEvents: function() {
				var selectedFeatures = this.select.getFeatures();
			
				this.select.on('change:active', function() {
					selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
				});
			},
			setActive: function(active) {
				this.select.setActive(active);
				this.modify.setActive(active);
			}
		};
		this.modifyPot.init();
		 return this.modifyPot
	 }
	 Map.prototype.drawAreaByInteraction = function(source){
		 this.drawPolygon = {
	    	init : function() {
	    		map.addInteraction(this.Polygon);
	    		this.Polygon.setActive(true);
	    	},
	    	Polygon : new ol.interaction.Draw({
	    		source : source,
	    		type : /** @type {ol.geom.GeometryType} **/('Polygon'),
	    		geometryName : 'geom',
	    		condition : ol.events.condition.primaryAction,
	    		style : configAreaStyleFun
	    	}),
	    	setActive : function(active) {
	    		this.Polygon.setActive(active);
	    	},
	    	getActive : function() {
	    		return this.Polygon.getActive();
	    	}
	     };
	     this.drawPolygon.init();
		 return this.drawPolygon
	 }
	 Map.prototype.modifyAreaByInteraction = function(layers){
		 this.modifyArea = {
			init: function() {
				this.select = new ol.interaction.Select({
					layers:layers,
				}); 
				this.modify = new ol.interaction.Modify({
					features: this.select.getFeatures(),
				});
				map.addInteraction(this.select);
				map.addInteraction(this.modify);
			
				this.setEvents();
			},
			setEvents: function() {
				var selectedFeatures = this.select.getFeatures();
			
				this.select.on('change:active', function() {
					selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
				});
			},
			setActive: function(active) {
				this.select.setActive(active);
				this.modify.setActive(active);
			}
		};
		this.modifyArea.init();
		 return this.modifyArea
	 }
	 Map.prototype.rmInteraction = function(it){
		  map.removeInteraction(it);
	 }
	 Map.prototype.saveFuature = function(features,tableType,updType,callback){
		var WFSTSerializer = new ol.format.WFS();
    	var formatGML = new ol.format.GML({
    		featureNS : 'http://www.' + DBs + '.com',
    		featurePrefix : DBs,
    		featureType : tableType,
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
		var request = new XMLHttpRequest();
		request.open('POST', wfsUrl + '?service=wfs');
		request.setRequestHeader('Content-Type', 'text/xml');
		request.send(featString);
		request.onreadystatechange = function() {
				//if (request.readyState == 4) {
					 callback(request.readyState);
				//}
		}
	 }
	 
	 Map.prototype.loadPoint = function(callback)
	 {
		   loadConfigPotArea(dbtype_pot);//加载点的图层
			callback && callback();
	 }
	 
	 Map.prototype.loadPolygon = function(callback)
	 {
		 loadConfigPotArea(dbtype_area);//加载面的图层
		 callback && callback();
	 }
	 
	 Map.prototype.getPointByClick = function(callback)
	 {
		    var condition = ol.events.condition.singleClick;
			this.select = this.selectByInteraction([configPotLayer],condition);
			this.select.select.on('select', function(e) {
				if(e.selected.length != 0) {  
					var selectInfo = e.selected[0];
				    callback && callback(selectInfo);
				}			
				
			});
			//self.rmInteraction(select.select);
	 }
	 /*
	  *删除某个点
	 */
	 Map.prototype.deletePoint = function(point, callback)
	 {
		 var newFeature = new ol.Feature();
		 newFeature.setId(point.getId());
		 self.saveFuature([newFeature], 'fence_configpot','remove',function(e){
			if (e == 4 ){
				//alert('保存成功');
				callback && callback(1);
				self.loadPoint();
			}else{
			   callback && callback(-1);
			}
		});
		//消除选择
		self.rmInteraction(self.select.select);
	 }
	 
	 //获取某个区域
	  Map.prototype.getAreaByClick = function(callback)
	 {
		    var condition = ol.events.condition.singleClick;
			this.select = this.selectByInteraction([configAreaLayer],condition);
			this.select.select.on('select', function(e) {
				if(e.selected.length != 0) {  
					var selectInfo = e.selected[0];
				    callback && callback(selectInfo);
				}			
				
			});
			//self.rmInteraction(select.select);
	 }
	 
	  /*
	  *删除某个面
	 */
	 Map.prototype.deleteArea = function(area, callback)
	 {
		var newFeature = new ol.Feature();
		newFeature.setId(area.getId());
		self.saveFuature([newFeature], 'fence_configarea','remove',function(e){
			if (e == 4 ){
				callback && callback(1);
			    self.loadPolygon();
			}else{
				callback && callback(-1);
			}
		});
		//消除选择
		self.rmInteraction(self.select.select);
	 }
	 
	 this.init(this.target);
	 this.refresh(this.placeId,this.buildingId,this.floorId);
	 // getFloorList(); 
  }
  
    /*
	 * 绘制点 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.drawPoint = function(info, callback)
	 {
		 var s = this;
		 var drawPot = s.drawPotByInteraction(configPotSource);
	    drawPot.Point.on('drawend', function(evt) {
			var Coordinates = evt.feature.get('geom').getCoordinates();
			var newCoordinates = [Coordinates[1],Coordinates[0]];
			var newFeature = new ol.Feature();
			newFeature.setId('pot');
			newFeature.setGeometryName('geom');
			newFeature.set('geom', null);
			newFeature.set('place_id', info.place_id);
			newFeature.set('building_id', info.building_id);
			newFeature.set('floor_id', info.floor_id);
			newFeature.set('name', info.name);
			newFeature.set('remarks', info.remarks);
			newFeature.set('icon', info.type);
			newFeature.setGeometry(new ol.geom.Point(newCoordinates));
			//drawPot.setActive(false);
			// 带信息保存
			s.saveFuature([newFeature], 'fence_configpot','insert',function(e){
				if (e ==4 ){
					//alert('保存成功');
					callback && callback(1);
					s.loadPoint();
				}else{
					callback && callback(-1);
				}
				
			});
			
			s.rmInteraction(drawPot.Point);
	   }, this);
	 }
	 
	 
	  /*
	 * 修改点 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.modifyPoint = function(info, callback)
	 {
		 var s = this;
		 var modifyPot = s.modifyPotByInteraction([configPotLayer]);
	     modifyPot.modify.on('modifyend', function(evt) {
			var modifyId = evt.features.getArray()[0].getId();
			var Coordinates = evt.features.getArray()[0].getGeometry().getCoordinates();
			var newCoordinates = [Coordinates[1],Coordinates[0]];
			var newFeature = new ol.Feature();
			newFeature.setId(modifyId);
			newFeature.setGeometryName('geom');
			newFeature.set('geom', null);
			newFeature.set('place_id', info.place_id);
			newFeature.set('building_id', info.building_id);
			newFeature.set('floor_id', info.floor_id);
			newFeature.set('name', info.name);
			newFeature.set('remarks', info.remarks);
			newFeature.set('icon', info.type);
			newFeature.setGeometry(new ol.geom.Point(newCoordinates));
			//drawPot.setActive(false);
			// 带信息保存
			s.saveFuature([newFeature], 'fence_configpot','update',function(e){
				if (e ==4 ){
					callback && callback(1);
					s.loadPoint();
				}else{
					callback && callback(-1);
				}
			});
			s.rmInteraction(modifyPot.select);
			s.rmInteraction(modifyPot.modify);
	    }, this);
	 }
	 
	  /*
	 * 绘制面 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.drawArea = function(info, callback)
	 {
		 var s = this;
		 var drawArea = s.drawAreaByInteraction(configAreaSource);
		 drawArea.Polygon.on('drawend', function(evt) {
			var Coordinates = evt.feature.get('geom').getCoordinates()[0];
			var CoordinatesLength = Coordinates.length;
			var newCoordinates = [];
			var oldCoordinates;
			for (var i=0;i<CoordinatesLength;i++){
				oldCoordinates = Coordinates[i];
				newCoordinates[i] = [oldCoordinates[1],oldCoordinates[0]];
			}
			var newFeature = new ol.Feature();
			newFeature.setId('area');
			newFeature.setGeometryName('geom');
			newFeature.set('geom', null);
			newFeature.set('place_id', info.place_id);
			newFeature.set('building_id', info.building_id);
			newFeature.set('floor_id', info.floor_id);
			newFeature.set('name', info.name);
			newFeature.set('remarks', info.remarks);
			newFeature.set('color', info.color);
			newFeature.setGeometry(new ol.geom.Polygon([newCoordinates]));
			//drawArea.setActive(false);
			// 带信息保存
			s.saveFuature([newFeature], 'fence_configarea','insert',function(e){
				if (e ==4){
					//alert('保存成功');
					callback && callback(1)
					s.loadPolygon();
				}else{
					callback && callback(-1);
				}
			});
			
			s.rmInteraction(drawArea.Polygon);
		}, this);
	 }
	 
	  /*
	 * 修改面 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.modifyArea = function(info, callback)
	 {
		 var s = this;
		 var modifyArea = s.modifyAreaByInteraction([configAreaLayer]);
		 modifyArea.modify.on('modifyend', function(evt) {
			var modifyId = evt.features.getArray()[0].getId();
			var Coordinates = evt.features.getArray()[0].getGeometry().getCoordinates()[0];
			var CoordinatesLength = Coordinates.length;
			var newCoordinates = [];
			var oldCoordinates;
			for (var i=0;i<CoordinatesLength;i++){
				oldCoordinates = Coordinates[i];
				newCoordinates[i] = [oldCoordinates[1],oldCoordinates[0]];
			}
			var newFeature = new ol.Feature();
			newFeature.setId(modifyId);
			newFeature.setGeometryName('geom');
			newFeature.set('geom', null);
			newFeature.set('place_id', info.place_id);
			newFeature.set('building_id', info.building_id);
			newFeature.set('floor_id', info.floor_id);
			newFeature.set('name', info.name);
			newFeature.set('remarks', info.remarks);
			newFeature.set('color', info.color);
			newFeature.setGeometry(new ol.geom.Polygon([newCoordinates]));
			//drawPot.setActive(false);
			// 带信息保存
			s.saveFuature([newFeature], 'fence_configarea','update',function(e){
				if (e ==4 ){
					callback && callback(1);
					s.loadPolygon();
				}else{
					callback && callback(-1);
				}
			});
			s.rmInteraction(modifyArea.select);
			s.rmInteraction(modifyArea.modify);
		}, this);
	 }
	 
  

  
   return {
      Map:Map
   }	
	
})();