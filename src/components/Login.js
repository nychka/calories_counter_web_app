import React from 'react';
import FacebookLogin from'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login'
import {axio, defaultHeaders} from '../utils';
import './Login.css';

class Login extends React.Component{
    failGoogle(response){
        console.log(response);
    }

    responseGoogle(response){
        console.log(response);
        this.signIn(response.accessToken, 'google');
    }
    responseFacebook(response){
        console.log(response);
        this.signIn(response.accessToken, 'facebook');
    }


    componentClicked(e){
        console.log(e);
    }
    signIn(accessToken, provider){

        axio({
            method: 'post',
            url: '/users/sign_in',
            data: { access_token: accessToken, provider: provider },
            headers: defaultHeaders()
        })
        .then(function (response) {
            console.log(response);
            if(response.status === 201) {
                alert(response.data.email + ' logged in!');
                //saveCurrentUser(response.data, response.headers.authorization);
                //history.push({pathname: '/'});
            }else{
                //self.setState({ hasError: true, errorMessage: response.data.error })
            }
        })
        .catch(function (response) {
            console.log(response);

        });
    }

    render(){
        return(
            <div className={'d-flex Login flex-column align-items-center'}>
                <div className={'d-flex flex-row login-title'}>
                    <h3>Sign in</h3>
                </div>
                <div className={'d-flex flex-column justify-content-center'}>
                    <FacebookLogin
                        appId="1816374385077661"
                        autoLoad={false}
                        fields="name,email,picture"
                        onClick={this.componentClicked.bind(this)}
                        callback={this.responseFacebook.bind(this)}
                        style={{}}
                        render={renderProps => (
                            <div onClick={renderProps.onClick} className={'d-flex flex-column align-items-center login-button'}>
                                <img className={'facebook-button'} src={'/images/facebook-login.png'} alt="Login with Facebook" />
                            </div>
                        )}
                    />
                    <GoogleLogin
                        clientId="930732790033-lirk2bn8esigr142rucgm86gqsifeum7.apps.googleusercontent.com"
                        //tag={'div'}
                        //type={'div'}
                        //className={'d-flex flex-row login-button'}
                        //style={{}}
                        autoLoad={false}
                        onSuccess={this.responseGoogle.bind(this)}
                        onFailure={this.failGoogle.bind(this)}
                        render={renderProps => (
                            <div onClick={renderProps.onClick} className={'d-flex flex-column align-items-center login-button'}>
                                <img className={'google-button'} src={'/images/google-login.png'} alt="Login with Google" />
                            </div>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default Login;