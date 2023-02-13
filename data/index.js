import * as nestedActions from '../actions';
import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as resolvers from '../resolvers/candidates';
import controls from '../controls';

import { combineReducers } from '@wordpress/data';

const reducer = combineReducers( reducers );

const actions = {};

// Flatten and format nested actions like this: candidates.addMany -> addManyCandidates
Object.entries( nestedActions ).forEach( ( [ moduleName, moduleActions ] ) => {
	const capitalizedModuleName = moduleName.charAt( 0 ).toUpperCase() + moduleName.slice( 1 );

	Object.entries( moduleActions )
		.filter( ( [ , actionFunction ] ) => typeof actionFunction === 'function' )
		.forEach( ( [ actionName, actionFunction ] ) => {
			actions[ `${ actionName }${ capitalizedModuleName }` ] = actionFunction;
		} );
} );

export const pistachioConfig = {
	reducer,
	actions,
	selectors,
	resolvers,
	controls,
};
