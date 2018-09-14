import React, {Fragment} from 'react';
import ProductCard from './products/ProductCard';
import {isValidNewOption} from "../utils";
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
    }

    render(){
        const self = this;
        const consumedProducts = this.props.consumedProducts.filter(product => {
            const date = self.props.moment.toDate().getTime();
            const consumedAt = new Date(product.consumedAt);
            const start = consumedAt.setHours(0,0,0,0);
            const end = consumedAt.setHours(23,59,59,999);

            return start < date && end > date;
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
                </div>
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