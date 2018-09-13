import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from './Home';

configure({ adapter: new Adapter()});

describe('<Home />', () => {
    const product = { id: 1, lang: { en: 'title'}, nutrition: {calories: 100, weight: 100} };
    const noConsumedProductsTitleSelector = 'h3';
    const consumedProductsWrapper = 'div.consumed-products-wrapper';
    const selectProductsSelector = '#select-products';

    const subject = (options = {}) => {
        const defaults = { consumedProducts: [] };
        const settings = Object.assign(defaults, options);

        return shallow(
            <Home
                consumedProducts={settings.consumedProducts}
                selectedProduct={product}
                pickProductHandler={() => {}}
                handleCreate={() => {}}
                productsOptions={{}}
            />
        );
    };

    it('renders search product input', () => {
        const wrapper = subject();

        expect(wrapper.exists(selectProductsSelector)).toBeTruthy();
    });

    it('renders no consumed products', () => {
        const wrapper = subject().find(consumedProductsWrapper);

        expect(wrapper.exists(noConsumedProductsTitleSelector)).toBeTruthy();
    });

    it('renders 2 consumed products', () => {
        const wrapper = subject({ consumedProducts: [product, product] });

        expect(wrapper.find(consumedProductsWrapper).children()).toHaveLength(2);
    });
});