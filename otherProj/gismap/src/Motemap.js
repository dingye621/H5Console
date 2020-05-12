var Mote = (function()
{
	
  function Map(e)
  {
     this.placeId = e.place;
	 this.buildingId = e.building;
	 this.floorId = e.floor;
	 this.target = e.target;
	 this.moveRoute = false;
	 
	 var self = this;

	 const dbtype_pot = 'fence_configpot'; 
	 const dbtype_area = "fence_configarea";
	 const dbtype_alphaArea = "fence_configalphaarea";
	 
	 Map.prototype.init = function(target){
		 initLoadMap(target);
	 }
	 Map.prototype.refresh = function(placeId, buildingId, floorId){	
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
	 Map.prototype.loadMap = function(lon,lat,zoom,callback){
		 view.setCenter([lon,lat]);
		 view.setZoom(zoom)
		  callback &&　callback(1);
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
	 Map.prototype.getPlace = function(){
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
	 Map.prototype.poiMouseEvent = function(eventType, callback){
		 switch(eventType){
			 case 'move':
			 {
				 var condition = ol.events.condition.pointerMove;
				 self.select = self.selectByInteraction([configPotLayer],condition);
				 self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						info.type = e.selected[0].get('icon');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						var geom = e.selected[0].getGeometry().getCoordinates();
						
						callback && callback(info);	
					}
		        });
				//self.rmInteraction(select.select);
			 }break;
			case 'click':
			{
				 var condition = ol.events.condition.singleClick;
				 self.select = tmap.selectByInteraction([configPotLayer],condition);
				 self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						info.type = e.selected[0].get('icon');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						var geom = e.selected[0].getGeometry().getCoordinates();
						
						callback && callback(info);	
					}
				});
			}break;
			case 'dbclick':
			{
				var condition = ol.events.condition.doubleClick;
				self.select = tmap.selectByInteraction([configPotLayer],condition);
				self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						info.type = e.selected[0].get('icon');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						var geom = e.selected[0].getGeometry().getCoordinates();
						
						callback && callback(info);	
					}
				});
			}break;
			 
		 }
		 
	 }
	  /*
	  *处理框的鼠标事件
	  *eventType 参数类型，单击'click',双击"dbclick"，移入'move'
	  *callback 返回的回调函数，info为返回的对象，对象定义{name:"", type:"", memo:"", lon:"", lat:""}
	 */
	 Map.prototype.areaMouseEvent = function(eventType, callback){
		 switch(eventType){
			 case 'move':
			 {
				 var condition = ol.events.condition.pointerMove;
				 self.select = self.selectByInteraction([configAreaLayer],condition);
				 self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						//info.type = e.selected[0].get('type');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						info.color = e.selected[0].get('color');
						
						callback && callback(info);	
					}
		        });
			 }break;
			case 'click':
			{
				 var condition = ol.events.condition.singleClick;
				 self.select = tmap.selectByInteraction([configAreaLayer],condition);
				 self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						//info.type = e.selected[0].get('type');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						info.color = e.selected[0].get('color');
						
						callback && callback(info);	
					}
				});
			}break;
			case 'dbclick':
			{
				var condition = ol.events.condition.doubleClick;
				self.select = tmap.selectByInteraction([configAreaLayer],condition);
				self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						//info.type = e.selected[0].get('type');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						info.color = e.selected[0].get('color');
						
						callback && callback(info);	
					}
				});
			}break;
			 
		 }
		 
	 }
	 Map.prototype.alphaAreaMouseEvent = function(eventType, callback){
		 switch(eventType){
			 case 'move':
			 {
				 var condition = ol.events.condition.pointerMove;
				 self.select = self.selectByInteraction([configAlphaAreaLayer],condition);
				 self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						//info.type = e.selected[0].get('type');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						info.border_color = e.selected[0].get('border_color');
						
						callback && callback(info);
					}
		        });
			 }break;
			case 'click':
			{
				 var condition = ol.events.condition.singleClick;
				 self.select = tmap.selectByInteraction([configAlphaAreaLayer],condition);
				 self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						//info.type = e.selected[0].get('type');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						info.border_color = e.selected[0].get('border_color');
						
						callback && callback(info);
					}
				});
			}break;
			case 'dbclick':
			{
				var condition = ol.events.condition.doubleClick;
				self.select = tmap.selectByInteraction([configAlphaAreaLayer],condition);
				self.select.select.on('select', function(e) {
					if(e.selected.length != 0){
						var info = new Object();
						info.fid = e.selected[0].getId();
						info.name = e.selected[0].get('name');
						info.remarks = e.selected[0].get('remarks');
						//info.type = e.selected[0].get('type');
						info.building_id = e.selected[0].get('building_id');
						info.floor_id = e.selected[0].get('floor_id');
						info.place_id = e.selected[0].get('place_id');
						info.border_color = e.selected[0].get('border_color');
						
						callback && callback(info);
					}
				});
			}break;
			 
		 }
		 
	 }
	 
	 Map.prototype.rmFeatureSelsct = function(){
		 self.select.rmFeatures();
	 }
	 Map.prototype.setSelectFeatureStyle = function(info){
		configAlphaAreaStyleFun =  function(feature) {
			var featureName = feature.get('name');
			// 返回数据的style
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: info.stroke,
					width:2
				}),
				fill: new ol.style.Fill({
					color: info.fill
				}),
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: info.fill
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
	 }
	 Map.prototype.rmMouseEvent = function(){
		 self.rmInteraction(self.select.select);
	 }
	 
	 Map.prototype.getClickEventFlag = function(){
		 return this.clickEvent?Object.keys(this.clickEvent).length:false
	 }
	 Map.prototype.selectByInteraction = function(layers,condition){
		 var style = layers[0] == configPotLayer
			?configPotStyleFun
			:layers[0] == configAreaLayer
				?configAreaStyleFun
				:layers[0] == configAlphaAreaLayer
					?configAlphaAreaStyleFun
					:layers[0] == AssetLocateLayer
						?assetstylefunction
						:layers[0] == AssetRoutePointLayer
							?RouteStyle['geoms']
							:geojsonstylefunction
		 this.selectFeature = {
			init: function() {
				this.select = new ol.interaction.Select({
					layers: layers,
					style : style,
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
			},
			rmFeatures: function() {
				var selectedFeatures = this.select.getFeatures();
				selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
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
	 
	 Map.prototype.loadPoint = function(callback){
		 var cqlFilter = 'place_id=' + this.placeId;
		   loadConfigPotArea(dbtype_pot,cqlFilter);//加载点的图层
			callback && callback();
	 }
	 Map.prototype.loadPointByType = function(info,callback){
		 var cqlFilter = 'place_id=' + this.placeId + ' and icon=' + info.type;
		   loadConfigPotArea(dbtype_pot,cqlFilter);//加载点的图层
			callback && callback(1);
	 }
	 Map.prototype.loadPolygon = function(callback){
		 var cqlFilter = 'place_id=' + this.placeId;
		 loadConfigPotArea(dbtype_area,cqlFilter);//加载面的图层
		 callback && callback();
	 }
	 Map.prototype.loadPolygonByType = function(info,callback){
		 var cqlFilter = 'place_id=' + this.placeId + ' and color=\'' + info.type + '\'';
		 loadConfigPotArea(dbtype_area,cqlFilter);//加载面的图层
		 callback && callback(1);
	 }
	 Map.prototype.loadAlphaPolygon = function(callback){
		 var cqlFilter = 'place_id=' + this.placeId;
		 loadConfigPotArea(dbtype_alphaArea,cqlFilter);//加载面的图层
		 callback && callback();
	 }
	 Map.prototype.loadAlphaPolygonByType = function(info,callback){
		 var cqlFilter = 'place_id=' + this.placeId + ' and border_color=\'' + info.type + '\'';
		 loadConfigPotArea(dbtype_alphaArea,cqlFilter);//加载透明框的图层
		 callback && callback(1);
	 }
	 Map.prototype.rmPoint = function(callback){
		configPotSource.clear();
			callback && callback();
	 }
	 Map.prototype.rmPolygon = function(callback){
		configAreaSource.clear();
			callback && callback();
	 }
	 Map.prototype.rmAlphaPolygon = function(callback){
		configAlphaAreaSource.clear();
			callback && callback();
	 }
	 Map.prototype.clearPot = function(callback){ 
		var features = configPotSource.getFeatures();
		if(features.length){
			self.saveFuature(features, dbtype_pot,'remove',function(e){
				if (e == 4 ){
					callback && callback(1);
					self.loadPoint();
				}else{
					callback && callback(-1);
				}
			});
		}
	 }
	 Map.prototype.clearArea = function(callback){ 
		var features = configAreaSource.getFeatures();
		if(features.length){
			self.saveFuature(features, dbtype_area,'remove',function(e){
				if (e == 4 ){
					callback && callback(1);
					self.loadPolygon();
				}else{
					callback && callback(-1);
				}
			});
		}
	 }
	 Map.prototype.clearAlphaArea = function(callback){ 
		var features = configAlphaAreaSource.getFeatures();
		if(features.length){
			self.saveFuature(features, dbtype_alphaArea,'remove',function(e){
				if (e == 4 ){
					callback && callback(1);
					self.loadAlphaPolygon();
				}else{
					callback && callback(-1);
				}
			});
		}
	 }
	 Map.prototype.getPointByClick = function(callback){
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
	 Map.prototype.deletePoint = function(point, callback){
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
	 Map.prototype.getAreaByClick = function(callback){
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
	 Map.prototype.deleteArea = function(area, callback){
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
	 Map.prototype.getAlphaAreaByClick = function(callback){
		    var condition = ol.events.condition.singleClick;
			this.select = this.selectByInteraction([configAlphaAreaLayer],condition);
			this.select.select.on('select', function(e) {
				if(e.selected.length != 0) {  
					var selectInfo = e.selected[0];
				    callback && callback(selectInfo);
				}			
				
			});
			//self.rmInteraction(select.select);
	 }
	 Map.prototype.deleteAlphaArea = function(area, callback){
		var newFeature = new ol.Feature();
		newFeature.setId(area.getId());
		self.saveFuature([newFeature], 'fence_configalphaarea','remove',function(e){
			if (e == 4 ){
				callback && callback(1);
			    self.loadAlphaPolygon();
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
  
    /*
	 * 绘制点 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.drawPoint = function(info, callback){
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
	 * 根据坐标绘制点 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.drawPointByCoordsCheck = function(info,callback){
		 var cqlFilter = 'place_id=' + this.placeId + ' and icon=' + info.type;
		 var check = checkConfigPot(cqlFilter);
		 callback && callback(check?1:0);
	 }
	 Map.prototype.drawPointByCoords = function(info, callback){
		 var s = this;
		 var newCoordinates = [info.lat,info.lon];
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
	 }	 
	  /*
	 * 修改点 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.modifyPoint = function(info, callback){
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
	 Map.prototype.drawArea = function(info, callback){
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
	 * 根据坐标绘制面 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.drawAreaByCoords = function(info, callback){
		 var s = this;
		 var Coordinates = info.coords;
		 var newCoordinates = [];
		 for (var i=0;i<info.coords.length;i++){
		 	newCoordinates[i] = [Coordinates[i].lat,Coordinates[i].lon];
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
	 }
	  /*
	 * 绘制透明面 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.drawAlphaArea = function(info, callback){
		 var s = this;
		 var drawAlphaArea = s.drawAreaByInteraction(configAlphaAreaSource);
		 drawAlphaArea.Polygon.on('drawend', function(evt) {
			var Coordinates = evt.feature.get('geom').getCoordinates()[0];
			var CoordinatesLength = Coordinates.length;
			var newCoordinates = [];
			var oldCoordinates;
			for (var i=0;i<CoordinatesLength;i++){
				oldCoordinates = Coordinates[i];
				newCoordinates[i] = [oldCoordinates[1],oldCoordinates[0]];
			}
			var newFeature = new ol.Feature();
			newFeature.setId('alphaArea');
			newFeature.setGeometryName('geom');
			newFeature.set('geom', null);
			newFeature.set('place_id', info.place_id);
			newFeature.set('building_id', info.building_id);
			newFeature.set('floor_id', info.floor_id);
			newFeature.set('name', info.name);
			newFeature.set('remarks', info.remarks);
			newFeature.set('border_color', info.border_color);
			newFeature.setGeometry(new ol.geom.Polygon([newCoordinates]));
			//drawArea.setActive(false);
			// 带信息保存
			s.saveFuature([newFeature], 'fence_configalphaarea','insert',function(e){
				if (e ==4){
					//alert('保存成功');
					callback && callback(1)
					s.loadAlphaPolygon();
				}else{
					callback && callback(-1);
				}
			});
			
			s.rmInteraction(drawAlphaArea.Polygon);
		}, this);
	 }
	 /*
	 * 根据坐标绘制透明面 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.drawAlphaAreaByCoords = function(info, callback){
		 var s = this;
		 var Coordinates = info.coords;
		 var newCoordinates = [];
		 for (var i=0;i<info.coords.length;i++){
		 	newCoordinates[i] = [Coordinates[i].lat,Coordinates[i].lon];
		 }
		 var newFeature = new ol.Feature();
		 newFeature.setId('alphaArea');
		 newFeature.setGeometryName('geom');
		 newFeature.set('geom', null);
		 newFeature.set('place_id', info.place_id);
		 newFeature.set('building_id', info.building_id);
		 newFeature.set('floor_id', info.floor_id);
		 newFeature.set('name', info.name);
		 newFeature.set('remarks', info.remarks);
		 newFeature.set('border_color', info.border_color);
		 newFeature.setGeometry(new ol.geom.Polygon([newCoordinates]));
		 // 带信息保存
		 s.saveFuature([newFeature], 'fence_configalphaarea','insert',function(e){
		 	if (e ==4){
		 		//alert('保存成功');
		 		callback && callback(1)
		 		s.loadAlphaPolygon();
		 	}else{
		 		callback && callback(-1);
		 	}
		 });
	 }
	  /*
	 * 修改面 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.modifyArea = function(info, callback){
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
	 /*
	 * 修改透明面 0 回调函数-1表示失败 0表示成功
	 */
	 Map.prototype.modifyAlphaArea = function(info, callback){
		 var s = this;
		 var modifyAlphaArea = s.modifyAreaByInteraction([configAlphaAreaLayer]);
		 modifyAlphaArea.modify.on('modifyend', function(evt) {
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
			newFeature.set('border_color', info.border_color);
			newFeature.setGeometry(new ol.geom.Polygon([newCoordinates]));
			//drawPot.setActive(false);
			// 带信息保存
			s.saveFuature([newFeature], 'fence_configalphaarea','update',function(e){
				if (e ==4 ){
					callback && callback(1);
					s.loadAlphaPolygon();
				}else{
					callback && callback(-1);
				}
			});
			s.rmInteraction(modifyAlphaArea.select);
			s.rmInteraction(modifyAlphaArea.modify);
		}, this);
	 }
	 
	 Map.prototype.loadLocators =  function(info,callback){
		 var features = [];
		 for(var i=0;i<info.length;i++){
			features[i] = new ol.Feature();
			features[i].setId(info[i].bid);
			features[i].set('place_id', info[i].placeId);
			features[i].set('building_id', info[i].buildingId);
			features[i].set('floor_id', info[i].floorId);
			features[i].set('name', info[i].bid);
			features[i].setGeometryName('geom');
			features[i].set('geom', null);
			features[i].setGeometry(new ol.geom.Point([info[i].lon,info[i].lat]));
		 }
		 AssetLocateSource.clear();
		 AssetLocateSource.addFeatures(features);
		  callback &&　callback(1);
	 }
	 Map.prototype.loadLocatorsNew =  function(icon,info,callback){
		 var features = [];
		 for(var i=0;i<info.length;i++){
			features[i] = new ol.Feature();
			features[i].setId(info[i].bid);
			features[i].set('icon',icon);
			features[i].set('bid', info[i].bid);
			features[i].set('place_id', info[i].placeId);
			features[i].set('building_id', info[i].buildingId);
			features[i].set('floor_id', info[i].floorId);
			features[i].set('name', info[i].name);
			features[i].set('sex', info[i].sex?'男':'女');
			features[i].set('battery', info[i].battery);
			features[i].set('heartRate', info[i].heartRate);
			features[i].set('bloodPressure', info[i].bloodPressure);
			features[i].set('steps', info[i].steps);
			features[i].setGeometryName('geom');
			features[i].set('geom', null);
			features[i].setGeometry(new ol.geom.Point([info[i].lon,info[i].lat]));
		 }
		 AssetLocateSource.clear();
		 AssetLocateSource.addFeatures(features);
		  callback &&　callback(1);
	 }
	 Map.prototype.loadPeopleLocators =  function(icon,info,callback){
		 if(!info.length){callback(0,"没有定位数据");}
		 self.loadLocatorsNew(icon,info);
		 
		 var popup = self.setPopupLegend();
		 self.overlay = self.setPopupOverlay(popup.container);
		 map.addOverlay(self.overlay);
		  
		 if(self.overlay){
			var condition = ol.events.condition.singleClick;
			self.selectPointerMove = self.selectByInteraction([AssetLocateLayer],condition);
			self.selectPointerMove.select.on('select', function(e) {
			if (e.selected[0] != null){
				//if(self.getZoom() > 17){
					self.makePopupMsg(e.selected[0],popup.content);
				//}
				self.overlay.setPosition(e.selected[0].getGeometry().getCoordinates());
			}else{
				self.overlay.setPosition(null);
			}
		  });
		  callback(1,"鼠标点击定位点显示信息");
		 }else{
			  callback(0,"请添加popupcontainer");
		 }
	 }
	 Map.prototype.setPopupLegend = function(){
	     var popupcontainer = document.createElement("div");
		 popupcontainer.className = "ol-popup";
		 popupcontainer.style.width = "340px";
		 
		 var popuppucture = document.createElement("div");
		 popuppucture.className = "col-md-4 col-sm-4";
		 popuppucture.setAttribute('align', 'right');
		 popuppucture.style.padding="0px 0px 0px 2px";
		 popupcontainer.appendChild(popuppucture);
		 
		 var popupcontent = document.createElement("div");
		 popupcontent.className = "col-md-8 col-sm-8";
		 popupcontent.setAttribute('align', 'left');
		 popupcontainer.appendChild(popupcontent);
		 
		 var popupimg = document.createElement("img");
		 popupimg.style.width="100px";
		 popupimg.style.heigth="220px";
		 popuppucture.appendChild(popupimg);
		 
		 document.body.append(popupcontainer);
		 return {
			 container:popupcontainer,
			 content:popupcontent
		 }
	 }
	 Map.prototype.setPopupOverlay = function(container){
		if(container){
			return new ol.Overlay( ({
			 element: container, 
			 autoPan: true,
			 autoPanAnimation: {
				 duration: 250
			 }
		 }));
		}else{
		 return null
		} 
	 }
	 Map.prototype.makePopupMsg = function(info,popupcontent){
		  var icon = info.get('icon');
		  var personImgUrl = icon ==1?'./pion/icon':icon ==2?'./chem/icon':'./scho/icon';
		  var alertinfo = '姓名：  ' + info.values_.name + '<br>'
		  + '性别：  ' + info.get('sex') + '<br>'
		  + '编号：  ' + info.get('bid') + '<br>'
		  + '场景：  ' + info.get('place_id') + '<br>'
		  + '建筑：  ' + info.get('building_id') + '<br>'
		  + '楼层：  ' + info.get('floor_id') + '<br>'
		  + '电量：  ' + info.get('battery') + '<br>'
		  + '心率：  ' + info.get('heartRate') + '<br>'
		  + '血压：  ' + info.get('bloodPressure') + '<br>'
		  + '步数：  ' + info.get('steps') + '<br>'
		  + '经度：  ' + info.getGeometry().getCoordinates()[0] + '<br>'
		  + '纬度：  ' + info.getGeometry().getCoordinates()[1];
		  popupcontent.innerHTML = alertinfo;
		  $('.popup-pucture img').attr("src",personImgUrl);
	 }
	 
	 Map.prototype.locatorMouseEvent = function(eventType,callback){
		var condition = ol.events.condition.pointerMove;
		self.select = self.selectByInteraction([AssetLocateLayer],condition);
		self.select.select.on('select', function(e) {
			if(e.selected.length != 0){
				var info = new Object();
				info.name = e.selected[0].get('name');
				info.building_id = e.selected[0].get('building_id');
				info.floor_id = e.selected[0].get('floor_id');
				info.place_id = e.selected[0].get('place_id');
				var geom = e.selected[0].getGeometry().getCoordinates();
				info.lon = geom[0];info.lat = geom[1];
				callback && callback(info);
			}
		});
	 }
	 
	 Map.prototype.trail = function(b,o){
		self.initTrail();
		self.setRoutePoint(b,o);
	 }
	 Map.prototype.initTrail = function(){
		 if (moveRoute) {
			moveRoute = false;
			clearInterval(myAssetRouteTime);
		}
		if (AssetRouteLayer != null || AssetRoutePointLayer != null){
			AssetRouteLayer.getSource().clear();
			AssetRoutePointLayer.getSource().clear();
		}else{
			getAssetFenceLayer();
			overmap.getLayers().extend([AssetRouteLayer]);	
			overmap.getLayers().extend([AssetRoutePointLayer]);	
		}
		moveRoute = true;
	 }
	 Map.prototype.setRoutePoint = function(b,o){
		 if (o.length){			
			// var mybuild = o[0].buildingId;
			// var myfloor = o[0].floorId;
			
			// if(mybuild != 0){
				// self.changeBuild(mybuild,myfloor);
			// }
			
			var FeaturePoints = [];
			var num =0;
			myAssetRouteTime = setInterval(function(){showme()}, 1000);
			function showme(){
				FeaturePoints[num] = new ol.Feature({
					geometry: new ol.geom.Point([o[num].lon,o[num].lat])
				});
				FeaturePoints[num].set('build',o[num].buildingId);
				FeaturePoints[num].set('time',o[num].time);
				FeaturePoints[num].set('floor',o[num].floorId);
				FeaturePoints[num].set('bid',b);
				
				if(num == 0){
					FeaturePoints[num].set('type','start');
					AssetRoutePointLayer.getSource().addFeature(FeaturePoints[num]);
				}else{
					num == o.length - 1?
						FeaturePoints[num].set('type','end'):
						FeaturePoints[num].set('type','geoms');
					if(o[num].buildingId != buildingid && o[num].buildingId != 0){
						// self.changeBuild(o[num].buildingId,o[num].floorId);
						AssetRoutePointLayer.getSource().addFeature(FeaturePoints[num]);
					}else{
						moveRoutePoint(FeaturePoints[num],[o[num-1].lon,o[num-1].lat],[o[num].lon,o[num].lat]);
					}
				} 
				if(num > 0 && distanceFromAToB([o[num-1].lon,o[num-1].lat],[o[num].lon,o[num].lat]) > 10 ){
					view.setCenter([o[num].lon,o[num].lat]);
				}
				num ++;
				if(num>o.length-1) clearInterval(myAssetRouteTime);
			}
		}
	 }
	 Map.prototype.changeBuild = function(build,floor){
		changeBuilding(build);
		floorUpdate(floor);
		changeFloorAction();
	 }
	 Map.prototype.trailMouseEvent = function(eventType,callback){
		var condition = ol.events.condition.pointerMove;
		self.select = self.selectByInteraction([AssetRoutePointLayer],condition);
		self.select.select.on('select', function(e) {
			if(e.selected.length != 0){
				var info = new Object();
				info.time = e.selected[0].get('time');
				callback && callback(info);
			}
		});
	 }
	 
	 
	 
	 
	 
	}
  
   return {
      Map:Map
   }	
	
})();