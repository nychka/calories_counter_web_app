import React from 'react';
import { withRouter } from 'react-router-dom';
import { Input } from 'reactstrap';

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
        const updatedWeight = parseInt(e.target.value, 10);

        product.nutrition.calories = updatedWeight ? Math.round(updatedWeight * product.nutrition.ratio) : '';
        product.nutrition.weight = updatedWeight;

        this.setState({ product: product, weight: updatedWeight });
    }

    calculate(){
        const product = Object.assign({}, this.state.product);
        const weight = product.nutrition.hasOwnProperty('weight') ? parseInt(product.nutrition.weight, 10) : 100;
        const calories = parseInt(product.nutrition.calories, 10);

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
                 <img src={product.image} alt="Card" />
                </div>
                <div className={'d-flex flex-row mb-5 align-self-center meal-new-title'}>{product.lang.en}</div>
                <div className={'d-flex jutify-content-center align-self-center flex-row mb-5'}>
                    
                    <div className={'d-flex flex-row'}>
                        <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                            <img src={'/icons/food-scale-tool.svg'} alt={'calorie'} />
                        </div>
                        <Input className={'d-flex flex-column meal-new-square meal-new-square-input'} type='number' min="0" step="50" onChange={this.setCalories.bind(this)} value={this.state.weight}/>
                    </div>

                    <div className={'d-flex flex-row'}>
                        <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                            <img src={'/icons/calorie.svg'} alt={'calorie'} />
                        </div>
                        <Input className={'d-flex flex-column meal-new-square meal-new-square-input'} disabled type='text' value={parseInt(this.state.product.nutrition.calories, 10) ? this.state.product.nutrition.calories : ':P'}/>
                    </div>
        
                </div>
                <div className={'d-flex justify-content-center meal-new-bottom'} onClick={this.calculate.bind(this)}> + Add</div>
            </div>
        )
    }
}

export default withRouter(MealsNew);
