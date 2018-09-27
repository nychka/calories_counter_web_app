import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from './Home';
import { ProductsProvider, ProductsContext } from './products/ProductsProvider';
import { toMomentObject } from 'react-dates';
import { localStorageFake } from '../utils';

window.localStorage = localStorageFake;
configure({ adapter: new Adapter()});
ProductsProvider.prototype.fetch = jest.fn(() => { /*console.log('fetch mocked by jest')*/});

describe('<Home />', () => {
    beforeEach(() => window.localStorage.clear());

    const product = {
        id: 1,
        lang: { en: 'title'},
        nutrition: {calories: 100, weight: 100}
    };
    const noMealsTitleSelector = 'h3';
    const mealsWrapper = 'div.consumed-products-wrapper';
    const selectProductsSelector = '#select-products';
    const removeSelector = '.product-card-remove';

    const daysAgo = ago => {
        let d = new Date();
        d.setDate(d.getDate() - ago);
        return d;
    };

    const todayMoment = () => toMomentObject(new Date());

    const subject = (options = {}) => {
        const defaults = { products: [], meals: [], moment: todayMoment() };
        const settings = Object.assign(defaults, options);

        ProductsProvider.prototype.getMoment = jest.fn(() => settings.moment);
        window.localStorage.setItem('meals', JSON.stringify(settings.meals));
        window.localStorage.setItem('products', JSON.stringify(settings.products));

        return mount(
            <ProductsProvider>
                <ProductsContext.Consumer>
                    { props => <Home {...props} />}
                </ProductsContext.Consumer>
            </ProductsProvider>
        );
    };

    const buildMeals = (count, consumedAt = new Date()) => {
        let products = [];
        const time = consumedAt.getTime();

        for(let i = 0; i < count; i += 1) {
            let consumedProduct = Object.assign({}, product);
            consumedProduct.id = i;
            consumedProduct.consumedAt = time + i;
            products.push(consumedProduct);
        }
        return products;
    };

    it('has search product input', () => {
        const wrapper = subject();

        expect(wrapper.exists(selectProductsSelector)).toBeTruthy();
    });

    it('shows message: no meals', () => {
        const wrapper = subject().find(mealsWrapper);

        expect(wrapper.exists(noMealsTitleSelector)).toBeTruthy();
    });

    it('shows 2 meals', () => {
        const wrapper = subject({ meals: buildMeals(2) });

        expect(wrapper.find(mealsWrapper).children()).toHaveLength(2);
    });

    it('shows meals consumed today', () => {
        const today = new Date();
        const yesterday = daysAgo(1);
        const consumedToday = buildMeals(3, today);
        const consumedYesterday = buildMeals(2, yesterday);
        const meals = [...consumedToday, ...consumedYesterday];
        const wrapper = subject({ moment: toMomentObject(today), meals: meals});

        expect(wrapper.find(mealsWrapper).children()).toHaveLength(3);
    });

    it('shows meals consumed yesterday', () => {
        const yesterday = daysAgo(1);
        const consumedToday = buildMeals(2, new Date());
        const consumedYesterday = buildMeals(5, yesterday);
        const meals = [...consumedToday, ...consumedYesterday];
        const wrapper = subject({ meals: meals });
        wrapper.setState({ moment: toMomentObject(yesterday) });

        expect(wrapper.find(mealsWrapper).children()).toHaveLength(5);
    });

    it('removes meal', () => {
        const wrapper = subject({ meals: buildMeals(3) });
        const container = wrapper.find(mealsWrapper);
        
        expect(container.children()).toHaveLength(3);
        
        container.childAt(0).find(removeSelector).simulate('click');
        container.childAt(1).find(removeSelector).simulate('click');
        wrapper.update();
       
        expect(wrapper.find(mealsWrapper).children()).toHaveLength(1);
    });
});