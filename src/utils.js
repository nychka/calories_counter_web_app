import axios from 'axios/index';
import createBrowserHistory from "history/createBrowserHistory";

export const userSignedIn = () => localStorage.getItem('currentUser') && localStorage.getItem('currentUser').length;

export const currentUser = () => userSignedIn() ? JSON.parse(localStorage.getItem('currentUser')) : false;

export const saveCurrentUser = (user, accessToken) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
};

export const defaultHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');

    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': accessToken
    }
};

export const signIn = (accessToken, provider) => {

    axio({
        method: 'post',
        url: '/users/sign_in',
        data: { token: accessToken, provider: provider, grant_type: 'access_token' },
        headers: defaultHeaders()
    })
    .then(function (response) {
        console.log(response);
        if(response.status === 201) {
            saveCurrentUser(response.data, response.headers.authorization);
            history.push({pathname: '/'});
        }else{
            console.error(response);
        }
    })
    .catch(function (response) {
        console.log(response);

    });
}

export const signOut = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
};

export const history = createBrowserHistory();


export const API_HOST =  process.env.REACT_APP_API_HOST;

export const axio = axios.create({
    baseURL: API_HOST
});

axio.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        console.info('401');
        console.warn('redirecting....');
        console.log(error.response);
    }
    return error.response;
});

// redefine function for react-select for searching
export const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    var compareOption = function compareOption(inputValue, option) {
        var candidate = inputValue.toLowerCase();
        return option.value.toLowerCase() === candidate;
    };
    return !(!inputValue || selectValue.some(function (option) {
        return compareOption(inputValue, option);
    }) || selectOptions.some(function (option) {
        return compareOption(inputValue, option);
    }));
};

export const isRightMoment = (moment, currentMoment) => {
    const date = currentMoment.toDate().getTime();
    const consumedAt = moment.toDate();
    const start = consumedAt.setHours(0,0,0,0);
    const end = consumedAt.setHours(23,59,59,999);

    return start < date && end > date;
};

export const localStorageFake = new class{
    store = {};
    setItem = (key, val) => (this.store[key] = val);
    getItem = key => {
        return this.store.hasOwnProperty(key) ? this.store[key] : [];
    };
    removeItem = key => { delete this.store[key]; };
    clear = () => (this.store = {});
};