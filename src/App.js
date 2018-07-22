import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';
import ProductList from "./components/ProductList";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
          <content className="container">
            <ProductList />
          </content>
      </div>
    );
  }
}

export default App;
