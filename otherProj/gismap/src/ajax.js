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

async function getTagInfo(tagName)
{
    return await axios.get("http://" + globalConfig.ip + "/api/Tag/getDto?name="+tagName);
//   .then(function (response) {
//       console.log('res..',response);
//    return response;
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
}

