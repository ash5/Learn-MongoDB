var json_file ='';

$(function(){
	json_file ='';
	var hint_level = 0; //ヒントレベル
	
	var coler = ['primary','success','info','warning','danger'];
//-------------------------
//SELECTされた時の動作
//-------------------------
	$("#sel_question").change(function(){
		//選択されたら
		var sel_val = $("#sel_question option:selected").attr("value");
		if(sel_val != ""){
			json_file = '/question/'+sel_val+'.json';
			var i = document.getElementById('q_num').value=0;//問題番号の初期化
			getQuestion(i,json_file);
		}
	});
	
//--------------------------
//Startボタンを押した際の動作	
//--------------------------
	$("#start").click({id:1},getQuestion);
	
	function getQuestion(i,json_file){	
		
		hint_level = 0;
		$.getJSON(json_file,function(json){
			//textはテキスト部分の書き換え
			makeQuestion(json,i);
			//q_idtなどのセット
			document.getElementById('q_id').value = json[i].q_id;
			document.getElementById('q_result').value = JSON.stringify(json[i].result);
			document.getElementById('q_feedback').value = json[i].feedback;	
			
			
			//複数クエリのセット
			var j = 1;
			var write_query ='';
			while(typeof json[i].query['q'+j]!= "undefined"){
				
				var s = json[i].query['q'+j];
				var r = s.indexOf(".");
				
				var col_name = s.slice(0,r);
				var query = s.slice(r+1);

				var new_col='<input type="hidden" id="q_query_col_'+j+'" name="q_query_col_'+j+'" value="'+col_name+'">';
				var new_query='<input type="hidden" id="q_query_'+j+'" name="q_query_'+j+'" value='+query+'>';
				write_query = write_query+new_col+new_query;
				
				j++;
			}
			$("div#q_query").html(write_query);
			
			makeButton(i,json.length);	

			
		});
		 reloadComment();
		
	}
	
	//iframeのリロード（初期化）
	function reloadComment(){
	
		var iframe = document.getElementById("comment");
		iframe.src = iframe.src;
	
	}
	
	//---------
	//問題文の作成
	//---------
	
	function makeQuestion(json,i){
		//問題エリアの初期化
		$("#key").text('');
		$("#value").text('');
		$("#q_r").text('');
		
		//作成
		//問題文
		
		
		$("#mondai").html('<h2><p class="text-info">Q'+
			json[i].q_id+'</p>'+'<small>'+json[i].sentence+'</small></h2>');
		//key
		var write_key = '<h4><p class="text-info">Key</p><p class="bg-warning">';
		for(j=0;j<json[i].key.length;j++){
			write_key = write_key + json[i].key[j]+",";
		}
		write_key += '</p>';
		$("#key").html(write_key);
		//value
		
		var write_value = '<h4><p class="text-info">Value</p><p class="bg-warning">';
		for(j=0;j<json[i].value.length;j++){
			write_value +=json[i].value[j]+",";
		}
		write_value += '</p>';
		$("#value").html(write_value);
		
		//クエリと操作結果
		
		var j = 1;
		var write_query ='';
				
		while(typeof json[i].query['q'+j]!= "undefined"){
			var	 mod = (j-1) % 5; 
			var q = json[i].query['q'+j];
			var r = json[i].result['q'+j];
			
			write_query += '<h4><small>query'+
					j+'  </small>'+q+'</h4>';
			//$("#q_r").append("query:"+q+"<br>");
			
			write_query += '<p class="bg-'+coler[mod]+'">';
			for(var l in r){
				write_query += 'query'+
				l+' : '+JSON.stringify(r[l])+'<br>';
			
				//	$("#q_r").append("result:"+JSON.stringify(r[l])+"<br>");
			}
			write_query += '</p>';
			
			j++;
		}
		
		$("#q_r").html(write_query);
		

	}
	

	//----------
	//ボタンの作成
	//----------
	
	function makeButton(i,l){
		var write_html = '';
		//戻るボタン
		if(i > 0){
			write_html = write_html + '<input type="button" value="Prev" id="b_prev" class="btn-default btn-lg pull-left">';
		}
		//進むボタン
		if(i < l-1)			
		{
			write_html = write_html + '<input type="button" value="Next" id="b_next" class="btn-success btn-lg pull-right" >';
		}		
		$('div#button').html(write_html);		
	}
	
	//戻るボタンの処理
	$(document).on('click','#b_prev',function(){
		var i = document.getElementById('q_num').value;
		i--;
		document.getElementById('q_num').value = i;
		getQuestion(i,json_file);
	});
	
	//進むボタンの処理
	$(document).on('click','#b_next',function(){
		var i = document.getElementById('q_num').value;
		i++;
		document.getElementById('q_num').value = i;
		getQuestion(i,json_file);
	});	
	


//--------------------------	
//add queryボタンを押した場合の処理	
//--------------------------	
	

	$(document).on('click','.btn_q_add',function(){
		//クエリ入力欄を追加
			//クエリの長さを取得
		
			var len_list=$("#query").children('li').length;
	
			var prev = len_list-1;
			var new_list='<li><input type="text" id="query_'+len_list+'" name="query_'+len_list+'" class="form-control"></li>';
			$("#query").append(new_list);
		
		//削除ボタンを一旦全消去し、配置しなおす
			$("#query").find('input[type="button"]').remove();		
			len_list++;
			for(var i=0; i<len_list; i++){
				var new_btn='<input type="button" value="delete"  id="q_del" class="btn-danger btn-xs pull-right"  >';
				$("#query").find('li:eq('+i+')').append(new_btn);
			};	
	});

//--------------------------	
//query　削除ボタンを押した場合の処理	
//--------------------------	
	$(document).on('click','.query_list input[type="button"]',function(ev){

			
		var doc_input=$(ev.target).parent().index();
		
		$("#query").find('li:eq('+doc_input+')').remove();
		//入力欄がひとつならば削除ボタンは消去
		var len_list=$("#query").children('li').length;
		if(len_list==1)$("#query").find('input[type="button"]').remove();	
		//入力欄の番号を振りなおす
		for(var i=0; i<len_list; i++){
			$("#query").find('li:eq('+i+')').attr('name',"query_"+i);	
			$("#query").find('li:eq('+j+')').attr('id',"query_"+j);	
		}
		
	});	



	
	
});




