import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from './Home';
import { toMomentObject } from 'react-dates';

configure({ adapter: new Adapter()});

describe('<Home />', () => {
    const product = {
        id: 1,
        lang: { en: 'title'},
        nutrition: {calories: 100, weight: 100}
    };
    const noConsumedProductsTitleSelector = 'h3';
    const consumedProductsWrapper = 'div.consumed-products-wrapper';
    const selectProductsSelector = '#select-products';

    const daysAgo = ago => {
        let d = new Date();
        d.setDate(d.getDate() - ago);
        return d;
    };

    const todayMoment = () => toMomentObject(new Date());

    const subject = (options = {}) => {
        const defaults = { consumed: [], moment: todayMoment() };
        const settings = Object.assign(defaults, options);

        return shallow(
            <Home
                consumedProducts={settings.consumed}
                selectedProduct={product}
                pickProductHandler={() => {}}
                handleCreate={() => {}}
                productsOptions={{}}
                moment={settings.moment}
                
            />
        );
    };

    const buildConsumedProducts = (count, consumedAt = new Date()) => {
        let products = [];
        const time = consumedAt.getTime();

        for(let i = 0; i < count; i += 1) {
            let consumedProduct = Object.assign({}, product);
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
});