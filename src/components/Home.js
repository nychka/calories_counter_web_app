import React from 'react';
import { Router } from 'react-router-dom';
import ProductCard from './products/ProductCard';
import {isValidNewOption, isRightMoment, history} from "../utils";
import Creatable from "react-select/lib/Creatable";
import { SingleDatePicker, toMomentObject } from 'react-dates';
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
        this.consumedDays = this.props.consumedProducts.map(product => toMomentObject(new Date(product.consumedAt)));
    }

    isOutsideRange = (day) => {
        return !this.consumedDays.some(consumedDay => isRightMoment(consumedDay, day));
    }

    render(){
        const self = this;
        const consumedProducts = this.props.consumedProducts.filter(product => {
            const moment = toMomentObject(new Date(product.consumedAt));
            return self.isRightMoment(moment);
        });

        return(
            <div className='d-flex flex-column'>
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
                <div id={'select-date'} className={'d-flex mt-3 md-3'}>
                    <SingleDatePicker
                        date={this.props.moment}
                        onDateChange={(date => this.props.pickMoment(date))}
                        focused={this.state.focused}
                        onFocusChange={({ focused }) => this.setState({ focused })}
                        id="date-picker"
                        numberOfMonths={1}
                        displayFormat="D MMM YYYY"
                        customInputIcon={<img src='/icons/calendar.svg' width="32px" />}
                        //customInputIconPosition="before"
                        readOnly
                        withPortal
                        isOutsideRange={this.isOutsideRange.bind(this)}
                    />
                </div>
                <div className={'d-flex flex-wrap align-items-end mt-3 consumed-products-wrapper'}>
                {
                    consumedProducts.length ?
                    consumedProducts.map(product => (
                        <Router history={history} key={product.consumedAt}>
                            <ProductCard 
                                key={product.consumedAt}
                                product={product}
                                showHandler={this.props.showHandler}
                                removeHandler={this.props.removeHandler}  
                            />
                            </Router>
                        ))
                    : <h3>No consumed products</h3> }
                </div>
            </div>
        );
    }
}

export default Home;