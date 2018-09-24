import React from 'react';
import Facebook from './logins/Facebook';
import Google from './logins/Google';
import './Login.css';

class Login extends React.Component{
    
    render(){
        return(
            <div className={'d-flex Login flex-column align-items-center'}>
                <div className={'d-flex flex-row login-title'}>
                    <h3>Sign in</h3>
                </div>
                <div className={'d-flex flex-column justify-content-center'}>
                    <Facebook />
                    <Google />
                </div>
            </div>
        );
    }
}

export default Login;