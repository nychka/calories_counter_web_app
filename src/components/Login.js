import React from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import {axio, defaultHeaders, saveCurrentUser} from "../utils";

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            hasError: false
        }
    }

    fetch(){
        this.props.fetchProducts();
        this.props.fetchCategories();
    }

    submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const history = this.props.history;
        const self = this;

        axio({
            method: 'post',
            url: '/users/sign_in',
            data: formData,
            headers: defaultHeaders()
        })
        .then(function (response) {
            console.log(response.data);
            if(response.status === 201) {
                saveCurrentUser(response.data, response.headers.authorization);
                history.push({pathname: '/'});
                self.fetch();
            }else{
                self.setState({ hasError: true, errorMessage: response.data.error })
            }
        })
        .catch(function (response) {
            console.log(response);

        });
    }
    render(){
        return(
            <div className="container">
                { this.state.hasError ?
                <Alert color="danger">
                    {this.state.errorMessage}
                </Alert> : '' }
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