import { axio, defaultHeaders } from '../utils';

class Meal{
    static all = () => {
        return axio({
            method: 'get',
            url: '/meals',
            headers: defaultHeaders()
        })
        .then(function (response) {
            return Promise.resolve(response.data.products);
        })
        .catch(function (response) {
            console.log(response);
        });
    }

    static create = (...meals) => {
        return axio({
            method: 'post',
            url: '/meals',
            data: { meals: meals },
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

export default Meal;