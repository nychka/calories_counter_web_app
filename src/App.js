import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import './App.css';
import { ProductsContext, ProductsProvider } from './components/products/ProductsProvider';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login'
import MealsNew from './components/meals/MealsNew';
import MealsShow from './components/meals/MealsShow';
import {axio, defaultHeaders} from './utils';



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
          <ProductsProvider>
              <ProductsContext.Consumer>
                  { props => (
                      <Header {...props} />
                  )}
              </ProductsContext.Consumer>
                <Switch>
                    <Route path='/meals/:id/new' exact render={() => (
                        <ProductsContext.Consumer>
                            { props => <MealsNew {...props} /> }
                        </ProductsContext.Consumer>
                    )} />

                    <Route path='/meals/:id' exact render={() => (
                        <ProductsContext.Consumer>
                            { props => <MealsShow {...props} /> }
                        </ProductsContext.Consumer>
                    )} />
                
                    <Route path='/login' exact render={() => (
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
                    )} />

                    <Route path='/' exact render={() => (
                        <ProductsContext.Consumer>
                            { props => <Home {...props} />}
                        </ProductsContext.Consumer>
                    )} />
                </Switch>
          </ProductsProvider>
      </div>
    );
  }
}

export default App;
