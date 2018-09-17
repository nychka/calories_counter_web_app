import React from "react";
import {axio, defaultHeaders, history, isRightMoment} from "../../utils";
import { toMomentObject } from 'react-dates';

export const ProductsContext = React.createContext({});

export class ProductsProvider extends React.Component{
    constructor(props){
        super(props);
        const consumedProducts = this.getItem('consumedProducts');
        const moment = this.getMoment();

        this.state = {
            currentPage: 1,
            totalPages: 0,
            currentAmount: 0,
            totalAmount: 100,
            caloriesLimit: 2000,
            products: [],
            productsOptions: [],
            moment: moment,
            consumedProducts: consumedProducts,
            consumedCalories: this.countConsumedCalories(consumedProducts),
            selectedProduct: {value: '', label: <span>Type product title here...</span>},
            fetch: this.fetch.bind(this),
            addCalories: this.addCalories.bind(this),
            findProductByValue: this.findProductByValue.bind(this),
            pickProductHandler: this.pickProductHandler.bind(this),
            handleCreate: this.handleCreate.bind(this),
            pickMoment: this.pickMoment.bind(this),
            isPresentMoment: this.isPresentMoment.bind(this),
            removeHandler: this.removeHandler.bind(this)
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
            const consumedProducts = prevState.consumedProducts.filter(item => item.id !== id); 
            const consumedCalories = this.countConsumedCalories(consumedProducts);
            this.saveItem('consumedProducts', consumedProducts);

            return { consumedProducts: consumedProducts, consumedCalories: consumedCalories };
        });
    }

    showHandler = (e) => {
        let id = e.target.parentElement.getAttribute('key');
        console.log('meal', id); alert('FOO');
        
        history.push({pathname: '/meals/' + id});
    }

    pickProductHandler(selected){
        history.push({pathname: '/meals/' + selected.value + '/new'});
    }

    handleCreate(){
        alert('create here');
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
            product.consumedAt = prevState.moment;
            consumedProducts.push(product);
            const consumedCalories = this.countConsumedCalories(consumedProducts);
            this.saveItem('consumedProducts', consumedProducts);

            return { consumedProducts: consumedProducts, consumedCalories: consumedCalories }
        });
        history.push('/');
    }

    findProductByValue(value){
        return this.state.products.find(product => product.lang.en === value);
    }

    fetch(){
        if(this.state.products.length) {
            console.info('RESOLVE products');
            return Promise.resolve(this.state.products);
        }

        const self = this;
        return axio({
            method: 'get',
            url: '/products?page='+self.state.currentPage,
            headers: defaultHeaders()
        })
            .then(function (response) {
                console.log(response);
                self.setState({products: response.data.products});
                self.setState({totalPages: response.data.meta.totalPages});
                self.setProgress(response.data.meta.total);
                console.log('get products...done!');

                const options = response.data.products.map(product => {
                    const label = <span><img width={'48px'} height={'48px'} src={product.image} />{product.lang.en}</span>;
                    return {value: product.lang.en, label: label}
                });
                self.setState((prevState) => {
                    console.log('changing state productsOptions');
                    return { productsOptions: options };
                });

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

    setProgress(total){
        this.setState({currentAmount: total});
        let percent = this.state.totalAmount / 100 * total;
        this.setState({progressPercent: percent});
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