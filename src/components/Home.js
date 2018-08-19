import React from 'react';
import { Link } from 'react-router-dom';
import {Jumbotron, NavLink } from 'reactstrap';
import { Line } from 'rc-progress';
import { userSignedIn } from "../utils";
import Login from './Login';
import { CategoriesContext} from "./categories/CategoriesProvider";
import { ProductsContext} from "./products/ProductsProvider";

class Home extends React.Component
{
    render(){
        return(
            <div>
               <h1>Todo</h1>
            </div>
        );
    }
}

export default Home;