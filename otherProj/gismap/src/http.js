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

async function getCameraList()
{
    return await axios.get('http://' + globalConfig.ip + '/api/Camera/getObject?current=1&pageSize=1000');
}

async function getGameraUrl(cameraId)
{
    return await axios.get('http://' + globalConfig.cameraDomain + '/api/MediaService/GetCamera?id='+cameraId);
}
//hse 接口
async function getLineChartData()
{
    return await axios.get('http://' + globalConfig.hseDomain + '/bpm/getpitfalldata.action');
}

async function getPieChartData()
{
    return await axios.get('http://' + globalConfig.hseDomain + '/bpm/getpitfalltypedata.action');
}

async function getEmer()
{
    return await axios.get('http://' + globalConfig.hseDomain + '/bpm/getsupplies.action');
}

async function getPermit()
{
    return await axios.get('http://' + globalConfig.hseDomain + '/bpm/gislicense.action');
}

async function getLineChartDataPack()
{
     //模拟数据
    //  return [
    //     {
    //       "CldCode": "AA0104",
    //       "num": [4,0,0,0],
    //       "month": [1,2,3,4],
    //       "CldName": "装卸区域",
    //       "ClientDevices": 11065
    //     },
    //     {
     
    //       "CldCode": "AA010701",
    //       "num": [1,2,9,0],
    //       "month": [1,2,3,4],
    //       "CldName": "地磅",
    //       "ClientDevices": 11069
    //     }
    //   ];
    var res = await getLineChartData();
    if(res.data.msg=='success')
    {
        return JSON.parse(res.data.data);
    }
    layer.alert('数据请求失败');
    return [];
}

async function getPieChartDataPack()
{
    // //模拟数据
    // return [
    //     {
    //       "CldName": "装卸区域",
    //       "ClientDevices": 11065,
    //       "CldCode": "AA0104",
    //       "pif": [
    //         {
    //           "PitfallName": "相关方作业",
    //           "PitfallTypex": 14288,
    //           "cn": 4
    //         }
    //       ]
    //     },
    //     {
    //       "CldName": "地磅",
    //       "ClientDevices": 11069,
    //       "CldCode": "AA010701",
    //       "pif": [
    //         {
    //           "PitfallName": "资质证照",
    //           "PitfallTypex": 14197,
    //           "cn": 2
    //         },
    //         {
    //           "PitfallName": "安全规章制度",
    //           "PitfallTypex": 14205,
    //           "cn": 1
    //         },
    //         {
    //           "PitfallName": "安全培训教育",
    //           "PitfallTypex": 14211,
    //           "cn": 1
    //         },
    //         {
    //           "PitfallName": "相关方管理",
    //           "PitfallTypex": 14220,
    //           "cn": 2
    //         },
    //         {
    //           "PitfallName": "重大危险源管理",
    //           "PitfallTypex": 14225,
    //           "cn": 2
    //         },
    //         {
    //           "PitfallName": "个体防护装备",
    //           "PitfallTypex": 14230,
    //           "cn": 3
    //         },
    //         {
    //           "PitfallName": "职业健康",
    //           "PitfallTypex": 14234,
    //           "cn": 1
    //         }
    //       ]
    //     }
    //   ];
    var res = await getPieChartData();
    if(res.data.msg=='success')
    {
        return JSON.parse(res.data.data);
    }
    layer.alert('数据请求失败');
    return [];
}

async function getPermitPack()
{
    var res = await getPermit();
    if(res.data.msg=='success')
    {
        return res.data.data;
    }
    layer.alert('数据请求失败');
    return [];
}





