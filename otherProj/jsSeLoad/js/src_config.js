var version = 1;

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

// jsloader(["js/sc.js", "js/DOM.js", "js/onload.js"], function () {
// 	console.log('all complete');
// });

function addScript(url) {
	const script = document.createElement('script')
	//script.setAttribute('type','text/javascript');
	//script.setAttribute('src',url);
	script.type = 'application/javascript'
	script.src = url
	//document.head.appendChild(script);
	//document.body.appendChild(script);
	document.getElementsByTagName('head')[0].appendChild(script);
}

//console.log('sc');
//addScript('js/sc.js');


$(document).ready(function(){
	//console.log('DOM');
	//addScript('js/DOM.js');
});

//不起作用
window.DOMContentLoaded=function()
{
	//console.log('DOM');
	//addScript('js/DOM.js');
}


window.onload=function(){
	//console.log('src..',globalConfig.src);
	//addScript('js/onload.js');
	
}




