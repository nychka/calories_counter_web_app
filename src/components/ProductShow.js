import React from 'react';
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
                        {process.env.REACT_APP_FEATURE_EDIT_PRODUCT ?
                            <Button color='warning'>Edit</Button>
                            : ''
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default ProductShow;