import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { history } from '../../utils';

class ProductCard extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const product = this.props.product;
        const showPath = '/meals/'+ product.consumedAt;
        return(
            <div key={product.consumedAt} className={'d-flex flex-column justify-content-center align-items-end mr-5 mb-5 product-card'}>
                <div className={'d-flex flex-row product-card-top mb-auto align-self-stretch justify-content-end align-items-center'}>
                    <div onClick={this.props.removeHandler} data-id={product.consumedAt} height="2rem" className={'d-flex product-card-remove-wrapper align-self-right'}>
                         <img className={'product-card-remove'} src={'/icons/remove.png'} width="100%" height="100%"/> 
                    </div>
                </div>
               
                <Link to={showPath}>
                    <div className={'d-flex flex-row-reverse mt-auto product-card-body'}>
                        <img onClick={this.props.showHandler} src={product.image} alt="Card image cap" />
                    </div>
                    <div className={'d-flex flex-row product-card-bottom mt-auto align-self-stretch justify-content-center align-items-center'}>
                        {product.nutrition.calories} kkal
                    </div>
                </Link>
            </div>
        )
    }
};

export default ProductCard;