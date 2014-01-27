	/*
	 * Mongolian を使用
	 */
	var Mongolian = require("mongolian");

	//Create a server instanve default host and port
	var server = new Mongolian;

	//get database
	var db = server.db("sampleDB");

	//get some collections
	var test = db.collection("test");
	var posts = db.collection("posts");

	var querystring = require("querystring");
	
exports.insert = function(req,res){

	// 解答の入力文字列をJSONオブジェクトに変換
 	try{
		var data = JSON.parse(req.body.answer);	
		console.log("json=",data);
	}catch(e){
		console.error("parsing error",e);
		 res.render('main', {
			    comment: 'parsing error'
			  });
	}
	
	//コレクションにドキュメントを追加
	test.insert(data);
	
	/*
	 * 入力したドキュメントに対してクエリを実行
	 */
	
	//コレクションからカーソルオブジェクトを取得
	var q = "test.find({'a':1})";
	var cursor = eval(q);
	//JSONファイルから実行
	//$.getJSON('/question/question.json',function(json){
	//	var q = json[0].query;
	//	var cursor = eval(q);

	//});
	/*
	.fail(function(jqXHR,textStatus,errorThrown){
		console.error("error"+textStatus);
	});
	*/
	
	//var cursor = test.find({"a":1});
	
	//カーソルをすべて表示
	cursor.forEach(function(doc){
		console.log(doc);
	});
	
	
	var tmp = 'console.log("abc");';
		eval(tmp);
	//res.end();
		//mainに戻る。
		res.redirect('/main');
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

exports.lucky = function(req, res){
	
	  
	    	// 入力されたデータを取得する
             
             var query = req.body;
             var luckyNumber = query.day % 10;
             console.log(query.day);
             /*
             
             req.on("end", function () {
                     // 取得したデータを整形する
                     var query = querystring.parse(req.data);
                     /* queryの中身は・・・
                     {
                             year: "2000",
                             month: "12",
                             day: "24"
                     }
                     

                     // ラッキーナンバーを計算する(生年月日の日の一桁！いんちき？)
                     var luckyNumber = query.day % 10;

                     /*
                     var resultHtml = '\
                             <body>\
                                     <div>\
                                             あなたのラッキーナンバーは... <em style="font-size: 30px">' + luckyNumber + '</em> です！\
                                     </div>\
                             </body>\
                     ';

                     // 結果を表示する
                     res.writeHead(200, setting.HEADER);
                     res.write(HTML_HEAD);
                     res.write(resultHtml);
                     res.write(HTML_FOOTER);
                     res.end();
                     
                    // res.render('index', { title: 'Entry List', items: 'NULL', number:luckyNumber});
                     res.redirect('/');
             });
             */
             res.render('index', { title: 'Entry List',  number:luckyNumber});   
       //      res.redirect('/');
             return ;
	    
	   
	};