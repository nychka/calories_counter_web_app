import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import './App.css';
import ProductList from "./components/products/ProductList";
import CategoryList from "./components/categories/CategoryList";
import CategoryNew from './components/categories/CategoryNew';
import Login from './components/Login';
import Logout from './components/Logout';
import Profile from './components/Profile';
import { userSignedIn } from './utils';

class App extends Component {

  render() {
    return (
      <div className="App">
          <Header />
        <Switch>
            <Route path='/me' exact render={() => userSignedIn() ? <Profile /> : <Redirect to={'/'} /> } />
            <Route path='/logout' exact render={() => userSignedIn() ? <Logout /> : <Redirect to={'/'}/> } />
            <Route path='/login' exact render={() => !userSignedIn() ? <Login /> : <Redirect to={'/'}/> } />
            <Route path='/' exact render={() => <Home/>} />
            <Route path="/products/new" exact render={() => {
                return <ProductNew parentState={this.state} handler={this.addProductHandler.bind(this)}/>
            }} />

            {/*<Route path="/categories/new" exact render={() => (*/}
                {/*<CategoryNew handler={this.addCategoryHandler.bind(this)}/>*/}
            {/*)} />*/}

        {/*<Route path="/products/:id/edit" exact render={() => (*/}
            {/*<ProductNew handler={this.editProductHandler.bind(this)} products={this.state.products} />*/}
        )} />

            {/*<Route path="/categories/:id/edit" exact render={() => (*/}
                {/*<CategoryNew handler={this.editCategoryHandler.bind(this)} products={this.state.categories} />*/}
            {/*)} />*/}

        <Route path="/products" exact render={() => userSignedIn() ? <ProductList /> : <Redirect to={'/login'}/> }/>

            {/*<Route path="/categories" exact render={() => {*/}
                {/*return <CategoryList*/}
                    {/*currentPage={this.state.currentCategoryPage}*/}
                    {/*totalPages={this.state.totalCategoryPages}*/}
                    {/*pageHandler={this.pageCategoryHandler.bind(this)}*/}
                    {/*removeHandler={this.removeCategoryHandler.bind(this)}*/}
                    {/*categories={this.state.categories}/>*/}
            {/*}} /> }*/}

            {/*<Route path="/products/:id" removeHandler={this.removeProductHandler.bind(this)} component={ProductShow} />*/}
        </Switch>

      </div>
    );
  }
}

export default App;
