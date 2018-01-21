/*
    ./client/components/App.jsx
*/
import React from 'react';
import axios from 'axios';

class Order extends React.Component {

	constructor(props){
	  	super(props);
	   this.state = {
	   		data : [],
	   		productName : "",
	   		predictedValue : "",
	   		quantity: "",
	   		pID: "-1"
	   }
	   this.PlaceOrder = this.PlaceOrder.bind(this);
	   this.ReRoute = this.ReRoute.bind(this);
	   this.AddProduct = this.AddProduct.bind(this);
	   this.FetchProducts = this.FetchProducts.bind(this);
	   this.handleNameChange = this.handleNameChange.bind(this);
	   this.handleIDChange = this.handleIDChange.bind(this);
	   this.handleQtyChange = this.handleQtyChange.bind(this);
	   this.handleValueChange = this.handleValueChange.bind(this);
	}

	componentDidMount(){
		this.FetchProducts();	
	}

	ReRoute(){
		window.location = "/";
	}

	handleNameChange(e){
		var productName = e.target.value;
		this.setState({
			productName: productName
		})
	}

	handleIDChange(e){
		var pID = e.target.value;
		this.setState({
			pID: pID
		})
	}

	handleQtyChange(e){
		var qty = e.target.value;
		this.setState({
			quantity: qty
		})
	}

	handleValueChange(e){
		var predictedValue = e.target.value;
		this.setState({
			predictedValue: predictedValue
		})
	}

	FetchProducts(){
		var that = this;
		axios.get('/fetch/products', {
		  })
		  .then(function (response) {
		  	console.log(response)
		    if(response.data.status=="success"){
		  		alert("product fetched successfully")
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

	AddProduct(){
		var pName = this.state.productName;
		var pValue = this.state.predictedValue;
		console.log(pName)
		if(!pName || !pValue){
			alert("Please enter product name and its predicted value")
			return;
		}
		axios.post('/insert/product', {
		    pName: pName,
		    pValue: pValue
		  })
		  .then(function (response) {
		    if(response.data.status=="success"){
		  		alert("product inserted successfully");
		  		window.location.reload();
		  	}
		  	else{
		  		alert("Could not insert product! Try Again.")
		  		return;
		  	}
		  })
		  .catch(function (error) {
		    alert(error + "-product not inserted successfully");
		  });
	}

	PlaceOrder(){
		var pID = this.state.pID;
		var pQty = this.state.quantity;
		console.log(pID)
		if(!pID || !pQty || pID=="-1"){
			alert("Please enter quantity and name of product")
			return;
		}
		axios.post('/place-order', {
		    pID: pID,
		    pQty: pQty
		  })
		  .then(function (response) {
		    if(response.data.status=="success"){
		  		alert("order placed successfully")
		  		//window.location.reload();
		  	}
		  	else{
		  		alert("Could not place order! Try Again.")
		  		return;
		  	}
		  })
		  .catch(function (error) {
		    alert(error + "-order not placed");
		  });
	}

	render() {
		var that = this;
		var data  = this.state.data;
		var productName = this.state.productName;
		var predictedValue = this.state.predictedValue;
		var quantity = this.state.quantity;
		var pID = this.state.pID;
		return (
			
			<div>
				<div><button onClick={() => that.ReRoute()}>Back To Kitchen Display</button></div>

				<div>
					<table>
						<thead>
							<tr>
								<th>Name</th>
			                    <th>Predicted Value</th>
			                    <th></th>
							</tr>
						</thead>
						<tbody>
							<tr>
			                    <td><input type="text" onChange={this.handleNameChange} value={productName} placeholder="Enter product name" /></td>
			                    <td><input type="number" onChange={this.handleValueChange} min='0' value={predictedValue} placeholder="Enter predicted value" /></td>
			                    <td><button onClick={this.AddProduct}>Add product</button></td>
			                </tr>
						</tbody>
					</table>
				</div>

				<div>
					<table>
						<thead>
							<tr>
		                        <th>Name</th>
		                        <th>Quantity</th>
		                        <th></th>
							</tr>
						</thead>
						<tbody>
							<tr>
		                        <td>
		                            <select onChange={this.handleIDChange}>
		                            	<option value={pID} defaultValue>Select Product Name</option>
		                            	{data.map(item => <option value={item.ProductID} key={item.ProductID} defaultValue>{item.ProductName}</option> )}
		                            </select>
		                        </td>
		                        <td><input type="number" id='txtProductQty' min='0' value={quantity} onChange={this.handleQtyChange} placeholder="Enter Quantity" name="" /></td>
		                        <td><button onClick={this.PlaceOrder}>Place Order</button></td>
		                    </tr>
						</tbody>
					</table>
				</div>

			</div>
		)
	}

}


export default Order