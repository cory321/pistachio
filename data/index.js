import * as actions from '../actions';
import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as resolvers from '../resolvers/candidates';
import controls from '../controls';

import { combineReducers } from '@wordpress/data';

const reducer = combineReducers( reducers );

export const pistachioStoreConfig = {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
};
