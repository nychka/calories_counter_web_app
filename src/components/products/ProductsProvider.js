import React from "react";
import {axio, defaultHeaders, history, isRightMoment} from "../../utils";
import { toMomentObject } from 'react-dates';
import createFilterOptions from 'react-select-fast-filter-options'
import Product from '../../lib/Product';
import Meal from '../../lib/Meal';

export const ProductsContext = React.createContext({});

export class ProductsProvider extends React.Component{
    constructor(props){
        super(props);
        // const meals = this.getItem('meals');
        // const products = this.getItem('products');
        const todayMoment = toMomentObject(new Date());

        this.state = {
            lang: 'en',
            selectedProductText: 'Type or select product',
            searchIndexes: [['lang', 'ua'], ['lang', 'ru'], ['lang', 'en']],
            caloriesLimit: 2000,
            consumedCalories: 0,
            products: [],//products,
            meals: [],//meals,
            productsOptions: [],
            filterOptions: [],
            todayMoment: todayMoment,
            moment: todayMoment,
            isLoading: false,
            selectedProduct: {value: '', label: ''},
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

    setSelectedProduct = (text) => {
        const product = { value: '', label: <span>{text}</span> };

        this.setState({ selectedProduct: product });
    }

    startLoading = () => {
        this.setState({isLoading: true });
        this.setState({selectedProduct: this.buildProductOption({lang: {en: 'Please wait - Products are loading'}}, 'default-option')});
    }

    finishLoading = () => {
        this.setState({isLoading: false });
        this.setState({selectedProduct: this.buildProductOption( { lang: {en: this.state.selectedProductText} }, 'default-option')});
    }

    componentDidMount(){
        this.setSelectedProduct(this.state.selectedProductText);
        this.fetch();
        this.pickMoment(this.state.moment);
    }

    isPresentMoment = () => isRightMoment(toMomentObject(new Date()), this.state.moment);

    mealsByDate = (date) => (
        this.state.meals.filter(product => {
            return isRightMoment(toMomentObject(new Date(product.consumedAt)), date)
        })
    )

    setConsumedCaloriesByDate = (date) => {
        const products = this.mealsByDate(date);
        const calories = this.countConsumedCalories(products);
        this.setState({consumedCalories: calories});
    }

    pickMoment(date){
        this.setConsumedCaloriesByDate(date);
        this.setState({moment: date});
    }

    removeHandler = (product) => {
        const id = parseInt(product.target.parentElement.getAttribute('data-id'), 10);

        this.setState((prevState) => {
            const meals = prevState.meals.filter(item => item.consumedAt !== id); 
            //this.saveItem('meals', meals);

            return { meals: meals };
        }, () => {
            this.setConsumedCaloriesByDate(this.state.moment);
        });
    }

    showHandler = (e) => {
        let id = e.target.parentElement.getAttribute('key');
        
        history.push({pathname: '/meals/' + id});
    }

    pickProductHandler(selected){
        if(!selected) return false;

        if(selected.action === 'create-option'){
            history.push({pathname: '/products/new', state: { title: selected.value }});
        }else if(selected.action === 'select-option' && selected.value.length >= 2){
            history.push({pathname: '/meals/new', state: { uuid: selected.value }});
        }
    }

    countConsumedCalories = (meals) => {
        let consumedCalories = 0;
        meals.map(product => (consumedCalories += parseInt(product.nutrition.calories, 10)));
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
            const meals = Object.assign([], prevState.meals);
            product.consumedAt = new Date().getTime();
            meals.push(product);
            //this.saveItem('meals', meals);
            console.log(product);
            const meal = { 
                product_id: product.id, 
                weight: product.nutrition.weight,
                created_at: product.consumedAt
            }
            Meal.create(meal);

            return { meals: meals }
        }, () => {
            this.setConsumedCaloriesByDate(this.state.moment);
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

        Product.create(product);

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
        return this.state.meals.find(product => product.lang.en === value);
    }

    findMealBy(key, value){
        return this.state.meals.find(product => product[key] === value);
    }

    buildProductOption = (product, action = 'select-option') => {
        const label = <span>
                {product.image && <img width={'48px'} height={'48px'} src={product.image} alt='product-option' />}
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
        const label = <span>
            <img width={'48px'} height={'48px'} src={'/icons/product-placeholder.png'} alt='product-placeholder' />
            {labelText}
        </span>;
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
            this.startLoading();
            Product.all()
            .then(products => {
                console.log(products);
                self.setState({products: products});
                self.buildProductsOptions();
                console.info('GET products from API');
                self.finishLoading();
            })
            // return axio({
            //     method: 'get',
            //     url: '/products',
            //     headers: defaultHeaders()
            // })
            // .then(function (response) {
            //     console.log(response);
            //     self.setState({products: response.data.products});
            //     //self.saveItem('products',response.data.products);
            //     self.buildProductsOptions();
            //     console.info('GET products from API');
            //     self.finishLoading();

            //     return response.data.products;
            // })
            // .catch(function (response) {
            //     console.log(response);
            //     history.push({
            //         pathname: '/logout',
            //         state: { error: '401' }
            //     });
            // });
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