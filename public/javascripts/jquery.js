$(function(){
	


//--------------------------
//Startボタンを押した際の動作	
//--------------------------
	$("#start").click({id:1},getQuestion);
	function getQuestion(q){
	
		var json_file = '/question/question.json';
		var i = q.data.id;
	
		$.getJSON(json_file,function(json){
			//textはテキスト部分の書き換え
			$("#mondai").text("問題"+json[i].q_id+"は"+json[i].sentence+"\r\n");

			//q_idtなどのセット
			document.getElementById('q_id').value = json[i].q_id;
			document.getElementById('q_result').value = json[i].result;
			document.getElementById('q_query').value = json[i].query;

		});
	}
	
//--------------------------	
//Testボタンを押した時の動作	
//--------------------------
	$("#test_button").click(function (){

		$.getJSON('/question/question.json',function(json){

		var answer = json[0].model_answer;
	    var str_tmp="";
		
		str_work=MakeHint(answer,5);
//		str_tmp=trace(answer);
			//指定した要素のHTMLに指定値をセットする．
			$("#test").html(str_work);					
		});//getJSON end		
		
	});
	

//--------------------------	
//add documentボタンを押した場合の処理	
//--------------------------	
	
	var prefix_d='document_';
	$(document).on('click','.btn_d_add',function(){
		//ドキュメント入力欄を追加
			//ドキュメントの長さを取得
			var btn_id = $(this).attr('id');	//ボタンのID
			var id_num = btn_id.slice(6);		//"btn_d_"=6
			var id = "document_"+id_num;		//ドキュメントのID
			var len_list=$("#"+id).children('li').length;
			
			var new_list='<li><input type="text" name='+id+'_'+len_list+'></li>';
			$("#"+id).append(new_list);
		
		//削除ボタンを一旦全消去し、配置しなおす
			$("#"+id).find('input[type="button"]').remove();		
			len_list++;
			for(var i=0; i<len_list; i++){
				var new_btn='<input type="button" value="削除" id=d_del_'+id_num+'>';
				$("#"+id).find('li:eq('+i+')').append(new_btn);
			};	
	});

//--------------------------	
//ドキュメント　削除ボタンを押した場合の処理	
//--------------------------	
	$(document).on('click','.document_list input[type="button"]',function(ev){
		//ドキュメント入力欄を削除
		//ドキュメントの長さを取得
		var btn_id = $(this).attr('id');	//ボタンのID
		var id_num = btn_id.slice(6);		//"d_del_"=6
		var id = "document_"+id_num;		//ドキュメントのID
			
		var doc_input=$(ev.target).parent().index();
		
		$("#"+id).find('li:eq('+doc_input+')').remove();
		//入力欄がひとつならば削除ボタンは消去
		var len_list=$("#"+id).children('li').length;
		if(len_list==1)$("#"+id).find('input[type="button"]').remove();	
		//入力欄の番号を振りなおす
		for(var i=0; i<len_list; i++){
			$("#"+id).find('li:eq('+i+') input[type="text"]').attr('name',id+"_"+i);	
		}
		
	});	


//--------------------------	
//add collectionボタンを押した場合の処理	
//--------------------------	
	
	var prefix_c='collection_list_';
	var prefix_b='btn_d_';
	$("#btn_c_add").click(function(){
		
		//コレクション入力欄を追加 
		var len_list=$('#collection_list>li').length / 2;
		
		var new_list='<li><hr><input type="text" id='+prefix_c+len_list+' name='+prefix_c+len_list+'></li>';
		var new_list=new_list +'<li><br>ドキュメント	<input type="button" value="add document" id='+prefix_b+len_list+' class="btn_d_add"><br><ul id='+prefix_d+len_list+' class="document_list"><li><input type="text" name='+prefix_d+len_list+'_0></li></ul>';
		$('#collection_list').append(new_list);

		ResetCdel();
	});	

//--------------------------	
//コレクション　削除ボタンを押した場合の処理	
//--------------------------
	
	$(document).on('click','.c_del',function(ev){
	
	    var res = confirm("コレクションを削除しますか?");
	    
	    if(res == true){
	    	
	    var btn_id = $(this).attr('id');	//ボタンのID
	    var id_num = btn_id.slice(6);		//"c_del_"=6
	    var c_id = id_num*2;
	    var d_id = c_id+1;
	    
	    var id = prefix_c+id_num;

	    //コレクションとドキュメント削除
	    $('#collection_list>li:eq('+d_id+')').remove();
	    $('#collection_list>li:eq('+c_id+')').remove();
	    
	    //入力欄がひとつならば削除ボタンは消去
	    var len_list=$('#collection_list>li').length / 2;
	    if(len_list==1)
	    	{$('#collection_list .c_del').remove();}
	    else{//削除ボタンの再割り当て
	    	ResetCdel();
	    }
	 
	    //コレクション番号,ドキュメント番号の振り直し
	    for(var i=parseInt(id_num); i<len_list; i++){
	    	
	    	var t=parseInt(i)+1;
	    	
	    	$("#"+prefix_c+t).attr({'name':prefix_c+i,'id':prefix_c+i});//コレクション
	    	$("#"+prefix_d+t).attr({'id':prefix_d+i});//ドキュメント
	    	$("#"+prefix_b+t).attr({'id':prefix_b+i});//ボタン
	    	
	    	var id = prefix_d+i;		//ドキュメントのID
	    	var len_d_list=$("#"+id).children('li').length;
	    	//削除ボタンが存在するなら
	    	if(len_d_list!=1)$("#"+d_del+t).attr({'id':d_del+i});//ドキュメント削除ボタン
	    	
	   		//入力欄の番号を振りなおす
	   		for(var j=0; j<len_d_list; j++){
	    			$("#"+id).find('li:eq('+j+') input[type="text"]').attr('name',id+"_"+i);	
	   		}	   		
	    }
	    
	    }else{//何もしない
	    }
	    
	
				
	});	

});






