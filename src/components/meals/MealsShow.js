import React from 'react';
import { withRouter } from 'react-router-dom';
import { Input} from 'reactstrap';
import { history } from '../../utils';

class MealsShow extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            product: { image: '', lang: { en: ''}, nutrition: { calories: 1, weight: 1 }}
        }
    }

    setProduct(){
        const self = this;
        const uuid = parseInt(self.props.match.params.id, 10);
        const meal = self.props.findMealBy('consumedAt', uuid);

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
                 <img src={product.image} alt="Card" />
                </div>
                <div className={'d-flex flex-row mb-5 align-self-center meal-new-title'}>{product.lang.en}</div>
                <div className={'d-flex jutify-content-center align-self-center flex-row mb-5'}>
                    
                    <div className={'d-flex flex-row'}>
                        <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                            <img src={'/icons/food-scale-tool.svg'} alt={'calorie'} />
                        </div>
                        <Input className={'d-flex flex-column meal-new-square meal-new-square-input'} type='text' disabled value={product.nutrition.weight}/>
                    </div>

                    <div className={'d-flex flex-row'}>
                        <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                            <img src={'/icons/calorie.svg'} alt={'calorie'} />
                        </div>
                        <Input className={'d-flex flex-column meal-new-square meal-new-square-input'} disabled type='text' value={product.nutrition.calories}/>
                    </div>
        
                </div>
                <div className={'d-flex justify-content-center meal-new-bottom'} onClick={() => { history.push({pathname: '/'})}}>
                    Cancel
                </div>
            </div>
        )
    }
}

export default withRouter(MealsShow);
