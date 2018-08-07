import React from 'react';
import axios from "axios/index";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom';

class Login extends React.Component{
    state = {
        api_host: process.env.REACT_APP_API_HOST
    }
    submitHandler = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let method = 'post';
        const self = this;

        const handler = this.props.authHandler;
        const history = this.props.history;
        let url = this.state.api_host + '/users/sign_in';

        axios({
            method: method,
            url: url,
            data: formData,
            config: { headers: {'Content-Type': 'json' }}
        })
            .then(function (response) {
                console.log(response.data);
                let auth_header = response.headers.authorization;
                let user = response.data;
                handler(user, auth_header);
                console.log(user, auth_header);
                history.push({
                    pathname: '/products'
                });
            })
            .catch(function (response) {
                console.log(response);
            });
    }
    render(){
        return(
            <div className="container">
                <Form onSubmit={this.submitHandler}>
                    <FormGroup row>
                        <Label for="user_email">Email</Label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                   @
                                </span>
                            </div>
                            <Input type="text" name='user[email]' id='user_email' />
                        </div>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="user_password">Password</Label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    :X
                                </span>
                            </div>
                            <Input type="password" name='user[password]' id='user_password' />
                        </div>
                    </FormGroup>

                    <FormGroup check row>
                        <Button className="btn-success btn-lg">Login</Button>

                    </FormGroup>
                </Form>
            </div>
        )
    }
}

export default withRouter(Login);