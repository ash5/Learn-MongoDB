$(function(){
	
	$("#start_button").click(function(){
	
		var str_work= "" ;

		$.getJSON('/question/question.json',function(json){
		
		//	var data = json[1];
			
		//	var tmp =$.parseJSON(data.model_answer);
			//alert("tmp=");
								
		/*	
			for(var i in json){	
			//JSONオブジェクトを文字列に変換
			var model_answer = JSON.stringify(json[i].model_answer);
				//question.jsonの内容を表示
				str_work=str_work+"q_id="+json[i].q_id+'\n'
							+"query="+json[i].model_answer+'\n';
			}
		*/			
			
			//指定した要素のHTMLに指定値をセットする．
			$("#question").html(str_work);
//			$("#question").html(tmp);
		
			
			});

		
	});

});
