import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import './App.css';
import ProductList from "./components/products/ProductList";
import CategoryList from "./components/categories/CategoryList";
import CategoryNew from './components/categories/CategoryNew';
import ProductNew from './components/products/ProductNew';
import ProductShow from './components/products/ProductShow';
import Login from './components/Login';
import axios from "axios/index";

class App extends Component {

    state = {
        api_host: process.env.REACT_APP_API_HOST,
        currentUser: null,
        currentCategoryPage: 1,
        totalCategoryPages: 1,
        categories: []
    }

    authorizeUser = (user, token) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('accessToken', token);
    }

    pageCategoryHandler = e => {
        this.state.currentCategoryPage = e.selected + 1;
        this.fetchCategories();
    }

    headers(){
        const accessToken = localStorage.getItem('accessToken');

        return { 'Content-Type': 'json', 'Authorization': accessToken };
    }

    currentUser(){
        if(this.state.currentUser) return this.state.currentUser;

        if(localStorage.getItem('currentUser') && localStorage.getItem('currentUser').length){
           let user = JSON.parse(localStorage.getItem('currentUser'));
           this.setState({currentUser: user});
           return user;
        }else{
            return false;
        }
    }



    fetchCategories() {
        const self = this;
        axios({
            method: 'get',
            url: self.state.api_host + '/categories?page='+self.state.currentCategoryPage,
            config: { headers: self.headers()}
        })
            .then(function (response) {
                console.log(response);
                self.setState({categories: response.data.categories});
                self.setState({totalCategoryPages: response.data.meta.totalPages});
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    componentDidMount(){
        this.currentUser();
    }

    addCategoryHandler = (product) => {
        let products = this.state.categories;
        products.unshift(product);

        this.setState({categories: products});
    }

    editCategoryHandler = (product) => {
        let products = this.state.categories;

        products.map((item, i) => {
            if(item.id === product.id){
                products[i] = product;
                return true;
            }
        });

        this.setState({categories: products});
    }

    removeCategoryHandler = product => {
        let canRemove = window.confirm('Are you really want to delete this product?');
        let url = `${this.state.api_host}/categories/${product.id}`;
        let products = this.state.categories;
        const self = this;

        if(canRemove){
            axios.delete(url)
                .then((response) => {
                    products.map((item, i) => {
                        if(item.id === product.id){
                            products.splice(i, 1);
                            self.setState({categories: products});
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
            <Route path='/login' exact render={() => {
                return <Login authHandler={this.authorizeUser.bind(this)} />
            }} />
            <Route path='/' exact render={() => {
                return <Home
                    totalAmount={this.state.totalAmount}
                    currentAmount={this.state.currentAmount}
                    progressPercent={this.state.progressPercent}
                />
            }} />
        {/*<Route path="/products/new" exact render={() => {*/}
           {/*return <ProductNew parentState={this.state} handler={this.addProductHandler.bind(this)}/>*/}
        }} />

            <Route path="/categories/new" exact render={() => (
                <CategoryNew handler={this.addCategoryHandler.bind(this)}/>
            )} />

        {/*<Route path="/products/:id/edit" exact render={() => (*/}
            {/*<ProductNew handler={this.editProductHandler.bind(this)} products={this.state.products} />*/}
        )} />

            <Route path="/categories/:id/edit" exact render={() => (
                <CategoryNew handler={this.editCategoryHandler.bind(this)} products={this.state.categories} />
            )} />

        <Route path="/products" exact render={() =>  <ProductList headers={this.headers.bind(this)} currentUser={this.currentUser.bind(this)}/>}/>

            <Route path="/categories" exact render={() => {
                return <CategoryList
                    currentPage={this.state.currentCategoryPage}
                    totalPages={this.state.totalCategoryPages}
                    pageHandler={this.pageCategoryHandler.bind(this)}
                    removeHandler={this.removeCategoryHandler.bind(this)}
                    categories={this.state.categories}/>
            }} /> }

            {/*<Route path="/products/:id" removeHandler={this.removeProductHandler.bind(this)} component={ProductShow} />*/}
        </Switch>

      </div>
    );
  }
}

export default App;
