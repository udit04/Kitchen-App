/*
    ./client/components/App.jsx
*/
import React from 'react';
import axios from 'axios';

import jsPDF from 'jspdf';

class Main extends React.Component {

	constructor(props){
	  	super(props);
	   this.state = {
	   		data : []
	   }
	   this.StatusUpdate = this.StatusUpdate.bind(this);
	   this.PdfReport = this.PdfReport.bind(this);
	   this.FetchOrders = this.FetchOrders.bind(this);
	}

	componentDidMount(){
		this.FetchOrders();	
	}

	FetchOrders(){
		var that = this;
		axios.get('/fetch/orders', {
		  })
		  .then(function (response) {
		  	console.log(response)
		    if(response.data.status=="success"){
			    that.setState({
			    	data: response.data.data
			    })
		  	}
		  	else{
		  		alert("No products fetched ! Try Adding the products.")
		  		return;
		  	}
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	}

	PdfReport(){
		var that = this;
		axios.get('/fetch/products', {
			params: { "type": "new" }
		  })
		  .then(function (response) {
		    if(response.data.status=="success"){
		  		var doc = new jsPDF();
				var sample = "";
			    response.data.data.forEach(function(row){
			    	sample = sample + "<tr><td>"+row.ProductName+"</td><td>"+(row.CreatedTillNow ? row.CreatedTillNow : "-")+"</td><td>"+row.Predicted+"</td></tr>"
			    })
			    sample = "<h2>Dish Wise Production Report</h2><table><thead><tr><th>Dish Name</th><th>Produced</th><th>Predicted</th></tr></thead><tbody>"+sample+"</tbody></table>";
			    doc.fromHTML(sample, 20, 20, {
				});
				doc.save('Report.pdf');
		  	}
		  	else{
		  		alert("No products fetched ! Try Adding the products.")
		  		return;
		  	}
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	}

	StatusUpdate(orderID,createdTillNow){
		axios.post('/confirm-order', {
		    orderID: orderID,
		    createdTillNow: createdTillNow
		  })
		  .then(function (response) {
		    if(response.data.status=="success"){
		  		window.location.reload();
		  	}
		  	else{
		  		alert("Could not update status! Try Again.")
		  		return;
		  	}
		  })
		  .catch(function (error) {
		    alert("Some server occured ! Orders could not be fetched");
		  });
	}

	render() {
		var that = this;
		var data  = this.state.data;
		return (		
			<div>
				<div style={{"textAlign": "center"}}><h1>Faasos Kitchen App</h1> <h4>Live Orders</h4></div>
				<div>
					<table border="1" width="100%" style={{"textAlign": "center"}}>
						<thead>
							<tr>
								<th >Order #</th>
			                    <th>Name</th>
			                    <th>Quantity</th>
			                    <th>Created-till-now</th>
			                    <th>Predicted</th>
			                    <th>Status</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item,index) => <tr key={index}><td>{item.OrderID}</td><td>{item.ProductName}</td><td>{item.Quantity}</td><td>{item.CreatedTillNow ? item.CreatedTillNow : "-"}</td><td>{item.Predicted}</td><td><button onClick={()=>{that.StatusUpdate(item.OrderID,item.CreatedTillNow)}}>Done</button></td></tr> )}
						</tbody>
					</table>
				</div>

				<div style={{"textAlign": "center","marginTop":"30px"}}>
			        <button onClick={this.PdfReport} >Download Report As PDF</button>
			    </div>

			</div>
		)
	}
}


export default Main