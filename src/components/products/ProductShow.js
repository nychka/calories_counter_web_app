import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

class ProductShow extends React.Component{

    render(){
        const product = this.props.location.state.product;
        return(
            <div>
                <Card>
                    <CardImg top width="200px" src={product.image} alt="Card image cap" />
                    <CardBody>
                        <CardTitle>{product.lang.en}</CardTitle>
                        <CardSubtitle>{product.category_id}</CardSubtitle>
                        <CardText>
                            {product.nutrition.calories}
                        </CardText>
                        <Link to={{ pathname: `/products` }}>Cancel</Link>
                        <Link to={{ pathname: `/products/'${product.id}/edit`, state: { product: product } }}>Edit</Link>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default ProductShow;