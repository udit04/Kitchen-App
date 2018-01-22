// app/index.js
import Order from './components/Order'
import Main from './components/Main'
import React from 'react'
import {render} from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';

render(
	<Router >
		<div>
            <Route exact path={"/"} component={Main}/>
	        <Route path={"/order"} component={Order}/>
	        
        </div>
    </Router>
    ,
    document.getElementById('root')
);