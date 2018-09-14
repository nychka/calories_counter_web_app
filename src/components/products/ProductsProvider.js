import React from "react";
import {axio, defaultHeaders, history, userSignedIn} from "../../utils";
import { toMomentObject } from 'react-dates';

export const ProductsContext = React.createContext({});

export class ProductsProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentPage: 1,
            totalPages: 0,
            currentAmount: 0,
            totalAmount: 100,
            caloriesLimit: 2000,
            products: [],
            productsOptions: [],
            consumedProducts: [],
            consumedCalories: 0,
            moment: toMomentObject(new Date()),
            selectedProduct: {value: '', label: <span>Type product title here...</span>},
            pageHandler: this.pageHandler.bind(this),
            fetch: this.fetch.bind(this),
            addHandler: this.addHandler.bind(this),
            editHandler: this.editHandler.bind(this),
            removeHandler: this.removeHandler.bind(this),
            showHandler: this.showHandler.bind(this),
            addCalories: this.addCalories.bind(this),
            findProductByValue: this.findProductByValue.bind(this),
            pickProductHandler: this.pickProductHandler.bind(this),
            handleCreate: this.handleCreate.bind(this),
            pickMoment: this.pickMoment.bind(this)
        }
        console.log('Products Provider constructor');
    }

    componentDidMount(){
        this.fetch();
        console.log('products provider did mount');
    }

    pickMoment(date){
        this.setState({moment: date});
    }

    pickProductHandler(selected){
        console.log(selected);
        //this.setState({selectedProduct: selected});
        //this.props.addCalories(selected);
        history.push({pathname: '/products/' + selected.value});
    }

    handleCreate(){
        console.log('create here');
    }

    addCalories(product){
        console.log('product', product);
        this.setState((prevState) => {
            if(!prevState.moment){
                console.error('moment is not set! Pick right moment;)');
                return false;
            }

            const consumedProducts = prevState.consumedProducts;
            let consumedCalories = 0;
            product.consumedAt = prevState.moment;
            consumedProducts.push(product);

            consumedProducts.map(product => (consumedCalories += parseInt(product.nutrition.calories)));
            console.log('consumed products: ', consumedProducts, consumedCalories);
            return { consumedProducts: consumedProducts, consumedCalories: consumedCalories }
        });
        history.push('/');
    }

    findProductByValue(value){
        return this.state.products.find(product => product.lang.en === value);
    }

    pageHandler = e => {
        this.state.currentPage = e.selected + 1;
        this.fetch();
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

    addHandler = (product) => {
        let products = this.state.products;
        products.unshift(product);
        const total = this.state.currentAmount + 1;
        console.log(this.state.currentAmount, total);
        this.setProgress(total);

        this.setState({products: products});
    }

    editHandler = (product) => {
        let products = this.state.products;

        products.map((item, i) => {
            if(item.id === product.id){
                products[i] = product;
                return true;
            }
        });

        this.setState({products: products});
    }

    removeHandler = product => {
        let canRemove = window.confirm('Are you really want to delete this product?');
        let url = `/products/${product.id}`;
        let products = this.state.products;
        const self = this;
        const total = this.state.currentAmount;

        if(canRemove){
            axio({
                method: 'delete',
                url: url,
                headers: defaultHeaders()
            })
            .then((response) => {
                products.map((item, i) => {
                    if(item.id === product.id){
                        products.splice(i, 1);
                        self.setState({products: products});
                        self.setProgress(total - 1);
                        return false;
                    }
                });
                console.log(response);
            })
            .catch((response) => {
                console.log(response);
                history.push({
                    pathname: '/logout',
                    state: { error: response }
                });
            })
        }else{
            return false;
        }
    }

    setProgress(total){
        this.setState({currentAmount: total});
        let percent = this.state.totalAmount / 100 * total;
        this.setState({progressPercent: percent});
    }

    showHandler = (e) => {
        let id = e.target.parentElement.getAttribute('data-id');
        let product = this.state.products.find(item => item.id == id);
        history.push({
            pathname: '/products/' + id,
            state: { product: product }
        });
    }

    render(){
        return(
            <ProductsContext.Provider value={this.state}>
                {this.props.children}
            </ProductsContext.Provider>
        )
    }
}