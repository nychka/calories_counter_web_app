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
            <div className='d-flex flex-column'>
                <div id={'select-products'}>
                    <Creatable
                    value={this.props.selectedProduct}
                    onChange={this.props.pickProductHandler}
                    options={this.props.productsOptions}
                    className={'search-products'}
                    onCreateOption={this.props.handleCreate}
                    isSearchable
                    isValidNewOption={isValidNewOption}
                    placeholder={'Search product'}
                   />
                </div>
                <div className={'d-flex flex-wrap align-items-end mt-3 consumed-products-wrapper'}>
                { consumedProducts.length ?
                    consumedProducts.map(product => <ProductCard product={product}/>)
                    : <h3>No consumed products</h3> }
                </div>
            </div>
        );
    }
}

export default Home;