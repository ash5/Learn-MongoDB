
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');//./routes/index.js の省略 
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//解答入力の処理
var answer = require('./routes/answer');
var mongo = require('./routes/mongo');

var app = express();

var fs = require('fs');
var util = require('util');

/*占いようモジュール*/
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
app.get('/users', user.list);

app.get('/form', routes.form);
app.post('/create', routes.create);

app.post('/lucky',routes.lucky);

app.post('/answer',answer.insert);
app.post('/mongo',mongo.insert);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