/*-------------関数-----------------*/



//Formのチェック
function chkForm(frm){


	var flag = 0 ; //True or False　判定用
	var error_ms = '';


	//-- 解答のコレクション名を配列に保存	
	var col_name = new Array();//コレクション名
	var i = 0;
	while((document.getElementById("collection_list_"+i) != null )&&(document.getElementById("collection_list_"+i).value.match(/\S/g)))
	{
		col_name[i] = document.getElementById("collection_list_"+i).value;
		i++;		
	}

	//複数クエリのセット
	var j = 0;
	var write_query ='';
	var q_col_name = new Array();//解答のコレクション名
	while((document.getElementById("query_"+j) != null )&&(document.getElementById("query_"+j).value.match(/\S/g))){
		
		var s = document.getElementById("query_"+j).value;
		var r = s.indexOf(".");

		var c_name = s.slice(0,r);
		var query = s.slice(r+1);

		//比較ようの配列に保存
		q_col_name[j] = c_name ;//解答のコレクション名
		
		var new_col='<input type="hidden" id="q_query_col_'+j+'" name="q_query_col_'+j+'" value="'+c_name+'">';
		var new_query='<input type="hidden" id="q_query_'+j+'" name="q_query_'+j+'" value='+query+'>';
		write_query = write_query+new_col+new_query;
		
		j++;
	}
	$("div#q_query").html(write_query);

	//コレクション数の比較
	if(col_name.length != q_col_name.length){
		flag++;
		error_ms += '<p>コレクション数が正しくありません</p>';
	}

	
	//コレクション名の比較
	for(i=0;i<q_col_name.length;i++){
		//比較に使う変数compCnameの初期化
		var compCname=0;
		for(j=0;j<col_name.length;j++){
			if(q_col_name[i] == col_name[j])compCname++;				
		}
		
		//コレクション名が存在するかどうかチェック
		if(compCname==0){
			flag++;
			error_ms += '<p>コレクション'+q_col_name[i]+'が必要です</p>';
		}else if(compCname > 1){
			flag++;
			error_ms += '<p>コレクション'+q_col_name[i]+'が2つ以上あります．1つにまとめてください</p>';
		}		
	}
	

	//ドキュメントがJSON形式かどうかの判定
    
	for(i=0;i<col_name.length;i++){
		var j=0;
		while((document.getElementById("document_"+i+"_"+j) != null )&&(document.getElementById("document_"+i+"_"+j).value.match(/\S/g)))
		{
			var doc = document.getElementById("document_"+i+"_"+j).value;
			try{		 				
				var jdoc = JSON.parse(doc);// 解答の入力文字列をJSONオブジェクトに変換
				 if((typeof jdoc == 'object') && (jdoc instanceof Array)){
					error_ms += '<p>"'+doc+'"は配列です.不正なドキュメント形式です</p>';
					flag++;
				 }
			}catch(e){//エラーをフィードバック表示
				error_ms += '<p>"'+doc+'"は不正なドキュメント形式です</p>';
				flag++;
			};
			j++;		
		}
		
		if(j==0){//ドキュメントが空
			error_ms += '<p>'+col_name[i]+'にドキュメントが記述されていません</p>';
			flag++;
		}
		
		
	}

	if(flag > 0){
		alert("F="+flag);
		$('div#error').html(error_ms);
		return false;	
	}else{

		alert("T");
		$('div#error').html('');
		return true;
	}
}	
	