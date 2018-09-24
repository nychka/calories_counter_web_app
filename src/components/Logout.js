import React from 'react';
import{ Redirect } from 'react-router-dom';
import { signOut, history } from '../utils';

class Logout extends React.Component{

    componentDidMount(){
        signOut();
    }

    render(){
        return(
            <Redirect to={'/'} history={history} />
        );
    }
}

export default Logout;