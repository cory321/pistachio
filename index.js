import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import App from './components/App';
import { change as hashChange } from './actions/route';
import * as reducers from './reducers';

function createReducer( reducers ) {
	return combineReducers( reducers );
}

const reducer = createReducer( reducers );

const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function route() {
	store.dispatch( hashChange( window.location.hash.slice( 1 ) ) );
}

window.addEventListener( 'hashchange', route );
route();

ReactDOM.render(
	<Provider store={ store }>
		<App />
	</Provider>,
	document.getElementById( 'pistachio' )
);
