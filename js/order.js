
//console.log(baseUrl)
console.log(baseUrl)
if(baseUrl.indexOf("localhost") >-1){
	baseUrl = "http://"+baseUrl
}
else
	baseUrl = "";
$( document ).ready(function() {

	load();

	// click handler to handle adding of products
    $("#btnAddProduct").click(function(){
		console.log("in here")
		var pName = $("#txtProductName").val();
		var pValue = $("#txtProductValue").val();
		if(!pName || !pValue){
			alert("Please enter product name and its predicted value")
			return;
		}
		$.ajax({
		  url: baseUrl+'/insert/product',
		  type: 'POST',
		  data: {"pName":pName,"pValue":pValue},
		  success: function(response) {
		  	if(response.status=="success"){
		  		alert("product inserted successfully");
		  		window.location.reload();
		  	}
		  	else{
		  		alert("Could not insert product! Try Again.")
		  		return;
		  	}
		  },
		  error: function(e) {
		    alert(e.message + "-product not inserted successfully");
		  }
		});
	})

    // click handler to handle placing of orders
    $("#btnPlaceOrder").click(function(){
		var pID = $("#products").val();
		var pQty = $("#txtProductQty").val();

		if(!pID || !pQty || pID=="-1"){
			alert("Please enter quantity and name of product")
			return;
		}
		$.ajax({
		  url: baseUrl+'/place-order',
		  type: 'POST',
		  data: {"pID":pID,"pQty":pQty},
		  success: function(response) {
		  	if(response.status=="success"){
		  		alert("order placed successfully")
		  	}
		  	else{
		  		alert("Could not place order! Try Again.")
		  		return;
		  	}
		  },
		  error: function(e) {
		    alert(e.message + "-order not placed");
		  }
		});
	})

	$("#btnHome").click(function(){
		window.location = "https://radiant-woodland-68601.herokuapp.com";
	})

});

// function to handle initial loading of products in dropdown
function load(){
	$.ajax({
	  url: baseUrl+'/fetch/products',
	  type: 'GET',
	  success: function(response) {
	  	if(response.status=="success"){
	  		alert("product fetched successfully")
	  		console.log(response.data)
		    response.data.forEach(function(row){
		    	$("#products").append("<option value='"+row.ProductID+"'>"+row.ProductName+"</option>")
		    })
	  	}
	  	else{
	  		alert("No products fetched ! Try Adding the products.")
	  		return;
	  	}
	  },
	  error: function(e) {
	    alert(e.message + " product could not be fetched");
	  }
	});
}

