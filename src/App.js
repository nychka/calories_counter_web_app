import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import './App.css';

import { ProductsContext, ProductsProvider } from './components/products/ProductsProvider';
import ProductList from "./components/products/ProductList";
import ProductNew from './components/products/ProductNew';
import ProductShow from './components/products/ProductShow';

import { CategoriesContext, CategoriesProvider } from "./components/categories/CategoriesProvider";
import CategoryList from "./components/categories/CategoryList";
import CategoryNew from './components/categories/CategoryNew';

import Login from './components/Login';
import Logout from './components/Logout';
import Profile from './components/Profile';
import { userSignedIn } from './utils';



class App extends React.Component {

  render() {
    return (
      <div className="App">
          <Header />
          <CategoriesProvider>
          <ProductsProvider>
                <Switch>
                    <Route path='/me' exact render={() => userSignedIn() ? <Profile /> : <Redirect to={'/'} /> } />
                    <Route path='/logout' exact render={() => userSignedIn() ? <Logout /> : <Redirect to={'/'}/> } />
                    <Route path='/login' exact render={() => (
                        <CategoriesContext.Consumer>
                            { cProps => (
                                <ProductsContext.Consumer>
                                    { props => (
                                        !userSignedIn() ? <Login
                                            fetchProducts={props.fetch}
                                            fetchCategories={cProps.fetch}
                                        /> : <Redirect to={'/'}/>
                                    )}
                                </ProductsContext.Consumer>
                            )}
                        </CategoriesContext.Consumer>
                    )} />

                    <Route path='/' exact render={() => (
                        <ProductsContext.Consumer>
                            { props => <Home {...props} />}
                        </ProductsContext.Consumer>
                    )} />
                <Route path="/products/new" exact render={() => (
                    <CategoriesContext.Consumer>
                        { cProps => (
                            <ProductsContext.Consumer>
                                {(props) => <ProductNew handler={props.addHandler} categories={cProps.categories} fetch={cProps.fetch}/>}
                            </ProductsContext.Consumer>
                        )}
                    </CategoriesContext.Consumer>
                    )} />

                    <Route path="/categories/new" exact render={() => (
                        <CategoriesContext.Consumer>
                            { props => <CategoryNew handler={props.addHandler}/> }
                        </CategoriesContext.Consumer>
                    )} />

                <Route path="/products/:id/edit" exact render={() => (
                    <CategoriesContext.Consumer>
                        { cProps => (
                            <ProductsContext.Consumer>
                                {(props) => <ProductNew handler={props.editHandler} categories={cProps.categories} fetch={cProps.fetch}/>}
                            </ProductsContext.Consumer>
                        )}
                    </CategoriesContext.Consumer>
                )} />

                    <Route path="/categories/:id/edit" exact render={() => (
                        <CategoriesContext.Consumer>
                            { props => <CategoryNew handler={props.editHandler} /> }
                        </CategoriesContext.Consumer>
                    )} />

                <Route path="/products" exact render={() => (
                    <ProductsContext.Consumer>
                            {(props) => <ProductList {...props} />}
                    </ProductsContext.Consumer>
                )} />

                    <Route path="/categories" exact render={() => (
                        <CategoriesContext.Consumer>
                            {(props) =>  <CategoryList {...props}/>}
                        </CategoriesContext.Consumer>
                    )} />

                    <Route path="/products/:id" exact render={(props) => (
                        <ProductsContext.Consumer>
                            { () => <ProductShow {...props} /> }
                        </ProductsContext.Consumer>
                    )} />
                </Switch>
          </ProductsProvider>
          </CategoriesProvider>
      </div>
    );
  }
}

export default App;
