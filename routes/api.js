module.exports = function(settings){
	
	var app = settings.app;
	var connectionPool = settings.connectionPool;
	var cache = settings.cache;
	var client = settings.client;
	/*
		@apiName - insert/product
		@params -> pName - product name
		@params -> pValue - product predcited value
		@success - string "success"
		@fail - string "fail"
	*/
	app.post("/insert/product",function(req,res){
		var pName = req.body.pName || null;
		var pValue = req.body.pValue || null;

		if(!pName || !pValue){
			res.json({
				status:"fail",
				message : "missing params"
			})
			return;
		}
		connectionPool.getConnection(function(err, connection) {
			if(err){
				res.json({
					status:"fail",
					message : "some server error occured"
				})
				return;
			}
			connection.query('insert into faasoskitchen (ProductName,Predicted) values (?,?)', [pName,pValue], function(err, result) {
				connection.release();
				if(err){
					res.json({
						status:"fail",
						message : "some server error occured"
					})
					return;
				}
				res.json({
					status:"success",
					message : "product inserted successfully"
				})
				return;    
		    })
		});	
	})

	/*
		@apiName - fetch/products
		@success - string "success" with data
		@fail - string "fail"
	*/
	app.get("/fetch/products",cache,function(req,res){
		connectionPool.getConnection(function(err, connection) {
			if(err){
				res.json({
					status:"fail",
					message : "some server error occured"
				})
				return;
			}
			connection.query('select * from faasoskitchen', function(err, rows, fields) {
				connection.release();
				if(err){
					res.json({
						status:"fail",
						message : "some server error occured"
					})
					return;
				}
				if(rows.length<1){
					res.json({
						status:"fail",
						message : "no records found"
					})
					return;
				}
				var data = [];
				rows.forEach(function(row){
					data.push(row)
				})
				client.setex("products_fetch", 15, JSON.stringify(data));

				res.json({
					data: data,
					status:"success",
					message : "product fetched successfully"
				})
				return;    
		    })
		});	
	})

	/*
		@apiName - place-order
		@params -> pID - product ID
		@params -> pQty - product quantity
		@success - string "success"
		@fail - string "fail"
	*/
	app.post("/place-order",function(req,res){
		var pID = req.body.pID || null;
		var pQty = req.body.pQty || null;

		if(!pID || !pQty){
			res.json({
				status:"fail",
				message : "missing params"
			})
			return;
		}
		connectionPool.getConnection(function(err, connection) {
			if(err){
				res.json({
					status:"fail",
					message : "some server error occured"
				})
				return;
			}
			connection.query('insert into FaasosKitchenOrders (ProductID,Quantity) values (?,?)', [pID,pQty], function(err, result) {
				connection.release();
				if(err){
					res.json({
						status:"fail",
						message : "some server error occured"
					})
					return;
				}
				res.json({
					status:"success",
					message : "order placed successfully"
				})
				return;    
		    })
		});	
	})

	/*
		@apiName - /fetch/orders
		@success - string "success" with data
		@fail - string "fail"
	*/
	app.get("/fetch/orders",cache,function(req,res){
		connectionPool.getConnection(function(err, connection) {
			if(err){
				res.json({
					status:"fail",
					message : "some server error occured"
				})
				return;
			}
			connection.query('select * from faasoskitchen fk inner join faasoskitchenorders fko on fk.ProductID = fko.ProductID', function(err, rows, fields) {
				connection.release();
				if(err){
					res.json({
						status:"fail",
						message : "some server error occured"
					})
					return;
				}
				if(rows.length<1){
					res.json({
						status:"fail",
						message : "no records found"
					})
					return;
				}
				var data = [];
				rows.forEach(function(row){
					data.push(row)
				})
				client.setex("orders_fetch", 5, JSON.stringify(data));
				res.json({
					data: data,
					status:"success",
					message : "product fetched successfully"
				})
				return;    
		    })
		});
	})

	/*
		@apiName - /confirm-order
		@params -> orderID - Order Number
		@params -> createdTillNow - No of products created till now
		@success - string "success"
		@fail - string "fail"
	*/
	app.post("/confirm-order",function(req,res){
		var orderID = req.body.orderID || null;
		var createdTillNow = req.body.createdTillNow || null;
		if(!orderID){
			res.json({
				status:"fail",
				message : "missing params"
			})
			return;
		}
		connectionPool.getConnection(function(err, connection) {
			if(err){
				res.json({
					status:"fail",
					message : "some server error occured"
				})
				return;
			}
			//selecting orders from table based on order ID
			connection.query('select * from faasoskitchenorders where OrderID = ?', [orderID], function(err, rows, fields) {
				if(err){
					connection.release();
					res.json({
						status:"fail",
						message : "some server error occured"
					})
					return;
				}
				if(rows.length<1){
					connection.release();
					res.json({
						status:"fail",
						message : "no records found"
					})
					return;
				}
				else{
					var productID = rows[0]["ProductID"];
					var pQty = rows[0]["Quantity"];
					if(createdTillNow==null || createdTillNow == "0" ||  createdTillNow == 0){
						var newValue = pQty;
					}
					else
						var newValue = parseInt(pQty) + parseInt(createdTillNow);
					// updating main table data with refernce to product id
					connection.query('update faasoskitchen set CreatedTillNow = ? where ProductID = ?', [newValue,productID], function(err, result) {
						if(err){
							connection.release();
							res.json({
								status:"fail",
								message : "some server error occured"
							})
							return;
						}
						// deleting order from orders table as there is no need of that data
						connection.query('delete from faasoskitchenorders where orderID = ?', [orderID], function(err, result) {
							connection.release();
							if(err){
								res.json({
									status:"fail",
									message : "some server error occured"
								})
								return;
							}
							res.json({
								status:"success",
								message : "status updated successfully"
							})
							return; 
						})
					})
				}   
		    })
		});
	})

}