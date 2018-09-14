import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from './Home';

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

    const subject = (options = {}) => {
        const defaults = { consumed: [], consumedWhen: new Date() };
        const settings = Object.assign(defaults, options);

        return shallow(
            <Home
                consumedProducts={settings.consumed}
                selectedProduct={product}
                pickProductHandler={() => {}}
                handleCreate={() => {}}
                productsOptions={{}}
                consumedWhen={settings.consumedWhen}
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
            //console.log(i, consumedProduct, time);
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
        const wrapper = subject({ consumedWhen: today, consumed: consumedProducts});

        expect(wrapper.find(consumedProductsWrapper).children()).toHaveLength(3);
    });

    it('shows products consumed yesterday', () => {
        const today = new Date();
        const yesterday = daysAgo(1);
        const consumedToday = buildConsumedProducts(3, today);
        const consumedYesterday = buildConsumedProducts(4, yesterday);
        const consumedProducts = [...consumedToday, ...consumedYesterday];
        const wrapper = subject({ consumedWhen: yesterday, consumed: consumedProducts});

        expect(wrapper.find(consumedProductsWrapper).children()).toHaveLength(4);
    });
});