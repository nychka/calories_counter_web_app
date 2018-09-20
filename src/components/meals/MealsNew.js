import React from 'react';
import { withRouter } from 'react-router-dom';
import { Input} from 'reactstrap';

class MealsNew extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            product: { image: '', lang: { en: ''}, nutrition: { calories: 1, weight: 100 }},
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
       
    }

    setProduct(){
        const self = this;
        const uuid = self.props.location.state.uuid;
        const product = self.props.findProductByValue(uuid);
        
        self.setState((prevState) => {
            product.nutrition.ratio = product.nutrition.calories / 100;
            return { product: product };
        });
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
                    <Input className={'d-flex flex-column meal-new-square'} type='number' onChange={this.setCalories.bind(this)} value={this.state.weight}/>
                    <Input className={'d-flex flex-column meal-new-square'} disabled type='text' value={parseInt(this.state.product.nutrition.calories) ? this.state.product.nutrition.calories + ' kkal' : ':P'}/>
                </div>
                <div className={'d-flex justify-content-center meal-new-bottom'} onClick={this.calculate.bind(this)}> + Add</div>
            </div>
        )
    }
}

export default withRouter(MealsNew);
