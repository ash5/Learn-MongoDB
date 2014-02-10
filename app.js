
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');//./routes/index.js の省略 

var http = require('http');
var path = require('path');
var fs = require('fs');
var util = require('util');

//解答入力の処理

var app = express();


var querystring = require("querystring");

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.bodyParser()); 


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);

//Mainページ用
var debug = require('./routes/debug');
app.post('/debug',debug.insert);

//Mainページ
app.get('/main',function(req,res){
	  res.render('main', {

		  });
});

//feedbackコメント
app.get('/comment',function(req,res){
	res.render('comment', {
    comment: '',
    feedback:''
    	
    	});
});


//問題作成ページ用
var check = require('./routes/check');
app.post('/check',check.insert);

//問題作成ページ
app.get('/create',function(req,res){
	  res.render('create', { });
});

//feedbackコメント
app.get('/setumon',function(req,res){
	res.render('setumon', {
		  result : '',
    	});
});



var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
