import React from 'react';
import { Router } from 'react-router-dom';
import ProductCard from './products/ProductCard';
import {isValidNewOption, isRightMoment, history} from "../utils";
import VirtualizedSelect from "react-virtualized-select";
import { SingleDatePicker, toMomentObject } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import "react-virtualized-select/styles.css";

class Home extends React.Component
{
    constructor(props){
        super(props);
        this.state = {
            focused: false
        }
        this.todayMoment = toMomentObject(new Date());
        this.isRightMoment = (moment) => isRightMoment(moment, this.props.moment);
    }

    componentDidMount(){
        this.consumedDays = this.props.consumedProducts.map(product => toMomentObject(new Date(product.consumedAt)));
        this.consumedDays.push(toMomentObject(new Date()));
    }

    componentDidUpdate(props){
        if(props.moment === this.todayMoment) return false;
        console.log(props);
        //this.props.pickMoment(this.todayMoment);
    }

    isOutsideRange = (day) => {
        return !this.consumedDays.some(consumedDay => isRightMoment(consumedDay, day));
    }

    isDayHighlighted = (day) => {
        return isRightMoment(day, this.todayMoment);
    }

    render(){
        const self = this;
        const consumedProducts = this.props.consumedProducts.filter(product => {
            const moment = toMomentObject(new Date(product.consumedAt));
            return self.isRightMoment(moment);
        });

        return(
            <div className='d-flex flex-column'>
                {this.props.isPresentMoment() && <div id={'select-products'}>
                    <VirtualizedSelect
                    value={this.props.selectedProduct}
                    onChange={this.props.pickProductHandler}
                    filterOptions={this.props.filterOptions}
                    options={this.props.productsOptions}
                    className={'search-products'}
                    isSearchable
                    isValidNewOption={isValidNewOption}
                    placeholder={'Search product'}
                    onInputChange={this.props.onInputChange}
                    optionHeight={64}
                    maxHeight={500}
                    clearable={false}
                   />
                </div> }
                <div id={'select-date'} className={'d-flex mt-3 md-3'}>
                    <SingleDatePicker
                        date={this.props.moment}
                        onDateChange={(date => this.props.pickMoment(date))}
                        focused={this.state.focused}
                        onFocusChange={({ focused }) => this.setState({ focused })}
                        id="date-picker"
                        numberOfMonths={1}
                        displayFormat="D MMM YYYY"
                        customInputIcon={<img src='/icons/calendar.svg' width="32px" alt='calendar' />}
                        readOnly
                        withPortal
                        isOutsideRange={this.isOutsideRange.bind(this)}
                        isDayHighlighted={this.isDayHighlighted.bind(this)}
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