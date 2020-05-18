// 添加标点
function addConfigPotPage(info){
	shapeInfo = info;
	layer.open({
		type : 2,
		title : "添加点位",
		area : [ '600px', '500px' ],
		fix : false,
		content : 'addpot',
		end : function() {
			loadConfigPotArea(Dbtype);
		}
	});
}
// 添加标框
function addConfigAreaPage(info){
	shapeInfo = info;
	layer.open({
		type : 2,
		title : "添加标框",
		area : [ '600px', '400px' ],
		fix : false,
		content : 'addmodel',
		end : function() {
			loadConfigPotArea(Dbtype);
		}
	});
}

	// 查询所有记录
	function loadConfigPotArea(type,filter){	
		$.ajax({
			url: wfsUrl,
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: DBs + ':' + type,
				outputFormat: 'application/json',
				cql_filter: filter
			},
			type: 'GET',
			dataType: 'json',	
			async: false,
			success: function(response){
				var features = new ol.format.GeoJSON().readFeatures(response);
				switch (type){
				case 'fence_configpot':
					configPotSource.clear();
					configPotSource.addFeatures(features);
					break;
				case 'fence_configarea':
					configAreaSource.clear();
					configAreaSource.addFeatures(features);
					break;
				case 'fence_configalphaarea':
					configAlphaAreaSource.clear();
					configAlphaAreaSource.addFeatures(features);
					break;
				}
			},
		});
	}
	// 查询所有记录
	function getConfigPotArea(type,filter){
		var data = [];
		$.ajax({
			url: wfsUrl,
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: DBs + ':' + type,
				outputFormat: 'application/json',
				cql_filter: filter
			},
			type: 'GET',
			dataType: 'json',	
			async: false,
			success: function(response){
				data = new ol.format.GeoJSON().readFeatures(response);					
			}
		});
		return data
	}

	// 判断点是否重复
	function checkConfigPot(filter){
		var check = true;
		$.ajax({
			url: wfsUrl,
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: DBs + ':fence_configpot',
				outputFormat: 'application/json',
				cql_filter: filter
			},
			type: 'GET',
			dataType: 'json',	
			async: false,
			success: function(response){
				var features = new ol.format.GeoJSON().readFeatures(response);
				// TODO
				
				
			},
		});
		return check
	}


	// 点击显示围栏
	function showConfigPotArea(center){
		view.setZoom(lzoom);
		view.setCenter(center);
	}	

// 删除配置记录
function deleteConfigPotArea(info){
	var fid = $(info).attr('id');
	layer.confirm("确认要删除吗，删除后不能恢复", { title: "删除确认" }, function (index) {
		$(info).parent().remove();
		var newFeature = new ol.Feature();
		newFeature.setId(fid);

		updateNewFeature([newFeature],Dbtype,'remove');
		/*if(beforeNodeID == fid){
			electronicLayer.getSource().clear();
		}*/
		setTimeout(function() {
			loadConfigPotArea(Dbtype);
			layer.close(index);
		}, 1000);
	});
}
