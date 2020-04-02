$(function(){
	var delParent;
	var defaults = {
		fileType         : ["jpg","png","bmp","jpeg"],   // 上传文件的类型
		fileSize         : 1024 * 1024 * 10                  // 上传文件的大小 10M
	};
	//接受参数
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return decodeURI(r[2]);
		return null;
	}
	var organId = GetQueryString("id");
	if(organId == 13){
		$('#leftAddTeacher').show()
	}else{
		$('#leftAddTeacher').hide()
	}
	//接口
	// var Api = "https://lexuexiu.com/"    //正式
	var Api = "http://152.136.144.170:9901" //测试
	var shn = "http://10.10.3.159:9901/"
    var diaryImgs = [];//上传图片数组
    var diaryVideos = [];//上传视频数组

	// 机构老师申请加入列表
	let auditTeacher = Api + 'organManager/examineTeahcers'
	// 机构信息
	let organMessage = Api + 'organManager/getOrganDetails'
	//补全机构信息
	let complementMessage = Api + 'organManager/completionData'
	//接受老师加入
	let reviewTeacher = Api + 'organManager/reviewTeacherJoinOrgan'
	// 机构发日记
	let publishDiary = Api + 'article/pcWriteDiary'
	// 机构发文章
	let publishArticle = Api + 'article/pcIssueArticle'
	//日记列表
	let diaryList = Api + 'article/pcOwnDiaryList'
	//机构老师列表
	let teacherList = Api + 'org/pcTeacherInOrgan'
	//修改密码
    let changePass = Api + 'organManager/updatePwd'
	//添加老师
	let addTeacher = Api + 'pcArticleManagement/createTeacher'
	//添加的老师列表
	let addTeacherList = Api + 'pcArticleManagement/queryVirtualTeacher'
    //上传图片
    var upImage = Api + 'upload/pcImage'; 
    //上传视频
    var upVideo = Api + 'upload/pcVideo'; 

	//封装ajax
	function sendAjax(url,data,respon) {
		$.ajax({
			type:"get",
			url: url,
			data: data,
			dataType:"jsonp", 
			jsonp:"callback",
			success(res) {
			  respon(null, res)
			},
			error: function(error) {
				console.log(error)
			}
		});
    }
	function sendPostAjax(url,data,respon) {
		$.ajax({
			type:"post",
			url: url,
			data: data,
			success(res) {
			  respon(null, res)
			},
			error: function(error) {
				console.log(error)
			}
		});
	}
	//机构信息
	var data1 = {
		organId:organId,
		// organId:13,
	}
	sendAjax('http://152.136.144.170:9901/organManager/getOrganDetails',data1,(err, res) =>{
		let data = JSON.parse(res.data);
		console.log(data)
		if(data.address == ''){
			$(".shade").show()
			$(".submitData").show()
		}else{
			$(".shade").hide()
			$(".submitData").hide()
		}
		var organType = data.organTypeArr;
		var organHonor = data.honorPathArr;
		var organEnvironment = data.organPathArr;
		var organCertif = data.certifPathArr;
		var organTypeArr = []
		for(let i = 0;i<organType.length;i++){
		   if(organType[i] == 1){
			   organTypeArr.push("美术")
		   }else if(organType[i] == 2){
			   organTypeArr.push("书法")
		   }else if(organType[i] == 3){
			   organTypeArr.push("音乐")
		   }else if(organType[i] == 4){
			   organTypeArr.push("体育")
		   }else if(organType[i] == 5){
			   organTypeArr.push("口才")
		   }
		  var div1='<span>';
		  var div2='</span> ';
		}
		$.each(organTypeArr,function(i,t){
			$(".organType").append(div1+t+div2);
		})
		for(let i = 0;i<organHonor.length;i++){
		   let $img = `<img src="${organHonor[i]}" >`;
		   $(".organHonor").append($img);
		}
		for(let i = 0;i<organEnvironment.length;i++){
		   let $img = `<img src="${organEnvironment[i]}" >`;
		   $(".organEnvironment").append($img);
		}
		for(let i = 0;i<organCertif.length;i++){
		   let $img = `<img src="${organCertif[i]}" >`;
		   $(".organCertif").append($img);
		}
		$(".organName").html(data.organNm)
		$(".layui-nav-img").attr('src',data.logPath)
		$(".message .honor img").attr('src',data.honorPathArr[0])
		$(".message .environment .img1").attr('src',data.organPathArr[0])
		$(".message .environment .img2").attr('src',data.organPathArr[1])
		$(".message .certif img").attr('src',data.certifPathArr[0])
		$(".message #mood").html(data.organIntro)
		$(".message #Invitation").html(data.organNo)
	})
	$("#organName").blur(function(){})
	$("#organAddress").blur(function(){})
	$("#organIntro").blur(function(){})
	$("#organprincipal").blur(function(){})
	$("#organPhone").blur(function(){})
	var text = []
	$('.organClass span input').each(function(i) {
		$(this).click(function(){	
			if ($(this).is(":checked")) {
				text.push(this.value)
			}else{
				text.splice($(this),1)
			};
		}); 
	});
	$("#classIfy1").attr("checked",false);   //未选中
	$("#classIfy1").attr("checked",true);    //选中
	//补全机构信息
	$('#submitData').click(function(){
		let data2 = {
			organId:organId,
			organName:$('#organName').val(),
			address:$('#organAddress').val(),
			organType:text.join(','),
			organIntro:$('#organIntro').val(),
			contactName:$('#organprincipal').val(),
			contactPhone:$('#organPhone').val(),
			logPath:diaryImgs.join(','),
			certifPath:organAptitude.join(','),
			organPath:organEnvironment.join(','),
			honorPath:organHonor.join(','),
		}
		sendAjax(complementMessage,data2,(err, res) =>{
			console.log(res)
			if(res.code == 1){
				$('.submitData').hide(500)
				$('.shade').hide(500)
				alert("资料补全成功")
			}else{
				alert(res.msg)
			}
		})
	})
	// 发布日记
	$('#publishDiary').click(function(){
		let data4 = {
			type: "2",
			contentType: $("#diaryType option:selected").val(),
			organId:organId,
			browseType:1,
			userType:3,
			diaryContent:$('#diaryContentTxt').val(),
			imageUrl: diaryImgs.join(','),
			videoUrl: diaryVideos.join(',')
		}
		sendAjax(publishDiary,data4,(err, res) =>{
            console.log(res)
            if(res.code=='1'){
                alert('发布成功')
                $("#diaryType option:selected").val(1);
                $('#diaryContentTxt').val('');
                diaryImgs = [];
                diaryVideos = [];
                $('.imgs img').remove();
                $('.videos video').remove();
            }else{
                alert('发布失败')
            }
		})
	});
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
	};
	//日记图片
	var diaryImgList = []; 
	$(".diaryFile").change(function(){	
		console.log(1)
		var idFile = $(this).attr("id");
		var file = document.getElementById(idFile);
		var imgContainer = $(this).parents(".z_photo"); //存放图片的父亲元素
		var fileList = file.files; //获取的图片文件
		var input = $(this).parent();//文本框的父亲元素
		var imgArr = [];
		//遍历得到的图片文件
		var numUp = imgContainer.find(".up-section").length;
		var totalNum = numUp + fileList.length;  //总的数量
		if(fileList.length > 8 || totalNum > 8 ){
			alert("上传图片数目不可以超过8个，请重新选择");  //一次选择上传超过5个 或者是已经上传和这次上传的到的总数也不可以超过5个
		}
		else if(numUp < 5){
			var files = fileList[0]
			var imgSrc;
			var reader = new FileReader();
			reader.readAsDataURL(files);
			reader.onload = function() {
			    imgSrc = this.result;
				console.log(imgSrc)
			    $.ajax({
			        type:"post",
			        headers: {
			            'token': "upload/pcImage"
			        },
			        // url: upImage,
					url: 'https://lexuexiu.com/upload/pcImage',
			        data: {"file":imgSrc},
			        success(res) {
			            var res = JSON.parse(res)
						console.log(res)
			            if(res.code=='1'){
			                diaryImgList.push(res.data)
			                console.log(diaryImgList)
			            }else{
			                alert('图片上传失败')
			            }
			        },
			        error: function(error) {
			            console.log(error)
			        }
			    });
			};
			fileList = validateUp(fileList);
			for(var i = 0;i<fileList.length;i++){
			 var imgUrl = window.URL.createObjectURL(fileList[i]);
				 imgArr.push(imgUrl);
			 var $section = $("<section class='up-section fl loading'>");
				 imgContainer.prepend($section);
			 var $span = $("<span class='up-span'>");
				 $span.appendTo($section);
			
			 var $img0 = $("<img class='close-upimg'>").on("click",function(event){
					event.preventDefault();
					event.stopPropagation();
					$(".works-mask").show();
					delParent = $(this).parent();
				});   
				$img0.attr("src","img/a7.png").appendTo($section);
			 var $img = $("<img class='up-img up-opcity'>");
				 $img.attr("src",imgArr[i]);
				 $img.appendTo($section);
			 var $p = $("<p class='img-name-p'>");
				 $p.html(fileList[i].name).appendTo($section);
			 var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
				 $input.appendTo($section);
			 var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
				 $input2.appendTo($section);
		   }
		}
		setTimeout(function(){
			 $(".up-section").removeClass("loading");
			 $(".up-img").removeClass("up-opcity");
		 },450);
		 numUp = imgContainer.find(".up-section").length;
		if(numUp >= 8){
			$(this).parent().hide();
		}
	});
	//文章首图
	var articleImg = [];
	$(".articleFile").change(function(e){	
		var idFile = $(this).attr("id");
		var file = document.getElementById(idFile);
		var imgContainer = $(this).parents(".articleImage"); //存放图片的父亲元素
		var fileList = file.files; //获取的图片文件
		var input = $(this).parent();//文本框的父亲元素
		var imgArr = [];
		//遍历得到的图片文件
		var numUp = imgContainer.find(".articleImage-section").length;
		var totalNum = numUp + fileList.length;  //总的数量
		if(fileList.length > 5 || totalNum > 5 ){
			alert("上传图片数目不可以超过1个，请重新选择");  //一次选择上传超过5个 或者是已经上传和这次上传的到的总数也不可以超过5个
		}
		else if(numUp < 5){
			var files = fileList[0]
			var imgSrc;
			var reader = new FileReader();
			reader.readAsDataURL(files);
			reader.onload = function() {
			    imgSrc = this.result;
				console.log(imgSrc)
			    $.ajax({
			        type:"post",
			        headers: {
			            'token': "upload/pcImage"
			        },
			        // url: upImage,
					url: 'https://lexuexiu.com/upload/pcImage',
			        data: {"file":imgSrc},
			        success(res) {
			            var res = JSON.parse(res)
						console.log(res)
			            if(res.code=='1'){
			                articleImg.push(res.data)
			                console.log(articleImg)
			            }else{
			                alert('图片上传失败')
			            }
			        },
			        error: function(error) {
			            console.log(error)
			        }
			    });
			};
			fileList = validateUp(fileList);
			console.log(fileList)
			for(var i = 0;i<fileList.length;i++){
			 var imgUrl = window.URL.createObjectURL(fileList[i]);
			     imgArr.push(imgUrl);
			 var $section = $("<section class='articleImage-section loading pr'>");
			     imgContainer.prepend($section);
			 var $span = $("<span class='up-span'>");
			     $span.appendTo($section);
		     var $img0 = $("<img class='close-upimg'>").on("click",function(event){
				    event.preventDefault();
					event.stopPropagation();
					$(".works-mask").show();
					delParent = $(this).parent();
				});   
				$img0.attr("src","img/a7.png").appendTo($section);
		     var $img = $("<img class='articleImg up-opcity'>");
				 console.log(imgArr[i])
		         $img.attr("src",imgArr[i]);
		         $img.appendTo($section);
		     var $p = $("<p class='img-name-p'>");
		         $p.html(fileList[i].name).appendTo($section);
		     var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
		         $input.appendTo($section);
		     var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
		         $input2.appendTo($section);
		   }
		}
		setTimeout(function(){
             $(".up-section").removeClass("loading");
		 	 $(".articleImg").removeClass("up-opcity");
		 },450);
		 numUp = imgContainer.find(".up-section").length;
		if(numUp >= 0){
			$(this).parent().hide();
		}
	});
	$(".z_photo").delegate(".close-upimg","click",function(){
     	  $(".works-mask").show();
     	  delParent = $(this).parent();
	});
		
	$(".wsdel-ok").click(function(){
		$(".works-mask").hide();
		var numUp = delParent.siblings().length;
		console.log(numUp)
		if(numUp < 6){
			delParent.parent().find(".z_file").show();
		}
		delParent.remove();
		articleImg.length = 0
	});
	
	$(".wsdel-no").click(function(){
		$(".works-mask").hide();
	});
	// 发布文章
	$('#publishArticle').click(function(){
		console.log($("#editBox").html())
		if($('#issueTitle').val() != '' && $("#editBox").html() != '' && articleImg.length == 1){
			$.ajax({ 
				type:'post',   
				// url: 'http://152.136.144.170:9901/article/pcIssueArticle', 
				url: 'http://152.136.144.170:9901/pcArticleManagement/pcWrite', 
				data:{
					type:1,
					contentType:$("#issueType option:selected").val(),
					// organId:organId,
					teacherId:$("#selectTeacherList option:selected").val(),
					browseType:'Y',
					userType:2,
					title:$('#issueTitle').val(),
					diaryContent:'',
					articleContent:$("#editBox").html(),
					imageUrl:articleImg.join(','),
					videoUrl: '',
				},
				// dataType:"jsonp", 
				// jsonp:"callback",
				success:function(response){
					console.log(response)
					if(response.code == 1){
						alert('发布成功')
					}else{
						alert(response.msg)
					}
				},
				error:function(error){
				},
			})
		}else{
			alert('缺少参数')
		}
	})
	// $('#publishArticle').click(function(){
	// 	alert(22222)
	// 	let data5 = {
	// 		callback:'jQuery20007835007696156644_1582724597685',
	// 		type:1,
	// 		contentType:1,
	// 		// contentType:$("#issueType option:selected").val(),
	// 		organId:organId,
	// 		browseType:1,
	// 		userType:3,
	// 		title:$('#issueTitle').val(),
	// 		diaryContent:'',
	// 		articleContent:'<p>123456</p></br><p>7891011</p>',
	// 		imageUrl: '',
	// 		videoUrl: '',
	// 		// diaryContent:$('#issueContentTxt').val(),
	// 		// imageUrl: diaryImgs.join(','),
	// 		// videoUrl: diaryVideos.join(',')
	// 	}
	// 	sendAjax(publishArticle,data5,(err, res) =>{
	// 		alert(333)
 //            console.log(res)
 //            if(res.code=='1'){
 //                alert('发布成功')
 //                $("#issueType option:selected").val(1);
 //                $('#issueTitle').val('');
 //                $('#issueContentTxt').val('');
 //                diaryImgs = [];
 //                diaryVideos = [];
 //                $('.imgs img').remove();
 //                $('.videos video').remove();
 //            }else{
 //                alert('发布失败')
 //            }
	// 	})
	// })
	//修改密码
	$('#changePass').click(function(){
		console.log($('#oldPassword').val())
		var oldPassword = $('#oldPassword').val();
		console.log($.md5(oldPassword))
		var pass = $.md5($.md5(oldPassword) + 'lexueshow')
		console.log(pass)
		alert(222)
		let data8 = {
			originalPassword:pass,
			nowPassword:"123456",
			organId:organId,
		}
		sendAjax(changePass,data8,(err, res) =>{
			console.log(res)
		})
	})
	//添加老师
	$("#addTeacherBtn").click(function(){
		if(diaryImgs.length == 1){
			$.ajax({ 
				type:'post',   
				url: 'http://152.136.144.170:9901/pcArticleManagement/createTeacher', 
				data:{
					imagePath:diaryImgs.join(','),
					teacherNm:$('#addTeacherName').val(),
					gender:$('#addTeacherSex option:selected').val(),
					teacherDate:$('#addTeacherData').val(),
				},
				success:function(response){
					console.log(response);
					if (response.code == 1) {
						alert('添加成功')
					}else{
						alert(response.msg)
					}
				},
				error:function(error){
				},
			})
		}else{
			alert('参数有误')
		}
		
	})
	// 左侧选项卡
	$(".organizationManage").click(function(){
		console.log(1111)
		$(".organizationManage").addClass('ManageBor')
		$(".up").toggle()
		$(".down").toggle()
		$(".authority").toggle(500)
		$(".message").toggle(500)
	})
	$('#diaryModule li').click(function(){
	    var index = $(this).index();
		console.log(index)
        diaryImgs = [];
        diaryVideos = [];
        $('.imgs img').remove();
        $('.videos video').remove();
		if(index == 1){
            $(".diaryList").html("");
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage,layer = layui.layer;
                console.log(12)
                     diary_id=1;
                    //调用分页
                    laypage.render({
                        elem: 'demo1',
                        count: 100,
                        jump: function(obj){
                            // 获取日记/文章列表
                            let data6 = {
                                type:2,
                                user_type:3,
                                // organ_id:organId,
								organ_id:13,
                                page:diary_id,
								pageSize:10
                            }
                            sendAjax('http://152.136.144.170:9901/article/pcOwnDiaryList',data6,(err, res) =>{
								console.log(res)
								var data = res.data.articleEntities
                                //模拟渲染
                                $(".diaryList")[0].innerHTML = function(){
                                    var arr = []
                                    ,thisData = data;
                                    layui.each(thisData, function(index, items){
                                        console.log(items)
                                        console.log(index)
                                        arr.push("<ul><li>"+items.diaryId+"</li><li>"+items.nickName+"</li><li>"+items.diaryDontent+"</li><li>"+items.contentType+"</li><li>"+items.browseCount+"</li><li>"+items.collectCount+"</li><li>"+items.likeCount+"</li><li>"+items.createDate+"</li><li><button>删除</button></li></ul>");
                                        if(index==9){
                                            diary_id = items.diary_id
                                            console.log(diary_id)
                                        }
                                    });
                                    return "<div>"+arr.join('')+"</div>";
                                }();
                            }); 
                        }
                })
              });
		}else if(index == 2){
			$.ajax({ 
				type:'post',   
				url: 'http://152.136.144.170:9901/pcArticleManagement/queryVirtualTeacher', 
				success:function(response){
					console.log(response)
					if(response.data != 0){
						for(var i = 0; i < response.data.length; i++){
							$("#selectTeacherList").append("<option value='"+response.data[i].teacherId+"'>"+response.data[i].teacherNm+"</option>");//新增
						}
						$("#channel_id option:eq(0)").attr('selected', 'selected');//选中第一个
						// $("#selectTeacherList").append("<option value=''>请选择</option>");
					}
				},
				error:function(error){
				},
			})
		}else if(index == 3){
			// if(organ_id == 13){
			// 	
			// }else{
			// 	
			// }
				
            $(".artileList").html("");
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage,layer = layui.layer;
                    let diary_id=1;
                    //调用分页
                    laypage.render({
                        elem: 'issueList',
                        count: 100,
                        jump: function(obj){
                            // 获取日记/文章列表
                            let data6 = {
                                type:1,
                                user_type:2,
								teacherId:8,
                                // organ_id:organId,
                                page:diary_id,
                                pageSize:10
                            }
                            sendAjax('http://152.136.144.170:9901/article/pcOwnDiaryList',data6,(err, res) =>{
								console.log(res)
                                var data = res.data.articleEntities
                                //模拟渲染
                                $(".artileList")[0].innerHTML = function(){
                                    var arr = []
                                    ,thisData = data;
                                    layui.each(thisData, function(index, items){
                                        console.log(items)
										arr.push("<ul><li>" + "<input type=checkbox />" + "</li><li>"+ index +"</li><li>"+items.title+"</li><li>"+items.diaryDontent+"</li><li>"+items.contentType+"</li><li>"+items.browseCount+"</li><li>"+items.collectCount+"</li><li>"+items.likeCount+"</li><li>"+items.createDate+"</li><li><button>编辑</button><button>删除</button></li></ul>");
                                        if(index==9){
                                            diary_id = items.diary_id
                                            console.log(diary_id)
                                        }
                                    });
                                    return "<div>"+arr.join('')+"</div>";
                                }();
                            }); 
                        }
                })
              })
			}
		// }else if(index == 4){
		// 	$.ajax({ 
		// 		type:'post',   
		// 		url: 'http://152.136.144.170:9901/pcArticleManagement/queryVirtualTeacher', 
		// 		success:function(response){
		// 			console.log(response)
		// 		},
		// 		error:function(error){
		// 		},
		// 	})
		// }else if(index == 7){
  //           $(".auditTeacher").html("");
  //           let data10 = {
  //               organId:organId,
  //               page:diary_id,
  //               pageSize:10
  //           }
  //           sendAjax(auditTeacher,data10,(err, res) =>{
  //               console.log(res)
  //               if(res.code=='1'){
  //                   var str="<div>";    
		// 		    $.each(res.data.examineTeahcersReturnDTOList,function(i,items){     
		// 		      str+="<ul><li><img class='headimg dis_biock margin_auto h100' src='"+items.hearImage+"'></li><li>"+items.name+"</li><li>"+items.mobile+"</li><li>"+items.name+"</li><li><button class='consent' id='"+items.organTeacherId+"'>同意</button><button class='refuse' id='"+items.organTeacherId+"'>拒绝</button></li></ul>";
		// 		     });                 
		// 		     str+="<div>";      
  //                    $(".auditTeacher").append(str); 
  //                     // 机构同意老师加入机构
  //                     console.log('cyy'+$('.auditTeacher .consent').length)
  //                   for(i in $('.auditTeacher .consent')){
  //                       console.log(1111)
  //                       console.log('cyy'+$('.auditTeacher .consent')[i])
  //                       $('.auditTeacher .consent')[i].onclick = function(data){
  //                           let data3 = {
  //                               application_status:"2",//接受 
  //                               id:$(this).attr('id')
  //                           }
  //                           sendAjax(reviewTeacher,data3,(err, res) =>{
  //                               if(res.code=='1'){
  //                                   alert('成功')
  //                               }else{
  //                                   alert(res.msg)
  //                               }
  //                               
  //                           })
  //                       }
  //                       //拒绝
  //                       $('.auditTeacher .refuse')[i].onclick = function(data){
  //                           let data3 = {
  //                               application_status:"3",//拒绝
  //                               id:$(this).attr('id')
  //                           }
  //                           sendAjax(reviewTeacher,data3,(err, res) =>{
  //                               if(res.code=='1'){
  //                                   alert('成功')
  //                               }else{
  //                                   alert(res.msg)
  //                               }
  //                           })
  //                       }
  //                       return
  //                   }
  //               }else{
  //                   alert(res.msg)
  //               }
		// 	})
		// }else if(index == 4){
  //           //老师列表
  //           let data7 = {
  //               organId:organId,
		// 		page:1,
		// 		pageSize:10
  //           }
  //           sendAjax(teacherList,data7,(err, res) =>{
  //               console.log(res)
  //                   if(res.code=='1'){
  //                       var str="<div>";    
  //                       $.each(res.data,function(i,items){     
  //                         str+="<ul><li>"+items.teacherId+"</li><li>"+items.teacherNm+"</li><li>"+items.beGood+"</li><li>"+items.beGood+"</li><li>"+items.beGood+"</li><li>"+items.beGood+"</li><li>"+items.beGood+"</li><li>"+items.beGood+"</li><li>"+items.beGood+"</li><li><button>删除</button><button>修改</button></li></ul>";
  //                       }); 
  //                       str+="<div>";      
  //                       $(".teacherList").append(str);  
  //                   }else{
  //                       alert('获取列表失败')
  //                   }
  //           })
  //       }
		$(".message").slideUp(500)
		$('#diaryModule li:eq('+index+')').siblings().removeClass('col009688');
	    $('#diaryModule li:eq('+index+')').addClass('col009688');
	    $('.meBox li:eq('+index+')').siblings().slideUp(500);
	    $('.meBox li:eq('+index+')').slideDown(500);
		$(".meBox").show(500)
    })
    // 选择图片预览并上传
	// 日记/文章
    $(".uploadImg").change(function(e) {
        var imgBox = e.target;
        uploadImg($('.imgs'), imgBox)
    });
	// 机构logo
	$("#organLogo").change(function(e) {
		if(diaryImgs.length == 0){
			var fileLogo = e.target; //获取图片资源
			uploadImg($('.imgList1'), fileLogo)
		}else{
			alert("只能上传一张")
		}
	});	
	// 机构资质
	$("#organAptitude").change(function(e) {
		console.log()
		console.log(e.target)
	    var fileAptitude = e.target;
	    uploadImg1($('.imgList2'), fileAptitude)
	});
	// 机构环境
	$("#organEnvironment").change(function(e) {
		console.log(e.target)
	    var fileEnvironment = e.target;
	    uploadImg2($('.imgList3'), fileEnvironment)
	});
	// 机构荣誉
	$("#organHonor").change(function(e) {
		console.log(e.target)
	    var fileHonor = e.target;
	    uploadImg3($('.imgList4'), fileHonor)
	});
    function uploadImg(element, tag) {
        var file = tag.files[0];
		console.log(file)
        var imgSrc;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            imgSrc = this.result;
			console.log(imgSrc)
            var imgs = document.createElement("img");
			console.log(imgs)
            $(imgs).attr("src", imgSrc);
            element.append(imgs);
            // let data5 = {
            //     "file":imgSrc
            // }
            $.ajax({
                type:"post",
                headers: {
                    'token': "upload/pcImage"
                },
                // url: upImage,
				url: 'https://lexuexiu.com/upload/pcImage',
                data: {"file":imgSrc},
                success(res) {
                    var res = JSON.parse(res)
                    if(res.code=='1'){
                        diaryImgs.push(res.data)
                        console.log(diaryImgs)
                    }else{
                        alert('图片上传失败')
                    }
                },
                error: function(error) {
                    console.log(error)
                }
            });
        };
    }
	//机构资质
	var organAptitude = [];
	function uploadImg1(element, tag) {
	    var file = tag.files[0];
	    var imgSrc;
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = function() {
	        imgSrc = this.result;
	        var imgs = document.createElement("img");
			console.log(imgs)
	        $(imgs).attr("src", imgSrc);
	        element.append(imgs);
	        $.ajax({
	            type:"post",
	            headers: {
	                'token': "upload/pcImage"
	            },
	            url: upImage,
	            data: {"file":imgSrc},
	            success(res) {
	                var res = JSON.parse(res)
	                console.log(res.code)
	                if(res.code=='1'){
	                    organAptitude.push(res.data)
	                    console.log(organAptitude)
	                }else{
	                    alert('图片上传失败')
	                }
	            },
	            error: function(error) {
	                console.log(error)
	            }
	        });
	    };
	}
	//删除机构资质图片
	
	//机构环境
	var organEnvironment = [];
	function uploadImg2(element, tag) {
	    var file = tag.files[0];
	    var imgSrc;
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = function() {
	        imgSrc = this.result;
	        var imgs = document.createElement("img");
			console.log(imgs)
	        $(imgs).attr("src", imgSrc);
	        element.append(imgs);
	        $.ajax({
	            type:"post",
	            headers: {
	                'token': "upload/pcImage"
	            },
	            url: upImage,
	            data: {"file":imgSrc},
	            success(res) {
	                var res = JSON.parse(res)
	                console.log(res.code)
	                if(res.code=='1'){
	                    organEnvironment.push(res.data)
	                    console.log(organEnvironment)
	                }else{
	                    alert('图片上传失败')
	                }
	            },
	            error: function(error) {
	                console.log(error)
	            }
	        });
	    };
	}
	//机构荣誉
	var organHonor = [];
	function uploadImg3(element, tag) {
	    var file = tag.files[0];
	    var imgSrc;
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = function() {
	        imgSrc = this.result;
	        var imgs = document.createElement("img");
			console.log(imgs)
	        $(imgs).attr("src", imgSrc);
	        element.append(imgs);
	        $.ajax({
	            type:"post",
	            headers: {
	                'token': "upload/pcImage"
	            },
	            url: upImage,
	            data: {"file":imgSrc},
	            success(res) {
	                var res = JSON.parse(res)
	                console.log(res.code)
	                if(res.code=='1'){
	                    organHonor.push(res.data)
	                    console.log(organHonor)
	                }else{
	                    alert('图片上传失败')
	                }
	            },
	            error: function(error) {
	                console.log(error)
	            }
	        });
	    };
	}
	// 选择视频预览并上传
    $(".uploadVideo").change(function(e) {
        var videoBox = e.target;
        uploadVideo($('.videos'), videoBox)
    });
    function uploadVideo(element, tag) {
        console.log(tag)
        var video = tag.files[0];
        console.log(video)
        var videoSrc;
        var reader = new FileReader();
        reader.readAsDataURL(video);
        reader.onload = function() {
            console.log(this.result);
            videoSrc = this.result;
            var videos = document.createElement("video");
            $(videos).attr("src", videoSrc);
            $(videos).attr("controls", "controls");
            console.log(videoSrc)
            element.append(videos); 
            $.ajax({
                type:"post",
                headers: {
                    'token': "upload/pcVidio"
                },
                url: 'http:10.253.77.76:9901/upload/pcVideo',
                data: {"file":videoSrc},
                success(res) {
                    console.log(res)
                    var res = JSON.parse(res)
                    if(res.code=='1'){
                        diaryVideos.push(res.data)
                        console.log(diaryVideos)
                        alert('视频上传成功')
                    }else{
                        alert('视频上传失败')
                    }
                },
                error: function(error) {
                    console.log(error)
                }
            });
        };
    };
	function imgRemove() {
	    var imgList = document.getElementsByClassName("imgList2");
	    var mask = document.getElementsByClassName("z_mask")[0];
		var cancel = document.getElementsByClassName("z_cancel")[0];
		var sure = document.getElementsByClassName("z_sure")[0];
	    for (var j = 0; j < imgList.length; j++) {
	        imgList[j].index = j;
	        imgList[j].onclick = function() {
	            var t = this;
	            mask.style.display = "block";
	            cancel.onclick = function() {
	                mask.style.display = "none";
	            };
	            sure.onclick = function() {
	                mask.style.display = "none";
	                t.style.display = "none";
	            };
	        }
	    };
	};
	$(function(){
	  $(document).keydown(function(event){
	    let key = event.keyCode
	    if(key === 37 || key === 38 || key === 39 || key === 40) {
	      changePositon(event)
	    }
	  })
	  $('#editBox').on('click',function(e) {
	    changePositon(e)
	  })
	  $('#fontColor').on('input',function(e) {
	    textChange('foreColor',e.target.value)
	  })
	  // $('#bgColor').on('input',function(e) {
	  //   textChange('hiliteColor',e.target.value)
	  // })
	  $('#fontSize').on('input',function(e) {
	    textChange('fontSize',e.target.value)
	  })
	  // $("#file").change(function(e) {
	  // 		var fileLogo = e.target; //获取图片资源
			// console.log(fileLogo)
	  // 		uploadImg($('.imgList1'), fileLogo)
	  // });	
	  // 发文章富文本上传图片
	  $("#file").change(function(e) {
		console.log(11)
		var file = e.target.files[0]
		var imgSrc;
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function() {
			imgSrc = this.result;
			var imgs = document.createElement("img");
			console.log(imgs)
			$(imgs).attr("src", imgSrc);
			$.ajax({
				type:"post",
				headers: {
					'token': "upload/pcImage"
				},
				url: 'https://lexuexiu.com/upload/pcImage',
				data: {"file":imgSrc},
				success(res) {
					var res = JSON.parse(res)
					var imgUrl = res.data
					console.log(imgUrl)
					if(res.code=='1'){
						image2base64(file, (data) => {
						  var pic = `<img style='width:100%;' src="${imgUrl}" />`
						  textChange('insertHTML', pic)
						})
					}else{
						alert('图片上传失败')
					}
				},
				error: function(error) {
					console.log(error)
				}
			});
		};
	      // uploadImg($('#editBox'), articleImg)
		  console.log(22)
		});
	  // $('#file').on('input',function(e) {
	  //   e.preventDefault()
	  //   const files = e.target.files[0]
	  //   if(files) {
	  //     image2base64(files, (data) => {
	  //       var pic = `<img src="data:image/jpeg;base64${data}" />`
			// console.log(pic)
	  //       textChange('insertHTML', pic)
	  //     })
	  //   }
	  // })
	  // 发文章富文本上传视频
	  $('#video').on('input',function(e) {
	    e.preventDefault()
	    const files = e.target.files[0]
	    if(files) {
	      getvideo(files, (data) => {
	        var pic = `<video src=${data} controls="controls">`
			console.log(pic)
	        textChange('insertHTML', pic)
	      })
	    }
	  })
	});
	function textChange(a, b) {
	  var isFocus=$("#editBox").is(":focus");
	  isFocus ? null : $('#editBox').focus();
	  b ?
	  document.execCommand(a, false, b)
	  :
	  document.execCommand(a, true, null)
	}
	function image2base64(file, cb) {
	  const reader = new FileReader()
	  reader.onloadend = function () {
	    cb && cb(this.result)
	  }
	  reader.readAsDataURL(file)
	}
	function getvideo(file, cb) {
	  // 建议判断下视频大小及格式，太大的可能会有问题
	    const reader = new FileReader();
	    reader.onload = function (evt) {
	      cb && cb(evt.target.result)
	    }
	    reader.readAsDataURL(file);
	}
	//改变光标位置
	function changePositon(e) {
	  var range = document.getSelection()
	  if(range && range.focusNode.data ) {
	    let t = range.focusNode.data
	    let p = range.focusNode.parentElement
	    let size = p.size
	    let color = p.color
	    //let bgColor = p.style.backgroundColor
	    if(!color) {
	      color = getColor(p)
	    }
	    if(!size) {
	      size = getSize(p)
	    }
	    // if(!bgColor) {
	    //   bgColor = getBgColor(p)
	    // }
	    $('#fontSize').val(size || 3)
	    $('#fontColor').val(color || '#000000')
	    //$('#bgColor').val(bgColor || '#000000')
	  }
	}
	function getBgColor(p) {
	  let c
	  if(p.parentElement) {
	    c = p.parentElement.style.backgroundColor
	    if(c) {
	      return c
	    }else {
	      getColor(p.parentElement)
	    }
	  }else {
	    return {}
	  }
	}
	function getColor(p) {
	  let c
	  if(p.parentElement) {
	    c = p.parentElement.color
	    if(c) {
	      return c
	    }else {
	      getColor(p.parentElement)
	    }
	  }else {
	    return {}
	  }
	}
	function getSize(p) {
	  let s
	  if(p.parentElement) {
	    s = p.parentElement.size
	    if(s) {
	      return s
	    }else {
	      getSize(p.parentElement)
	    }
	  }else {
	    return {}
	  }
	}
}) 