import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './components/History';
import './index.css';
// import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'mdbreact/dist/css/mdb.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}



ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('root'));
registerServiceWorker();
