(function(w){
	w.globalConfig = {
			//ip:"10.109.75.229:7000",
			ip:"localhost:7000",
			//src:"10.109.75.228:8091",
			src:"47.103.35.78:8081",
			poison:{type:1,load:['29'],name:'posion'},//可燃有毒
			danger:{type:2,load:['32'],name:'danger'},//重大危险源监控
			hidden:{type:3,load:['14'],name:'hidden'},//隐患排查
			risk:{type:4,load:['7'],name:'risk'},//风险分区四色图
			work:{type:5,load:['8'],name:'work'},//作业许可
			emer:{type:6,load:['9'],name:'emer'},//应急物资
			position:{type:7,load:['6'],name:'position'},//重大危险源点位
	};
	return w;
})(window || {});


