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
				var htm = "";
				switch (type){
				case 'fence_configpot':
					configPotSource.clear();
					configPotSource.addFeatures(features);
					htm += "<div>";
					for(var i=0;i<features.length;i++){
						htm += "<div class='cont'>";
						htm += "<div class='col-md-7' style='color:#fff;' onclick=showConfigPotArea([" + features[i].getGeometry().getCoordinates() + "])>";
						htm += "	<img src='images/fence/fence1.png'/>";
						htm += "	<span> " + features[i].get('name') + "</span></div>";
						htm += "	<span id='" + features[i].getId() + "' onclick=deleteConfigPotArea(this); class='editdelete'>删除</span></div>";
					}
					htm += "</div>";
					$('#potarea').html(htm);
					break;
				case 'fence_configarea':
					configAreaSource.clear();
					configAreaSource.addFeatures(features);
					htm += "<div>";
					for(var i=0;i<features.length;i++){
						htm += "<div class='cont'>";
						htm += "<div class='col-md-7' style='color:#fff;' onclick=showConfigPotArea([" + features[i].getGeometry().getInteriorPoint().getCoordinates() + "])>";
						htm += "<img src='images/fence/fence2.png'/>";
						htm += "<span>" + features[i].get('name') + "</span></div>";
						htm += "<span id='" + features[i].getId() + "' onclick=deleteConfigPotArea(this); class='editdelete'>删除</span></div>";
						 
					}
					htm += "</div>";
					$('#modelarea').html(htm);
					break;
				case 'fence_configalphaarea':
					configAlphaAreaSource.clear();
					configAlphaAreaSource.addFeatures(features);
					break;
				}
			},
		});
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
