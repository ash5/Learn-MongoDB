	/*
	 * Mongolian を使用
	 */
	var Mongolian = require("mongolian");

	//Create a server instanve default host and port
	var server = new Mongolian;

	//get database
	var db = server.db("sampleDB");

	var querystring = require("querystring");
	
exports.insert = function(req,res){
	
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
	
	
	//デバッグ用--------------------
	for (i=0; i<col_name.length;i++){
		for (j = 0; j<doc[i].length;j++){
			console.log("doc["+i+"]["+j+"]="+doc[i][j]);
		} 
			
	}
	
	console.log("i="+i);

	console.log("length="+col_name.length);
	
	for (j = 0; j<i;j++){
		console.log("c="+col_name[j]);
	} 
	//-------------------------------
		

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
					    comment: 'parsing error'
					  });
			};
		}
	} 

	
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
	
	//クエリの実行
	for(i=0;i<query.length;i++){
		
		var tmp = "q_col["+i+"]."+query[i];
		console.log("queryTMP==",tmp);
		var cursor = eval(tmp);
		
		console.log("query=="+query[i]+" col="+q_col[i]);		

		//カーソルをすべて表示
		cursor.forEach(function(cur){
			console.log("doc=",cur);
		});

	}

	//--使用したコレクションを空にする
	
	for(i=0;i<col_name.length;i++){
		col[i].remove();		
	}
	
	
	res.render('comment', {
	    comment: 'DEBUG END'
	  });
	
	
};
