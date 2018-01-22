var express = require('express');
var app = express();
//const redis = require('redis');
var parseJSON = require('json-parse-async');

//const client = redis.createClient("6379"); //hardcoded value of port - original from config file

var bodyParser = require('body-parser')
app.set('port', (process.env.PORT || 5000));
var mysql = require('mysql');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var connectionPool  = mysql.createPool({ //sample config of mysql
    connectionLimit : 5,
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b5837b0f1d3d06',
    password : '9d9ae3d5',
    database : 'heroku_db89e2842543609'
});

app.use('/public', express.static(__dirname + '/build'));
app.use('/public', express.static(__dirname + '/js'));
app.use('/public', express.static(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/vendor'));




// app.use(express.static(__dirname + '/js'));
// //Store all HTML files in view folder.
// app.use(express.static(__dirname + '/views'));
// app.use(express.static(__dirname + '/vendor'));

app.engine('html', require('ejs').renderFile);

//main entry point for first page
/*app.get('/', function(req, res) {
  var baseUrl = req.get('host');
  res.render('main.html',{ baseUrl: baseUrl });
});

// entry point for inserting product and placing orders page
app.get('/order', function(req, res) {
    var baseUrl = req.get('host');
  	res.render('order.html',{ baseUrl: baseUrl });
  	//var sqlQuery = "truncate faasoskitchenorders";
  	//var sqlQuery = "CREATE TABLE FaasosKitchen (ProductID bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY, ProductName VARCHAR(250), CreatedTillNow smallint, Predicted smallint)";
  	// var sqlQuery = "CREATE TABLE FaasosKitchenOrders (OrderID bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,ProductID bigint(20) unsigned not null,Quantity smallint)"
  	// connection.query(sqlQuery, function(err, result) {
   //    if (err) throw err;

   //    else{
   //    	res.send('Table created');	
   //    }    
   //  });
});*/

// app.get(/^^\/(order|main)\//, function(req, res) {
//   var baseUrl = req.get('host');
//   res.render('ordermain.html',{ baseUrl: baseUrl });
// });
app.get('/order', function(req, res) {
  var baseUrl = req.get('host');
  res.render('ordermain.html',{ baseUrl: baseUrl });
});

app.get('/', function(req, res) {
  var baseUrl = req.get('host');
  res.render('ordermain.html',{ baseUrl: baseUrl });
});


// cache middleware - it serves for fetch requests and returns data if key matches and also has data else process moves on to next middleware.

function cache(req, res, next) {
    if(req.query.type == "new"){
      next();
    }
    else{
      var url = req.originalUrl;
      if(url =="/fetch/products")
        var key = "products_fetch"; //hardcoded
      else if(url == "/fetch/orders")
        var key = "orders_fetch"; //hardcoded
      client.get(key, function (err, data) {
          if (err) throw err;

          if (data != null) {
            //var data  = JSON.parse(data);
            parseJSON(data, function(err, content) {
              res.json({
                data: content,
                status:"success",
                message : "product fetched successfully"
              })
              return;
            });
            
            
          } else {
              next();
          }
      });
    }   
}


// all config and settings being passed in required files
var settings = {
	app: app,
  connectionPool: connectionPool
  //,
  //cache: cache,
  //client: client
}

require(__dirname + "/routes/api.js")(settings);

app.listen(app.get('port'), function() {
  console.log('Faasos Kitchen app is running on port', app.get('port'));
});