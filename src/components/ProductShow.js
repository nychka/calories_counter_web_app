import React from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import axios from "axios/index";

class ProductShow extends React.Component{

    state = {
        api_host: process.env.REACT_APP_API_HOST,
        product: { image: '', nutrition: { calories: 100}, lang: { en: 'test'}}
    }
    componentDidMount(){
        const self = this;
        axios({
            method: 'get',
            url: self.state.api_host + '/products/'+self.props.match.params.id,
            config: { headers: {'Content-Type': 'json' }}
        })
            .then(function (response) {
                console.log(response);
               self.setState({product: response.data});
            })
            .catch(function (response) {
                console.log(response);
            });
    }
    render(){
        return(
            <div>
                <Card>
                    <CardImg top height="200px" src={this.state.product.image} alt="Card image cap" />
                    <CardBody>
                        <CardTitle>{this.state.product.lang.en}</CardTitle>
                        <CardSubtitle>{this.state.product.category_id}</CardSubtitle>
                        <CardText>
                            {this.state.product.nutrition.calories}
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