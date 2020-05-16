//var version = 1;
var version = Math.random();

function jsloader(arr, cb) {
    var head = document.getElementsByTagName('head')[0];

    var _load_index = 0;

    function onScriptLoad(node, e, url) {
        var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/
        if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
            head.removeChild(node);
            onCallback();
        }
    }

    function onCallback() {
        _load_index++;
        if (_load_index == arr.length) {
            cb();
        } else {
            load(arr[_load_index]);
        }
    }

    var isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]';

    function load(url) {
        var node = document.createElement('script');

        node.async = true;
        node.charset = 'utf-8';
        node.src = url + '?v=' + version;

        head.appendChild(node);
        if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera) {
            node.attachEvent('onreadystatechange', function (e) {
                onScriptLoad(node, e, url);
            });
        } else {
            node.addEventListener('load', function (e) {
                onScriptLoad(node, e, url);
            }, false);
        }
    }

    load(arr[_load_index]);
}

jsloader(["http://"+globalConfig.src+"/chem/js/global/bootstrap.js", 
"http://"+globalConfig.src+"/chem/js/map/map/ol-debug.js", 
"../src/api_Common.js",
"http://"+globalConfig.src+"/chem/js/map/map/asset_style.js",
"http://"+globalConfig.src+"/chem/js/map/map/asset_init.js",
"http://"+globalConfig.src+"/chem/js/map/map/asset_base_fun.js",
"../src/Motemap.js",
"../src/api_PotArea.js",
"../src/function.js"
], 
function () {
	console.log('all complete');
});

function addScript(url) {
	const script = document.createElement('script')
	//script.setAttribute('type','text/javascript');
	//script.setAttribute('src',url);
	script.type = 'application/javascript'
	script.src = url
	//document.head.appendChild(script);
	document.getElementsByTagName('head')[0].appendChild(script);
	//document.body.appendChild(script);
}


window.onload=function(){

	// this.addScript('http://'+globalConfig.src+'/chem/js/global/bootstrap.js');
	// //地图
	// this.addScript('http://'+globalConfig.src+'/chem/js/map/map/ol-debug.js');
	// this.addScript('src/api_Common.js');
	// this.addScript('http://'+globalConfig.src+'/chem/js/map/map/asset_style.js');
	// this.addScript('http://'+globalConfig.src+'/chem/js/map/map/asset_init.js');
	// this.addScript('http://'+globalConfig.src+'/chem/js/map/map/asset_base_fun.js');
	// this.addScript('src/Motemap.js');
	// this.addScript('src/api_PotArea.js');
	// //弹框
	// this.addScript('http://'+globalConfig.src+'/chem/com/layer/layer.js');
	// //网页js
	// this.addScript('src/function.js');
}




