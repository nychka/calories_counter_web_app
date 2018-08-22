import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardImg, CardTitle, CardSubtitle, CardBody, Button, Input} from 'reactstrap';

class CaloriesNew extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            product: { image: '', lang: { en: ''}, nutrition: { calories: 0, weight: 100 }},
            style: {
                width: '150px',
                border: '1px',
                margin: '5px'
            }
        }
    }
    setCalories(e){
        const product = Object.assign({}, this.state.product);
        product.nutrition.weight = parseInt(e.target.value);
        console.log(product.nutrition.calories, '<=== calories set');
        this.setState({ product: product });
    }

    calculate(){
        const product = Object.assign({}, this.state.product);
        const calories = Math.ceil(product.nutrition.calories / 100 * product.nutrition.weight);
        console.log(calories, '<=== calories calculate');
        product.nutrition.calories = calories;
        this.props.addCalories(product);
    }

    componentDidUpdate(){
        console.warn('updates');
        console.log(this.props.match.params.id, this.state.product.lang.en);

        if(this.props.match.params.id !== this.state.product.lang.en){
            console.log('setting product...');
            this.setProduct();
        }
    }

    setProduct(){
        const self = this;
        this.props.fetch().then((products) => {
            console.log(products);
            const product = self.props.findProductByValue(self.props.match.params.id);
            console.log(product);
            self.setState((prevState) => {
                console.log('...product has been set', product);
                product.nutrition.weight = 100;
                return { product: product };
            });
        })
    }

    componentDidMount(){
        console.log('component did mount');
        this.setProduct();
    }

    render(){
        const product = this.state.product;
        return (
            <Card style={this.state.style}>
                <CardImg top src={product.image} alt="Card image cap" />
                <CardBody>
                    <CardTitle>{product.lang.en}</CardTitle>
                    <CardSubtitle>
                        {product.nutrition.calories} kkal /
                        <Input type='number' onChange={this.setCalories.bind(this)} value={this.state.product.nutrition.weight}/>
                        gram
                    </CardSubtitle>
                    <Button className={'btn btn-primary'} onClick={this.calculate.bind(this)}>Count</Button>
                </CardBody>
            </Card>
        )
    }
}

export default withRouter(CaloriesNew);
