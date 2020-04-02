var Mote = (function()
{
	
   var  coord = {lat:0.0, lon:0.0};
   
  function Map(e)
  {
     this.placeId = e.place;
	 this.buildingId = e.building;
	 this.floorId =e.floor;
	 this.target = e.target;

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
	 Map.prototype.setLonLatByClick = function(){		 
		 this.clickEvent = map.on('click',function(e){
		  var t = e.coordinate;
		  alert(t);
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
	 
	 Map.prototype.init(this.target);
	 Map.prototype.refresh(this.placeId,this.buildingId,this.floorId);
	 // getFloorList();
	 
	 
  }
  
   return {
      Map:Map
   }	
	
})();