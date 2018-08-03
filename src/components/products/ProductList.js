import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import TimeAgo from 'react-timeago'
import { Line } from 'rc-progress';

class ProductList extends React.Component{

    showHandler = (e) => {
        const history = this.props.history;
        let id = e.target.parentElement.getAttribute('data-id');
        let product = this.props.products.find(item => item.id == id);
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
                <h2>Products: {this.props.currentAmount } / {this.props.totalAmount}</h2>
                <Line percent={this.props.progressPercent} strokeWidth="1" strokeColor="#2db7f5" />
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
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Show</th>
                            <th>Edit</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                { this.props.products.map(product => {
                    let lang_en = product.lang !== null && product.lang.en;
                    let calories = product.nutrition !== null && product.nutrition.calories;

                    return (<tr key={product.id} data-id={product.id} onDoubleClick={this.showHandler.bind(this)}>
                        <th scope="row">{product.id}</th>
                        <td><img className="" height="50px" src={product.image} alt={product.image} /></td>
                        <td>{lang_en}</td>
                        <td>{calories}</td>
                        <td><TimeAgo date={product.created_at} /></td>
                        <td>
                            { (product.created_at !== product.updated_at) ?
                            <TimeAgo date={product.updated_at} />
                                : '-' }
                        </td>
                        <td><Link to={{ pathname: `/products/${product.id}`, state: { product: product } }}>Show</Link></td>
                        <td><Link to={{ pathname: `/products/${product.id}/edit`, state: { product: product } }}>Edit</Link></td>
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
                </div>

            </div>
        )
    }
}

export default withRouter(ProductList);