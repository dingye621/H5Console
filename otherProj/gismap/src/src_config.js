function addScript(url) {
	const script = document.createElement('script')
	script.setAttribute('type','text/javascript');
	script.setAttribute('src',url);
//	script.type = 'application/javascript'
	//script.src = url
	//document.head.appendChild(script);
	document.body.appendChild(script);
}
//addScript('http://'+globalConfig+'/chem/js/global/jquery-2.1.1.min.js');
//addScript('http://'+globalConfig+'/chem/js/global/bootstrap.js');

addScript('src/axiosex.js');

