import React from 'react';
import GoogleLogin from 'react-google-login'
import { signIn } from '../../utils';

class Google extends React.Component{
    clickHandler = e => {
        console.log(e);
    }
    failHandler(response){
        console.log(response);
    }

    responseHandler(response){
        console.log(response);
        signIn(response.accessToken, 'google');
    }

    render(){
        return(
            <GoogleLogin
                clientId="930732790033-lirk2bn8esigr142rucgm86gqsifeum7.apps.googleusercontent.com"
                autoLoad={false}
                onSuccess={this.responseHandler.bind(this)}
                onFailure={this.failHandler.bind(this)}
                render={renderProps => (
                    <div onClick={renderProps.onClick} className={'d-flex flex-column align-items-center login-button'}>
                        <img className={'google-button'} src={'/images/google-login.png'} alt="Login with Google" />
                    </div>
                )}
            />
        )
    }
}

export default Google;