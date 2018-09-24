import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import './App.css';
import './ReactSelect.css';
import './Calendar.css';
import { ProductsContext, ProductsProvider } from './components/products/ProductsProvider';
import MealsNew from './components/meals/MealsNew';
import MealsShow from './components/meals/MealsShow';
import ProductNew from './components/products/ProductNew';
import Login from './components/Login';

class App extends React.Component {
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
                    <Route path='/products/new' exact render={() => (
                        <ProductsContext.Consumer>
                            { props => <ProductNew {...props} /> }
                        </ProductsContext.Consumer>
                    )} />

                    <Route path='/meals/new' exact render={() => (
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
                               <Login />
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
