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
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login'

import CaloriesNew from './components/CaloriesNew';
import {axio, defaultHeaders, saveCurrentUser, userSignedIn} from './utils';



class App extends React.Component {

    failGoogle(response){
        console.log(response);
    }

    responseGoogle(response){
        console.log(response);
        this.signIn(response.accessToken, 'google');
    }
    responseFacebook(response){
        console.log(response);
        this.signIn(response.accessToken, 'facebook');
    }


    componentClicked(e){
        console.log(e);
    }
    signIn(accessToken, provider){

        axio({
            method: 'post',
            url: '/users/sign_in',
            data: { access_token: accessToken, provider: provider },
            headers: defaultHeaders()
        })
        .then(function (response) {
            console.log(response);
            if(response.status === 201) {
                alert(response.data.email + ' logged in!');
                //saveCurrentUser(response.data, response.headers.authorization);
                //history.push({pathname: '/'});
            }else{
                //self.setState({ hasError: true, errorMessage: response.data.error })
            }
        })
        .catch(function (response) {
            console.log(response);

        });
    }
  render() {
    return (
      <div className="App">
          <CategoriesProvider>
          <ProductsProvider>
              <ProductsContext.Consumer>
                  { props => (
                      <Header {...props} />
                  )}
              </ProductsContext.Consumer>
                <Switch>
                    <Route path='/products/:id' exact render={() => (
                        <ProductsContext.Consumer>
                            { props => <CaloriesNew {...props} /> }
                        </ProductsContext.Consumer>
                    )} />
                    <Route path='/me' exact render={() => userSignedIn() ? <Profile /> : <Redirect to={'/'} /> } />
                    <Route path='/logout' exact render={() => userSignedIn() ? <Logout /> : <Redirect to={'/'}/> } />
                    <Route path='/login' exact render={() => (
                        <CategoriesContext.Consumer>
                            { cProps => (
                                <ProductsContext.Consumer>
                                    { props => (
                                        <div>
                                           <FacebookLogin
                                               appId="1816374385077661"
                                               autoLoad={false}
                                               fields="name,email,picture"
                                               onClick={this.componentClicked.bind(this)}
                                               callback={this.responseFacebook.bind(this)}
                                           />

                                            <GoogleLogin
                                                clientId="930732790033-lirk2bn8esigr142rucgm86gqsifeum7.apps.googleusercontent.com"
                                                buttonText="Login"
                                                autoLoad={false}
                                                onSuccess={this.responseGoogle.bind(this)}
                                                onFailure={this.failGoogle.bind(this)}
                                            />
                                        </div>
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
                {/*<Route path="/products/new" exact render={() => ( userSignedIn() ?*/}
                    {/*<CategoriesContext.Consumer>*/}
                        {/*{ cProps => (*/}
                            {/*<ProductsContext.Consumer>*/}
                                {/*{(props) => <ProductNew handler={props.addHandler} categories={cProps.categories} fetch={cProps.fetch}/>}*/}
                            {/*</ProductsContext.Consumer>*/}
                        {/*)}*/}
                    {/*</CategoriesContext.Consumer>*/}

                    {/*: <Redirect to={'/'}/>)} />*/}

                    <Route path="/categories/new" exact render={() => ( userSignedIn() ?
                        <CategoriesContext.Consumer>
                            { props => <CategoryNew handler={props.addHandler}/> }
                        </CategoriesContext.Consumer>
                    : <Redirect to={'/'}/> )} />

                <Route path="/products/:id/edit" exact render={() => ( userSignedIn() ?
                    <CategoriesContext.Consumer>
                        { cProps => (
                            <ProductsContext.Consumer>
                                {(props) => <ProductNew handler={props.editHandler} categories={cProps.categories} fetch={cProps.fetch}/>}
                            </ProductsContext.Consumer>
                        )}
                    </CategoriesContext.Consumer>
                    : <Redirect to={'/'}/> )} />

                    {/*<Route path="/categories/:id/edit" exact render={() => ( userSignedIn() ?*/}
                        {/*<CategoriesContext.Consumer>*/}
                            {/*{ props => <CategoryNew handler={props.editHandler} /> }*/}
                        {/*</CategoriesContext.Consumer>*/}
                        {/*: <Redirect to={'/'}/> )} />*/}

                <Route path="/products" exact render={() => ( userSignedIn() ?
                    <ProductsContext.Consumer>
                            {(props) => <ProductList {...props} />}
                    </ProductsContext.Consumer>
                : <Redirect to={'/'}/>)} />

                    <Route path="/categories" exact render={() => ( userSignedIn() ?
                        <CategoriesContext.Consumer>
                            {(props) =>  <CategoryList {...props}/>}
                        </CategoriesContext.Consumer>
                    : <Redirect to={'/'}/> )} />

                    {/*<Route path="/products/:id" exact render={(props) => (  userSignedIn() ?*/}
                        {/*<ProductsContext.Consumer>*/}
                            {/*{ () => <ProductShow {...props} /> }*/}
                        {/*</ProductsContext.Consumer>*/}
                        {/*: <Redirect to={'/'}/> )} />*/}
                </Switch>
          </ProductsProvider>
          </CategoriesProvider>
      </div>
    );
  }
}

export default App;
