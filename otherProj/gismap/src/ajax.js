function getTag(tagId)
{
    $.ajax({  
        type : "POST",  //提交方式  
        url : "${pageContext.request.contextPath}/org/doDelete.action",//路径  
        data : {  
            "org.id" : "${org.id}"  
        },//数据，这里使用的是Json格式进行传输  
        success : function(result) {//返回数据根据结果进行相应的处理  
            if ( result.success ) {  
                $("#tipMsg").text("删除数据成功");  
                tree.deleteItem("${org.id}", true);  
            } else {  
                $("#tipMsg").text("删除数据失败");  
            }  
        }  
    });  
}