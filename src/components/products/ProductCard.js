import React from 'react';
import { Card, CardImg, CardTitle, CardSubtitle, CardBody, Button} from 'reactstrap';

class ProductCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            style: {
                width: '120px',
                border: '1px',
                margin: '5px'
            }
        }
    }

    render(){
        const product = this.props.product;
        return(
            <Card style={this.state.style}>
                <CardImg top src={product.image} alt="Card image cap" />
                <CardBody>
                    <CardTitle>{product.lang.en}</CardTitle>
                    <CardSubtitle>{product.nutrition.calories}</CardSubtitle>
                    <Button>Button</Button>
                </CardBody>
            </Card>
        )
    }
};

export default ProductCard;