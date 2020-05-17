(function(w){
	w.globalConfig = {
			//ip:"192.168.18.12:7000",
			ip:"localhost:7000",
			src:"192.168.18.3:8091",
			cameraDomain:"cam.hse.upneep.com",
			//src:"47.103.35.78:8081",
			poison:{type:1,load:['11','29'],name:'Poison',code:['K03','K02']},//可燃(load[0])有毒(load[1])
			danger:{type:2,load:['32'],name:'Danger',code:['32']},//重大危险源监控
			hidden:{type:3,load:['#FFFF3030'],name:'Hidden'},//隐患排查
			risk:{type:4,load:['#FFFF3030'],name:'Risk'},//风险分区四色图
			work:{type:5,load:['8'],name:'Work'},//作业许可
			emer:{type:6,load:['9'],name:'Emer'},//应急物资
			position:{type:7,load:['6'],name:'Position'},//重大危险源点位
			esCode:'ES',//东南角
			wnCode:'WN',//西北角
			wsCode:'WS',//西南角
			enCode:'EN',//东北角
	};
	return w;
})(window || {});


