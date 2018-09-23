import React from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Label, FormGroup } from 'reactstrap';
import { history } from '../../utils';

class ProductNew extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            willConsume: true,
            product: { image: '/icons/product-placeholder.png', lang: { en: ''}, nutrition: { calories: '', weight: 100 }},
        }
    }
    setCalories(e){
        const product = Object.assign({}, this.state.product);
        const calories = parseInt(e.target.value, 10);
        product.nutrition.calories = calories;
        
        this.setState({ product: product });
    }

    setTitle(e){
        const product = Object.assign({}, this.state.product);
        const title = e.target.value;
        product.lang.en = title;
        
        this.setState({ product: product });
    }

    setWeight(e){
        const product = Object.assign({}, this.state.product);
        const weight = parseInt(e.target.value, 10);
        product.nutrition.weight = weight;
        
        this.setState({ product: product });
    }

    save = () => {
        const product = this.state.product;
        this.props.addProduct(product);
        const path = this.state.willConsume ? '/meals/new' : '/';
        history.push({pathname: path, state: { uuid: product.lang.en, product: product }});
    }

    setWillConsume(e){
       this.setState({willConsume: !this.state.willConsume});
    }
    

    componentDidUpdate(){
       
    }

    componentDidMount(){
        const title = this.props.location.state && this.props.location.state.title;
        if(title && title.length){
            const product = Object.assign({}, this.state.product);
            product.lang.en = title;
    
            this.setState({product: product});
        }
    }

    render(){
        const product = this.state.product;
        return (
            <div className={'d-flex flex-column meal-new '}>
                <div className={'d-flex flex-row mb-5 align-self-center justify-content-center meal-new-top'}>
                 <img src={product.image} alt="Card" />
                </div>
                <div className={'d-flex flex-row mb-5 align-self-center meal-new-title'}>
                    <Input className={'d-flex flex-column product-new-title'} type='text' placeholder={'e.g. apple'} onChange={this.setTitle.bind(this)} value={this.state.product.lang.en}/>
                </div>
                <div className={'d-flex jutify-content-center align-self-center flex-row mb-5'}>
                    
                    <div className={'d-flex flex-row'}>
                        <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                            <img src={'/icons/food-scale-tool.svg'} alt={'calorie'} />
                        </div>
                        <Input className={'d-flex flex-column meal-new-square meal-new-square-input'} type='number' disabled value={this.state.product.nutrition.weight}/>
                    </div>

                    <div className={'d-flex flex-row'}>
                        <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                            <img src={'/icons/calorie.svg'} alt={'calorie'} />
                        </div>
                        <Input className={'d-flex flex-column meal-new-square meal-new-square-input'} type='text' onChange={this.setCalories.bind(this)} value={this.state.product.nutrition.calories}/>
                    </div>
        
                </div>
                <FormGroup check>
                    <Label for="willConsume">
                        <Input type='checkbox' id='willConsume' checked={this.state.willConsume} value={this.state.willConsume} onChange={this.setWillConsume.bind(this)} />
                        Add meal after
                    </Label>
                </FormGroup>
                <div className={'d-flex justify-content-center meal-new-bottom'} onClick={this.save.bind(this)}>{this.state.willConsume ? 'Add and consume' : 'Add'}</div>
            </div>
        )
    }
}

export default withRouter(ProductNew);
