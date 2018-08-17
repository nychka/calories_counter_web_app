import React from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

class Header extends React.Component
{
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.siteName = 'Calories Counter Admin';
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render(){
        return(
            <div>
                <Navbar color="light" light expand="md" className="">
                    <NavbarBrand tag={Link} to="/">{ this.siteName }</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="" navbar>
                            <NavItem>
                                <NavLink tag={Link} className="btn btn-default" to="/products/new">New Product</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="btn btn-default" to="/categories/new">New Category</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/products">Products</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/categories">Categories</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Header;