import React from 'react';
import { withRouter } from 'react-router-dom';
import { Input} from 'reactstrap';
import { history } from '../../utils';

class MealsShow extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            product: { image: '', lang: { en: ''}, nutrition: { calories: 1, weight: 1 }},
            weight: 100
        }
    }
    setCalories(e){
        const product = Object.assign({}, this.state.product);
        const updatedWeight = parseInt(e.target.value);

        product.nutrition.calories = updatedWeight ? Math.round(updatedWeight * product.nutrition.ratio) : '';
        product.nutrition.weight = updatedWeight;

        this.setState({ product: product, weight: updatedWeight });
    }

    calculate(){
        const product = Object.assign({}, this.state.product);
        const weight = product.nutrition.hasOwnProperty('weight') ? parseInt(product.nutrition.weight) : 100;
        const calories = parseInt(product.nutrition.calories);

        if(weight && calories){
            this.props.addCalories(product);
        }else{
            alert('Please set correct weight in grams');
        }
    }

    componentDidUpdate(){
        if(this.props.match.params.id !== this.state.product.lang.en){
            this.setProduct();
        }
    }

    setProduct(){
        const self = this;
        const meal = self.props.findMealByValue(self.props.match.params.id);
        this.setState({product: meal});
    }

    componentDidMount(){
        this.setProduct();
    }

    render(){
        const product = this.state.product;
        return (
            <div className={'d-flex flex-column meal-new '}>
                <div className={'d-flex flex-row mb-5 align-self-center justify-content-center meal-new-top'}>
                 <img src={product.image} alt="Card image cap" />
                </div>
                <div className={'d-flex flex-row mb-5 align-self-center meal-new-title'}>{product.lang.en}</div>
                <div className={'d-flex jutify-content-around flex-row mb-5'}>
                    <Input className={'d-flex flex-column meal-new-square'} disabled type='number' onChange={this.setCalories.bind(this)} value={this.state.product.nutrition.weight}/>
                    <Input className={'d-flex flex-column meal-new-square'} disabled type='text' value={parseInt(this.state.product.nutrition.calories) ? this.state.product.nutrition.calories + ' kkal' : ':P'}/>
                </div>
                <div className={'d-flex justify-content-around'}>
                    <div className={'d-flex justify-content-center meal-cancel-button'} onClick={() => { history.goBack(); }}>Cancel</div>
                    <div className={'d-flex justify-content-center meal-save-button'} onClick={() => {}}>Save</div>
                </div>
            </div>
        )
    }
}

export default withRouter(MealsShow);
