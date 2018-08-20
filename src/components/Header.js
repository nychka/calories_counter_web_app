import React from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'rc-progress';
import { Navbar, NavbarBrand, FormGroup} from 'reactstrap';
import Creatable from 'react-select/lib/Creatable';
import {userSignedIn, currentUser, axio, history, defaultHeaders, isValidNewOption} from "../utils";

class Header extends React.Component
{
    constructor(props) {
        super(props);

        this.siteName = 'Calories Counter';
        this.state = {
            isOpen: false,
            progressPercent: 25,
            productsOptions: [],
            selectedProduct: {value: '', label: <span>Type product title here...</span>},
            style: {
                fontWeight: 'bold',
                fontSize: 'large'
            },
            selectKey: 0
        };
    }

    getProducts(){
        const self = this;
        if(this.state.productsOptions.length) return this.state.productsOptions;

        return axio({
            method: 'get',
            url: '/products',
            headers: defaultHeaders()
        })
        .then(function (response) {
            console.log(response);
            const options = response.data.products.map(product => {
                const label = <span><img width={'48px'} height={'48px'} src={product.image} />{product.lang.en}</span>;
                return {value: product.lang.en, label: label}
            });
            self.setState((prevState) => {
                console.log('changing state');
                return { productsOptions: options };//, selectKey: prevState.selectKey + 1 };
            });
            console.log('get products...done!');
            return options;
        })
        .catch(function (response) {
            console.log(response);
            history.push({
                pathname: '/logout',
                state: { error: '401' }
            });
        });
    }

    componentDidMount(){
        console.log('get products...');
       this.getProducts();
    }

    pickProductHandler(selected){
        console.log(selected);
        //this.setState({selectedProduct: selected});
        this.props.addCalories(selected);
    }

    handleCreate(){
        console.log('create here');
    }

    render(){
        const progress = this.props.consumedCalories / (this.props.caloriesLimit / 100);
        return(
            <div>
                <Navbar color="light" light expand="md" className="">
                    <NavbarBrand tag={Link} to="/">{ this.siteName }</NavbarBrand>
                    <span style={this.state.style}>{this.props.consumedCalories} / {this.props.caloriesLimit}</span>
                </Navbar>
                <Line percent={progress} strokeWidth="1" strokeColor="#2db7f5" />
                <FormGroup row>
                    <Creatable
                        value={this.state.selectedProduct}
                        onChange={this.pickProductHandler.bind(this)}
                        options={this.state.productsOptions}
                        className={'form-control'}
                        onCreateOption={this.handleCreate}
                        isSearchable
                        isValidNewOption={isValidNewOption}
                        placeholder={'Search product'}
                    />
                </FormGroup>
            </div>
        );
    }
}

export default Header;