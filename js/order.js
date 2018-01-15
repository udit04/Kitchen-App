
//console.log(baseUrl)
console.log(baseUrl)
if(baseUrl.indexOf("localhost") >-1){
	baseUrl = "http://"+baseUrl
}
$( document ).ready(function() {
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


});

