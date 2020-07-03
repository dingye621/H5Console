$('.menu-li').click(function(){
	var id=$(this).attr("id");
	var type=id.replace('menu','');
	location.href='http://'+globalConfig.gisDomain+'/gis/gis.html?tp='+type;
});

