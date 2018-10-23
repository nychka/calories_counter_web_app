import { axio, defaultHeaders } from '../utils';

class Meal{
    static all = () => {
        return axio({
            method: 'get',
            url: '/meals',
            headers: defaultHeaders()
        })
        .then(function (response) {
            const meals = response.data.meals ? response.data.meals : [];
            return Promise.resolve(meals);
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
            return Promise.resolve(response.data.meals);
        })
        .catch(function (response) {
            console.log(response);
        });
    }

    static delete = (...meals) => {
        let ids = [];
        meals.filter(meal => {
            if(meal.hasOwnProperty('server_id')){
                ids.push(meal.server_id);
            }
        });
        if(ids.length < 1) return false;

        return axio({
            method: 'delete',
            url: '/meals',
            data: { ids: ids },
            headers: defaultHeaders()
        })
        .then(function (response) {
            return Promise.resolve(response);
        })
        .catch(function (response) {
            console.log(response);
        });
    }
}

export default Meal;