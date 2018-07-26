import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
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
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root'));
registerServiceWorker();
