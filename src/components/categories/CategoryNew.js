import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import ImagePicker from '../ImagePicker';
import {axio, defaultHeaders} from "../../utils";

class CategoryNew extends React.Component{
   state = {
       product: { id: 0, lang: { en: '', ua: '', ru: ''}, image: ''},
       editMode: false,
       suggestions: []
   };

   pickImageHandler(e){
       let imageUrl = e.target.src;
       let product = this.state.product;
       product.image = imageUrl;
       this.setState({product: product});
   }

   componentDidMount(){
       console.log(this.props.location.state);
       if(this.props.location.state && this.props.location.state.hasOwnProperty('product')){
           this.setState({product: this.props.location.state.product});
           this.setState({editMode: true});
       }
   }

   onBlur(e){
       const self = this;

       if(e.target.value.length < 2) return false;
       const currentLang = e.target.getAttribute('data-lang');

       const preparedParams = (() => {

           let inputs = document.querySelectorAll('input[data-lang]');
           let params = [];
           for(let input of inputs){
               if(input.value.length < 2){
                   let lang = input.getAttribute('data-lang');
                   if(currentLang !== lang) params.push(lang);
               }
           }
           return params;
       })();



       axio({
           method: 'get',
           url: `/image_search/search?q=${e.target.value}`,
           headers: defaultHeaders()
       })
       .then(response => {
           self.setState({suggestions: response.data.value});
           console.log(response)
       })
       .catch(response => {
           console.error(response);
       })

       if(preparedParams.length){
           let query = `from=${currentLang}&to=${preparedParams.join(',')}`;

           axio({
             method: 'get',
             url:  `/translates/translate?q=${e.target.value}&${query}`,
             headers: defaultHeaders()
           })
           .then(response => {
               console.log(response);
               let translations = response.data[0]['translations'];
               let product = self.state.product;
               translations.forEach(item => {
                   let lang = item.to;
                   if(item.to === 'uk') lang = 'ua';

                   product['lang'][lang] = item.text.toLowerCase();
               })
               self.setState({product: product})
           })
           .catch(response => {
               console.error(response);
           })
       }

   }

   changeLangEn(e){
       let product = this.state.product;

       product['lang']['en'] = e.target.value;

       this.setState({product: product})
   }

    changeLangUa(e){
        let product = this.state.product;
        product['lang']['ua'] = e.target.value;

        this.setState({product: product});
    }

    changeLangRu(e){
        let product = this.state.product;
        product['lang']['ru'] = e.target.value;

        this.setState({product: product});
    }

    change(e){
       let product = this.state.product;
       product[e.target.name] = e.target.value;

       this.setState({product: product});
    }

    submitHandler = e => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let method = this.state.editMode ? 'put' : 'post';
        const self = this;

        const handler = this.props.handler;
        const history = this.props.history;
        let url = '/categories';
        url += this.state.editMode ? ('/' + this.state.product.id) : '';
        axio({
            method: method,
            url: url,
            data: formData,
            headers: defaultHeaders()
        })
        .then(function (response) {
            console.log(response.data);
            handler.call(self, response.data);
            let url = '/categories';
            history.push({
                pathname: url,
                state: { product: self.state.product }
            });
        })
        .catch(function (response) {
            console.log(response);
        });
    }

    render(){
        return(
            <div className="container">
                <h1>{ this.state.editMode ? 'Edit' : 'New' }</h1>
            <Form onSubmit={this.submitHandler}>
                {this.state.editMode ?
                <input type="hidden" name="id" value={this.state.product.id} />
                    : '' }
                <FormGroup row>
                    <Label for="product_lang_en">En</Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <img alt='en flag' src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-400.png" width="30px" />
                                </span>
                        </div>
                        <Input type="text" name='lang[en]' data-lang='en' id='product_lang_en' onBlur={this.onBlur.bind(this)} onChange={this.changeLangEn.bind(this)} value={this.state.product.lang.en} />

                    </div>
                </FormGroup>

                <FormGroup row>
                    <Label for="product_lang_ua">Ua</Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <img alt='ua flag' src="https://www.flaggenmeer.de/Media/Default/Thumbs/0008/0008672-flagge-ukraine.gif" width="30px" />
                                </span>
                        </div>
                        <Input type="input" name="lang[ua]" data-lang='ua' id="product_lang_ua" onBlur={this.onBlur.bind(this)} onChange={this.changeLangUa.bind(this)} value={this.state.product.lang.ua} />

                    </div>
                </FormGroup>

                <FormGroup row>
                    <Label for="product_lang_ru">Ru</Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <img alt='ru flag' src="https://vignette.wikia.nocookie.net/deusex/images/c/cf/Flag_of_Russia_2.png/revision/latest?cb=20161106171639&path-prefix=ru" width="30px" />
                                </span>
                        </div>
                        <Input type="input" name="lang[ru]" data-lang='ru' id="product_lang_ru" onBlur={this.onBlur.bind(this)} onChange={this.changeLangRu.bind(this)} value={this.state.product.lang.ru}  />

                    </div>
                </FormGroup>

                <FormGroup row>
                    { this.state.suggestions && this.state.suggestions.length ?
                        <ImagePicker pickImageHandler={this.pickImageHandler.bind(this)} suggestions={this.state.suggestions} />
                        : ''
                    }
                    <Label for="product_image">Image</Label>
                    <Input type="input" onChange={this.change.bind(this)} name="image" id="product_image" value={this.state.product.image} required  />
                </FormGroup>


                <FormGroup check row>
                    <Link to={{ pathname: `/categories` }}>Cancel</Link>
                    <Button className="btn-success btn-lg">{this.state.editMode ? 'Update' : 'Save'}</Button>

                </FormGroup>
            </Form>
            </div>
        );
    }
}

export default withRouter(CategoryNew);