/** @format */

import { ADD, ADD_MANY } from '../actions/labels';

export default function labels( state = [], action ) {
	switch ( action.type ) {
		case ADD:
			return [ ...state.filter( label => label.id !== action.payload.id ), action.payload ];
		case ADD_MANY:
			return [ ...action.payload ];
	}

	return state;
}
