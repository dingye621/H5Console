//获取参数的方法
function GetRequest() {   
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
       var str = url.substr(1);   
       strs = str.split("&");   
       for(var i = 0; i < strs.length; i ++) {   
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
       }   
    }   
    return theRequest;   
} 

// function getTagInfo(tagName)
// {
//     $.ajax({  
//         type : "get",  //提交方式  
//         url : "http://" + globalConfig.ip + "/api/Tag/getDto?name="+tagName,//路径  
//         async: false,
//         data : {},//数据，这里使用的是Json格式进行传输  
//         success : function(result) {//返回数据根据结果进行相应的处理  
//             return result;
//         }  
//     });  
// }

// async function getTagInfo(tagName)
// {
//     return await axios.get("http://" + globalConfig.ip + "/api/Tag/getDto?name="+tagName);
// }

async function getTagInfo(tagName)
{
    return await axios.get('http://' + globalConfig.ip + '/api/Tag/getObject?tagName='+tagName+'&current=1&pageSize=1');
//   .then(function (response) {
//       console.log('res..',response);
//    return response;                                                                                                                                                                         
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
}

async function getCameraInfo(cameraName)
{
    return await axios.get('http://' + globalConfig.ip + '/api/Camera/getObject?cameraName='+cameraName+'&current=1&pageSize=1');

}


async function getHazardList()
{
    return await axios.get('http://' + globalConfig.ip + '/api/Hazard/getHazard?current=1&pageSize=10000');
}


async function getAreas()
{
    return await axios.get('http://' + globalConfig.ip + '/api/Org/getAreas');
}


