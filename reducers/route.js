/** @format */

import { CHANGE } from '../actions/route';

export default function route( state = '', action ) {
	switch ( action.type ) {
		case CHANGE:
			return action.payload;
	}

	return state;
}
