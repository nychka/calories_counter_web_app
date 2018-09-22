import React from "react";
import {axio, defaultHeaders, history, isRightMoment} from "../../utils";
import { toMomentObject } from 'react-dates';
import createFilterOptions from 'react-select-fast-filter-options'

export const ProductsContext = React.createContext({});

export class ProductsProvider extends React.Component{
    constructor(props){
        super(props);
        const consumedProducts = this.getItem('consumedProducts');
        const products = this.getItem('products');
        const moment = this.getMoment();
        const searchPlaceholder = <span>Type product title here...</span>;

        this.state = {
            lang: 'en',
            searchIndexes: [['lang', 'ua'], ['lang', 'ru'], ['lang', 'en']],
            currentPage: 1,
            totalPages: 0,
            currentAmount: 0,
            totalAmount: 100,
            caloriesLimit: 2000,
            products: products,
            productsOptions: [],
            filterOptions: [],
            moment: moment,
            consumedProducts: consumedProducts,
            consumedCalories: this.countConsumedCalories(consumedProducts),
            selectedProduct: {value: '', label: searchPlaceholder},
            fetch: this.fetch.bind(this),
            addCalories: this.addCalories.bind(this),
            findProductByValue: this.findProductByValue.bind(this),
            findMealByValue: this.findMealByValue.bind(this),
            findMealBy: this.findMealBy.bind(this),
            pickProductHandler: this.pickProductHandler.bind(this),
            pickMoment: this.pickMoment.bind(this),
            isPresentMoment: this.isPresentMoment.bind(this),
            removeHandler: this.removeHandler.bind(this),
            addProduct: this.addProduct.bind(this),
            onInputChange: this.onInputChange.bind(this)
        }
    }

    componentDidMount(){
        this.fetch();
    }

    isPresentMoment = () => isRightMoment(toMomentObject(new Date()), this.state.moment);

    pickMoment(date){
        this.setState({moment: date});
    }

    removeHandler = (product) => {
        const id = parseInt(product.target.parentElement.getAttribute('data-id'));

        this.setState((prevState) => {
            const consumedProducts = prevState.consumedProducts.filter(item => item.consumedAt !== id); 
            const consumedCalories = this.countConsumedCalories(consumedProducts);
            this.saveItem('consumedProducts', consumedProducts);

            return { consumedProducts: consumedProducts, consumedCalories: consumedCalories };
        });
    }

    showHandler = (e) => {
        let id = e.target.parentElement.getAttribute('key');
        
        history.push({pathname: '/meals/' + id});
    }

    pickProductHandler(selected){
        if(selected.action === 'create-option'){
            history.push({pathname: '/products/new', state: { title: selected.value }});
        }else if(selected.action === 'select-option' && selected.value.length >= 2){
            history.push({pathname: '/meals/new', state: { uuid: selected.value }});
        }
    }

    countConsumedCalories = (consumedProducts) => {
        let consumedCalories = 0;
        consumedProducts.map(product => (consumedCalories += parseInt(product.nutrition.calories)));
        return consumedCalories;
    }

    saveItem = (key, value) => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    getItem = (key) => {
        return JSON.parse(window.localStorage.getItem(key)) || [];
    }

    addCalories(product){
        this.setState((prevState) => {
            if(!prevState.moment){
                alert.error('moment is not set! Pick right moment;)');
                return false;
            }
            const consumedProducts = prevState.consumedProducts;
            product.consumedAt = new Date().getTime();
            consumedProducts.push(product);
            const consumedCalories = this.countConsumedCalories(consumedProducts);
            this.saveItem('consumedProducts', consumedProducts);

            return { consumedProducts: consumedProducts, consumedCalories: consumedCalories }
        });
        history.push('/');
    }

    addProduct = (product) => {
        const options = Object.assign([], this.state.productsOptions);
        const products = Object.assign([], this.state.products);
        const option = this.buildProductOption(product);
        options.push(option);
        products.push(product);
        const filterOptions = createFilterOptions({ options });

        this.setState({
            productsOptions: options,
            filterOptions: filterOptions,
            products: products
        });
    }

    findProductByValue(value){
        return this.state.products.find(product => product.lang.en === value);
    }

    findMealByValue(value){
        return this.state.consumedProducts.find(product => product.lang.en === value);
    }

    findMealBy(key, value){
        return this.state.consumedProducts.find(product => product[key] === value);
    }

    buildProductOption = (product, action = 'select-option') => {
        const label = <span>
                <img width={'48px'} height={'48px'} src={product.image} />
                {product.lang[this.state.lang]}
        </span>;
        return { value: product.lang[this.state.lang], label: label, lang: product.lang, action: action };
    }

    onInputChange = (newCreateValue) => {
        console.log(newCreateValue);

        const getUpdatedOptions = (options, newCreateValue) => {
            options[0] = this.buildCreateOption(newCreateValue);
            return options;
        }
        const oldOptions = Object.assign([], this.state.productsOptions);
        const newOptions = getUpdatedOptions(oldOptions, newCreateValue);

        const filterOptions = createFilterOptions({
            indexes: this.state.searchIndexes,
            options: newOptions
        });
    
        this.setState({productsOptions: newOptions, filterOptions: filterOptions});
    }

    buildCreateOption = (newCreateValue) => {
        const labelText = newCreateValue.length ? `Create product "${newCreateValue}"` : 'Create product';
        const label = <span>{labelText}</span>;
        return { value: newCreateValue, label: label, lang: { en: newCreateValue}, action: 'create-option' };
    }

    buildProductsOptions = () => {
        const self = this;
        const options = this.state.products.map(product => {
            return self.buildProductOption(product);   
        });
        options.unshift(this.buildCreateOption(''));
    
        const filterOptions = createFilterOptions({
            indexes: this.state.searchIndexes,
            options: options
        });

        self.setState({ productsOptions: options, filterOptions: filterOptions });
    }

    fetch(){
        const self = this;

        if(this.state.products.length) {
            console.info('GET products from localStorage');
            if(!this.state.productsOptions.length) self.buildProductsOptions();
            return Promise.resolve(this.state.products);
        }else{
            return axio({
                method: 'get',
                url: '/products',
                headers: defaultHeaders()
            })
            .then(function (response) {
                console.log(response);
                self.setState({products: response.data.products});
                self.saveItem('products',response.data.products);
                self.buildProductsOptions();
                console.info('GET products from API');

                return response.data.products;
            })
            .catch(function (response) {
                console.log(response);
                history.push({
                    pathname: '/logout',
                    state: { error: '401' }
                });
            });
        }
    }

    render(){
        return(
            <ProductsContext.Provider value={this.state}>
                {this.props.children}
            </ProductsContext.Provider>
        )
    }
}

ProductsProvider.prototype.getMoment = () => toMomentObject(new Date());