/*-------------関数-----------------*/

//削除ボタンを一旦全消去し、配置しなおす
function ResetCdel(){

	$('#collection_list .c_del').remove();
	var len_list=$('#collection_list>li').length / 2;
	len_list++;
	for(var i=0; i<len_list; i++){
		var new_btn='<input type="button" value="削除" class="c_del" id=c_del_'+i+'>';
		$('#collection_list>li:eq('+i*2+')').append(new_btn);
	}
};



//ヒントを作る
function MakeHint(s,h){
	  mylog = [];
	  var hint = h;//ヒントレベル
	  var last = 0;	  

	  //ヒントレベルの最大値を求める
	  function getLast(txt, LastLebel){
		    var cnt = LastLebel;		    
		    //array
		    if((typeof txt == 'object') && (txt instanceof Array)){
		      cnt++;
		      if(last < cnt)last=cnt;
		      for(var i = 0; i < txt.length; i++){
		    	  cnt++;
			      if(last < cnt)last=cnt;
		    	  getLast(txt[i], cnt);
		    	  cnt--;
		       }		    
		      //object
		    }else if((typeof txt == 'object')){
		      cnt++;
		      if(last < cnt)last=cnt;
		      for(var i in txt){
		    	  cnt++;
			      if(last < cnt)last=cnt;
		    	  getLast(txt[i], cnt);
		    	  cnt--;
		      }		   
		    }	
		    return last;
	  }  
	  
	  /*ヒントの作成*/
	  //インデントの計算
	  function getIndent(num){
	    var ind = [];
	    while(num){
	      ind.push('  ');
	      num--;
	    }
	    return ind.join('');
	  }
	  
	  //出力用にプッシュ
	  function pushLog(num,str){
		  if(hint >= num)mylog.push(str);
		  return;
	  }
	  
	  //再帰
	  function addLog(txt, defaultIndent, HintLebel){
	    var indent = defaultIndent;
	    var cnt = HintLebel;
	
	    //array
	    if((typeof txt == 'object') && (txt instanceof Array)){
	      indent++;
	      cnt++;
	      pushLog(cnt,'[');
	      for(var i = 0; i < txt.length; i++){
	        mylog.push('\r\n' + getIndent(indent));
	        cnt++;
	        addLog(txt[i], indent, cnt);
	        if(i != txt.length - 1){
	        	pushLog(cnt,',');
	         }
	        cnt--;
	      }
	      mylog.push('\r\n' + getIndent(indent - 1) );
	      pushLog(cnt,']');
	    //object
	    }else if((typeof txt == 'object')){
	      indent++;
	      cnt++;
	      pushLog(cnt,'{');
	      for(var i in txt){
	        mylog.push('\r\n' + getIndent(indent));
	        pushLog(last,'"'+i+'"');//最終ヒント
	        cnt++;
	        pushLog(cnt,':');
	        addLog(txt[i], indent, cnt);
	        pushLog(cnt,',');	 
	        cnt--;
	      }
	      mylog.pop();
	      mylog.push('\r\n' + getIndent(indent - 1) );
	      pushLog(cnt,'}');
	    }else{
	      //mylog.push(txt);
	    }
	  }
	  
	  last = getLast(s,0)+1; //ヒントの最大レベル
	  mylog.push("Last="+last+"\n");//確認用
	  addLog(s, 0, 0);//ヒント作成
	  return mylog.join('');	  
	};


//デバッグ用.トレース結果を出力
function trace(s){
	  mylog = [];
	  
	  function getIndent(num){
	    var ind = [];
	    while(num){
	      ind.push('  ');
	      num--;
	    }
	    return ind.join('');
	  }
	  function addLog(txt, defaultIndent){
	    var cnt = defaultIndent;
	    //array
	    if((typeof txt == 'object') && (txt instanceof Array)){
	      cnt++;
	      mylog.push('[');
	      for(var i = 0; i < txt.length; i++){
	        mylog.push('\r\n' + getIndent(cnt));
	        addLog(txt[i], cnt);
	        if(i != txt.length - 1){
	          mylog.push(',');
	        }
	      }
	      mylog.push('\r\n' + getIndent(cnt - 1) + ']');
	    //object
	    }else if((typeof txt == 'object')){
	      cnt++;
	      mylog.push('{');
	      for(var i in txt){
	        mylog.push('\r\n' + getIndent(cnt) + i + ':');
	        addLog(txt[i], cnt);
	        mylog.push(',');
	      }
	      mylog.pop();
	      mylog.push('\r\n' + getIndent(cnt - 1) + '}');
	    }else{
	      mylog.push(txt);
	    }
	  }
	
	  addLog(s, 0);
	  return mylog.join('');	  
	};

