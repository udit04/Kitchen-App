

$( document ).ready(function() {

	$.ajax({
	  url: "http://localhost:5000"+'/fetch/orders',
	  type: 'GET',
	  success: function(response) {
	  	if(response.status=="success"){
	  		//alert("product fetched successfully")
		    response.data.forEach(function(row){
		    	for(var key in row){
		    		if(row[key]==undefined || row[key]==null)
		    			row[key] = "0"
		    	}
		    	$("#tblOrders").append("<tr><td>"+row.OrderID+"</td><td>"+row.ProductName+"</td><td>"+row.Quantity+"</td><td>"+row.CreatedTillNow+"</td><td>"+row.Predicted+"</td><td><button id='btnStatusUpdate'>Done</button></td></tr>")
		    })
	  	}
	  	else{
	  		alert("No orders fetched ! Try Again")
	  		return;
	  	}
	  },
	  error: function(e) {
	    alert(e.message + " orders could not be fetched");
	  }
	});

    $("#tblOrders").on("click","#btnStatusUpdate",function(){
		var orderID = $(this).parent().parent().find("td").eq(0).text();
		var createdTillNow = $(this).parent().parent().find("td").eq(3).text();

		$.ajax({
		  url: "http://localhost:5000"+'/confirm-order',
		  type: 'POST',
		  data: {"orderID":orderID,"createdTillNow":createdTillNow},
		  success: function(response) {
		  	if(response.status=="success"){
		  		//alert("order status updated successfully")
		  		window.location.reload(false);
		  	}
		  	else{
		  		alert("Could not update status! Try Again.")
		  		return;
		  	}
		  },
		  error: function(e) {
		    alert(e.message + "-order not updated");
		  }
		});
		localStorage.setItem('a',  (Math.random() * 999999));
	})

	$("#btnReport").click(function(){
		$.ajax({
		  url: "http://localhost:5000"+'/fetch/products',
		  type: 'GET',
		  success: function(response) {
		  	if(response.status=="success"){
		  		var doc = new jsPDF();
				var sample = "";
			    response.data.forEach(function(row){
			    	sample = sample + "<tr><td>"+row.ProductName+"</td><td>"+row.CreatedTillNow+"</td><td>"+row.Predicted+"</td></tr>"
			    })
			    sample = "<table><thead><tr><th>Dish Name</th><th>Produced</th><th>Predicted</th></tr></thead><tbody>"+sample+"</tbody></table>";
			    doc.fromHTML(sample, 20, 20, {
				});
				doc.save('Report.pdf');
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
	})

	 $(window).bind('storage', function (e) {
	     console.log(e.originalEvent.key, e.originalEvent.newValue);
	     window.location.reload(false);
	 });

});

