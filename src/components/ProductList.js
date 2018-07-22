import React from 'react';

class ProductList extends React.Component{
    state = {
        products: [
            { id: 1, title: 'Apple', category_id: 1, image: 'image.png', calories: 100 },
            { id: 2, title: 'Banana', category_id: 1, image: 'image.png', calories: 104 },
            { id: 3, title: 'Orange', category_id: 1, image: 'image.png', calories: 206 },
            { id: 4, title: 'Potato', category_id: 1, image: 'image.png', calories: 256 }
        ]
    }
    render(){
        return(
            <div className="productList">
          <h1>Product List:</h1>
                <table>
                    <thead>
                    <tr>
                        <td>Title</td>
                        <td>Calories</td>
                    </tr>
                    </thead>
                    <tbody>
                { this.state.products.map(product => {
                    return (<tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.calories}</td>
                    </tr>)
                }) }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ProductList;