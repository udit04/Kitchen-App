# Kitchen-App
Kitchen App to add products and place orders and download report

**THIS APP HAS BOTH API AND FRONTEND CODE RUNNING ON ONE SERVER ITSELF**

1) The App has two html pages

	1) The main page that displays kitchen's live orders
	2) The secondary page that allows you to insert products and place orders

2) Directory Structure

	js - contains all html's source js files
	routes - contains all api code
	vendor - contains all helper js files
	views - contains all html code
	index.js - entry point

3) Table Structures

	## Table - FaasosKitchen
		Columns:-
		-ProductID bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY
		-ProductName VARCHAR(250)
		-CreatedTillNow smallint
		-Predicted smallint

	## Table - FaasosKitchenOrders
		Columns:- 
		-OrderID bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY
		-ProductID bigint(20) unsigned not null
		-Quantity smallint




