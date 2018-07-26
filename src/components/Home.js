import React from 'react';
import {Jumbotron, NavLink, NavItem} from 'reactstrap';

class Home extends React.Component
{
    render(){
        return(
            <div>
                <Jumbotron>
                    <h1 className="display-3">Hello, my dear Calory Counter!</h1>
                    <p className="lead">
                        Let me guess - you're here to add some products for mobile app or what?
                        Hurry up! Add some products - make people's life better!
                    </p>
                    <hr className="my-2" />
                    <NavLink href='/products/new' className='btn btn-success'>
                        Add Product
                    </NavLink>
                </Jumbotron>
            </div>
        );
    }
}

export default Home;