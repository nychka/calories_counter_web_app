import React, {Fragment} from 'react';
import ProductCard from './products/ProductCard';
import {isValidNewOption, isRightMoment} from "../utils";
import Creatable from "react-select/lib/Creatable";
import { SingleDatePicker, toMomentObject } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

class Home extends React.Component
{
    constructor(props){
        super(props);
        this.state = {
            focused: false
        }
        this.isRightMoment = (moment) => isRightMoment(moment, this.props.moment);
    }

    render(){
        debugger;
        const self = this;
        const consumedProducts = this.props.consumedProducts.filter(product => {
            const moment = toMomentObject(new Date(product.consumedAt));
            return self.isRightMoment(moment);
        });

        return(
            <div className='d-flex flex-column'>
                <div id={'select-date'}>
                    <SingleDatePicker
                        date={this.props.moment} // momentPropTypes.momentObj or null
                        onDateChange={(date => this.props.pickMoment(date))} // PropTypes.func.isRequired
                        focused={this.state.focused} // PropTypes.bool
                        onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                        id="your_unique_id" // PropTypes.string.isRequired,
                    />
                </div>
                { this.isRightMoment(toMomentObject(new Date()), this.props.moment) &&
                <div id={'select-products'}>
                    <Creatable
                    value={this.props.selectedProduct}
                    onChange={this.props.pickProductHandler}
                    options={this.props.productsOptions}
                    className={'search-products'}
                    onCreateOption={this.props.handleCreate}
                    isSearchable
                    isValidNewOption={isValidNewOption}
                    placeholder={'Search product'}
                   />
                </div> }
                <div className={'d-flex flex-wrap align-items-end mt-3 consumed-products-wrapper'}>
                {
                    consumedProducts.length ?
                    consumedProducts.map(product => <ProductCard key={product.id} product={product}/>)
                    : <h3>No consumed products</h3> }
                </div>
            </div>
        );
    }
}

export default Home;