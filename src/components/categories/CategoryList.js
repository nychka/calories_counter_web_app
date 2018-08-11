import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import TimeAgo from 'react-timeago'
import {API_HOST, defaultHeaders} from "../../utils";
import axios from "axios/index";

class CategoryList extends React.Component{

    state = {
        currentCategoryPage: 1,
        totalCategoryPages: 1,
        categories: []
    }

    pageCategoryHandler = e => {
        this.state.currentCategoryPage = e.selected + 1;
        this.fetchCategories();
    }

    fetchCategories() {
        const self = this;
        axios({
            method: 'get',
            url: API_HOST + '/categories?page='+self.state.currentCategoryPage,
            config: { headers: defaultHeaders}
        })
            .then(function (response) {
                console.log(response);
                self.setState({categories: response.data.categories});
                self.setState({totalCategoryPages: response.data.meta.totalPages});
            })
            .catch(function (response) {
                console.log(response);
            });
    }


    addCategoryHandler = (product) => {
        let products = this.state.categories;
        products.unshift(product);

        this.setState({categories: products});
    }

    editCategoryHandler = (product) => {
        let products = this.state.categories;

        products.map((item, i) => {
            if(item.id === product.id){
                products[i] = product;
                return true;
            }
        });

        this.setState({categories: products});
    }

    removeCategoryHandler = product => {
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
            <div className="container productList">
                <Table bordered striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Edit</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                { this.props.categories.map(product => {
                    let lang_en = product.lang !== null && product.lang.en;

                    return (<tr key={product.id}>
                        <th scope="row">{product.id}</th>
                        <td><img className="" height="50px" src={product.image} alt={product.image} /></td>
                        <td>{lang_en}</td>
                        <td><TimeAgo date={product.created_at} /></td>
                        <td>
                            { (product.created_at !== product.updated_at) ?
                            <TimeAgo date={product.updated_at} />
                                : '-' }
                        </td>
                        <td><Link to={{ pathname: `/categories/${product.id}/edit`, state: { product: product } }}>Edit</Link></td>
                        <td><Button onClick={this.props.removeHandler.bind(this, product)}>Remove</Button></td>
                            </tr>)
                }) }
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={<a href="">...</a>}
                    breakClassName={"break-me"}
                    pageCount={this.props.totalPages}
                    onPageChange={this.props.pageHandler}
                    containerClassName={"pagination justify-content-center"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    nextClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextLinkClassName={'page-link'}
                />
            </div>
        )
    }
}

export default CategoryList;