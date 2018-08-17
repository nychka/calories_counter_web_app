import React from 'react';
import { Link } from 'react-router-dom';
import {Jumbotron, NavLink, NavItem} from 'reactstrap';
import { Line } from 'rc-progress';

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
                    <h3>Products {this.props.currentAmount } / {this.props.totalAmount}</h3>
                    <Line percent={this.props.progressPercent} strokeWidth="1" strokeColor="#2db7f5" />
                    <hr className="my-2"/>
                    <NavLink tag={Link} to='/products/new' className='btn btn-success'>
                        Add Product
                    </NavLink>
                </Jumbotron>
            </div>
        );
    }
}

export default Home;