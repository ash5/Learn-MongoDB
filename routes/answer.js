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

	
	//decide collection_name
	var col1_name = "test";
	var col2_name = "posts";
		
	//get some collections
	var col1 = db.collection(col1_name);
	var col2 = db.collection(col2_name);
	
		
	console.log("q=",req.body);
	
	
	try{
	console.log("query=",req.body.q_query);
	}catch(e){console.log("ERROR!!!");}
	
	// 解答の入力文字列をJSONオブジェクトに変換
 	try{
		var data = JSON.parse(req.body.answer);	
		console.log("json=",data);
	}catch(e){//エラーをフィードバック表示
		console.error("parsing error",e);
		 res.render('comment', {
			    comment: 'parsing error'
			  });
	}
	
	//コレクションにドキュメントを追加
	col1.insert(data);
	
	/*
	 * 入力したドキュメントに対してクエリを実行
	 */
	
	//コレクションからカーソルオブジェクトを取得
	//クエリの代入
	var q = "col1."+req.body.q_query;
	console.log("query==",q);

//	try{
		var cursor = eval(q);	
/*		
	}catch(e){
		console.error("eval error",e);
		 res.render('main', {
			    comment: 'eval error'
			  });
	}
*/	
		
	//var tmp = col1.find(req.body.q_result);
	var tmp = "col1.find({"+req.body.q_result+"})";
	 tmp = eval(tmp);
	tmp.forEach(function(doc){
		console.log("tmp=",doc);
		
	});		
		//カーソルをすべて表示
		cursor.forEach(function(doc){
			console.log("doc=",doc._id);
			
			var tmp = "col1.find({"+req.body.q_result+","+"\"_id\""+":"+doc._id+"})";
	     
			console.log("t=",tmp);
			tmp = eval(tmp);
			/*
			try{
			col1.find(q_)	
			}catch(e){console.log("ERROR!");}
			*/
		});
		
	//フィードバックを表示。
	res.render('comment', {
    comment: 'Finish!'
	});
};


var model = require('./model');
var Post = model.Post;

var querystring = require("querystring");


exports.index = function(req, res){
  Post.find({}, function(err, items){
      res.render('index', { title: 'Entry List', items: items, number:'NULL'});
    });
};

exports.form = function(req, res){
  res.render('form', { title: 'New Entry' });
};

exports.create = function(req, res){
  var newPost = new Post(req.body);
  newPost.save(function(err){
     if (err) {
       console.log(err);
       res.redirect('back');
     } else {
       res.redirect('/');
     }
    });
};
