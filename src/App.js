import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import './App.css';
import ProductList from "./components/ProductList";
import ProductNew from './components/ProductNew';
import ProductShow from './components/ProductShow';
import axios from "axios/index";

class App extends Component {

    state = {
        api_host: process.env.REACT_APP_API_HOST,
        currentPage: 1,
        products: [
            { id: 1, lang: {en: 'Apple'}, category_id: 1, image: 'image.png', nutrition: { calories: 100 } },
            { id: 2, lang: {en: 'Banana'}, category_id: 1, image: 'image.png', nutrition: { calories: 104 } },
        ]
    }

    fetchProducts(){
        const self = this;
        axios({
            method: 'get',
            url: self.state.api_host + '/products?page='+self.state.currentPage,
            config: { headers: {'Content-Type': 'json' }}
        })
            .then(function (response) {
                console.log(response);
                self.setState({products: response.data});
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    componentDidMount(){
        this.fetchProducts()
    }

    componentWillUnmount(){
        alert('will unmount!');
    }
    addProductHandler = (product) => {
        let products = this.state.products;
        products.unshift(product);
        this.setState({products: products});
    }

  render() {
    return (
      <div className="App">
          <Header />
        <Switch>
            <Route path='/' exact component={Home} />
          <Route path="/products/new" exact render={() => (
              <ProductNew handler={this.addProductHandler}/>
          )} />

          <Route path="/products" exact render={() => {
              return <ProductList products={this.state.products}/>
          }} />

            <Route path="/products/:id" component={ProductShow} />
        </Switch>

      </div>
    );
  }
}

export default App;
