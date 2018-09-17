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
    const noConsumedProductsTitleSelector = 'h3';
    const consumedProductsWrapper = 'div.consumed-products-wrapper';
    const selectProductsSelector = '#select-products';
    const removeSelector = '.product-card-remove';

    const daysAgo = ago => {
        let d = new Date();
        d.setDate(d.getDate() - ago);
        return d;
    };

    const todayMoment = () => toMomentObject(new Date());

    const subject = (options = {}) => {
        const defaults = { consumed: [], moment: todayMoment() };
        const settings = Object.assign(defaults, options);

        ProductsProvider.prototype.getMoment = jest.fn(() => settings.moment);
        window.localStorage.setItem('consumedProducts', JSON.stringify(settings.consumed));
        
        return mount(
            <ProductsProvider>
                <ProductsContext.Consumer>
                    { props => <Home {...props} />}
                </ProductsContext.Consumer>
            </ProductsProvider>
        );
    };

    const buildConsumedProducts = (count, consumedAt = new Date()) => {
        let products = [];
        const time = consumedAt.getTime();

        for(let i = 0; i < count; i += 1) {
            let consumedProduct = Object.assign({}, product);
            consumedProduct.id = i;
            consumedProduct.consumedAt = time;
            products.push(consumedProduct);
        }
        return products;
    };

    it('has search product input', () => {
        const wrapper = subject();

        expect(wrapper.exists(selectProductsSelector)).toBeTruthy();
    });

    it('shows message: no consumed products', () => {
        const wrapper = subject().find(consumedProductsWrapper);

        expect(wrapper.exists(noConsumedProductsTitleSelector)).toBeTruthy();
    });

    it('shows 2 consumed products', () => {
        const wrapper = subject({ consumed: buildConsumedProducts(2) });

        expect(wrapper.find(consumedProductsWrapper).children()).toHaveLength(2);
    });

    it('shows products consumed today', () => {
        const today = new Date();
        const yesterday = daysAgo(1);
        const consumedToday = buildConsumedProducts(3, today);
        const consumedYesterday = buildConsumedProducts(2, yesterday);
        const consumedProducts = [...consumedToday, ...consumedYesterday];
        const wrapper = subject({ moment: toMomentObject(today), consumed: consumedProducts});

        expect(wrapper.find(consumedProductsWrapper).children()).toHaveLength(3);
    });

    it('shows products consumed yesterday', () => {
        const today = new Date();
        const yesterday = daysAgo(1);
        const consumedToday = buildConsumedProducts(3, today);
        const consumedYesterday = buildConsumedProducts(4, yesterday);
        const consumedProducts = [...consumedToday, ...consumedYesterday];
        const wrapper = subject({ moment: toMomentObject(yesterday), consumed: consumedProducts});

        expect(wrapper.find(consumedProductsWrapper).children()).toHaveLength(4);
    });

    it('removes consumed product', () => {
        const wrapper = subject({ consumed: buildConsumedProducts(3) });
        const container = wrapper.find(consumedProductsWrapper);
        
        expect(container.children()).toHaveLength(3);
        
        container.childAt(0).find(removeSelector).simulate('click');
        container.childAt(1).find(removeSelector).simulate('click');
        wrapper.update();
       
        expect(wrapper.find(consumedProductsWrapper).children()).toHaveLength(1);
    });
});