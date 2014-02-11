	var querystring = require("querystring");
	
	/*JSONDiffPatchを使用*/
	var jsondiffpatch = require("jsondiffpatch");
		//設定?
		jsondiffpatch.config.objectHash = function(obj){
			return  obj.id || JSON.stringify(obj);
		};
	
exports.insert = function(req,res){
	//----Mongorian----------------	
	var Mongolian = require("mongolian");

	//Create a server instanve default host and port
	var server = new Mongolian;

	//get database
	var db = server.db("createDB");
//----------------------------------------
	var data = req.body;

	//--　変数の冠詞
	var prefix_c = "collection_list_";
	var prefix_d = "document_";
	var p_q_c = "q_query_col_";
	var p_q = "q_query_";
	
	//-- Collection の設定	
	var col_name = new Array();//コレクション名
	var col = new Array(); //コレクション
	
	var i = 0;
	while(typeof data[prefix_c+i]!= "undefined" && data[prefix_c+i] != '')
	{
		col_name[i] = data[prefix_c+i];
		col[i] = db.collection(col_name[i]);
		i++;		
	}
	
	//-- ドキュメントの取り出し
	var doc = new Array();
	for(i=0;i<col_name.length;i++){
		var j=0;
		var doc_tmp = new Array();
		while(typeof data[prefix_d+i+'_'+j]!= "undefined" && data[prefix_d+i+'_'+j] != '')
		{					
			doc_tmp[j]=data[prefix_d+i+'_'+j];
			j++;		
		}
		doc[i]=doc_tmp;
	}
	
	

	//--コレクションに解答のデータモデルを保存
	for(i=0;i<col_name.length;i++){
		for (j=0; j<doc[i].length;j++){
			
			try{		 				
				var d = JSON.parse(doc[i][j]);// 解答の入力文字列をJSONオブジェクトに変換
				col[i].insert(d); //コレクションにドキュメントを追加
			}catch(e){//エラーをフィードバック表示
				 res.render('comment', {
					    comment: 'parsing error',
					    feedback:''
					  });
			};
		}
	} 
 
	//-----------解答のクエリに関する設定

	//コレクション名とクエリの保存
	var q_col_name = new Array();//解答のコレクション名
	var q_col = new Array(); //解答のコレクション
	var query = new Array(); //解答のクエリ
	
	var i = 0;			//※今回は0から
	while(typeof data[p_q_c+i]!= "undefined")
	{
		q_col_name[i] = data[p_q_c+i];				//コレクション名
		q_col[i] = db.collection(q_col_name[i]);	//コレクション
		query[i] = data[p_q+i];							//クエリ
		i++;	
		
	}
	
	//結果のクエリ保存用の配列
	var q_result = new Array();
	for(i=0;i<query.length;i++){
	 q_result[i]= new Array();
	}
	//クエリの実行
	
	function execQuery(){
		
		for(i=0;i<query.length;i++){
			var tmp = "q_col["+i+"]."+query[i];
			try{
				var cursor = eval(tmp);			
			}catch(e){
				 res.render('comment', {
					    comment: 'query error',
					    	feedback:''
					  });
			}
	
			//--------
			//操作結果の取得

			//--------
	

			compCur(i);
			
			function compCur(i){
			
				//要素数の確認　c = カーソルの数　cur_num　= 配列に格納した値
				var c = 0 ;
				var cur_num = 0;
				cursor.count(function(err,count){
					c = count;
					});
							
				cursor.forEach(function(cur){
					
						delete cur._id; //比較に不要な_idの除去　
						q_result[i][cur_num] = JSON.stringify(cur);
						cur_num++;
						
					//すべてのチェックが完了したらフィードバック
					if((i+1)==query.length&&cur_num==c){
						createQuestion();
						//			checkResult();
					}
				});
			};	
		};		

	};
	

	
	//---問題の作成
	function createQuestion(){
		
		//----文字列保存用
		var q_id = '';
   		var sentence = '';
		var key = new Array();
		var value = new Array();
		var query = '';
		var model_answer = new Array();
		var result = '';
		var feedback = '';
			
		
		//問題番号
		q_id = '"q_id" : '+data.q_id;
	
		//問題文
		sentence = '"sentence" : "'+data.q_sentence.replace(/"/g,'\\"')+'"';
		
		//key と　value
		for(i=0;i<col_name.length;i++){
			for (j=0; j<doc[i].length;j++){
				
			tmp = makeKV(JSON.parse(doc[i][j]),key,value);
			key = tmp.key;
			value = tmp.value;
			}
		}
		
		key = '"key" : '+'['+key+']';
		value = '"value" : '+'['+value+']';
		
		//クエリ
		query = '"query" : {';
		for(i=0;i<q_col.length;i++){
			var tmp_q = data['query_'+i].replace(/"/g,'\\"');
			query += '"q'+(i+1)+'" : "'+tmp_q+'",';
		}
		query = query.slice(0,-1);
		query += '}'; 
		
		//模範解答
		model_answer = '"model_answer" : [';
		
		for(i=0;i<col_name.length;i++){
			model_answer += '{"collection":"'+col_name[i]+'","document":[';
			for (j=0; j<doc[i].length;j++){
				model_answer += doc[i][j]+',';
			};
			model_answer = model_answer.slice(0,-1);
			model_answer += ']},';
		} 
		model_answer = model_answer.slice(0,-1);
		model_answer += ']';
	
		
		//結果
		result = '"result" : {';
		for(i=0;i<q_col.length;i++){
		//	var tmp_q = data['query_'+i].replace(/"/g,'\\"');
			result += '"q'+(i+1)+'" : [';
			for(j=0;j<q_result[i].length;j++){
				result += q_result[i][j]+',';
			}
			result = result.slice(0,-1);
			result += '],';
		}
		
		result = result.slice(0,-1);
		result += '}';
		
		
		
		
		//フィードバック
		feedback = '"feedback" : "'+data.q_feedback.replace(/"/g,'\\"')+'"';
		
			
		res.render('setumon', {
		   result: '{'+q_id+',<br>'+
		   				sentence+',<br>'+
		   				key+',<br>'+
		   				value+',<br>'+
		   				query+',<br>'+
		   				model_answer+',<br>'+
		   				result+',<br>'+
		   				feedback+'}'
		   	});
	
	//--createQUestion内の関数
		//--Key と　Value 求める関数
		function makeKV(s,k,v){  

			//ヒントのKVを求める
			  function getKV(txt){  
			  	    //array
			  	    if((typeof txt == 'object') && (txt instanceof Array)){
			  	      for(var i = 0; i < txt.length; i++){
			  	    	  getKV(txt[i]);
			  	       }		    
			  	      //object
			  	    }else if((typeof txt == 'object')){
			  	      for(var i in txt){
			  	    	  
			  	    	  var tmp = 0 ;
			  	    	  var comp_i='"'+i+'"';
			  	    	  //重複が無ければ書き込む
			  	    	  k.forEach(function(a){  
			  	    		 if(a==comp_i)tmp++;
			  	    	  });
			  	    	  if(tmp ==0){k.push('"'+i+'"');};
			  	    	  getKV(txt[i]);
			  	      }		   
			  	    }else{
			  	    	if(typeof txt == 'string'){txt='"'+txt+'"';}			  	    	
			  	      var tmp = 0 ;
		  	    	  //重複が無ければ書き込む
		  	    	 v.forEach(function(a){  
		  	    		 if(a==txt)tmp++;
		  	    	  });
		  	    	  if(tmp ==0)v.push(txt);
			  	    };
			  }  
			  getKV(s);
			  return {key : k, value:v };	  
			};

	}
	
	
	//--クエリの実行
	execQuery();
	
	//--使用したコレクションを空にする
	
	for(i=0;i<col_name.length;i++){
		col[i].remove();		
	}
	
	
	
};


