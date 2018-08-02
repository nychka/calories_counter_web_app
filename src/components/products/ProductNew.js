import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import ImagePicker from '../ImagePicker';
import Select from 'react-select';

class ProductNew extends React.Component{
   state = {
       api_host: process.env.REACT_APP_API_HOST,
       product: { id: 0, lang: { en: '', ua: '', ru: ''}, image: '', nutrition: { calories: ''}},
       editMode: false,
       suggestions: [],
       selectedCategory: null,
       categoryOptions: [],
       categories: []
   }

   selectCategoryHandler = selected => {
       this.setState({selectedCategory: selected});
       console.log('selected category', selected);
   }

   pickImageHandler(e){
       let imageUrl = e.target.src;
       let product = this.state.product;
       product.image = imageUrl;
       this.setState({product: product});
   }

    fetchCategories() {
        const self = this;
        axios({
            method: 'get',
            url: self.props.parentState.api_host + '/categories',
            config: { headers: {'Content-Type': 'json' }}
        })
            .then(function (response) {
                console.log(response);
                self.setState({categories: response.data.categories});
                self.setState({totalCategoryPages: response.data.meta.totalPages});
                const options = response.data.categories.map(item => {
                    return { value: item.id, label: item.lang.en }
                });
                self.setState({categoryOptions: options});
            })
            .catch(function (response) {
                console.log(response);
            });
    }

   componentDidMount(){
       console.log(this.props.location.state);
       if(this.props.location.state && this.props.location.state.hasOwnProperty('product')) {
           this.setState({product: this.props.location.state.product});
           this.setState({editMode: true});
       }
       this.fetchCategories();
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



       axios
           .get(`${this.state.api_host}/image_search/search?q=${e.target.value}`)
           .then(response => {
               self.setState({suggestions: response.data.value});
               console.log(response)
           })
           .catch(response => {
               console.error(response);
           })

       if(preparedParams.length){
           let query = `from=${currentLang}&to=${preparedParams.join(',')}`;

           axios
               .get(`${this.state.api_host}/translates/translate?q=${e.target.value}&${query}`)
               .then(response => {
                   console.log(response);
                   let translations = response.data[0]['translations'];
                   let product = self.state.product;
                   translations.map(item => {
                       let lang = item.to;
                       if(item.to == 'uk') lang = 'ua';

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

    changeNutritionCalories(e){
        let product = this.state.product;
        product['nutrition']['calories'] = e.target.value;

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
        let url = this.state.api_host + '/products';
        url += this.state.editMode ? ('/' + this.state.product.id) : '';
        axios({
            method: method,
            url: url,
            data: formData,
            config: { headers: {'Content-Type': 'json' }}
        })
        .then(function (response) {
            console.log(response.data);
            handler.call(self, response.data);
            let url = self.state.editMode ? '/products/' + self.state.product.id : '/products';
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
                    <Label for="product_calories">Calories</Label>
                    <div className="input-group">
                        <Input type="number" onChange={this.changeNutritionCalories.bind(this)} value={this.state.product.nutrition.calories} min="1" max="1000" step="1" name="nutrition[calories]" id="product_calories" required  />
                        <div className="input-group-append">
                            <span className="input-group-text">100 gram</span>
                        </div>
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


                <FormGroup row>
                    <Label for="product_category_id">Category</Label>
                    <Select
                        value={this.state.selectedCategory}
                        onChange={this.selectCategoryHandler}
                        options={this.state.categoryOptions}
                        className={'form-control'}
                    />
                </FormGroup>

                <FormGroup check row>
                    <Link to={{ pathname: `/products` }}>Cancel</Link>
                    <Button className="btn-success btn-lg">{this.state.editMode ? 'Update' : 'Save'}</Button>

                </FormGroup>
            </Form>
            </div>
        );
    }
}

export default withRouter(ProductNew);