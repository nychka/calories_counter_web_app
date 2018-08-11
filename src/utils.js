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

export const API_HOST =  process.env.REACT_APP_API_HOST;