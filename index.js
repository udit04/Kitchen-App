var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.set('port', (process.env.PORT || 5000));
var mysql = require('mysql');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// sample config of mysql
// var connection = mysql.createConnection({
//     host : 'us-cdbr-iron-east-05.cleardb.net',
//     user : 'b5837b0f1d3d06',
//     password : '9d9ae3d5',
//     database : 'heroku_db89e2842543609'
// });

var connectionPool  = mysql.createPool({
    connectionLimit : 5,
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b5837b0f1d3d06',
    password : '9d9ae3d5',
    database : 'heroku_db89e2842543609'
});

app.use(express.static(__dirname + '/js'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/vendor'));

app.engine('html', require('ejs').renderFile);

//main entry point for first page
app.get('/', function(req, res) {
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
});

// all config and settings being passed in required files
var settings = {
	app: app,
	connectionPool: connectionPool
}

require(__dirname + "/routes/api.js")(settings);

app.listen(app.get('port'), function() {
  console.log('Faasos Kitchen app is running on port', app.get('port'));
});