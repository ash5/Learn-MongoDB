	var async = require("async");//async を使用
/*
	/*
	 * Mongolian を使用
	 */
	/*

	var Mongolian = require("mongolian");

	//Create a server instanve default host and port
	var server = new Mongolian;

	//get database
	var db = server.db("sampleDB");

*/
	var querystring = require("querystring");
	

	/*JSONDiffPatchを使用*/
	var jsondiffpatch = require("jsondiffpatch");
		//設定?
		jsondiffpatch.config.objectHash = function(obj){
			return  obj.id || JSON.stringify(obj);
			//
			//return obj.name;
		};
	
exports.insert = function(req,res){
//----Mongorian----------------	
	var Mongolian = require("mongolian");

	//Create a server instanve default host and port
	var server = new Mongolian;

	//get database
	var db = server.db("sampleDB");
//----------------------------------------
	
	var data = req.body;
	console.log("BODY=",req.body);

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
	
	

	//--コレクションに解答を保存
	for(i=0;i<col_name.length;i++){
		for (j=0; j<doc[i].length;j++){
			
			try{		 				
				var d = JSON.parse(doc[i][j]);// 解答の入力文字列をJSONオブジェクトに変換
				console.log("json=",doc[i][j]); //デバッグ
				col[i].insert(d); //コレクションにドキュメントを追加
				
			}catch(e){//エラーをフィードバック表示
				console.error("parsing error",e);
				 res.render('comment', {
					    comment: 'parsing error',
					    feedback:''
					  });
			};
		}
	} 

	 col[0].find().forEach(function(post){console.log("コレクション[0]に保存したドキュメント=",post);});
	//-----------解答のクエリに関する設定

	//コレクション名とクエリの保存
	var q_col_name = new Array();//解答のコレクション名
	var q_col = new Array(); //解答のコレクション
	var query = new Array(); //解答のクエリ
	
	var i = 1;			//※クエリなので1から
	while(typeof data[p_q_c+i]!= "undefined")
	{
		q_col_name[i-1] = data[p_q_c+i];				//コレクション名
		q_col[i-1] = db.collection(q_col_name[i-1]);	//コレクション
		query[i-1] = data[p_q+i];							//クエリ
		i++;		
	}
	
	//操作結果の分割
	
	var q_result = JSON.parse(data.q_result);
	console.log("操作結果の分割_q1の長さ"+q_result['q'+1].length);

	console.log("正誤判定結果配列初期化");
	//正誤判定結果記録用配列の初期化
	var c_length = query.length+1;
	var check = new Array(c_length);
	for (i=1; i <= query.length ; i++){
		
		check[i]=new Array(q_result['q'+i].length);
		for (j=0; j<q_result['q'+i].length; j++)check[i][j]=0;
	};
	//クエリの実行
	console.log("クエリの実行");
	function execQuery(){
		
		for(i=0;i<query.length;i++){
			var tmp = "q_col["+i+"]."+query[i];
			
			try{
				var cursor = eval(tmp);
			}catch(e){
				console.error("parsing error",e);
				 res.render('comment', {
					    comment: 'query error',
					    	feedback:''
					  });
			}
			
			//var cursor = eval(tmp);		
			var tmp_i = i+1;
			var q_length = q_result['q'+tmp_i].length;//結果の数
			
			console.log("問題"+tmp_i+"の結果の数は"+q_length);
			
			//--------
			//操作結果とカーソルの値を比較
	
			//q_result['q'+tmp_i][j]
			//--------
	
			compCur(tmp_i,q_length);

			function compCur(i,q_length){
			
				//要素数の確認
				var c = 0 ;
				var cur_num = 0;
				cursor.count(function(err,count){
					c = count;
					
					//カーソルが0である場合エラー
					if(c==0){
						console.log("CUR=0");
						res.render('comment', {
						    comment: '不正解です',
						    feedback:'query'+i+'の条件を満たすドキュメントが入力されていません'
						  });
					}
					console.log("!cn="+cur_num+"c="+c);
				});
				
				cursor.forEach(function(cur){
					cur_num++;
					console.log("数えた数="+cur_num+"カーソル数="+c);
					for(j=0;j<q_length;j++){
						console.log("i="+i+"j="+j); 
						console.log("hikaku="+JSON.stringify(q_result['q'+i][j])); 
						delete cur._id; //比較に不要な_idの除去　
						console.log("doc=",cur);
						
						var delta = jsondiffpatch.diff(cur,q_result['q'+i][j]);
						console.log("delta= "+JSON.stringify(delta));
	
						if(typeof delta == "undefined"){
						check[i][j]++;
						console.log("Check["+i+"]["+j+"]=="+check[i][j]);
						}else{
							console.log("notCheck["+i+"]["+j+"]");
						}
					};
					//すべてのチェックが完了したらフィードバック
					if(i==query.length&&j==q_result['q'+i].length&&cur_num==c){
						console.log("LAST=i="+i+"j="+j);
						checkResult();
					}else{console.log("STOP");};
					
				});
			};	
		};		

	};
	

	
	//---判定
	function checkResult(){
		
		var ALL = 0;
		for (i=1; i <= query.length ; i++){
			for (j=0; j<q_result['q'+i].length; j++){
				console.log("!!Check["+i+"]["+j+"]=="+check[i][j]);
				if(check[i][j] != 1)ALL++;
			};
		};
	
		if(ALL==0){
			console.log("Perfect");
			
			
			res.render('comment', {
			    comment: '正解です',
		    	feedback:data.q_feedback

			  });
	
		
		}else{
			console.log("NOT");
			res.render('comment', {
			    comment: '不正解です',
			    feedback:''
			  });
		}

	}
	

	//execQuery();
	
	
	//-------------
	execQuery();
	
	//--使用したコレクションを空にする
	
	for(i=0;i<col_name.length;i++){
		col[i].remove();		
	}
	

    var checkNext = '<input type="hidden" id="next_b"  value="1">';
	
	
};


