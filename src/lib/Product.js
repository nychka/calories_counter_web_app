import { axio, defaultHeaders } from '../utils';

class Product{
    static all = () => {
        return axio({
            method: 'get',
            url: '/products',
            headers: defaultHeaders()
        })
        .then(function (response) {
            return Promise.resolve(response.data.products);
        })
        .catch(function (response) {
            console.log(response);
        });
    }

    static create = (...products) => {
        console.log(products);
        return axio({
            method: 'post',
            url: '/products',
            data: { products: products },
            headers: defaultHeaders()
        })
        .then(function (response) {
            return Promise.resolve(response.data.products);
        })
        .catch(function (response) {
            console.log(response);
        });
    }
}

export default Product;