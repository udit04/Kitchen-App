var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.use('/views', express.static(__dirname + '/public'));

var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

var connection = mysql.createConnection({
 host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b5837b0f1d3d06',
    password : '9d9ae3d5',
    database : 'heroku_db89e2842543609'
});

app.use(express.static(__dirname + '/js'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/vendor'));
app.use("/styles", express.static(__dirname + '/css'));

app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
  res.render('main.html');
});

app.get('/order', function(req, res) {
  //res.render('order.html');
  	res.render('order.html');
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

var settings = {
	app: app,
	connection: connection
}

require(__dirname + "/routes/api.js")(settings);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});