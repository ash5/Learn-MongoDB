

var querystring = require("querystring");


exports.index = function(req, res){
 
      res.render('index', { title: 'Learn MongoDB' });
  
};

