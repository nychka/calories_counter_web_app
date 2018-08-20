import React, {Fragment} from 'react';
import ProductCard from './products/ProductCard';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Jumbotron, NavLink } from 'reactstrap';
import { Line } from 'rc-progress';
import { userSignedIn } from "../utils";
import Login from './Login';
import { CategoriesContext} from "./categories/CategoriesProvider";
import { ProductsContext} from "./products/ProductsProvider";


class Home extends React.Component
{
    constructor(props){
        super(props);
    }

    render(){
        const consumedProducts = this.props.consumedProducts;
        return(
            <div className='container ml-md-auto'>
                <Row>
                { consumedProducts.length ?
                    consumedProducts.map(product => (
                        <Col key={product.id}>
                            <ProductCard product={product}/>
                        </Col>
                            ))
                    : <h3>No consumed products</h3> }
                </Row>
            </div>
        );
    }
}

export default Home;