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