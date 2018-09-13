import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardImg, CardTitle, CardSubtitle, CardBody, Button} from 'reactstrap';

class ProductCard extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const product = this.props.product;
        return(
            <div key={product.id} className={'d-flex flex-column justify-content-center align-items-end mr-5 mb-5 product-card'}>
                <div className={'d-flex flex-row mt-auto product-card-body'}>
                    <img src={product.image} alt="Card image cap" />
                </div>
                <div className={'d-flex flex-row product-card-bottom mt-auto align-self-stretch justify-content-center align-items-center'}>
                    {product.nutrition.calories} kkal
                    </div>
            </div>
        )
    }
};

export default ProductCard;