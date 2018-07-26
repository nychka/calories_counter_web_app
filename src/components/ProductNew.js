import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

class ProductNew extends React.Component{
   state = {
       api_host: process.env.REACT_APP_API_HOST
   }

    submitHandler = e => {
        e.preventDefault();
        let formData = new FormData(e.target);
        // let isValid = this.validator(formData);

        const handler = this.props.handler;
        const history = this.props.history;
        axios({
            method: 'post',
            url: this.state.api_host + '/products',
            data: formData,
            config: { headers: {'Content-Type': 'json' }}
        })
        .then(function (response) {
            console.log(response.data);
            handler.call(this, response.data);
            history.push('/products');

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
                    <Label for="product_lang_en">En</Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <img alt='en flag' src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-400.png" width="30px" />
                                </span>
                        </div>
                        <Input type="text" pattern="[a-z]{3,}" name='lang[en]' id='product_lang_en' required />

                    </div>
                </FormGroup>

                <FormGroup row>
                    <Label for="product_lang_ua">Ua</Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <img alt='en flag' src="https://www.flaggenmeer.de/Media/Default/Thumbs/0008/0008672-flagge-ukraine.gif" width="30px" />
                                </span>
                        </div>
                        <Input type="input" pattern="[а-яйїьє]{3,}" name="lang[ua]" id="product_lang_ua" required  />

                    </div>
                </FormGroup>

                <FormGroup row>
                    <Label for="product_calories">Calories</Label>
                    <div className="input-group">
                        <Input type="number" min="1" max="1000" step="1" name="nutrition[calories]" id="product_calories" required  />
                        <div className="input-group-append">
                            <span className="input-group-text">100 gram</span>
                        </div>
                    </div>
                </FormGroup>

                <FormGroup row>
                    <Label for="product_image">Image</Label>
                    <Input type="input" name="image" id="product_image" required  />
                </FormGroup>

                <FormGroup row>
                    <Label for="product_category_id">Category</Label>
                    <Input type="number" name="category_id" id="product_category_id"  />
                </FormGroup>


                <FormGroup check row>
                        <Button className="btn-success btn-lg">Save</Button>
                </FormGroup>
            </Form>
            </div>
        );
    }
}

export default withRouter(ProductNew);