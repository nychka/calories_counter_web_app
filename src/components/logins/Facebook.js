import React from 'react';
import FacebookLogin from'react-facebook-login/dist/facebook-login-render-props';
import { signIn } from '../../utils';

class Facebook extends React.Component{
    clickHandler = e => {
        console.log(e);
    }

    responseFacebook(response){
        console.log(response);
        signIn(response.accessToken, 'facebook');
    }

    render(){
        return(
            <FacebookLogin
                appId="1816374385077661"
                autoLoad={false}
                fields="name,email,picture"
                onClick={this.clickHandler.bind(this)}
                callback={this.responseFacebook.bind(this)}
                style={{}}
                render={renderProps => (
                    <div onClick={renderProps.onClick} className={'d-flex flex-column align-items-center login-button'}>
                        <img className={'facebook-button'} src={'/images/facebook-login.png'} alt="Login with Facebook" />
                    </div>
                )}
            />
        )
    }
}

export default Facebook;