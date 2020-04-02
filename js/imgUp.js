$(function(){
	var delParent;
	var defaults = {
		fileType         : ["jpg","png","bmp","jpeg"],   // 上传文件的类型
		fileSize         : 1024 * 1024 * 10                  // 上传文件的大小 10M
	};
	/*点击图片的文本框*/
		function validateUp(files){
		var arrFiles = [];//替换的文件数组
		for(var i = 0, file; file = files[i]; i++){
			//获取文件上传的后缀名
			var newStr = file.name.split("").reverse().join("");
			if(newStr.split(".")[0] != null){
					var type = newStr.split(".")[0].split("").reverse().join("");
					console.log(type+"===type===");
					if(jQuery.inArray(type, defaults.fileType) > -1){
						// 类型符合，可以上传
						if (file.size >= defaults.fileSize) {
							alert(file.size);
							alert('您这个"'+ file.name +'"文件大小过大');	
						} else {
							// 在这里需要判断当前所有文件中
							arrFiles.push(file);	
						}
					}else{
						alert('您这个"'+ file.name +'"上传类型不符合');	
					}
				}else{
					alert('您这个"'+ file.name +'"没有类型, 无法识别');	
				}
		}
		return arrFiles;
		}
	
})
