/** @format */

import '@wordpress/jest-preset-default';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure( { adapter: new Adapter() } );
