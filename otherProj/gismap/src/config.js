(function(w){
	w.globalConfig = {
			//ip:"192.168.18.12:7000",
			ip:"localhost:7000",
			src:"192.168.18.3:8091",
			//src:"47.103.35.78:8081",
			cameraDomain:"cam.hse.upneep.com",
			hseDomain:'192.168.18.12:8088',
			alertDomain:'192.168.18.12:8080',
			gisDomain:'localhost:8089',
			poison:{type:1,load:['11','12'],name:'Poison',code:['K03','K02']},//可燃(load[0])有毒(load[1])
			danger:{type:2,load:['31','32','33','34'],name:'Danger',code:['default','JKYT01','JKYT02','JKYT03']},//重大危险源监控
			hidden:{type:3,load:['#DC143C30'],name:'Hidden'},//隐患排查 红色
			risk:{type:4,load:['#0000FF80','#FFF68F80','#EE762180','#FF000080'],name:'Risk'},//风险分区四色图  蓝黄橙红
			work:{type:5,load:['#1E90FF30'],name:'Work'},//作业许可 蓝色
			emer:{type:6,load:['37'],name:'Emer'},//应急物资
			position:{type:7,load:['21'],name:'Position',code:['K01']},//重大危险源点位
			esCode:'ES',//东南角
			wnCode:'WN',//西北角
			wsCode:'WS',//西南角
			enCode:'EN',//东北角
			defaultColor:'#FFFF3030',//基础区域颜色  黄色,
			colorCode:'COLOR',
	};
	return w;
})(window || {});


