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
            selectedProduct: {value: '', label: <span>Type product title here...</span>},
            style: {
                fontWeight: 'bold',
                fontSize: 'large'
            },
            selectKey: 0
        };
    }

    componentDidMount(){
        const self = this;
        console.log('get products...');
       // this.props.fetch()
       //     .then(products => {
       //         console.log('products fetched in ProductsProvider!', products.length);
       //      });
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
                        options={this.props.productsOptions}
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