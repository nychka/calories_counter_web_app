import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProductCard from './ProductCard';

configure({ adapter: new Adapter()});

describe('<ProductCard />', () => {
   it('should render product', () => {
        const product = { id: 1, nutrition: { calories: 100 }};
        const wrapper = shallow(<ProductCard product={product}/>);

        expect(wrapper.find('div.flex-row')).toHaveLength(2);
   });
});