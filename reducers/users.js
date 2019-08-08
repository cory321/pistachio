import { ADD, ADD_MANY } from '../actions/users';

export default function users( state = [], action ) {
	switch ( action.type ) {
		case ADD:
			return [ ...state.filter( user => user.id !== action.payload.id ), action.payload ];
		case ADD_MANY:
			return [ ...state, ...action.payload ];
	}

	return state;
}
