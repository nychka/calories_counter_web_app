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
        currentAmount: 0,
        totalAmount: 100,
        progressPercent: 0,
        products: [
            { id: 1, lang: {en: 'Apple'}, category_id: 1, image: 'image.png', nutrition: { calories: 100 } },
            { id: 2, lang: {en: 'Banana'}, category_id: 1, image: 'image.png', nutrition: { calories: 104 } },
        ]
    }

    pageHandler = e => {
        this.state.currentPage = e.selected + 1;
        this.fetchProducts();
    }

    setProgress(total){
        this.setState({currentAmount: total});
        let percent = this.state.totalAmount / 100 * total;
        this.setState({progressPercent: percent});
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
                self.setState({products: response.data.products});
                self.setState({totalPages: response.data.meta.totalPages});
                self.setProgress(response.data.meta.total);
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    componentDidMount(){
        this.fetchProducts()
    }

    addProductHandler = (product) => {
        let products = this.state.products;
        products.unshift(product);

        this.setState({products: products});
    }

    editProductHandler = (product) => {
        let products = this.state.products;

        products.map((item, i) => {
            if(item.id === product.id){
                products[i] = product;
                return true;
            }
        });

        this.setState({products: products});
    }

    removeProductHandler = product => {
        let canRemove = window.confirm('Are you really want to delete this product?');
        let url = `${this.state.api_host}/products/${product.id}`;
        let products = this.state.products;
        const self = this;

        if(canRemove){
            axios.delete(url)
            .then((response) => {
                products.map((item, i) => {
                    if(item.id === product.id){
                        products.splice(i, 1);
                        self.setState({products: products});
                        return false;
                    }
                });
                console.log(response);
            })
            .catch((response) => {
                console.log(response);
            })
        }else{
            return false;
        }
    }

  render() {
    return (
      <div className="App">
          <Header />
        <Switch>
            <Route path='/' exact render={() => {
                return <Home
                    totalAmount={this.state.totalAmount}
                    currentAmount={this.state.currentAmount}
                    progressPercent={this.state.progressPercent}
                />
            }} />
        <Route path="/products/new" exact render={() => (
          <ProductNew handler={this.addProductHandler.bind(this)}/>
        )} />

        <Route path="/products/:id/edit" exact render={() => (
            <ProductNew handler={this.editProductHandler.bind(this)} products={this.state.products} />
        )} />

        <Route path="/products" exact render={() => {
          return <ProductList
              progressPercent={this.state.progressPercent}
              totalAmount={this.state.totalAmount}
              currentAmount={this.state.currentAmount}
              currentPage={this.state.currentPage}
              totalPages={this.state.totalPages}
              pageHandler={this.pageHandler.bind(this)}
              removeHandler={this.removeProductHandler.bind(this)}
              products={this.state.products}/>
        }} />

            <Route path="/products/:id" removeHandler={this.removeProductHandler.bind(this)} component={ProductShow} />
        </Switch>

      </div>
    );
  }
}

export default App;
