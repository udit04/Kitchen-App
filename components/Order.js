/*
    ./client/components/App.jsx
*/
import React from 'react';

class Order extends React.Component {

	constructor(){
	  super(props);
	   this.PlaceOrder = this.PlaceOrder.bind(this);
	   this.ReRoute = this.ReRoute.bind(this);
	   this.AddProduct = this.AddProduct.bind(this);
	   this.FetchProducts = this.FetchProducts.bind(this);
	   this.handleNameChange = this.handleNameChange.bind(this);
	   this.handleIDChange = this.handleIDChange.bind(this);
	   this.handleQtyChange = this.handleQtyChange.bind(this);
	   this.handleValueChange = this.handleValueChange.bind(this);
	   this.state({
	   		data : [],
	   		productName : "",
	   		predictedValue : "",
	   		quantity: "",
	   		pID: ""
	   })
	}

	componentDidMount(){
		this.FetchProducts();
	}

	ReRoute(){
		window.location = "/";
	}

	handleNameChange(e){
		var val = e.target.value;
		this.setState({
			productName: val
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
		axios.get('/fetch/products', {
		  })
		  .then(function (response) {
		    if(response.status=="success"){
		  		alert("product fetched successfully")
			    this.setState({
			    	data: response.data
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

		axios.post('/insert/product', {
		    pName: pName,
		    pValue: pValue
		  })
		  .then(function (response) {
		    if(response.status=="success"){
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

		axios.post('/insert/product', {
		    pName: pName,
		    pValue: pValue
		  })
		  .then(function (response) {
		    if(response.status=="success"){
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

	render() {
	return (
		var that = this;
		var data  = this.state.data;
		var productName = this.state.productName;
		var predictedValue = this.state.predictedValue;
		var quantity = this.state.quantity;
		<div>
			<div><button onClick={() => that.ReRoute()}></button></div>

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
		                    <td><input type="text" oChange={this.handleNameChange} value={productName} placeholder="Enter product name" name=""></td>
		                    <td><input type="number" id='txtProductValue' oChange={this.handleValueChange} min='0' value={predictedValue} placeholder="Enter predicted value" name=""></td>
		                    <td><button id='btnAddProduct' onClick={this.addProduct}>Add product</button></td>
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
	                            <select>
	                            	<option value="-1" selected="">Select Product Name</option>
	                            	data.map(function(key,index){
	                            		<option value={key.ProductID} oChange={this.handleIDChange}>{key.ProductName}</option>
	                            	})
	                            </select>
	                        </td>
	                        <td><input type="number" id='txtProductQty' min='0' value={quantity} oChange={this.handleQtyChange} placeholder="Enter Quantity" name=""></td>
	                        <td><button onClick={this.PlaceOrder}>Place Order</button></td>
	                    </tr>
					</tbody>
				</table>
			</div>

		</div>

}

export default Order;