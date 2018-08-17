import React from "react";
import axios from "axios";

export const CategoriesContext = React.createContext({});

export class CategoriesProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            api_host: process.env.REACT_APP_API_HOST,
            currentPage: 1,
            totalPages: 0,
            categories: [],
            pageHandler: this.pageHandler.bind(this),
            fetch: this.fetch.bind(this),
            addHandler: this.addHandler.bind(this),
            editHandler: this.editHandler.bind(this),
            removeHandler: this.removeHandler.bind(this),
            // showHandler: this.showHandler.bind(this)
        };
        console.log('ProductsProvider constructor');
    }

    componentDidMount(){
        this.fetch();
        console.log('categories provider did mount');
    }

    pageHandler = e => {
        this.state.currentPage = e.selected + 1;
        this.fetch();
    }

    fetch = (callback) => {
        console.log('fetching categories...');
        const self = this;
        axios({
            method: 'get',
            url: self.state.api_host + '/categories?page='+self.state.currentPage,
            config: { headers: {'Content-Type': 'json' }}
        })
            .then(function (response) {
                console.log(response);
                self.setState({categories: response.data.categories});
                self.setState({totalPages: response.data.meta.totalPages});
                callback.call(this, response.data.categories);
            })
            .catch(function (response) {
                console.log(response);
            });
    }


    addHandler = (product) => {
        let products = this.state.categories;
        products.unshift(product);

        this.setState({categories: products});
    }

    editHandler = (product) => {
        let products = this.state.categories;

        products.map((item, i) => {
            if(item.id === product.id){
                products[i] = product;
                return true;
            }
        });

        this.setState({categories: products});
    }

    removeHandler = product => {
        let canRemove = window.confirm('Are you really want to delete this product?');
        let url = `${this.state.api_host}/categories/${product.id}`;
        let products = this.state.categories;
        const self = this;

        if(canRemove){
            axios.delete(url)
                .then((response) => {
                    products.map((item, i) => {
                        if(item.id === product.id){
                            products.splice(i, 1);
                            self.setState({categories: products});
                            return false;
                        }
                    });
                    console.log(response);
                })
                .catch((response) => {
                    console.log(response);
                })
        }else{
            return false;
        }
    }

    render(){
        return(
            <CategoriesContext.Provider value={this.state}>
                {this.props.children}
            </CategoriesContext.Provider>
        )
    }
}