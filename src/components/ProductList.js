import React from 'react';
import { Table } from 'reactstrap';

class ProductList extends React.Component{
    render(){
        return(
            <div className="container productList">
          <h2>Products:</h2>
                <Table bordered striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Calories</th>
                            <th>Created</th>
                            <th>Show</th>
                        </tr>
                    </thead>
                    <tbody>
                { this.props.products.map(product => {
                    let lang_en = product.lang !== null && product.lang.en;
                    let calories = product.nutrition !== null && product.nutrition.calories;

                    return (<tr key={product.id}>
                        <th scope="row">{product.id}</th>
                        <td><img className="" height="50px" src={product.image} alt={product.image} /></td>
                        <td>{lang_en}</td>
                        <td>{calories}</td>
                        <td>{product.created_at}</td>
                        <td><a href={'/products/'+product.id}>Show</a></td>
                    </tr>)
                }) }
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default ProductList;