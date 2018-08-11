import React from 'react';
import axios from "axios/index";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { defaultHeaders, API_HOST, saveCurrentUser } from "../utils";

class Login extends React.Component{

    submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const history = this.props.history;

        axios({
            method: 'post',
            url: API_HOST + '/users/sign_in',
            data: formData,
            headers: defaultHeaders()
        })
        .then(function (response) {
            console.log(response.data);
            saveCurrentUser(response.data, response.headers.authorization);

            history.push({ pathname: '/'});
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
                        <Button className="btn-success btn-lg">Sign In</Button>

                    </FormGroup>
                </Form>
            </div>
        )
    }
}

export default withRouter(Login);