import React from "react";
import {axio, defaultHeaders, history} from "../../utils";

export const ProductsContext = React.createContext({});

export class ProductsProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentPage: 1,
            totalPages: 0,
            currentAmount: 0,
            totalAmount: 100,
            products: [],
            pageHandler: this.pageHandler.bind(this),
            fetch: this.fetch.bind(this),
            addHandler: this.addHandler.bind(this),
            editHandler: this.editHandler.bind(this),
            removeHandler: this.removeHandler.bind(this),
            showHandler: this.showHandler.bind(this)
        }
        console.log('Products Provider constructor');
    }

    componentDidMount(){
        this.fetch();
        console.log('products provider did mount');
    }

    pageHandler = e => {
        this.state.currentPage = e.selected + 1;
        this.fetch();
    }

    fetch(){
        const self = this;
        axio({
            method: 'get',
            url: '/products?page='+self.state.currentPage,
            headers: defaultHeaders()
        })
            .then(function (response) {
                console.log(response);
                self.setState({products: response.data.products});
                self.setState({totalPages: response.data.meta.totalPages});
                self.setProgress(response.data.meta.total);
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