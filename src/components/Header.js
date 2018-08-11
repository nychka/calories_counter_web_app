import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
  } from 'reactstrap';
import { userSignedIn, currentUser } from "../utils";

class Header extends React.Component
{
    state = {
        dropdownOpen: false
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.siteName = 'Calories Counter Admin';
        this.state = {
            isOpen: false
        };
    }
    dropdownToggle() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }
    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render(){
        return(
            <div>
                <Navbar color="light" light expand="md" className="">
                    <NavbarBrand href="/">{ this.siteName }</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    { userSignedIn() ?
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="" navbar>
                            <NavItem>
                                <NavLink className="btn btn-default" href="/products/new">New Product</NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink className="btn btn-default" href="/categories/new">New Category</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/products">Products</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/categories">Categories</NavLink>
                            </NavItem>
                        </Nav>
                        <Nav className='ml-md-auto'>
                            <NavItem>
                                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.dropdownToggle.bind(this)}>
                                    <DropdownToggle caret>
                                        { currentUser().email }
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem disabled><NavLink href={'/me'}>Profile</NavLink></DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem><NavLink href={'/logout'}>Log out</NavLink></DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    : '' }
                </Navbar>
            </div>
        );
    }
}

export default Header;