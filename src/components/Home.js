import React, {Fragment} from 'react';
import ProductCard from './products/ProductCard';
import { Row, Col } from 'reactstrap';
import {isValidNewOption} from "../utils";
import Creatable from "react-select/lib/Creatable";

class Home extends React.Component
{
    constructor(props){
        super(props);
    }

    render(){
        const consumedProducts = this.props.consumedProducts;
        return(
            <div className='container ml-md-auto'>
            <Creatable
                value={this.props.selectedProduct}
                onChange={this.props.pickProductHandler}
                options={this.props.productsOptions}
                className={''}
                onCreateOption={this.props.handleCreate}
                isSearchable
                isValidNewOption={isValidNewOption}
                placeholder={'Search product'}
            />
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