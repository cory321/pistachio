/** @format */

import { ADD, ADD_MANY } from '../actions/jobs';

export default function jobs( state = [], action ) {
	switch ( action.type ) {
		case ADD:
			return [ ...state.filter( job => job.id !== action.payload.id ), action.payload ];
		case ADD_MANY:
			return [ ...state, ...action.payload ];
	}

	return state;
}
