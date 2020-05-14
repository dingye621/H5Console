(function(w){
	w.globalConfig = {
			//ip:"10.109.75.229:7000",
			ip:"localhost:7000",
			//src:"10.109.75.228:8091",
			src:"47.103.35.78:8081",
			poison:{type:1,load:['11','29'],name:['fire','poison'],code:['11','29']},//可燃(load[0])有毒(load[1])
			danger:{type:2,load:['32'],name:['danger'],code:['32']},//重大危险源监控
			hidden:{type:3,load:['14'],name:'hidden'},//隐患排查
			risk:{type:4,load:['#FFFF3030'],name:'risk'},//风险分区四色图
			work:{type:5,load:['8'],name:'work'},//作业许可
			emer:{type:6,load:['9'],name:'emer'},//应急物资
			position:{type:7,load:['6'],name:'position'},//重大危险源点位
			esCode:'ES',//东南角
			wnCode:'WN',//西北角
			wsCode:'WS',//西南角
			enCode:'EN',//东北角
	};
	return w;
})(window || {});


