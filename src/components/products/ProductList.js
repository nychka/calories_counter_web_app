import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import TimeAgo from 'react-timeago'
import { Line } from 'rc-progress';
import axios from "axios/index";

class ProductList extends React.Component{

    state = {
        api_host: process.env.REACT_APP_API_HOST,
        currentProductPage: 1,
        totalProductPages: 1,
        currentAmount: 0,
        totalAmount: 100,
        progressPercent: 0,
        products: [],
    }

    componentDidMount(){
        console.info('component mounted');
        if(this.state.products.length === 0 && this.props.currentUser()){
            this.fetchProducts();
        }else{
            console.log('products count: ', this.state.products.length);
            console.log('user: ', this.props.currentUser());
        }
    }

    pageProductHandler = e => {
        this.state.currentProductPage = e.selected + 1;
        this.fetchProducts();
    }

    addProductHandler = (product) => {
        let products = this.state.products;
        products.unshift(product);

        this.setState({products: products});
    }

    editProductHandler = (product) => {
        let products = this.state.products;

        products.map((item, i) => {
            if(item.id === product.id){
                products[i] = product;
                return true;
            }
        });

        this.setState({products: products});
    }

    setProgress(total){
        this.setState({currentAmount: total});
        let percent = this.state.totalAmount / 100 * total;
        this.setState({progressPercent: percent});
    }

    removeProductHandler = product => {
        let canRemove = window.confirm('Are you really want to delete this product?');
        let url = `${this.state.api_host}/products/${product.id}`;
        let products = this.state.products;
        const self = this;

        if(canRemove){
            axios.delete(url)
                .then((response) => {
                    products.map((item, i) => {
                        if(item.id === product.id){
                            products.splice(i, 1);
                            self.setState({products: products});
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
    
    fetchProducts(){
        const self = this;
        const headers = this.props.headers();

        axios({
            method: 'get',
            url: self.state.api_host + '/products?page='+self.state.currentProductPage,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': headers.Authorization }
        })
            .then(function (response) {
                console.log(response);
                self.setState({products: response.data.products});
                self.setState({totalProductPages: response.data.meta.totalPages});
                self.setProgress(response.data.meta.total);
            })
            .catch(function (response) {
                console.log(response);
            });
    }
    showHandler = (e) => {
        const history = this.props.history;
        let id = e.target.parentElement.getAttribute('data-id');
        let product = this.state.products.find(item => item.id == id);
        history.push({
            pathname: '/products/' + id,
            state: { product: product }
        });
    }

    render(){
        return(
            <div className="container productList">
                <div className="row">
                    <div className="col">
                <h2>Products: {this.state.currentAmount } / {this.state.totalAmount}</h2>
                <Line percent={this.state.progressPercent} strokeWidth="1" strokeColor="#2db7f5" />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Calories</th>
                            <th>Category</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Show</th>
                            <th>Edit</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                { this.state.products.map(product => {
                    let lang_en = product.lang !== null && product.lang.en;
                    let calories = product.nutrition !== null && product.nutrition.calories;
                    let category = product.category && product.category.lang && product.category.lang.en;
                    let style = !category ? {backgroundColor: 'red'} : {};

                    return (<tr key={product.id} data-id={product.id} onDoubleClick={this.showHandler.bind(this)}>
                        <th scope="row">{product.id}</th>
                        <td><img className="" height="50px" src={product.image} alt={product.image} /></td>
                        <td>{lang_en}</td>
                        <td>{calories}</td>
                        <td style={style}>{category}</td>
                        <td><TimeAgo date={product.created_at} /></td>
                        <td>
                            { (product.created_at !== product.updated_at) ?
                            <TimeAgo date={product.updated_at} />
                                : '-' }
                        </td>
                        <td><Link to={{ pathname: `/products/${product.id}`, state: { product: product } }}>Show</Link></td>
                        <td><Link to={{ pathname: `/products/${product.id}/edit`, state: { product: product } }}>Edit</Link></td>
                        <td><Button onClick={this.removeProductHandler.bind(this, product)}>Remove</Button></td>
                            </tr>)
                }) }
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={<a href="">...</a>}
                    breakClassName={"break-me"}
                    pageCount={this.state.totalProductPages}
                    onPageChange={this.state.pageProductHandler}
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
                </div>

            </div>
        )
    }
}

export default withRouter(ProductList);