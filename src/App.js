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
        auth_header: null,
        currentProductPage: 1,
        currentCategoryPage: 1,
        totalProductPages: 1,
        totalCategoryPages: 1,
        currentAmount: 0,
        totalAmount: 100,
        progressPercent: 0,
        products: [
            { id: 1, lang: {en: 'Apple'}, category_id: 1, image: 'image.png', nutrition: { calories: 100 } },
            { id: 2, lang: {en: 'Banana'}, category_id: 1, image: 'image.png', nutrition: { calories: 104 } },
        ],
        categories: []
    }

    authorizeUser = (user, token) => {
        this.setState({currentUser: user});
        this.setState({auth_header: token});
    }

    pageProductHandler = e => {
        this.state.currentProductPage = e.selected + 1;
        this.fetchProducts();
    }

    pageCategoryHandler = e => {
        this.state.currentCategoryPage = e.selected + 1;
        this.fetchCategories();
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
            url: self.state.api_host + '/products?page='+self.state.currentProductPage,
            config: { headers: {'Content-Type': 'json', 'Authorization': self.state.auth_header }}
        })
            .then(function (response) {
                console.log(response);
                self.setState({products: response.data.products});
                self.setState({totalProductPages: response.data.meta.totalPages});
                self.setProgress(response.data.meta.total);
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    fetchCategories() {
        const self = this;
        axios({
            method: 'get',
            url: self.state.api_host + '/categories?page='+self.state.currentCategoryPage,
            config: { headers: {'Content-Type': 'json', 'Authorization': self.state.auth_header }}
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
        if(this.state.currentUser){
            this.fetchCategories();
            this.fetchProducts();
        }
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
        <Route path="/products/new" exact render={() => {
           return <ProductNew parentState={this.state} handler={this.addProductHandler.bind(this)}/>
        }} />

            <Route path="/categories/new" exact render={() => (
                <CategoryNew handler={this.addCategoryHandler.bind(this)}/>
            )} />

        <Route path="/products/:id/edit" exact render={() => (
            <ProductNew handler={this.editProductHandler.bind(this)} products={this.state.products} />
        )} />

            <Route path="/categories/:id/edit" exact render={() => (
                <CategoryNew handler={this.editCategoryHandler.bind(this)} products={this.state.categories} />
            )} />

        <Route path="/products" exact render={() => {
          return this.state.currentUser ?
              <ProductList
              progressPercent={this.state.progressPercent}
              totalAmount={this.state.totalAmount}
              currentAmount={this.state.currentAmount}
              currentPage={this.state.currentProductPage}
              totalPages={this.state.totalProductPages}
              pageHandler={this.pageProductHandler.bind(this)}
              removeHandler={this.removeProductHandler.bind(this)}
              fetchHandler={this.fetchProducts.bind(this)}
              products={this.state.products}/>
              : <Redirect to={'/login'} />;
        }} />

            <Route path="/categories" exact render={() => {
                return this.state.currentUser ?
                <CategoryList
                    currentPage={this.state.currentCategoryPage}
                    totalPages={this.state.totalCategoryPages}
                    pageHandler={this.pageCategoryHandler.bind(this)}
                    removeHandler={this.removeCategoryHandler.bind(this)}
                    categories={this.state.categories}/>
                    :  <Redirect to={'/login'} />
            }} /> }

            <Route path="/products/:id" removeHandler={this.removeProductHandler.bind(this)} component={ProductShow} />
        </Switch>

      </div>
    );
  }
}

export default App;
